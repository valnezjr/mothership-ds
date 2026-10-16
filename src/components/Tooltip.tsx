import React from "react";

/* ============================================================
   Tooltip — a forma em componente do `data-tip`. Não desenha nada:
   marca o gatilho e deixa o `TooltipProvider` (acima na árvore)
   posicionar, mostrar e ligar o `aria-describedby`. Um renderizador
   só, para os dois caminhos. Sem estado: renderiza no servidor.
   ============================================================ */

export interface TooltipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Texto do tooltip. Vazio ou ausente: só o gatilho, sem tooltip. */
  content?: string;
  /** O gatilho. Para chegar por teclado, precisa ser focável. */
  children: React.ReactNode;
}

export function Tooltip({ content, children, className, ...rest }: TooltipProps) {
  // `display: contents`: o wrapper não ocupa caixa, então envolver um
  // bloco ou um item de flex não muda o layout de quem consome.
  return (
    <span
      {...rest}
      className={["ms-tooltip-trigger", className].filter(Boolean).join(" ")}
      data-tip={content || undefined}
    >
      {children}
    </span>
  );
}
