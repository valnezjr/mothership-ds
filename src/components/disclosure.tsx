"use client";

import React from "react";
import { HoverEdge } from "./theme";
import type { Tone } from "./primitives";

/* ============================================================
   Accordion, carrossel e galeria.
   ============================================================ */

/* ---------- Accordion ---------- */

const Chevron = (
  <svg
    className="ms-accordion__chevron"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export interface AccordionItemData {
  title: React.ReactNode;
  content: React.ReactNode;
  /** Começa aberto. */
  defaultOpen?: boolean;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItemData[];
  /** Abrir um item fecha os demais. */
  single?: boolean;
}

/** Expande com leve bounce na abertura e no fechamento. */
export function Accordion({ items, single, className, ...rest }: AccordionProps) {
  const [open, setOpen] = React.useState<Set<number>>(
    () => new Set(items.map((it, i) => (it.defaultOpen ? i : -1)).filter((i) => i >= 0))
  );
  const baseId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-acc`;

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(single ? [] : prev);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className={["ms-accordion", className].filter(Boolean).join(" ")} {...rest}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <div
            key={i}
            className={["ms-accordion__item", isOpen && "ms-accordion__item--open"]
              .filter(Boolean)
              .join(" ")}
          >
            <button
              className="ms-accordion__header"
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${baseId}-${i}`}
              onClick={() => toggle(i)}
            >
              <span>{item.title}</span>
              {Chevron}
            </button>
            <div className="ms-accordion__body" id={`${baseId}-${i}`} role="region">
              <div className="ms-accordion__inner">
                <div className="ms-accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Carrossel ---------- */

const ArrowLeft = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const ArrowRight = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export interface Slide {
  /** `url(...)` ou gradiente CSS para a foto do slide. */
  image: string;
  caption?: React.ReactNode;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fotos em tela cheia, com legenda opcional. Use `items` no lugar disso para conteúdo livre. */
  slides?: Slide[];
  /**
   * Uma página por item, com conteúdo livre — ex. um grupo de
   * `TestimonialCard`. Substitui `slides`; some das duas.
   */
  items?: React.ReactNode[];
  /** Avança sozinho a cada N ms. */
  autoplay?: number;
}

/** Bullets mostram qual página está em destaque: a ativa vira uma pill. */
export function Carousel({ slides, items, autoplay, className, ...rest }: CarouselProps) {
  const pages = items ?? slides ?? [];
  const [index, setIndex] = React.useState(0);
  const count = pages.length;
  const [tick, setTick] = React.useState(0); // reinicia o relógio ao interagir

  const go = React.useCallback(
    (n: number) => {
      if (!count) return;
      setIndex(((n % count) + count) % count);
      setTick((t) => t + 1);
    },
    [count]
  );

  React.useEffect(() => {
    if (!autoplay || count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), autoplay);
    return () => clearInterval(id);
  }, [autoplay, count, tick]);

  if (!count) return null;

  return (
    <div
      className={["ms-carousel", items && "ms-carousel--content", className].filter(Boolean).join(" ")}
      {...rest}
    >
      <div className="ms-carousel__track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {items
          ? items.map((node, i) => (
              <div key={i} className="ms-carousel__slide ms-carousel__slide--content">
                {node}
              </div>
            ))
          : slides!.map((s, i) => (
              <div
                key={i}
                className="ms-carousel__slide"
                style={{ ["--ms-photo" as string]: s.image }}
              >
                {s.caption != null && <div className="ms-carousel__caption">{s.caption}</div>}
              </div>
            ))}
      </div>
      <button
        className="ms-carousel__arrow ms-carousel__arrow--prev"
        type="button"
        aria-label="Anterior"
        onClick={() => go(index - 1)}
      >
        {ArrowLeft}
      </button>
      <button
        className="ms-carousel__arrow ms-carousel__arrow--next"
        type="button"
        aria-label="Próximo"
        onClick={() => go(index + 1)}
      >
        {ArrowRight}
      </button>
      <div className="ms-carousel__bullets">
        {pages.map((_, i) => (
          <button
            key={i}
            className={["ms-carousel__bullet", i === index && "ms-carousel__bullet--active"]
              .filter(Boolean)
              .join(" ")}
            type="button"
            aria-label={`Ir para o slide ${i + 1}`}
            onClick={() => go(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------- Galeria ---------- */

export interface GalleryCategory {
  /** Chave usada em `GalleryItem.categories`. */
  key: string;
  label: React.ReactNode;
  /** Cor viva da categoria (usada no contorno do hover e na badge). */
  color?: string;
  tone?: Tone;
}

export interface GalleryItem {
  image: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  categories: string[];
}

export interface GalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  categories: GalleryCategory[];
  allLabel?: React.ReactNode;
}

/**
 * Filtros em pill + grade de itens com foto, badges e descrição.
 * No hover o item usa o contorno reativo com as cores das suas
 * categorias.
 */
export function Gallery({
  items,
  categories,
  allLabel = "Todos",
  className,
  ...rest
}: GalleryProps) {
  const [filter, setFilter] = React.useState("*");
  const byKey = React.useMemo(
    () => Object.fromEntries(categories.map((c) => [c.key, c])),
    [categories]
  );

  const colorsFor = (keys: string[]): [string, string] => {
    const cats = keys.map((k) => byKey[k]).filter(Boolean);
    // `neutral` não tem cor própria — usa a borda, como nos alertas
    const color = (c?: GalleryCategory) =>
      c?.color ??
      (c?.tone
        ? c.tone === "neutral"
          ? "var(--color-border)"
          : `var(--color-${c.tone})`
        : "var(--color-accent)");
    if (cats.length >= 2) return [color(cats[0]), color(cats[1])];
    const base = cats[0]?.tone ?? "accent";
    if (cats[0]?.color) return [cats[0].color, cats[0].color];
    if (base === "neutral") return ["var(--color-border)", "var(--color-border-strong)"];
    return [`var(--color-${base}-300)`, `var(--color-${base}-600)`];
  };

  return (
    <div className={["ms-gallery", className].filter(Boolean).join(" ")} {...rest}>
      <div className="ms-gallery__filters">
        <button
          className={["ms-gallery__filter", filter === "*" && "ms-gallery__filter--active"]
            .filter(Boolean)
            .join(" ")}
          type="button"
          onClick={() => setFilter("*")}
        >
          {allLabel}
        </button>
        {categories.map((c) => (
          <button
            key={c.key}
            className={["ms-gallery__filter", filter === c.key && "ms-gallery__filter--active"]
              .filter(Boolean)
              .join(" ")}
            type="button"
            onClick={() => setFilter(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="ms-gallery__grid">
        {items
          .filter((item) => filter === "*" || item.categories.includes(filter))
          .map((item, i) => (
            <HoverEdge
              key={i}
              className="ms-gallery__item"
              colors={colorsFor(item.categories)}
            >
              <div
                className="ms-gallery__photo"
                style={{ ["--ms-photo" as string]: item.image }}
              />
              <div className="ms-gallery__info">
                <span className="ms-gallery__title">{item.title}</span>
                <span className="ms-gallery__badges">
                  {item.categories.map((k) => {
                    const c = byKey[k];
                    if (!c) return null;
                    return (
                      <span
                        key={k}
                        className={["ms-badge", c.tone && c.tone !== "neutral" && `ms-badge--${c.tone}`]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {c.label}
                      </span>
                    );
                  })}
                </span>
                {item.description != null && (
                  <span className="ms-gallery__desc">{item.description}</span>
                )}
              </div>
            </HoverEdge>
          ))}
      </div>
    </div>
  );
}
