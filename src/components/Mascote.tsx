import React from "react";
import { EYE_D, PUPIL_D, SMILE_D } from "./face-paths";

/* ============================================================
   Mascote — o rosto da marca (olho + sorriso de assets/logo.svg)
   em quatro expressões, todas de olho aberto: o anel é o que dá
   massa ao rosto (D6). Olho, pupila e sorriso são as paths da logo;
   bocas, "?" e bolhas foram desenhados para o mascote. Animação 100%
   CSS.
   ============================================================ */

/** Mesmo viewBox nas quatro expressões: trocar de uma para outra não
    desloca o rosto. A folga no alto e à direita é a do "?" e das bolhas. */
const VIEWBOX = "1997 5600 1000 1350";
/** Bocas desenhadas: mesma largura (2292–2702, ~520 com as pontas,
    perto dos 580 do sorriso da logo) e o mesmo centro vertical dele (6750). */
const MOUTH_D = {
  procurando: "M2292 6775Q2497 6765 2702 6725",
  confuso: "M2292 6750q102.5 -110 205 0t205 0", // til
  // sorriso de canto: sobe na ponta, do lado para onde o olhar vai
  pensando: "M2292 6750Q2450 6800 2622 6750q50 -18 80 -75",
} as const;
/** Pupila menor no confuso, deslocada para cima e à direita no pensando. */
const IRIS_TRANSFORM: Partial<Record<MascoteExpressao, string>> = {
  confuso: "translate(2498 6216) scale(0.6) translate(-2498 -6216)",
  pensando: "translate(65 -90)",
};
/** Bolhas de pensamento, da menor (perto do rosto) à maior; a menor
    tem o diâmetro do traço dos adornos (55). */
const BUBBLES = [
  { cx: 2775, cy: 5985, r: 27.5 },
  { cx: 2850, cy: 5880, r: 40 },
  { cx: 2925, cy: 5755, r: 55 },
];

export type MascoteExpressao = "piscando" | "procurando" | "confuso" | "pensando";

export interface MascoteProps extends Omit<React.SVGAttributes<SVGSVGElement>, "children"> {
  expressao?: MascoteExpressao;
  /** Largura em px (padrão 96); a altura segue a proporção. */
  size?: number;
  /**
   * Nome acessível. Sem ele, o mascote é decorativo (`aria-hidden`) —
   * o caso comum, ao lado de um texto que já diz o que está acontecendo.
   */
  label?: string;
}

/**
 * Para transições e estados vazios, nunca para algo sempre visível.
 * Cada expressão tem a própria animação, parada sob
 * `prefers-reduced-motion`.
 */
export function Mascote({
  expressao = "piscando",
  size = 96,
  label,
  className,
  style,
  ...rest
}: MascoteProps) {
  // useId: duas instâncias não podem compartilhar o id do gradiente
  const gradId = `ms-mascote-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const smileFill = `url(#${gradId})`;

  return (
    <svg
      className={["ms-mascote", `ms-mascote--${expressao}`, className].filter(Boolean).join(" ")}
      viewBox={VIEWBOX}
      style={{ width: size, ...style }}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      {...rest}
    >
      <defs>
        {/* gradiente da logo, estático, nas coordenadas do arquivo original;
            paradas nos tons -500, que não mudam com o tema (D5) */}
        <linearGradient
          id={gradId}
          gradientUnits="userSpaceOnUse"
          x1="8185.85" y1="3472.64" x2="549.16" y2="3545.48"
        >
          <stop offset="0" style={{ stopColor: "var(--color-accent-500)" }} />
          <stop offset="0.6" style={{ stopColor: "var(--color-pink-500)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-orange-500)" }} />
        </linearGradient>
      </defs>

      <g className="ms-mascote__face">
        <g className="ms-mascote__eye">
          <path className="ms-mascote__ink" d={EYE_D} />
          <g className="ms-mascote__pupil">
            <path className="ms-mascote__iris" d={PUPIL_D} transform={IRIS_TRANSFORM[expressao]} />
          </g>
        </g>
        {expressao === "piscando" ? (
          <path d={SMILE_D} fill={smileFill} />
        ) : (
          <path className="ms-mascote__mouth" d={MOUTH_D[expressao]} stroke={smileFill} />
        )}
      </g>

      {expressao === "confuso" && (
        <g className="ms-mascote__ask">
          <path className="ms-mascote__mark" d="M2790 5770a80 80 0 1 1 120 70q-40 25 -40 75" />
          <circle className="ms-mascote__ink" cx={2870} cy={5995} r={27.5} />
        </g>
      )}
      {expressao === "pensando" &&
        BUBBLES.map((b, i) => (
          <circle
            key={i}
            className="ms-mascote__ink ms-mascote__bubble"
            style={{ "--i": i } as React.CSSProperties}
            {...b}
          />
        ))}
    </svg>
  );
}
