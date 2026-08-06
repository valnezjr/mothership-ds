"use client";

import React from "react";
import { HoverEdge } from "./theme";
import { Button } from "./primitives";
import type { Tone } from "./primitives";
import { StepIndicator } from "./StepIndicator";

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

/* ---------- Tabs ---------- */

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
}

/** Indicador desliza com bounce até a aba ativa — mesma assinatura de movimento do sistema. */
export function Tabs({ items, value, defaultValue, onChange, className, id, ...rest }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(
    () => defaultValue ?? items.find((it) => !it.disabled)?.id
  );
  const activeId = value !== undefined ? value : internalValue;
  const baseId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-tabs`;
  const listRef = React.useRef<HTMLDivElement>(null);
  const tabRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);

  const measure = React.useCallback(() => {
    const btn = activeId ? tabRefs.current.get(activeId) : undefined;
    if (!btn) return;
    setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [activeId]);

  React.useLayoutEffect(measure, [measure]);

  React.useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  function activate(item: TabItem) {
    if (item.disabled) return;
    if (value === undefined) setInternalValue(item.id);
    onChange?.(item.id);
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const enabled = items.map((it, i) => ({ it, i })).filter(({ it }) => !it.disabled);
    if (enabled.length === 0) return;
    const pos = enabled.findIndex(({ i }) => i === index);
    let target: number | undefined;
    if (e.key === "ArrowRight") target = enabled[(pos + 1) % enabled.length].i;
    else if (e.key === "ArrowLeft") target = enabled[(pos - 1 + enabled.length) % enabled.length].i;
    else if (e.key === "Home") target = enabled[0].i;
    else if (e.key === "End") target = enabled[enabled.length - 1].i;
    if (target !== undefined) {
      e.preventDefault();
      const item = items[target];
      activate(item);
      tabRefs.current.get(item.id)?.focus();
    }
  }

  const activeItem = items.find((it) => it.id === activeId);
  const tabId = (itemId: string) => `${baseId}-tab-${itemId}`;
  const panelId = (itemId: string) => `${baseId}-panel-${itemId}`;

  return (
    <div className={["ms-tabs", className].filter(Boolean).join(" ")} id={id} {...rest}>
      <div className="ms-tabs__list" role="tablist" ref={listRef}>
        {items.map((item, index) => {
          const selected = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(el) => {
                if (el) tabRefs.current.set(item.id, el);
                else tabRefs.current.delete(item.id);
              }}
              type="button"
              role="tab"
              id={tabId(item.id)}
              aria-selected={selected}
              aria-controls={panelId(item.id)}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              className={["ms-tabs__tab", selected && "ms-tabs__tab--active"].filter(Boolean).join(" ")}
              onClick={() => activate(item)}
              onKeyDown={(e) => onKeyDown(e, index)}
            >
              {item.label}
            </button>
          );
        })}
        {indicator && (
          <span
            className="ms-tabs__indicator"
            style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
          />
        )}
      </div>
      {activeItem && (
        <div
          className="ms-tabs__panel"
          role="tabpanel"
          id={panelId(activeItem.id)}
          aria-labelledby={tabId(activeItem.id)}
          tabIndex={0}
        >
          {activeItem.content}
        </div>
      )}
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
  /** Setas de anterior/próximo. Padrão `true`; os bullets navegam sempre. */
  arrows?: boolean;
}

/**
 * Bullets mostram qual página está em destaque: a ativa vira uma
 * pill. Sempre navegável por arraste horizontal (toque ou mouse),
 * além de setas (opcionais) e bullets.
 */
export function Carousel({ slides, items, autoplay, arrows = true, className, ...rest }: CarouselProps) {
  const pages = items ?? slides ?? [];
  const [index, setIndex] = React.useState(0);
  const count = pages.length;
  const [tick, setTick] = React.useState(0); // reinicia o relógio ao interagir

  // `count` pode mudar em runtime (ex. paginação responsiva) — sem isso
  // o índice guardado sobreviveria a uma página que deixou de existir.
  React.useEffect(() => {
    setIndex((i) => (count ? Math.min(i, count - 1) : 0));
  }, [count]);

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

  // Arraste horizontal (dedo ou mouse): só decide a direção ao soltar,
  // pra não brigar com cliques nos bullets ou no conteúdo do slide.
  const dragX = React.useRef<number | null>(null);
  const handleDragStart = (x: number) => { dragX.current = x; };
  const handleDragEnd = (x: number) => {
    if (dragX.current == null) return;
    const delta = x - dragX.current;
    dragX.current = null;
    if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
  };

  if (!count) return null;

  return (
    <div
      className={[
        "ms-carousel",
        items && "ms-carousel--content",
        !arrows && "ms-carousel--no-arrows",
        className,
      ].filter(Boolean).join(" ")}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={(e) => handleDragEnd(e.changedTouches[0].clientX)}
      onPointerDown={(e) => e.pointerType !== "touch" && handleDragStart(e.clientX)}
      onPointerUp={(e) => e.pointerType !== "touch" && handleDragEnd(e.clientX)}
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
      {arrows && (
        <>
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
        </>
      )}
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
  /**
   * Pagina a grade (`StepIndicator`, rodapé com "Página X de Y" +
   * anterior/próximo) em vez de crescer em altura — quantos itens já
   * filtrados aparecem por página. Sem essa prop, a grade mostra tudo
   * de uma vez (comportamento original). Trocar de filtro ou encolher
   * `itemsPerPage` (ex.: reflow responsivo) sempre volta pra primeira
   * página.
   */
  itemsPerPage?: number;
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
  itemsPerPage,
  className,
  ...rest
}: GalleryProps) {
  const [filter, setFilter] = React.useState("*");
  const [page, setPage] = React.useState(0);
  const byKey = React.useMemo(
    () => Object.fromEntries(categories.map((c) => [c.key, c])),
    [categories]
  );

  const filtered = items.filter((item) => filter === "*" || item.categories.includes(filter));
  const totalPages = itemsPerPage ? Math.max(1, Math.ceil(filtered.length / itemsPerPage)) : 1;
  const currentPage = Math.min(page, totalPages - 1);
  const visibleItems = itemsPerPage
    ? filtered.slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage)
    : filtered;

  // eslint-disable-next-line react-hooks/exhaustive-deps -- só reage à troca de filtro, não a `items`/`categories` em si
  React.useEffect(() => setPage(0), [filter]);
  // Sobrevive a itemsPerPage encolher (reflow responsivo) ou o filtro
  // reduzir a lista o bastante pra invalidar a página atual.
  React.useEffect(() => setPage((p) => Math.min(p, totalPages - 1)), [totalPages]);

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
        {visibleItems.map((item, i) => (
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
      {itemsPerPage != null && totalPages > 1 && (
        <div className="ms-gallery__pager">
          <StepIndicator current={currentPage} total={totalPages} showCount label="Página" />
          <Button inline size="sm" variant="ghost" disabled={currentPage === 0} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <Button
            inline
            size="sm"
            variant="solid"
            disabled={currentPage === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Próximo
          </Button>
        </div>
      )}
    </div>
  );
}
