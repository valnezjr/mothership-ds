"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useEdgeAngle } from "./theme";

/* ============================================================
   Dados: gráficos em SVG puro e widgets de dashboard.
   Cores em --chart-1..4 (ordem fixa, validadas por tema contra
   daltonismo e contraste). Status (success/danger) fica reservado
   para deltas, nunca para séries.
   ============================================================ */

export type ChartSlot = 1 | 2 | 3 | 4;

/* ---------- Tooltip ---------- */

/**
 * Mostra um tooltip de vidro para qualquer elemento com `data-tip`
 * dentro da árvore — inclusive nós SVG. Monte uma vez, perto da raiz.
 *
 * Reage a ponteiro (mouse/toque) **e** a foco de teclado — achado real
 * de um consumidor (valnezJrLP, badges de ferramenta com alternativa
 * open source só documentada em `title`, invisível a quem navega por
 * Tab): antes só `pointerover`/`pointermove`/`pointerout`, então
 * qualquer `data-tip` era inacessível por teclado, ainda que o próprio
 * elemento fosse focável (`tabIndex`). O gatilho por foco não decide
 * *se* um elemento é focável — isso continua sendo escolha de quem
 * consome (`tabIndex={0}` no elemento com `data-tip`, quando fizer
 * sentido ele ser um tab stop); o Provider só reage quando já é.
 *
 * Duas correções de acessibilidade (achado real, `axe-core` contra um
 * consumidor real): (1) o `<div role="tooltip">` do portal existia
 * sempre no DOM, mesmo vazio/sem nenhum tooltip ativo — um elemento
 * com esse role e sem nome acessível viola ARIA, independente de
 * estar visível (`aria-tooltip-name`). Corrigido só aplicando o role
 * quando há de fato um `tip` ativo. (2) o caminho de FOCO mostrava o
 * texto visualmente mas nunca ligava o elemento focado ao tooltip via
 * `aria-describedby` — leitor de tela lia só o texto visível do
 * elemento (ex. "Penpot"), nunca o conteúdo do tooltip. Corrigido só
 * no caminho de foco (não no de ponteiro: mouse/toque já mostra o
 * texto visualmente pra quem enxerga, sem relação com leitor de tela).
 */
export function TooltipProvider({ children }: { children?: React.ReactNode }) {
  const [tip, setTip] = React.useState<{ text: string; x: number; y: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const describedRef = React.useRef<Element | null>(null);
  const tooltipId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-tooltip`;

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    // `x`/`y` é o ponto de ancoragem — o cursor pro caminho de ponteiro,
    // o canto inferior-esquerdo do próprio elemento pro caminho de foco
    // (não há posição de cursor num Tab). Mesmo deslocamento/clamp pros
    // dois: motivo de existir uma função só, não duas quase iguais.
    const place = (x: number, y: number, text: string) => {
      const el = ref.current;
      const w = el?.offsetWidth ?? 0;
      const h = el?.offsetHeight ?? 0;
      let px = x + 14;
      let py = y + 14;
      if (px + w > window.innerWidth - 8) px = x - w - 10;
      if (py + h > window.innerHeight - 8) py = y - h - 10;
      setTip({ text, x: px, y: py });
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element)?.closest?.("[data-tip]");
      if (!target) return;
      place(e.clientX, e.clientY, target.getAttribute("data-tip") ?? "");
    };
    const move = (e: PointerEvent) => {
      const target = (e.target as Element)?.closest?.("[data-tip]");
      if (target) place(e.clientX, e.clientY, target.getAttribute("data-tip") ?? "");
    };
    const out = (e: PointerEvent) => {
      const from = (e.target as Element)?.closest?.("[data-tip]");
      if (!from) return;
      // só esconde ao sair de fato do elemento (e não ao trocar de filho)
      const to = (e.relatedTarget as Element | null)?.closest?.("[data-tip]");
      if (to !== from) setTip(null);
    };
    // `focusin`/`focusout` (variantes que borbulham de `focus`/`blur`) —
    // mesmo padrão de delegação num listener só na window que
    // `pointerover`/`pointerout` já usam, em vez de um listener por
    // elemento com `data-tip`. `aria-describedby` liga o elemento
    // focado ao `<div role="tooltip">` (id estável via useId) — sem
    // isso, o texto só existia visualmente, nunca chegava a leitor de
    // tela pelo caminho de teclado.
    const focusIn = (e: FocusEvent) => {
      const target = (e.target as Element)?.closest?.("[data-tip]");
      if (!target) return;
      const r = target.getBoundingClientRect();
      place(r.left, r.bottom, target.getAttribute("data-tip") ?? "");
      target.setAttribute("aria-describedby", tooltipId);
      describedRef.current = target;
    };
    const focusOut = (e: FocusEvent) => {
      const from = (e.target as Element)?.closest?.("[data-tip]");
      if (!from) return;
      const to = (e.relatedTarget as Element | null)?.closest?.("[data-tip]");
      if (to !== from) {
        setTip(null);
        if (describedRef.current === from) {
          from.removeAttribute("aria-describedby");
          describedRef.current = null;
        }
      }
    };
    window.addEventListener("pointerover", over);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerout", out);
    window.addEventListener("focusin", focusIn);
    window.addEventListener("focusout", focusOut);
    return () => {
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("focusin", focusIn);
      window.removeEventListener("focusout", focusOut);
    };
  }, [tooltipId]);

  return (
    <>
      {children}
      {/* portal: `position: fixed` quebraria sob qualquer ancestral com
          transform/filter — e o sistema usa backdrop-filter à vontade.
          `role="tooltip"`/`id` só entram quando `tip` existe de verdade
          — um role="tooltip" permanente e vazio (sem `tip` ativo) viola
          ARIA (nome acessível ausente), mesmo invisível. */}
      {mounted &&
        createPortal(
          <div
            ref={ref}
            id={tip ? tooltipId : undefined}
            role={tip ? "tooltip" : undefined}
            className={["ms-tooltip", "ms-portal-root", tip && "ms-tooltip--show"].filter(Boolean).join(" ")}
            style={{ left: tip?.x ?? 0, top: tip?.y ?? 0 }}
          >
            {tip?.text}
          </div>,
          document.body
        )}
    </>
  );
}

/* ---------- Legenda ---------- */

export interface LegendItem {
  slot: ChartSlot;
  label: React.ReactNode;
}

export interface LegendProps extends React.HTMLAttributes<HTMLDivElement> {
  items: LegendItem[];
}

export function Legend({ items, className, ...rest }: LegendProps) {
  return (
    <div className={["ms-legend", className].filter(Boolean).join(" ")} {...rest}>
      {items.map((it, i) => (
        <span className="ms-legend__item" key={i}>
          <span className="ms-legend__swatch" style={{ background: `var(--chart-${it.slot})` }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ---------- Gráfico de linhas ---------- */

export interface Series {
  name: string;
  data: number[];
  slot: ChartSlot;
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  series: Series[];
  labels: string[];
  /** Valor máximo do eixo y. Calculado a partir dos dados se omitido. */
  max?: number;
  /** Sufixo dos valores nos rótulos e tooltips. */
  unit?: string;
  /** Número de linhas de grade (padrão 5, contando o zero). */
  gridLines?: number;
}

/** Gráfico tradicional de eixos x/y com grade recessiva e hover. */
export function LineChart({
  series,
  labels,
  max,
  unit = "",
  gridLines = 5,
  className,
  ...rest
}: LineChartProps) {
  const x0 = 44;
  const x1 = 528;
  const y0 = 14;
  const y1 = 198;
  const values = series.flatMap((s) => s.data);
  const peak = values.length ? Math.max(...values) : 0;
  // evita -Infinity (série vazia) e divisão por zero (tudo zero)
  const top = max ?? (peak > 0 ? peak * 1.15 : 1);
  const lines = Math.max(2, gridLines);
  const X = (i: number) => x0 + ((x1 - x0) * i) / Math.max(1, labels.length - 1);
  const Y = (v: number) => y1 - ((y1 - y0) * v) / top;
  const steps = Array.from({ length: lines }, (_, i) => (top / (lines - 1)) * i);

  return (
    <div className={["ms-chart", className].filter(Boolean).join(" ")} {...rest}>
      <svg viewBox="0 0 600 232" role="img" aria-label={series.map((s) => s.name).join(", ")}>
        {steps.map((v, i) => (
          <g key={i}>
            <line x1={x0} y1={Y(v)} x2={x1} y2={Y(v)} stroke="var(--chart-grid)" />
            <text x={x0 - 8} y={Y(v) + 4} textAnchor="end">
              {Math.round(v)}
              {unit}
            </text>
          </g>
        ))}
        {labels.map((l, i) => (
          <text key={l + i} x={X(i)} y={y1 + 20} textAnchor="middle">
            {l}
          </text>
        ))}
        {series.map((s, si) => (
          <g key={`${s.name}-${si}`}>
            <polyline
              points={s.data.map((v, i) => `${X(i)},${Y(v)}`).join(" ")}
              fill="none"
              stroke={`var(--chart-${s.slot})`}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {s.data.map((v, i) => (
              <g key={i} className="ms-chart__dot" style={{ color: `var(--chart-${s.slot})` }}>
                <circle cx={X(i)} cy={Y(v)} r={3.5} fill={`var(--chart-${s.slot})`} />
                <circle
                  className="ms-chart__dot-hit"
                  cx={X(i)}
                  cy={Y(v)}
                  r={11}
                  fill="transparent"
                  data-tip={`${s.name} · ${labels[i]}: ${v}${unit}`}
                />
              </g>
            ))}
            <text x={x1 + 8} y={Y(s.data[s.data.length - 1]) + 4}>
              {s.name}
            </text>
          </g>
        ))}
      </svg>
      <Legend items={series.map((s) => ({ slot: s.slot, label: s.name }))} />
    </div>
  );
}

/* ---------- Barras horizontais / progresso ---------- */

export interface MeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "slot"> {
  label: React.ReactNode;
  /** 0–100. */
  value: number;
  slot?: ChartSlot;
}

/**
 * Barra horizontal. O preenchimento é um degradê da cor da série para
 * uma versão clara e luminosa; no hover, a pill ganha o contorno
 * reativo do sistema e o brilho sobe.
 */
export function Meter({ label, value, slot = 1, className, ...rest }: MeterProps) {
  const trackStyle: React.CSSProperties = {
    ["--ms-fill" as string]: `var(--chart-${slot})`,
    ["--ms-edge-a" as string]: `var(--chart-${slot})`,
    ["--ms-edge-b" as string]: `color-mix(in srgb, var(--chart-${slot}) 40%, white)`,
  };

  const handleMove = useEdgeAngle();

  return (
    <div className={["ms-meter", className].filter(Boolean).join(" ")} {...rest}>
      <div className="ms-meter__head">
        <span>{label}</span>
        <span className="ms-meter__value">{value}%</span>
      </div>
      <div
        className="ms-meter__track ms-hover-edge"
        style={trackStyle}
        onPointerMove={handleMove}
        data-tip={`${typeof label === "string" ? label : ""}: ${value}%`}
      >
        <div className="ms-meter__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

/* ---------- Pizza ---------- */

export interface PieSlice {
  label: string;
  value: number;
  slot: ChartSlot;
}

export interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  slices: PieSlice[];
}

/** Fatias com respiro de 2px, rótulos diretos e legenda. */
export function PieChart({ slices, className, ...rest }: PieChartProps) {
  const cx = 200;
  const cy = 106;
  const r = 84;
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  let angle = -90;

  const parts = slices.map((s) => {
    const sweep = (s.value / total) * 360;
    const a1 = angle;
    const a2 = angle + sweep;
    angle = a2;
    const rad = (a: number) => (a * Math.PI) / 180;
    const p1 = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))];
    const p2 = [cx + r * Math.cos(rad(a2)), cy + r * Math.sin(rad(a2))];
    const mid = rad((a1 + a2) / 2);
    const lx = cx + (r + 14) * Math.cos(mid);
    const ly = cy + (r + 14) * Math.sin(mid);
    return {
      ...s,
      d: `M${cx},${cy} L${p1[0].toFixed(1)},${p1[1].toFixed(1)} A${r},${r} 0 ${
        sweep > 180 ? 1 : 0
      } 1 ${p2[0].toFixed(1)},${p2[1].toFixed(1)} Z`,
      lx,
      ly,
      anchor: (Math.cos(mid) >= -0.05 ? "start" : "end") as "start" | "end",
      pct: Math.round((s.value / total) * 100),
    };
  });

  const single = parts.length === 1;

  return (
    <div className={["ms-chart", className].filter(Boolean).join(" ")} {...rest}>
      <svg viewBox="0 0 400 216" role="img" aria-label="Distribuição por categoria">
        {/* uma fatia de 360° vira um arco degenerado — desenha um círculo */}
        {single && (
          <circle
            className="ms-pie__slice"
            style={{ ["--ms-pie-origin" as string]: `${cx}px ${cy}px` }}
            cx={cx}
            cy={cy}
            r={r}
            fill={`var(--chart-${parts[0].slot})`}
            data-tip={`${parts[0].label}: ${parts[0].pct}%`}
          />
        )}
        {!single && parts.map((p) => (
          <path
            key={p.label}
            className="ms-pie__slice"
            style={{ ["--ms-pie-origin" as string]: `${cx}px ${cy}px` }}
            d={p.d}
            fill={`var(--chart-${p.slot})`}
            stroke="var(--bg-base)"
            strokeWidth={2}
            data-tip={`${p.label}: ${p.pct}%`}
          />
        ))}
        {parts.map((p) => (
          <text key={`t-${p.label}`} x={p.lx.toFixed(1)} y={(p.ly + 4).toFixed(1)} textAnchor={p.anchor}>
            {p.label} {p.pct}%
          </text>
        ))}
      </svg>
      <Legend items={slices.map((s) => ({ slot: s.slot, label: s.label }))} />
    </div>
  );
}

/* ---------- Anel de progresso ---------- */

export interface ProgressRingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "slot"> {
  /** 0–100. */
  value: number;
  caption?: React.ReactNode;
  size?: number;
  thickness?: number;
  slot?: ChartSlot;
  /** Esconde o número no centro (útil dentro de um stat tile). */
  hideValue?: boolean;
}

export function ProgressRing({
  value,
  caption,
  size = 140,
  thickness = 12,
  slot = 1,
  hideValue,
  className,
  style: styleProp,
  ...rest
}: ProgressRingProps) {
  const r = (size - thickness) / 2 - 2;
  const c = 2 * Math.PI * r;
  const gradId = React.useId().replace(/:/g, "");

  const style: React.CSSProperties = {
    ...styleProp,
    color: `var(--chart-${slot})`,
    ["--ms-edge-a" as string]: `var(--chart-${slot})`,
    ["--ms-edge-b" as string]: `color-mix(in srgb, var(--chart-${slot}) 40%, white)`,
  };

  const handleMove = useEdgeAngle();

  return (
    <div
      className={["ms-ring", "ms-hover-edge", className].filter(Boolean).join(" ")}
      style={style}
      onPointerMove={handleMove}
      data-tip={caption ? `${caption}: ${value}%` : undefined}
      {...rest}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {/* Degradê do traço: cor da série → versão clara e luminosa */}
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={`var(--chart-${slot})`} />
            <stop offset="1" stopColor={`color-mix(in srgb, var(--chart-${slot}) 35%, white)`} />
          </linearGradient>
        </defs>
        <circle className="ms-ring__track" cx={size / 2} cy={size / 2} r={r} strokeWidth={thickness} />
        <circle
          className="ms-ring__value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={thickness}
          stroke={`url(#${gradId})`}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
        />
      </svg>
      {!hideValue && (
        <span className="ms-ring__label">
          <span className="ms-ring__number">{value}%</span>
          {caption != null && <span className="ms-ring__caption">{caption}</span>}
        </span>
      )}
    </div>
  );
}

/* ---------- Sparkline ---------- */

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  slot?: ChartSlot;
  width?: number;
  height?: number;
}

export function Sparkline({ data, slot = 1, width = 96, height = 28, ...rest }: SparklineProps) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = 2 + ((width - 4) * i) / Math.max(1, data.length - 1);
      const y = height - 3 - ((height - 6) * (v - min)) / span;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" {...rest}>
      <polyline
        points={points}
        fill="none"
        stroke={`var(--chart-${slot})`}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ---------- Widgets de dashboard ---------- */

const ArrowUp = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);
const ArrowDown = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

export function StatGrid({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={["ms-stats", className].filter(Boolean).join(" ")} {...rest} />;
}

export interface StatTileProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "slot"> {
  /** Opcionais: omita ambos para montar o conteúdo livremente via children. */
  label?: React.ReactNode;
  value?: React.ReactNode;
  /** Direção do indicador — a seta e o texto acompanham a cor. */
  trend?: "up" | "down" | "flat";
  delta?: React.ReactNode;
  /** Série da sparkline; define também a cor do contorno no hover. */
  sparkline?: number[];
  slot?: ChartSlot;
  /** Liga o contorno reativo no hover com as cores vivas do widget. */
  interactive?: boolean;
  children?: React.ReactNode;
}

/**
 * Stat tile de vidro. No hover, o anel herda as cores do próprio
 * conteúdo: a da série somada ao verde de alta / vermelho de queda.
 */
export function StatTile({
  label,
  value,
  trend,
  delta,
  sparkline,
  slot = 1,
  interactive = true,
  className,
  style,
  children,
  ...rest
}: StatTileProps) {
  const statusColor =
    trend === "up"
      ? "var(--color-success)"
      : trend === "down"
      ? "var(--color-danger)"
      : `color-mix(in srgb, var(--chart-${slot}) 45%, var(--color-text))`;

  const vars: React.CSSProperties = { ...style };
  if (interactive) {
    (vars as Record<string, string>)["--ms-edge-a"] = `var(--chart-${slot})`;
    (vars as Record<string, string>)["--ms-edge-b"] = statusColor;
  }

  const setAngle = useEdgeAngle();
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (interactive) setAngle(e);
  };

  return (
    <div
      className={["ms-stat", interactive && "ms-hover-edge", className].filter(Boolean).join(" ")}
      style={vars}
      onPointerMove={handleMove}
      {...rest}
    >
      {label != null && <span className="ms-stat__label">{label}</span>}
      {value != null && <span className="ms-stat__value">{value}</span>}
      {(delta != null || trend) && (
        <span
          className={["ms-stat__delta", trend && `ms-stat__delta--${trend}`].filter(Boolean).join(" ")}
        >
          {trend === "up" && ArrowUp}
          {trend === "down" && ArrowDown}
          {trend === "flat" && "—"} {delta}
        </span>
      )}
      {sparkline && (
        <span className="ms-stat__spark">
          <Sparkline data={sparkline} slot={slot} />
        </span>
      )}
      {children}
    </div>
  );
}
