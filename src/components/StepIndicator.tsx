"use client";

import React from "react";

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export interface StepIndicatorProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  /** Etapa/página atual, 0-indexada. */
  current: number;
  total: number;
  /** Pular direto pra uma etapa/página (clique num ponto). Sem efeito
   *  no modo `showCount` (texto, não interativo). */
  onChange?: (index: number) => void;
  /** "Etapa 2 de 4" em vez dos pontos. */
  showCount?: boolean;
  /** Palavra usada no texto e nos rótulos de acessibilidade — "Etapa"
   *  por padrão (ex.: "Página" pra uma galeria paginada). */
  label?: string;
}

/**
 * Indicador de progresso por etapas/páginas: pontos em pill (mesma
 * linguagem dos bullets do Carousel) ou texto "Etapa X de Y"
 * (`showCount`). Extraído do rodapé do `StepModal` — que segue usando
 * este componente por baixo, sem mudança de comportamento — pra também
 * servir navegação paginada fora de um modal (ex.: uma galeria
 * paginada em vez de rolagem).
 */
export function StepIndicator({
  current,
  total,
  onChange,
  showCount,
  label = "Etapa",
  className,
  ...rest
}: StepIndicatorProps) {
  if (showCount) {
    return (
      <span className={cx("ms-step-indicator__count", className)} {...rest}>
        {label} {current + 1} de {total}
      </span>
    );
  }

  return (
    <div
      className={cx("ms-step-indicator__dots", className)}
      role="group"
      aria-label={`${label} ${current + 1} de ${total}`}
      {...rest}
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          className={cx(
            "ms-step-indicator__dot",
            i === current && "ms-step-indicator__dot--active",
            i < current && "ms-step-indicator__dot--done"
          )}
          aria-label={`Ir para ${label.toLowerCase()} ${i + 1}`}
          aria-current={i === current}
          onClick={() => onChange?.(i)}
        />
      ))}
    </div>
  );
}
