"use client";

import React from "react";

/* ============================================================
   Marquee — primitive de scroll horizontal infinito (v1.2). A
   animação inteira é CSS (@keyframes + animation-play-state no
   :hover) — nada de JS movendo elemento, nada de requestAnimationFrame
   ou timer. O "use client" aqui NÃO é pela animação: é só o efeito
   que aplica `inert` à cópia duplicada (ver mais abaixo) — React 18
   não reconhece `inert` como atributo JSX e descarta silenciosamente
   (`<div inert="">` some do HTML renderizado), então setamos a
   propriedade DOM direto via ref, uma vez, fora do ciclo de animação.

   Composições futuras (não implementadas ainda — só a primitive):
   LogoMarquee, TechMarquee, IconMarquee, TestimonialMarquee. Cada uma
   seria só <Marquee> com um jeito específico de montar os children
   (ex.: LogoMarquee mapeia uma lista de logos para <img> dentro do
   Marquee) — nenhuma precisa de estado ou lógica própria além de
   compor, então entram neste mesmo arquivo quando existirem.

   Sem prop `loop`: um marquee sem loop é outro componente (uma
   "esteira" de passagem única) — saber quando o conteúdo saiu
   inteiramente da tela exige medir a largura real dele, e isso só dá
   pra fazer com JS. Como scroll infinito e loop perfeito já são
   comportamento obrigatório (não opcional) daqui, não há um "loop"
   pra desligar.
   ============================================================ */

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export type MarqueeDirection = "left" | "right";
export type MarqueeGap = "sm" | "md" | "lg";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Qualquer conteúdo — logos, texto, cards, ícones. */
  children: React.ReactNode;
  /** Sentido do scroll. Padrão `"left"`. */
  direction?: MarqueeDirection;
  /**
   * `"slow" | "normal" | "fast"`, ou um número de segundos para uma
   * duração exata — útil quando o conteúdo é largo ou estreito demais
   * para as três velocidades nomeadas. Padrão `"normal"`.
   */
  speed?: "slow" | "normal" | "fast" | number;
  /** Pausa a rolagem enquanto o mouse está sobre o componente. */
  pauseOnHover?: boolean;
  /** Esmaece as bordas esquerda/direita com uma máscara CSS. */
  fade?: boolean;
  /** Espaço entre os itens. Padrão `"md"`. */
  gap?: MarqueeGap;
}

/**
 * Faixa de conteúdo em scroll horizontal infinito. O loop é sempre
 * contínuo e sem costura: o conteúdo é duplicado uma vez (a cópia
 * leva `aria-hidden` + `inert`, invisível para leitor de tela e fora
 * da navegação por teclado) e a animação desliza exatamente metade da
 * faixa — as duas cópias, sendo idênticas, encaixam sem emenda.
 *
 * Empilhe vários `<Marquee>` para linhas independentes: cada um tem
 * sua própria animação CSS, sem coordenação entre eles.
 */
export function Marquee({
  children,
  direction = "left",
  speed = "normal",
  pauseOnHover,
  fade,
  gap = "md",
  className,
  style,
  ...rest
}: MarqueeProps) {
  const vars: React.CSSProperties = { ...style };
  if (typeof speed === "number") {
    (vars as Record<string, string>)["--ms-marquee-duration"] = `${speed}s`;
  }

  // React 18 não tem `inert` no seu mapa de atributos DOM — passá-lo
  // via JSX é descartado silenciosamente. Setar a propriedade direto
  // no elemento contorna isso; não é a animação, roda uma vez só.
  const duplicateRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (duplicateRef.current) (duplicateRef.current as HTMLDivElement & { inert: boolean }).inert = true;
  }, []);

  return (
    <div
      className={cx(
        "ms-marquee",
        `ms-marquee--gap-${gap}`,
        typeof speed === "string" && `ms-marquee--${speed}`,
        fade && "ms-marquee--fade",
        pauseOnHover && "ms-marquee--pause-on-hover",
        className
      )}
      style={vars}
      {...rest}
    >
      <div className={cx("ms-marquee__track", direction === "right" && "ms-marquee__track--reverse")}>
        <div className="ms-marquee__group">{children}</div>
        {/* Cópia puramente visual, pro loop fechar sem costura — some
            do leitor de tela (aria-hidden) e da navegação por teclado
            (inert, aplicado via ref acima), já que repete exatamente o
            mesmo conteúdo focável da primeira cópia. */}
        <div className="ms-marquee__group" aria-hidden="true" ref={duplicateRef}>
          {children}
        </div>
      </div>
    </div>
  );
}
