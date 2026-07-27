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
 */
export function TooltipProvider({ children }: { children?: React.ReactNode }) {
  const [tip, setTip] = React.useState<{ text: string; x: number; y: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const place = (e: PointerEvent, text: string) => {
      const el = ref.current;
      const w = el?.offsetWidth ?? 0;
      const h = el?.offsetHeight ?? 0;
      let x = e.clientX + 14;
      let y = e.clientY + 14;
      if (x + w > window.innerWidth - 8) x = e.clientX - w - 10;
      if (y + h > window.innerHeight - 8) y = e.clientY - h - 10;
      setTip({ text, x, y });
    };
    const over = (e: PointerEvent) => {
      const target = (e.target as Element)?.closest?.("[data-tip]");
      if (!target) return;
      place(e, target.getAttribute("data-tip") ?? "");
    };
    const move = (e: PointerEvent) => {
      const target = (e.target as Element)?.closest?.("[data-tip]");
      if (target) place(e, target.getAttribute("data-tip") ?? "");
    };
    const out = (e: PointerEvent) => {
      const from = (e.target as Element)?.closest?.("[data-tip]");
      if (!from) return;
      // só esconde ao sair de fato do elemento (e não ao trocar de filho)
      const to = (e.relatedTarget as Element | null)?.closest?.("[data-tip]");
      if (to !== from) setTip(null);
    };
    window.addEventListener("pointerover", over);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerout", out);
    return () => {
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <>
      {children}
      {/* portal: `position: fixed` quebraria sob qualquer ancestral com
          transform/filter — e o sistema usa backdrop-filter à vontade */}
      {mounted &&
        createPortal(
          <div
            ref={ref}
            className={["ms-tooltip", tip && "ms-tooltip--show"].filter(Boolean).join(" ")}
            style={{ left: tip?.x ?? 0, top: tip?.y ?? 0 }}
            role="tooltip"
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

export interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
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
      anchor: Math.cos(mid) >= -0.05 ? "start" : "end",
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

export interface ProgressRingProps extends React.HTMLAttributes<HTMLDivElement> {
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

export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
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
