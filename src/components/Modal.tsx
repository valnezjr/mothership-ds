"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Button } from "./primitives";

/* ============================================================
   Modal / popup — entrada com o bounce do sistema, saída suave.
   Fecha no X, no clique fora e no Esc.
   ============================================================ */

const CloseIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Ações no rodapé (alinhadas à direita). */
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  /** Impede fechar clicando fora ou no Esc. */
  dismissable?: boolean;
  className?: string;
}

/* Trava de scroll compartilhada: com dois modais abertos, só o último a
   fechar destrava a página. */
let scrollLocks = 0;
let previousOverflow = "";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Portal, Esc, trava de scroll, saída animada e gestão de foco. */
function useModalShell(open: boolean, onClose: () => void, dismissable: boolean) {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(open);
  const [closing, setClosing] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const lastFocused = React.useRef<Element | null>(null);

  React.useEffect(() => setMounted(true), []);

  const requestClose = React.useCallback(() => {
    if (closeTimer.current) return; // já fechando: ignora cliques repetidos
    setClosing(true);
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      setClosing(false);
      setVisible(false);
      onClose();
    }, 200); // acompanha ms-modal-out
  }, [onClose]);

  React.useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    } else if (!closeTimer.current) {
      setVisible(false);
    }
  }, [open]);

  React.useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  /* Trava de scroll com contagem de referências */
  React.useEffect(() => {
    if (!visible) return;
    if (scrollLocks++ === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    return () => {
      if (--scrollLocks === 0) document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  /* Esc + ciclo de foco dentro do diálogo (focus trap) */
  React.useEffect(() => {
    if (!visible) return;
    lastFocused.current = document.activeElement;
    const node = dialogRef.current;
    // foca o primeiro elemento útil, ou o próprio diálogo
    const first = node?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? node)?.focus?.();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissable) {
        requestClose();
        return;
      }
      if (e.key !== "Tab" || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      // devolve o foco a quem abriu
      (lastFocused.current as HTMLElement | null)?.focus?.();
    };
  }, [visible, dismissable, requestClose]);

  return { mounted, visible, closing, requestClose, dialogRef };
}

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
  dismissable = true,
  className,
}: ModalProps) {
  const { mounted, visible, closing, requestClose, dialogRef } = useModalShell(
    open,
    onClose,
    dismissable
  );
  const titleId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-title`;
  if (!mounted || !visible) return null;

  return createPortal(
    <div
      className={["ms-modal-backdrop", closing && "ms-modal-backdrop--closing"].filter(Boolean).join(" ")}
      onClick={() => dismissable && requestClose()}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={["ms-modal", size !== "md" && `ms-modal--${size}`, className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ms-modal__head">
          {title != null && (
            <span className="ms-modal__title" id={titleId}>
              {title}
            </span>
          )}
          <button className="ms-modal__close" type="button" aria-label="Fechar" onClick={requestClose}>
            {CloseIcon}
          </button>
        </div>
        <div className="ms-modal__body">{children}</div>
        {footer != null && <div className="ms-modal__footer ms-modal__footer--end">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

/* ---------- Modal em etapas ---------- */

export interface ModalStep {
  title?: React.ReactNode;
  content: React.ReactNode;
}

export interface StepModalProps extends Omit<ModalProps, "children" | "footer" | "title"> {
  steps: ModalStep[];
  /** Rótulo do botão na última etapa. */
  finishLabel?: React.ReactNode;
  /** Chamado ao concluir a última etapa (fecha o modal em seguida). */
  onFinish?: () => void;
  /** Mostra "Etapa 2 de 4" em vez dos pontos. */
  showCount?: boolean;
}

/**
 * Popup paginado: avança e volta entre etapas, com os painéis deslizando
 * na direção da navegação e o indicador em pills (mesma linguagem dos
 * bullets do carrossel).
 */
export function StepModal({
  open,
  onClose,
  steps,
  size = "md",
  dismissable = true,
  className,
  finishLabel = "Concluir",
  onFinish,
  showCount,
}: StepModalProps) {
  const { mounted, visible, closing, requestClose, dialogRef } = useModalShell(
    open,
    onClose,
    dismissable
  );
  const [index, setIndex] = React.useState(0);
  const [dir, setDir] = React.useState<"fwd" | "back">("fwd");
  const titleId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-title`;

  React.useEffect(() => {
    if (open) {
      setIndex(0);
      setDir("fwd");
    }
  }, [open]);

  if (!mounted || !visible || !steps.length) return null;

  // resiste a `steps` encolher com o modal aberto
  const current = Math.min(index, steps.length - 1);
  const step = steps[current];
  const first = current === 0;
  const last = current === steps.length - 1;

  const go = (n: number) => {
    setDir(n > current ? "fwd" : "back");
    setIndex(Math.min(steps.length - 1, Math.max(0, n)));
  };

  return createPortal(
    <div
      className={["ms-modal-backdrop", closing && "ms-modal-backdrop--closing"].filter(Boolean).join(" ")}
      onClick={() => dismissable && requestClose()}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className={["ms-modal", size !== "md" && `ms-modal--${size}`, className].filter(Boolean).join(" ")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={step.title != null ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ms-modal__head">
          {step.title != null && (
            <span className="ms-modal__title" id={titleId}>
              {step.title}
            </span>
          )}
          <button className="ms-modal__close" type="button" aria-label="Fechar" onClick={requestClose}>
            {CloseIcon}
          </button>
        </div>

        {/* Dois elementos, um eixo cada: o corpo cuida da rolagem
            vertical; a grade interna corta (clip) o deslize horizontal
            da animação. Todas as etapas ficam montadas na mesma célula,
            então o modal já nasce com a altura da mais alta e não muda
            de tamanho ao navegar. */}
        <div className="ms-modal__body">
          <div className="ms-modal__steps" data-dir={dir}>
            {steps.map((s, i) => (
              <div
                key={i}
                className="ms-modal__step"
                data-active={i === current}
                /* visibility:hidden (no CSS) já tira do foco e dos
                   leitores de tela — daí não precisar de `inert` */
                aria-hidden={i !== current}
              >
                {s.content}
              </div>
            ))}
          </div>
        </div>

        <div className="ms-modal__footer">
          {showCount ? (
            <span className="ms-modal__count">
              Etapa {current + 1} de {steps.length}
            </span>
          ) : (
            <div className="ms-modal__dots" role="group" aria-label={`Etapa ${current + 1} de ${steps.length}`}>
              {steps.map((_, i) => (
                <button
                  key={i}
                  className={[
                    "ms-modal__dot",
                    i === current && "ms-modal__dot--active",
                    i < current && "ms-modal__dot--done",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  type="button"
                  aria-label={`Ir para a etapa ${i + 1}`}
                  aria-current={i === current}
                  onClick={() => go(i)}
                />
              ))}
            </div>
          )}
          <Button inline size="sm" variant="ghost" disabled={first} onClick={() => go(current - 1)}>
            Anterior
          </Button>
          <Button
            inline
            size="sm"
            variant="solid"
            onClick={() => {
              if (last) {
                onFinish?.();
                requestClose();
              } else {
                go(current + 1);
              }
            }}
          >
            {last ? finishLabel : "Próximo"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
