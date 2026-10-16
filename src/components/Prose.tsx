import React from "react";

/* ============================================================
   Prose — texto corrido já em HTML (o que sai de um conversor de
   markdown): títulos, parágrafos, listas, links, código, citações,
   com o ritmo vertical e a tipografia do sistema. Só estilo: não
   converte nem sanitiza. Sem estado: renderiza no servidor.
   ============================================================ */

type ProseContent =
  | {
      /** HTML pronto, injetado como está. Sanitizar é de quem chama. */
      html: string;
      children?: never;
    }
  | {
      html?: never;
      /** Elementos JSX (`<h2>`, `<p>`, `<ul>`…) no lugar de `html`. */
      children?: React.ReactNode;
    };

// `type`, não `interface`: o par html/children é uma união, e interface
// não estende união.
export type ProseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "dangerouslySetInnerHTML"
> &
  ProseContent;

export function Prose({ html, children, className, ...rest }: ProseProps) {
  return (
    <div
      {...rest}
      className={["ms-prose", className].filter(Boolean).join(" ")}
      dangerouslySetInnerHTML={html !== undefined ? { __html: html } : undefined}
    >
      {children}
    </div>
  );
}
