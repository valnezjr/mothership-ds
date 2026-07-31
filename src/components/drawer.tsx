"use client";

import React from "react";
import { createPortal } from "react-dom";

/* ============================================================
   Drawer — painel deslizante com véu de fundo, controlado de fora
   (open/onClose). Mecânica extraída da gaveta mobile do Sidebar
   (v1.2.2), agora compartilhada.

   "Leve" como o Popover, não um overlay modal completo — mesmo
   comportamento que o Sidebar já tinha antes da extração, preservado
   à risca (não é uma mudança de contrato): sem focus trap, sem travar
   o scroll do fundo, só Esc/clique no véu fecham. Portal no <body>
   (ver ARCHITECTURE.md § Portais), montado só depois da hidratação
   (mesma cautela de sempre pra SSR).
   ============================================================ */

export interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  /** Lado de onde a gaveta desliza. Padrão `"left"`. */
  side?: "left" | "right";
  /** Classe extra no véu de fundo (o `className` normal vai só no painel). */
  backdropClassName?: string;
}

/** Painel deslizante com véu — a mecânica que o Sidebar usa pra própria gaveta mobile. */
export function Drawer({
  open,
  onClose,
  side = "left",
  className,
  backdropClassName,
  children,
  ...rest
}: DrawerProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={["ms-drawer-backdrop", open && "ms-drawer-backdrop--open", backdropClassName]
          .filter(Boolean)
          .join(" ")}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={["ms-drawer", side === "right" && "ms-drawer--right", open && "ms-drawer--open", className]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {children}
      </div>
    </>,
    document.body
  );
}
