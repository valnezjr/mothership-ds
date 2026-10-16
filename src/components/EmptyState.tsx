import React from "react";
import { Mascote } from "./Mascote";

/* ============================================================
   EmptyState — ilustração, título, descrição e ação opcional para
   quando não há nada a mostrar. Sem estado: renderiza no servidor.
   ============================================================ */

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Ação opcional (ex.: um `Button`), abaixo do texto. */
  action?: React.ReactNode;
  /**
   * Padrão: `Mascote` `procurando`. Aceita qualquer `ReactNode`;
   * `null` tira a ilustração.
   */
  illustration?: React.ReactNode;
  /** Versão menor, para painéis estreitos (histórico de alertas, lista). */
  compact?: boolean;
}

export function EmptyState({
  title,
  description,
  action,
  illustration,
  compact,
  className,
  ...rest
}: EmptyStateProps) {
  // undefined usa o padrão; null é escolha explícita de não ter ilustração
  const art =
    illustration === undefined ? <Mascote expressao="procurando" size={compact ? 56 : 96} /> : illustration;

  return (
    <div
      className={["ms-empty-state", compact && "ms-empty-state--compact", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {art != null && <div className="ms-empty-state__art">{art}</div>}
      <p className="ms-empty-state__title">{title}</p>
      {description != null && <p className="ms-empty-state__description">{description}</p>}
      {action != null && <div className="ms-empty-state__action">{action}</div>}
    </div>
  );
}
