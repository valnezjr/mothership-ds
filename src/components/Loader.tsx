"use client";

import React from "react";
import { EYE_D, PUPIL_D, SMILE_D } from "./face-paths";

/* ============================================================
   Loader — o rosto da marca (olho + sorriso) piscando enquanto
   se enche de líquido conforme o carregamento avança.
   Gerado a partir de assets/logo.svg; não edite os paths à mão.
   ============================================================ */

/** Onda que forma a superfície do líquido: três ciclos, para poder
    deslizar um ciclo inteiro em loop sem emenda. */
const WAVE_D = "M 1372 5832 q 184 -42 369 0 t 369 0 t 369 0 t 369 0 t 369 0 t 369 0 L 3586 7223 L 1372 7223 Z";

const VIEWBOX = "2110 5832 738 1091";
const FILL_HEIGHT = 1091;

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Progresso de 0 a 100. Omita para o modo indeterminado, em que o
   * líquido oscila sozinho.
   */
  value?: number;
  /** Lado do loader em px (padrão 96). */
  size?: number;
  /** Cor do líquido (padrão: gradiente accent do sistema). */
  color?: string;
  /** Texto abaixo do rosto. Use `showValue` para exibir a porcentagem. */
  label?: React.ReactNode;
  showValue?: boolean;
}

/**
 * Enquanto carrega, o rosto começa em vidro — translúcido, como as
 * demais superfícies — e vai sendo preenchido de baixo para cima por um
 * líquido com superfície ondulada. O olho pisca ocasionalmente, como na
 * splash.
 */
export function Loader({
  value,
  size = 96,
  color,
  label,
  showValue,
  className,
  style,
  ...rest
}: LoaderProps) {
  // useId: um contador de módulo divergiria entre servidor e cliente
  const id = `ms-loader-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const maskId = `${id}-mask`;
  const gradId = `${id}-grad`;
  const glassId = `${id}-glass`;
  const indeterminate = value == null;
  const pct = Math.min(100, Math.max(0, value ?? 0));

  // nível: 0% → líquido todo abaixo da forma; 100% → acima do topo
  const levelY = ((100 - pct) / 100) * FILL_HEIGHT;

  const vars: React.CSSProperties = {
    ...style,
    width: size,
    ["--ms-loader-level" as string]: `${levelY.toFixed(1)}px`,
    ["--ms-loader-glass" as string]: `url(#${glassId})`,
  };
  if (color) {
    const v = vars as Record<string, string>;
    v["--ms-loader-color"] = color;
    // topo do líquido: a mesma cor, mais clara — mantém o degradê coerente
    v["--ms-loader-color-top"] = `color-mix(in srgb, ${color} 45%, white)`;
  }

  return (
    <div
      className={["ms-loader", indeterminate && "ms-loader--indeterminate", className]
        .filter(Boolean)
        .join(" ")}
      style={vars}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={typeof label === "string" ? label : "Carregando"}
      {...rest}
    >
      <svg className="ms-loader__mark" viewBox={VIEWBOX} aria-hidden="true">
        <defs>
          <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="white" stopOpacity=".42" />
            <stop offset=".45" stopColor="white" stopOpacity=".08" />
            <stop offset="1" stopColor="#b4e2ff" stopOpacity=".20" />
          </linearGradient>
          <linearGradient id={gradId} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="var(--ms-loader-color, var(--color-accent))" />
            <stop
              offset="1"
              stopColor="var(--ms-loader-color-top, var(--color-accent-300))"
            />
          </linearGradient>

          {/* A máscara aceita <g>, então o nível (translateY) e a onda
              (translateX em loop) ficam em camadas separadas. */}
          {/* x/y/width/height explícitos: sem eles a área da máscara cai
              no padrão relativo ao bounding box e o líquido some */}
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={2110}
            y={5832}
            width={738}
            height={1391}
          >
            <g className="ms-loader__level">
              <g className="ms-loader__wave">
                <path d={WAVE_D} fill="#fff" />
              </g>
            </g>
          </mask>
        </defs>

        {/* base em vidro */}
        <g className="ms-loader__glass">
          <g className="ms-loader__eye">
            <path d={EYE_D} />
            <path d={PUPIL_D} />
          </g>
          <path d={SMILE_D} />
        </g>

        {/* líquido: as mesmas formas, reveladas pela máscara */}
        <g className="ms-loader__liquid" mask={`url(#${maskId})`} fill={`url(#${gradId})`}>
          <g className="ms-loader__eye">
            <path d={EYE_D} />
            <path d={PUPIL_D} />
          </g>
          <path d={SMILE_D} />
        </g>
      </svg>

      {(label != null || showValue) && (
        <span className="ms-loader__label">
          {label}
          {showValue && !indeterminate && (
            <span className="ms-loader__value">{Math.round(pct)}%</span>
          )}
        </span>
      )}
    </div>
  );
}
