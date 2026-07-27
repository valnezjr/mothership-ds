"use client";

import React from "react";
import { createPortal } from "react-dom";

/* ============================================================
   Alertas: estáticos, como notificação (toast de 20s com barra
   de tempo) e o histórico acessível pelo sino da navbar.
   ============================================================ */

import type { Tone } from "./primitives";

/** Mesma união de cores das badges — uma só fonte de verdade. */
export type AlertTone = Tone;

const InfoIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11.5" x2="12" y2="16.5" />
    <line x1="12" y1="7.5" x2="12.01" y2="7.5" />
  </svg>
);

const CloseIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

function toneClass(tone: AlertTone) {
  return tone === "accent" ? "" : `ms-alert--${tone}`;
}

/* ---------- Alerta estático ---------- */

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: React.ReactNode;
  /** Mostra o botão de dispensar. */
  onDismiss?: () => void;
}

export function Alert({ tone = "accent", title, onDismiss, className, children, ...rest }: AlertProps) {
  return (
    <div className={["ms-alert", toneClass(tone), className].filter(Boolean).join(" ")} {...rest}>
      <span className="ms-alert__icon">{InfoIcon}</span>
      <span className="ms-alert__body">
        {title != null && <strong>{title}</strong>} {children}
      </span>
      {onDismiss && (
        <button className="ms-alert__close" type="button" aria-label="Dispensar notificação" onClick={onDismiss}>
          {CloseIcon}
        </button>
      )}
    </div>
  );
}

/* ---------- Notificações ---------- */

export interface NotifyOptions {
  title?: React.ReactNode;
  message: React.ReactNode;
  tone?: AlertTone;
  /** Tempo de vida em ms (padrão 20000). */
  duration?: number;
}

interface Toast extends NotifyOptions {
  id: number;
  duration: number;
  leaving?: boolean;
}

export interface HistoryEntry {
  id: number;
  title?: React.ReactNode;
  message: React.ReactNode;
  tone: AlertTone;
  time: string;
}

interface AlertsCtx {
  notify: (opts: NotifyOptions) => number;
  dismiss: (id: number) => void;
  history: HistoryEntry[];
  clearHistory: () => void;
  unread: number;
  historyOpen: boolean;
  toggleHistory: () => void;
}

const Ctx = React.createContext<AlertsCtx | null>(null);

export function useAlerts(): AlertsCtx {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useAlerts precisa estar dentro de <AlertsProvider>");
  return ctx;
}

const TONE_COLOR: Record<AlertTone, string> = {
  accent: "var(--color-accent)",
  highlight: "var(--color-highlight)",
  success: "var(--color-success)",
  danger: "var(--color-danger)",
  neutral: "var(--color-border)",
  violet: "var(--color-violet)",
  pink: "var(--color-pink)",
  orange: "var(--color-orange)",
  gray: "var(--color-gray)",
};

let seq = 0;

/** Teto do histórico, para sessões longas não crescerem sem limite. */
const MAX_HISTORY = 50;

/**
 * Fornece as notificações e o histórico. Renderize uma vez, envolvendo
 * a aplicação; o `<AlertsHost />` é montado automaticamente.
 */
export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const [history, setHistory] = React.useState<HistoryEntry[]>([]);
  const [unread, setUnread] = React.useState(0);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const timers = React.useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const dismiss = React.useCallback((id: number) => {
    clearTimeout(timers.current[id]);
    delete timers.current[id];
    if (timers.current[-id]) return; // já saindo
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    // o timer de remoção também entra no mapa, para o cleanup alcançá-lo
    timers.current[-id] = setTimeout(() => {
      delete timers.current[-id];
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 320);
  }, []);

  const notify = React.useCallback(
    (opts: NotifyOptions) => {
      const id = ++seq;
      const duration = opts.duration ?? 20000;
      const tone = opts.tone ?? "accent";
      setToasts((list) => [...list, { ...opts, id, tone, duration }]);
      const d = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setHistory((list) => [
        {
          id,
          title: opts.title,
          message: opts.message,
          tone,
          time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
        },
        ...list,
      ].slice(0, MAX_HISTORY));
      setUnread((n) => n + 1);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  React.useEffect(() => {
    const t = timers.current;
    return () => {
      Object.values(t).forEach(clearTimeout);
    };
  }, []);

  const toggleHistory = React.useCallback(() => {
    setHistoryOpen((open) => {
      if (!open) setUnread(0);
      return !open;
    });
  }, []);

  const value = React.useMemo<AlertsCtx>(
    () => ({
      notify,
      dismiss,
      history,
      clearHistory: () => setHistory([]),
      unread,
      historyOpen,
      toggleHistory,
    }),
    [notify, dismiss, history, unread, historyOpen, toggleHistory]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <AlertsHost toasts={toasts} onDismiss={dismiss} />
      {historyOpen && <AlertHistory />}
    </Ctx.Provider>
  );
}

function AlertsHost({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: number) => void }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  // A região viva fica sempre no DOM: leitores de tela só anunciam
  // conteúdo inserido em containers que já existiam.
  return createPortal(
    <div className="ms-toast-stack" role="status" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={[
            "ms-alert",
            "ms-alert--toast",
            toneClass(t.tone ?? "accent"),
            t.leaving && "ms-alert--leaving",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="ms-alert__icon">{InfoIcon}</span>
          <span className="ms-alert__body">
            {t.title != null && <strong>{t.title}</strong>} {t.message}
          </span>
          <button
            className="ms-alert__close"
            type="button"
            aria-label="Dispensar notificação"
            onClick={() => onDismiss(t.id)}
          >
            {CloseIcon}
          </button>
          <span className="ms-alert__timer" style={{ animationDuration: `${t.duration}ms` }} />
        </div>
      ))}
    </div>,
    document.body
  );
}

/**
 * Painel com o histórico geral de alertas. Montado automaticamente pelo
 * `AlertsProvider` quando aberto — não renderize manualmente.
 */
export function AlertHistory() {
  const { history, clearHistory, toggleHistory } = useAlerts();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") toggleHistory(); };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (!ref.current?.contains(t) && !t.closest?.(".ms-navbar__bell")) toggleHistory();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [toggleHistory]);

  return (
    <div className="ms-alert-history" ref={ref} role="dialog" aria-label="Notificações">
      <div className="ms-alert-history__head">
        <span className="ms-alert-history__title">Notificações</span>
        <button className="ms-alert-history__clear" type="button" onClick={clearHistory}>
          Limpar
        </button>
      </div>
      {!history.length && <p className="ms-text-sm ms-text-muted">Sem alertas por enquanto.</p>}
      {history.map((h) => (
        <div className="ms-alert-history__item" key={h.id}>
          <span className="ms-alert-history__dot" style={{ background: TONE_COLOR[h.tone] }} />
          <span>
            {h.title != null && <strong>{h.title}</strong>} {h.message}
          </span>
          <span className="ms-alert-history__time">{h.time}</span>
        </div>
      ))}
    </div>
  );
}

/** Sino da navbar: abre o histórico e mostra os não lidos. */
export function NotificationBell({ className }: { className?: string }) {
  const { unread, toggleHistory, historyOpen } = useAlerts();
  return (
    <button
      className={["ms-navbar__bell", className].filter(Boolean).join(" ")}
      type="button"
      aria-label="Notificações"
      aria-expanded={historyOpen}
      title="Histórico de alertas"
      onClick={toggleHistory}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
      <span className="ms-navbar__bell-badge" hidden={unread === 0}>
        {unread > 9 ? "9+" : unread}
      </span>
    </button>
  );
}
