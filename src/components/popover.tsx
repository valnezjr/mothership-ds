"use client";

import React from "react";
import { createPortal } from "react-dom";

/* ============================================================
   Popover — painel flutuante disparado por clique, com conteúdo
   livre e interativo. Diferente do Tooltip (hover, só texto):
   fica aberto até ser dispensado (clique fora, Esc, ou clique no
   próprio gatilho de novo).

   "Popover leve", não um overlay modal — ver ACCESSIBILITY.md § Modal:
   não prende o foco dentro (sem focus trap), só fecha e devolve o
   foco ao gatilho no Esc. Não usa role="dialog" por não implementar
   o contrato completo de diálogo — seria elogio falso pra leitor de
   tela.

   Posicionamento: portal no <body> + position: fixed, com a posição
   calculada de verdade (getBoundingClientRect do gatilho e do
   conteúdo, com flip de lado se não couber e clamp horizontal na
   viewport) — o mecanismo que Select/Combobox deliberadamente NÃO
   construíram, sabendo que viria daqui.
   ============================================================ */

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export interface PopoverProps {
  /** Elemento que abre/fecha o popover ao ser clicado — não precisa encaminhar `ref`. */
  trigger: React.ReactElement;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: "top" | "bottom";
  align?: "start" | "center" | "end";
  className?: string;
}

interface Position {
  top: number;
  left: number;
}

function computePosition(
  trigger: DOMRect,
  content: { width: number; height: number },
  placement: "top" | "bottom",
  align: "start" | "center" | "end"
): Position {
  const gap = 8;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const fitsBelow = trigger.bottom + gap + content.height <= vh;
  const fitsAbove = trigger.top - gap - content.height >= 0;
  const finalPlacement: "top" | "bottom" =
    placement === "bottom" ? (fitsBelow || !fitsAbove ? "bottom" : "top") : fitsAbove || !fitsBelow ? "top" : "bottom";

  const top = finalPlacement === "bottom" ? trigger.bottom + gap : trigger.top - gap - content.height;

  let left = trigger.left;
  if (align === "center") left = trigger.left + trigger.width / 2 - content.width / 2;
  else if (align === "end") left = trigger.right - content.width;

  // nunca deixa o popover sair da viewport horizontalmente
  left = Math.min(Math.max(left, 8), Math.max(8, vw - content.width - 8));

  return { top, left };
}

/** Painel flutuante disparado por clique — o `Popover` "leve" que Select/Combobox deixaram pra depois. */
export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  align = "start",
  className,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;
  // Wrapper de medição, não um clone com `ref` — Button/ButtonLink/IconButton
  // não encaminham ref hoje, então medir o gatilho de verdade quebraria com
  // eles. O wrapper é só uma caixa inline-block, sem papel semântico.
  const triggerWrapRef = React.useRef<HTMLSpanElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState<Position | null>(null);
  const baseId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-popover`;

  function setOpen(next: boolean) {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }

  const reposition = React.useCallback(() => {
    if (!triggerWrapRef.current || !contentRef.current) return;
    setPos(
      computePosition(
        triggerWrapRef.current.getBoundingClientRect(),
        { width: contentRef.current.offsetWidth, height: contentRef.current.offsetHeight },
        placement,
        align
      )
    );
  }, [placement, align]);

  React.useLayoutEffect(() => {
    if (open) reposition();
    else setPos(null);
  }, [open, reposition]);

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
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerWrapRef.current
          ?.querySelector<HTMLElement>("a, button, input, select, textarea, [tabindex]")
          ?.focus();
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const clonedTrigger = React.cloneElement(trigger, {
    "aria-expanded": open,
    "aria-controls": open ? baseId : undefined,
    onClick: (e: React.MouseEvent) => {
      // Sempre previne a ação padrão do gatilho — IconButton/ButtonLink
      // são sempre <a> (IconButton exige href), então sem isso o clique
      // também navegaria de verdade. O papel do gatilho aqui é só abrir
      // o popover, nunca disparar a ação nativa dele.
      e.preventDefault();
      (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick?.(e);
      setOpen(!open);
    },
  });

  return (
    <>
      <span ref={triggerWrapRef} style={{ display: "inline-block" }}>
        {clonedTrigger}
      </span>
      {open &&
        createPortal(
          <div
            ref={contentRef}
            id={baseId}
            className={cx("ms-popover", className)}
            style={{
              top: pos?.top ?? -9999,
              left: pos?.left ?? -9999,
              visibility: pos ? "visible" : "hidden",
            }}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
}
