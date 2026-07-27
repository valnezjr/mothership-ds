"use client";

import React from "react";
import { createPortal } from "react-dom";

/* ============================================================
   Navbar flutuante em pill: marca + links + extras (sino, tema),
   com scrollspy e menu hamburguer responsivo.
   ============================================================ */

export interface NavLink {
  href: string;
  label: React.ReactNode;
}

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  /** Marca à esquerda. Sem ela, os links ficam centralizados. */
  brand?: React.ReactNode;
  brandHref?: string;
  links?: NavLink[];
  /** Marca o link da seção visível conforme a rolagem (âncoras `#id`). */
  spy?: boolean;
  /** Tira do modo flutuante (renderiza no fluxo). */
  variant?: "floating" | "static";
  /** Habilita o hamburguer + menu em telas estreitas. */
  responsive?: boolean;
  /** Sino de notificações, switch de tema etc. */
  children?: React.ReactNode;
}

export function Navbar({
  brand,
  brandHref = "#",
  links = [],
  spy = false,
  variant = "floating",
  responsive = true,
  className,
  children,
  ...rest
}: NavbarProps) {
  const navRef = React.useRef<HTMLElement>(null);
  const [active, setActive] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [menuBox, setMenuBox] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  /* Scrollspy: marca o link cuja seção está visível. */
  // depende dos hrefs, não da identidade do array (que muda a cada render)
  const hrefKey = links.map((l) => l.href).join("|");

  React.useEffect(() => {
    if (!spy || !links.length) return;
    const targets = links
      .filter((l) => l.href.startsWith("#") && l.href.length > 1)
      .map((l) => ({ href: l.href, el: document.querySelector<HTMLElement>(l.href) }))
      .filter((t): t is { href: string; el: HTMLElement } => !!t.el);
    if (!targets.length) return;

    const onScroll = () => {
      const y = window.innerHeight * 0.25;
      let current: string | null = null;
      // getBoundingClientRect é imune a ancestrais posicionados
      for (const t of targets) if (t.el.getBoundingClientRect().top <= y) current = t.href;
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spy, hrefKey]);

  /* O menu vive no <body>: backdrop-filter aninhado na navbar não se
     aplica, então ele é posicionado logo abaixo dela ao abrir. */
  const openMenu = React.useCallback(() => {
    const el = navRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMenuBox({ top: r.bottom + 8, left: r.left, width: r.width });
    setOpen(true);
  }, []);

  const toggleMenu = () => (open ? setOpen(false) : openMenu());

  const menuId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-menu`;

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element;
      if (!t.closest?.(".ms-navbar__menu") && !t.closest?.(".ms-navbar__burger")) setOpen(false);
    };
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const menu =
    mounted && menuBox
      ? createPortal(
          <div
            id={menuId}
            className={["ms-navbar__menu", open && "ms-navbar__menu--open"].filter(Boolean).join(" ")}
            style={{ top: menuBox.top, left: menuBox.left, width: menuBox.width }}
          >
            {links.map((l) => (
              <a
                key={l.href}
                className={[
                  "ms-navbar__link",
                  active === l.href && "ms-navbar__link--active",
                ]
                  .filter(Boolean)
                  .join(" ")}
                href={l.href}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <nav
        ref={navRef}
        className={[
          "ms-navbar",
          variant === "static" && "ms-navbar--static",
          open && "ms-navbar--open",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      >
        {brand != null && (
          <a className="ms-navbar__brand" href={brandHref}>
            {brand}
          </a>
        )}
        {links.map((l) => (
          <a
            key={l.href}
            className={[
              "ms-navbar__link",
              active === l.href && "ms-navbar__link--active",
            ]
              .filter(Boolean)
              .join(" ")}
            href={l.href}
          >
            {l.label}
          </a>
        ))}
        {children}
        {responsive && links.length > 0 && (
          <button
            className="ms-navbar__burger"
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        )}
      </nav>
      {menu}
    </>
  );
}
