import React from "react";
import { EYE_D, PUPIL_D, SMILE_D } from "./face-paths";

/* ============================================================
   Mascote — o rosto da marca (olho + sorriso de assets/logo.svg)
   em três expressões. Olho, pupila e sorriso são as paths da logo;
   pálpebra, "z" e a boca de "procurando" vêm do esboço aprovado
   (.scratch/identidade-v1.9/mascote). Animação 100% CSS.
   ============================================================ */

/** Mesmo viewBox nas três expressões: trocar de uma para outra não
    desloca o rosto. A folga no alto e à direita é a dos "z". */
const VIEWBOX = "1997 5600 1000 1350";
const LID_D = "M2252 6260Q2497 6400 2742 6260";
const MOUTH_PROCURANDO_D = "M2400 6770Q2505 6762 2610 6730";
/** Os três "z" do dormindo, do maior (mais baixo) ao menor. */
const ZS = [
  { d: "M2770 5930h130l-130 130h130", w: 42 },
  { d: "M2850 5790h95l-95 95h95", w: 34 },
  { d: "M2905 5680h65l-65 65h65", w: 26 },
];

export type MascoteExpressao = "piscando" | "dormindo" | "procurando";

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

      {expressao === "dormindo" ? (
        <>
          <g className="ms-mascote__breath">
            <path className="ms-mascote__lid" d={LID_D} />
            {/* boca entreaberta do ronco, no lugar do sorriso */}
            <ellipse className="ms-mascote__snore" cx={2502} cy={6735} rx={80} ry={62} fill={smileFill} />
          </g>
          {ZS.map((z, i) => (
            <path
              key={i}
              className="ms-mascote__z"
              style={{ "--i": i } as React.CSSProperties}
              d={z.d}
              strokeWidth={z.w}
            />
          ))}
        </>
      ) : (
        <>
          <g className="ms-mascote__eye">
            <path className="ms-mascote__ink" d={EYE_D} />
            <g className="ms-mascote__pupil">
              <path className="ms-mascote__iris" d={PUPIL_D} />
            </g>
          </g>
          {expressao === "procurando" ? (
            <path className="ms-mascote__mouth" d={MOUTH_PROCURANDO_D} stroke={smileFill} />
          ) : (
            <path d={SMILE_D} fill={smileFill} />
          )}
        </>
      )}
    </svg>
  );
}
