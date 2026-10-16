"use client";

import React from "react";
import { createPortal } from "react-dom";
import { clampLeft } from "./popover";

/* ============================================================
   Select e Combobox — listbox própria (customizada), não o
   <select> nativo do navegador. A mecânica de popup/teclado/
   destaque é compartilhada entre os dois (OptionList, useOutsideClick,
   nextEnabled); Select é só-escolha (gatilho é um <button>), Combobox
   acrescenta filtro por texto (gatilho é um <input>).

   O popup é portal no <body> com `position: fixed` e a largura do
   campo — assim um ancestral com `overflow: hidden` não o corta. Abre
   embaixo, vira para cima ou encolhe (ver `useListPosition`); o clamp
   horizontal é o do `Popover`. O foco nunca sai do gatilho: a lista
   cancela o mousedown, e o destaque anda por `aria-activedescendant`.
   ============================================================ */

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

/** Fecha ao clicar fora do campo e fora da lista (que mora num portal, fora do campo no DOM). */
function useOutsideClick(
  refs: Array<React.RefObject<HTMLElement | null>>,
  onOutside: () => void,
  active: boolean
) {
  React.useEffect(() => {
    if (!active) return;
    function handle(e: MouseEvent) {
      const target = e.target as Node;
      if (refs.some((r) => r.current?.contains(target))) return;
      onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onOutside]);
}

interface ListPosition {
  top: number;
  left: number;
  above: boolean;
}

/** Altura máxima da lista (`.ms-listbox`), encolhida quando nenhum dos lados do campo tem esse espaço. */
const LISTBOX_MAX = 240;
/** Respiro entre o campo e a lista, e entre a lista e a borda da tela (`--space-1`, o do CSS antigo). */
const LISTBOX_GAP = 4;

/**
 * Posição da lista flutuante. Abre embaixo; vira para cima quando não cabe e há espaço em
 * cima; se não cabe em nenhum dos dois, vai para o lado com mais espaço e encolhe até caber.
 * O clamp horizontal é o do `Popover`. Acompanha scroll e resize, e a mudança no número de
 * opções (o filtro do Combobox muda a altura da lista).
 */
function useListPosition(
  anchorRef: React.RefObject<HTMLElement | null>,
  listRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  optionCount: number
): ListPosition | null {
  const [pos, setPos] = React.useState<ListPosition | null>(null);

  const reposition = React.useCallback(() => {
    const anchor = anchorRef.current;
    const list = listRef.current;
    if (!anchor || !list) return;
    const rect = anchor.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - 2 * LISTBOX_GAP;
    const spaceAbove = rect.top - 2 * LISTBOX_GAP;
    // Largura e altura são escritas direto no DOM (não pelo `style` do JSX): a altura natural
    // precisa ser medida já na largura do campo, sem o limite de uma medição anterior.
    list.style.width = `${rect.width}px`;
    list.style.maxHeight = `${LISTBOX_MAX}px`;
    const natural = list.offsetHeight;
    const above = natural > spaceBelow && spaceAbove > spaceBelow;
    const height = Math.min(natural, Math.max(above ? spaceAbove : spaceBelow, 0));
    list.style.maxHeight = `${height}px`;
    const top = above ? rect.top - LISTBOX_GAP - height : rect.bottom + LISTBOX_GAP;
    setPos({ top, left: clampLeft(rect.left, rect.width), above });
  }, [anchorRef, listRef]);

  React.useLayoutEffect(() => {
    if (open) reposition();
    else setPos(null);
  }, [open, reposition, optionCount]);

  React.useEffect(() => {
    if (!open) return;
    // Rolar a própria lista não move o campo; reposicionar ali remediria a altura e desalinharia a rolagem.
    function onScroll(e: Event) {
      if (listRef.current?.contains(e.target as Node)) return;
      reposition();
    }
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, reposition, listRef]);

  return pos;
}

/** Próximo índice habilitado, ciclando e pulando `disabled`. */
function nextEnabledIndex(options: SelectOption[], from: number, dir: 1 | -1): number {
  const n = options.length;
  if (n === 0) return -1;
  let i = from;
  for (let step = 0; step < n; step++) {
    i = (i + dir + n) % n;
    if (!options[i].disabled) return i;
  }
  return from;
}

function firstEnabledIndex(options: SelectOption[]): number {
  return options.findIndex((o) => !o.disabled);
}

const OptionList = React.forwardRef<
  HTMLUListElement,
  {
    id: string;
    options: SelectOption[];
    activeIndex: number;
    selectedValue: string | undefined;
    onHover: (i: number) => void;
    onSelect: (opt: SelectOption) => void;
    emptyLabel: string;
    pos: ListPosition | null;
  }
>(function OptionList({ id, options, activeIndex, selectedValue, onHover, onSelect, emptyLabel, pos }, ref) {
  // Mantém a opção destacada à vista — só depois de posicionada, já com a altura final.
  const placed = pos != null;
  React.useEffect(() => {
    if (placed) document.getElementById(`${id}-${activeIndex}`)?.scrollIntoView({ block: "nearest" });
  }, [id, activeIndex, placed]);

  return createPortal(
    <ul
      ref={ref}
      className={cx("ms-listbox", "ms-portal-root", pos?.above && "ms-listbox--above")}
      role="listbox"
      id={id}
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        // Nasce escondida até a posição ser medida — não pisca no lugar errado.
        visibility: pos ? "visible" : "hidden",
      }}
      // Clique na lista (inclusive na barra de rolagem) não tira o foco do gatilho.
      onMouseDown={(e) => e.preventDefault()}
    >
      {options.length === 0 && <li className="ms-listbox__empty">{emptyLabel}</li>}
      {options.map((opt, i) => (
        <li
          key={opt.value}
          id={`${id}-${i}`}
          role="option"
          aria-selected={opt.value === selectedValue}
          aria-disabled={opt.disabled || undefined}
          className={cx(
            "ms-listbox__option",
            i === activeIndex && "ms-listbox__option--active",
            opt.value === selectedValue && "ms-listbox__option--selected",
            opt.disabled && "ms-listbox__option--disabled"
          )}
          onMouseEnter={() => !opt.disabled && onHover(i)}
          onMouseDown={(e) => {
            // Preserva o foco no gatilho — sem isso, o mousedown tiraria
            // o foco do botão/input antes do clique disparar o onSelect.
            e.preventDefault();
            if (!opt.disabled) onSelect(opt);
          }}
        >
          {opt.label}
        </li>
      ))}
    </ul>,
    document.body
  );
});

export interface SelectProps extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange" | "defaultValue"> {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  /** Nome pro `<input type="hidden">` que participa de `<form>` — omita se não usar formulário nativo. */
  name?: string;
}

/** `<select>` só-escolha, com listbox própria (vidro, `--ease-bounce`, mesmo visual do resto do sistema). */
export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(function Select(
  { options, placeholder, value, defaultValue, onChange, disabled, name, className, id, ...rest },
  ref
) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const selectedValue = value !== undefined ? value : internalValue;
  const [activeIndex, setActiveIndex] = React.useState(() => {
    const i = options.findIndex((o) => o.value === selectedValue);
    return i >= 0 ? i : firstEnabledIndex(options);
  });
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const listId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-listbox`;

  useOutsideClick([wrapRef, listRef], () => setOpen(false), open);
  const pos = useListPosition(wrapRef, listRef, open, options.length);

  const selected = options.find((o) => o.value === selectedValue);

  function openAt(index: number) {
    setActiveIndex(index >= 0 ? index : firstEnabledIndex(options));
    setOpen(true);
  }

  function commit(opt: SelectOption) {
    if (value === undefined) setInternalValue(opt.value);
    onChange?.(opt.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openAt(options.findIndex((o) => o.value === selectedValue));
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => nextEnabledIndex(options, i, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => nextEnabledIndex(options, i, -1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt && !opt.disabled) commit(opt);
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(firstEnabledIndex(options));
    } else if (e.key === "End") {
      e.preventDefault();
      for (let i = options.length - 1; i >= 0; i--) {
        if (!options[i].disabled) {
          setActiveIndex(i);
          break;
        }
      }
    }
  }

  return (
    <div className="ms-select" ref={wrapRef}>
      <button
        ref={ref}
        type="button"
        id={id}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        disabled={disabled}
        className={cx("ms-input", "ms-select__trigger", className)}
        onClick={() => (open ? setOpen(false) : openAt(options.findIndex((o) => o.value === selectedValue)))}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        {...rest}
      >
        <span className={cx("ms-select__value", selected == null && "ms-select__value--placeholder")}>
          {selected ? selected.label : placeholder}
        </span>
      </button>
      {open && (
        <OptionList
          id={listId}
          options={options}
          activeIndex={activeIndex}
          selectedValue={selectedValue}
          onHover={setActiveIndex}
          onSelect={commit}
          emptyLabel="Nada por aqui."
          pos={pos}
          ref={listRef}
        />
      )}
      {name != null && <input type="hidden" name={name} value={selectedValue ?? ""} />}
    </div>
  );
});

export interface ComboboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "defaultValue"> {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Filtro aplicado ao digitar — padrão: contém, sem diferenciar maiúsculas. */
  filter?: (option: SelectOption, query: string) => boolean;
  /** Texto exibido quando o filtro não encontra nada. */
  emptyLabel?: string;
}

function labelText(opt: SelectOption | undefined): string {
  if (opt == null) return "";
  return typeof opt.label === "string" ? opt.label : opt.value;
}

function defaultFilter(opt: SelectOption, query: string): boolean {
  return labelText(opt).toLowerCase().includes(query.toLowerCase());
}

/**
 * Campo de texto com autocomplete — filtra `options` conforme o usuário digita.
 * Reaproveita a mesma listbox do `Select`; a diferença é o gatilho (`<input>`
 * editável, não um `<button>` só-escolha) e o filtro por texto.
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { options, value, defaultValue, onChange, filter = defaultFilter, emptyLabel = "Nada encontrado.", className, id, ...rest },
  ref
) {
  const initialValue = value ?? defaultValue;
  const [selectedValue, setSelectedValue] = React.useState(initialValue);
  const [query, setQuery] = React.useState(() => labelText(options.find((o) => o.value === initialValue)));
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const listId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-listbox`;

  // Sincroniza quando controlado de fora — não roda no primeiro render
  // (o estado já nasce certo via useState acima).
  const isControlled = value !== undefined;
  React.useEffect(() => {
    if (!isControlled) return;
    setSelectedValue(value);
    setQuery(labelText(options.find((o) => o.value === value)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useOutsideClick([wrapRef, listRef], () => setOpen(false), open);

  const filtered = query === "" ? options : options.filter((o) => filter(o, query));
  const pos = useListPosition(wrapRef, listRef, open, filtered.length);

  function commit(opt: SelectOption) {
    if (!isControlled) setSelectedValue(opt.value);
    setQuery(labelText(opt));
    onChange?.(opt.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      setActiveIndex((i) => nextEnabledIndex(filtered, i, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => nextEnabledIndex(filtered, i, -1));
    } else if (e.key === "Enter") {
      const opt = filtered[activeIndex];
      if (open && opt && !opt.disabled) {
        e.preventDefault();
        commit(opt);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="ms-select" ref={wrapRef}>
      <input
        ref={ref}
        id={id}
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && filtered[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        className={cx("ms-input", className)}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        {...rest}
      />
      {open && (
        <OptionList
          id={listId}
          options={filtered}
          activeIndex={activeIndex}
          selectedValue={selectedValue}
          onHover={setActiveIndex}
          onSelect={commit}
          emptyLabel={emptyLabel}
          pos={pos}
          ref={listRef}
        />
      )}
    </div>
  );
});
