"use client";

import React from "react";
import { createPortal } from "react-dom";
import { computePosition, type Position, type RectLike } from "./popover";

/* ============================================================
   DropdownMenu — menu flutuante de ações, navegável por teclado
   (setas, Home/End, Esc). Absorve o que seria um `ContextMenu`
   separado via `triggerOn="context"`: mesmo menu, só muda o gesto
   que abre (clique vs. clique direito) e a origem do posicionamento
   (o retângulo do gatilho vs. o ponto do cursor).

   Reaproveita o `computePosition` do Popover (flip vertical + clamp
   horizontal) — no modo "context", um gatilho virtual de tamanho
   zero no ponto do clique faz o mesmo algoritmo resolver os dois
   casos sem duplicar a conta.

   "Leve" como o Popover (ver ACCESSIBILITY.md § Modal): sem focus
   trap, Esc/clique fora fecham e devolvem o foco a quem abriu. Foco
   real (não `aria-activedescendant`) percorre os itens — é o padrão
   de `role="menu"` da WAI-ARIA, diferente da listbox do Select/Combobox.
   ============================================================ */

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

function focusableItems(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'));
}

interface MenuCtx {
  close: () => void;
}

const Ctx = React.createContext<MenuCtx>({ close: () => {} });

export interface DropdownMenuProps {
  /** Elemento que abre o menu — não precisa encaminhar `ref`. */
  trigger: React.ReactElement;
  children: React.ReactNode;
  /** `"click"` abre no clique normal; `"context"` abre no clique direito (o antigo `ContextMenu`). */
  triggerOn?: "click" | "context";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "top" | "bottom";
  align?: "start" | "center" | "end";
  className?: string;
}

/** Menu de ações flutuante — absorve `ContextMenu` via `triggerOn="context"`. */
export function DropdownMenu({
  trigger,
  children,
  triggerOn = "click",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  align = "start",
  className,
}: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;
  const triggerWrapRef = React.useRef<HTMLSpanElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);
  // Ponto do clique direito, quando `triggerOn="context"` — vira um
  // gatilho virtual de tamanho zero pro mesmo `computePosition`.
  const pointRef = React.useRef<{ x: number; y: number } | null>(null);
  const [pos, setPos] = React.useState<Position | null>(null);
  // Evita re-focar o primeiro item a cada reposicionamento por scroll/resize
  // (que gera um novo `pos`) — só foca uma vez por abertura.
  const focusedOnOpenRef = React.useRef(false);
  const baseId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-dropdown-menu`;

  function setOpen(next: boolean) {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }

  function close() {
    setOpen(false);
    returnFocusRef.current?.focus();
  }

  const reposition = React.useCallback(() => {
    if (!contentRef.current) return;
    const rect: RectLike | undefined = pointRef.current
      ? {
          top: pointRef.current.y,
          bottom: pointRef.current.y,
          left: pointRef.current.x,
          right: pointRef.current.x,
          width: 0,
          height: 0,
        }
      : triggerWrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(
      computePosition(
        rect,
        { width: contentRef.current.offsetWidth, height: contentRef.current.offsetHeight },
        placement,
        align
      )
    );
  }, [placement, align]);

  React.useLayoutEffect(() => {
    if (open) reposition();
    else {
      setPos(null);
      focusedOnOpenRef.current = false;
    }
  }, [open, reposition]);

  React.useEffect(() => {
    // Só foca o primeiro item depois que `pos` sai de `null` (menu já
    // visível, não mais `visibility: hidden` — elemento invisível não
    // aceita foco) — e só uma vez por abertura, senão cada reposição
    // por scroll/resize puxaria o foco de volta pro primeiro item.
    if (!open || !pos || focusedOnOpenRef.current) return;
    const first = contentRef.current && focusableItems(contentRef.current)[0];
    first?.focus();
    focusedOnOpenRef.current = true;
  }, [open, pos]);

  React.useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, reposition]);

  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerWrapRef.current?.contains(target)) return;
      if (contentRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onMenuKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!contentRef.current) return;
    const items = focusableItems(contentRef.current);
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(currentIndex + 1 + items.length) % items.length].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length].focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0].focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1].focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  const clonedTrigger = React.cloneElement(trigger, {
    "aria-haspopup": "menu",
    "aria-expanded": open,
    "aria-controls": open ? baseId : undefined,
    onClick:
      triggerOn === "click"
        ? (e: React.MouseEvent) => {
            e.preventDefault();
            (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
            pointRef.current = null;
            returnFocusRef.current = e.currentTarget as HTMLElement;
            setOpen(!open);
          }
        : (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick,
    onContextMenu:
      triggerOn === "context"
        ? (e: React.MouseEvent) => {
            e.preventDefault();
            (trigger.props as { onContextMenu?: (e: React.MouseEvent) => void }).onContextMenu?.(e);
            pointRef.current = { x: e.clientX, y: e.clientY };
            returnFocusRef.current = e.currentTarget as HTMLElement;
            setOpen(true);
          }
        : (trigger.props as { onContextMenu?: (e: React.MouseEvent) => void }).onContextMenu,
  });

  return (
    <Ctx.Provider value={{ close }}>
      <span ref={triggerWrapRef} style={{ display: "inline-block" }}>
        {clonedTrigger}
      </span>
      {open &&
        createPortal(
          <div
            ref={contentRef}
            id={baseId}
            role="menu"
            className={cx("ms-dropdown-menu", className)}
            style={{
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              visibility: pos ? "visible" : "hidden",
            }}
            onKeyDown={onMenuKeyDown}
          >
            {children}
          </div>,
          document.body
        )}
    </Ctx.Provider>
  );
}

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  /** `"danger"` — ações destrutivas (ex. excluir), mesma cor de `Badge tone="danger"`. */
  tone?: "default" | "danger";
}

/** Item clicável do menu — fecha o menu sozinho ao ser clicado. */
export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(function DropdownMenuItem(
  { disabled, tone = "default", className, onClick, ...rest },
  ref
) {
  const { close } = React.useContext(Ctx);
  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cx("ms-dropdown-menu__item", tone === "danger" && "ms-dropdown-menu__item--danger", className)}
      onClick={(e) => {
        onClick?.(e);
        close();
      }}
      {...rest}
    />
  );
});

export function DropdownMenuLabel({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("ms-dropdown-menu__label", className)} {...rest} />;
}

export function DropdownMenuDivider({ className, ...rest }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx("ms-dropdown-menu__divider", className)} role="separator" {...rest} />;
}
