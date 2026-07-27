import React from "react";

/* ============================================================
   Marketing — blocos de conversão para landing pages (v1.5):
   precificação, depoimentos, bento grid. Puramente apresentacionais,
   sem estado; por isso este arquivo não leva "use client".
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
