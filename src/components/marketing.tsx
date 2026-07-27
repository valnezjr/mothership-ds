"use client";

import React from "react";
import { useEdgeAngle } from "./theme";

/* ============================================================
   Marketing — blocos de conversão para landing pages (v1.2):
   precificação, depoimentos, bento grid. TestimonialCard usa o
   contorno reativo no hover (useEdgeAngle + onPointerMove), por isso
   o arquivo leva "use client" — PricingCard, puramente visual, vai
   junto pela mesma razão que primitives.tsx documenta: um arquivo é
   uma unidade só de client/server, não por export.
   ============================================================ */

type Div = React.HTMLAttributes<HTMLDivElement>;

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

/* ---------- Card de precificação ---------- */

const CheckIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const DashIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);

export interface PricingFeature {
  text: React.ReactNode;
  /**
   * `false` risca o texto e troca o ícone de check por um traço —
   * recurso não incluído nesse plano. Padrão: incluído.
   */
  included?: boolean;
}

export interface PricingCardProps extends Omit<Div, "title"> {
  /** Nome do plano — "Starter", "Pro"… */
  title: React.ReactNode;
  /** Frase curta de apoio, abaixo do nome. */
  description?: React.ReactNode;
  /** Valor principal, já formatado — `"R$49"`, `"Grátis"`. */
  price: React.ReactNode;
  /** Unidade ao lado do preço — `"/mês"`. */
  period?: React.ReactNode;
  features?: PricingFeature[];
  /** Ação do card — normalmente um `<ButtonLink>`. */
  cta?: React.ReactNode;
  /** Rótulo acima do card (ex. "Popular"). Implica `highlighted`. */
  badge?: React.ReactNode;
  /** Contorno e glow de destaque, para o plano recomendado. */
  highlighted?: boolean;
}

/**
 * Card de precificação: nome, preço, lista de recursos (com ou sem
 * check) e uma ação. Combine com `<HoverEdge>` para o contorno
 * reativo, como o `<Card>`.
 */
export function PricingCard({
  title,
  description,
  price,
  period,
  features,
  cta,
  badge,
  highlighted,
  className,
  ...rest
}: PricingCardProps) {
  return (
    <div
      className={cx("ms-pricing", (highlighted || badge != null) && "ms-pricing--highlighted", className)}
      {...rest}
    >
      {badge != null && <span className="ms-pricing__badge">{badge}</span>}
      <div className="ms-pricing__title">{title}</div>
      {description != null && <p className="ms-pricing__description">{description}</p>}
      <div className="ms-pricing__price">
        <span className="ms-pricing__price-value">{price}</span>
        {period != null && <span className="ms-pricing__price-period">{period}</span>}
      </div>
      {features && features.length > 0 && (
        <ul className="ms-pricing__features">
          {features.map((f, i) => (
            <li key={i} className={cx("ms-pricing__feature", f.included === false && "ms-pricing__feature--excluded")}>
              <span className="ms-pricing__feature-icon" aria-hidden="true">
                {f.included === false ? DashIcon : CheckIcon}
              </span>
              <span>{f.text}</span>
            </li>
          ))}
        </ul>
      )}
      {cta != null && <div className="ms-pricing__cta">{cta}</div>}
    </div>
  );
}

/* ---------- Card de depoimentos ---------- */

const StarIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5l2.9 6.3 6.9.7-5.2 4.7 1.5 6.8L12 17.6l-6.1 3.4 1.5-6.8-5.2-4.7 6.9-.7z" />
  </svg>
);

export interface TestimonialCardProps extends Omit<Div, "role"> {
  /** Depoimento em si. */
  quote: React.ReactNode;
  /** Nome de quem depõe. */
  author: React.ReactNode;
  /** Cargo e/ou empresa, abaixo do nome. */
  role?: React.ReactNode;
  /** Normalmente um `<Avatar>`. */
  avatar?: React.ReactNode;
  /** 0–5. Omita para não mostrar estrelas. */
  rating?: number;
  /** Contorno e glow de destaque, para o depoimento em foco. */
  highlighted?: boolean;
  /** Contorno reativo no hover/active, como o `StatTile`. Padrão: `true`. */
  interactive?: boolean;
}

/**
 * Card de depoimento: estrelas opcionais, texto e a identidade de
 * quem depôs (avatar + nome + cargo) fixada no rodapé do card. Já
 * nasce com o contorno reativo do sistema (`interactive`, padrão
 * `true`) — não precisa envolver com `<HoverEdge>`.
 */
export function TestimonialCard({
  quote,
  author,
  role,
  avatar,
  rating,
  highlighted,
  interactive = true,
  className,
  ...rest
}: TestimonialCardProps) {
  const setAngle = useEdgeAngle();
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (interactive) setAngle(e);
  };

  return (
    <div
      className={cx(
        "ms-testimonial",
        highlighted && "ms-testimonial--highlighted",
        interactive && "ms-hover-edge",
        className
      )}
      onPointerMove={handleMove}
      {...rest}
    >
      {rating != null && (
        <div className="ms-testimonial__rating" role="img" aria-label={`${rating} de 5 estrelas`}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={cx("ms-testimonial__star", n > rating && "ms-testimonial__star--empty")}
              aria-hidden="true"
            >
              {StarIcon}
            </span>
          ))}
        </div>
      )}
      <p className="ms-testimonial__quote">{quote}</p>
      <div className="ms-testimonial__footer">
        {avatar}
        <div className="ms-testimonial__identity">
          <div className="ms-testimonial__author">{author}</div>
          {role != null && <div className="ms-testimonial__role">{role}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Bento grid ---------- */

export function BentoGrid({ className, ...rest }: Div) {
  return <div className={cx("ms-bento", className)} {...rest} />;
}

export interface BentoTileProps extends Omit<Div, "title"> {
  /** Quantas colunas ocupa no grid de 4. Padrão 1. */
  colSpan?: 2 | 3 | 4;
  /** Quantas linhas ocupa. Padrão 1. */
  rowSpan?: 2;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Contorno reativo no hover/active. Padrão `true`. */
  interactive?: boolean;
}

/**
 * Célula do bento grid: vidro + `icon`/`title`/`description` opcionais
 * (ou `children` livre), com `colSpan`/`rowSpan` controlando o
 * tamanho. Já nasce com o contorno reativo (`interactive`, padrão
 * `true`). Abaixo de 720px o grid vira uma coluna e todo tile volta a
 * 1×1 — nenhum bloco fica maior que outro numa lista vertical.
 */
export function BentoTile({
  colSpan,
  rowSpan,
  icon,
  title,
  description,
  interactive = true,
  className,
  children,
  ...rest
}: BentoTileProps) {
  const setAngle = useEdgeAngle();
  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (interactive) setAngle(e);
  };

  return (
    <div
      className={cx(
        "ms-bento__tile",
        colSpan && `ms-bento__tile--col-${colSpan}`,
        rowSpan && `ms-bento__tile--row-${rowSpan}`,
        interactive && "ms-hover-edge",
        className
      )}
      onPointerMove={handleMove}
      {...rest}
    >
      {icon != null && <div className="ms-bento__tile-icon">{icon}</div>}
      {title != null && <div className="ms-bento__tile-title">{title}</div>}
      {description != null && <p className="ms-bento__tile-desc">{description}</p>}
      {children}
    </div>
  );
}
