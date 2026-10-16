"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Drawer } from "./drawer";

/* ============================================================
   Navbar flutuante em pill: marca + links + extras (sino, tema),
   com scrollspy e menu hamburguer responsivo.
   ============================================================ */

export interface NavLink {
  href: string;
  label: React.ReactNode;
}

/**
 * Marca o `href` (âncora `#id`) cuja seção está visível na rolagem.
 * Compartilhado por `Navbar` (`spy`) e `Sidebar`.
 */
function useScrollSpy(hrefs: string[], enabled: boolean): string | null {
  const [active, setActive] = React.useState<string | null>(null);
  const hrefKey = hrefs.join("|");

  React.useEffect(() => {
    if (!enabled || !hrefs.length) return;
    const targets = hrefs
      .filter((h) => h.startsWith("#") && h.length > 1)
      .map((h) => ({ href: h, el: document.querySelector<HTMLElement>(h) }))
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
  }, [enabled, hrefKey]);

  return active;
}

export interface UseHashRouteOptions {
  /** IDs válidos (sem `#`) — o que o hash não bater cai no resultado de `resolve`. */
  ids: string[];
  /**
   * Resolve um hash (com ou sem `#`) pro id que deve ficar ativo.
   * Padrão: bate exato com algum item de `ids` ou cai no primeiro —
   * o suficiente pra âncoras simples. Personalize pra casos como
   * "hash aponta pro cabeçalho de um grupo, mostra o primeiro item dele".
   */
  resolve?: (hash: string, ids: string[]) => string;
}

/**
 * Estado de "qual view está ativa" sincronizado com o hash da URL —
 * sem lib de rotas. Pensado pra layouts de uma seção por vez: troca o
 * conteúdo montado no clique em vez de rolar até ele (ver `Sidebar`
 * `active` e ARCHITECTURE.md § Performance do styleguide, que usa
 * exatamente essa dupla).
 *
 * Lido só depois da hidratação — mesma cautela do `ThemeProvider` com
 * `localStorage`: o primeiro render sempre é `ids[0]`, corrigido pro
 * hash real logo em seguida, pra nunca divergir do HTML do servidor.
 * Voltar/avançar do navegador funcionam de graça — é só histórico de
 * URL, sem estado extra pra sincronizar manualmente.
 */
export function useHashRoute({ ids, resolve }: UseHashRouteOptions): [string, (id: string) => void] {
  const resolveRef = React.useRef(resolve);
  resolveRef.current = resolve;
  const idsKey = ids.join("|");

  const defaultResolve = React.useCallback((hash: string, ids: string[]) => {
    const id = hash.replace(/^#/, "");
    return ids.includes(id) ? id : ids[0];
  }, []);

  const [active, setActive] = React.useState(ids[0]);

  React.useEffect(() => {
    const resolveFn = resolveRef.current ?? defaultResolve;
    const apply = () => setActive(resolveFn(window.location.hash, ids));
    if (!window.location.hash) {
      // Sem hash na entrada: fixa o padrão na URL, sem empilhar uma
      // entrada nova no histórico.
      window.history.replaceState(null, "", `#${resolveFn("", ids)}`);
    }
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  const navigate = React.useCallback((id: string) => {
    window.location.hash = id;
  }, []);

  return [active, navigate];
}

export interface LinkRenderProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  /** Presente no link ativo. Repasse ao elemento num `renderLink` próprio. */
  "aria-current"?: "location";
}

function defaultRenderLink({ href, className, children, onClick, "aria-current": ariaCurrent }: LinkRenderProps) {
  return (
    <a className={className} href={href} onClick={onClick} aria-current={ariaCurrent}>
      {children}
    </a>
  );
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
  /**
   * Sobrescreve como marca e links são renderizados — ex.: `Link` de um
   * router de SPA em vez de `<a>` nativo. Sem isso, `href` sempre vira
   * `<a>` puro e clicar recarrega a página inteira; num app de página
   * única com fundo persistente (canvas 3D, áudio, o que for), isso
   * quebra a continuidade — o navegador não sabe que a navegação é
   * "interna". Padrão preserva o comportamento de sempre.
   */
  renderLink?: (props: LinkRenderProps) => React.ReactNode;
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
  renderLink = defaultRenderLink,
  className,
  children,
  ...rest
}: NavbarProps) {
  const navRef = React.useRef<HTMLElement>(null);
  const [open, setOpen] = React.useState(false);
  const [menuBox, setMenuBox] = React.useState<{ top: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const active = useScrollSpy(links.map((l) => l.href), spy && links.length > 0);

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

  const linkProps = (href: string) => ({
    href,
    className: ["ms-navbar__link", active === href && "ms-navbar__link--active"].filter(Boolean).join(" "),
    "aria-current": active === href ? ("location" as const) : undefined,
  });

  const menu =
    mounted && menuBox
      ? createPortal(
          <div
            id={menuId}
            className={["ms-navbar__menu", "ms-portal-root", open && "ms-navbar__menu--open"].filter(Boolean).join(" ")}
            style={{ top: menuBox.top, left: menuBox.left, width: menuBox.width }}
          >
            {links.map((l) => (
              <React.Fragment key={l.href}>
                {renderLink({
                  ...linkProps(l.href),
                  onClick: () => setOpen(false),
                  children: l.label,
                })}
              </React.Fragment>
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
        {brand != null && renderLink({ href: brandHref, className: "ms-navbar__brand", children: brand })}
        {links.map((l) => (
          <React.Fragment key={l.href}>
            {renderLink({
              ...linkProps(l.href),
              children: l.label,
            })}
          </React.Fragment>
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

/* ============================================================
   Sidebar — sumário completo das seções (e subtópicos) da página,
   fixo à esquerda no desktop; vira botão + gaveta com o mesmo
   conteúdo abaixo de 720px. Mesmo scrollspy da Navbar (`useScrollSpy`),
   mas cobrindo também os itens aninhados.
   ============================================================ */

export interface SidebarItem {
  href: string;
  label: React.ReactNode;
}

export interface SidebarSection extends SidebarItem {
  /** Subtópicos da seção — mesmo `href` de âncora, um nível abaixo. */
  items?: SidebarItem[];
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  sections: SidebarSection[];
  /** Marca a seção/subtópico visível conforme a rolagem. Padrão `true`. Ignorado se `active` for passado. */
  spy?: boolean;
  /**
   * Controla o item ativo de fora (ex. roteamento próprio, SPA de uma
   * story por vez) em vez de detectar por scroll. Passando isso, o
   * scrollspy interno desliga por completo — nem os listeners de
   * scroll são anexados.
   */
  active?: string;
  /**
   * `"sticky"` (padrão): acompanha a rolagem da página, gruda sob a
   * navbar. `"fill"`: ocupa 100% da altura do pai, sem sticky nem
   * teto de altura próprio — pra uso dentro de um app-shell de altura
   * fixa (ver `useHashRoute` e `.ms-app-shell`), onde só o conteúdo
   * rola e a Sidebar deve esticar junto da coluna.
   */
  variant?: "sticky" | "fill";
  /** Nome acessível do botão que abre a gaveta abaixo de 720px. */
  toggleLabel?: string;
}

/**
 * Sumário de navegação: uma versão mais completa da Navbar, com
 * subtópicos por seção. Fica fixo (`position: sticky`) à esquerda no
 * desktop — o host posiciona ao lado do conteúdo (flex/grid próprio,
 * a lib não impõe layout de página). `variant="fill"` troca o sticky
 * por esticar 100% da altura do pai, pra uso num app-shell de altura
 * fixa. Abaixo de 720px vira um botão flutuante que abre a mesma
 * navegação como gaveta, nos dois variants.
 */
export function Sidebar({
  sections,
  spy = true,
  active: activeProp,
  variant = "sticky",
  toggleLabel = "Abrir sumário",
  className,
  ...rest
}: SidebarProps) {
  const hrefs = sections.flatMap((s) => [s.href, ...(s.items ?? []).map((i) => i.href)]);
  const spyActive = useScrollSpy(hrefs, spy && activeProp === undefined);
  const active = activeProp ?? spyActive;
  const [open, setOpen] = React.useState(false);
  const drawerId = `${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}-drawer`;
  const navRef = React.useRef<HTMLElement>(null);
  const drawerRef = React.useRef<HTMLElement>(null);

  // Mantém o item ativo visível: útil sobretudo com `active` controlado
  // (ex. roteamento) — sem isso, navegar pra um item fora da área
  // visível não rola a lista sozinha até ele.
  React.useEffect(() => {
    for (const el of [navRef.current, drawerRef.current]) {
      // O link do subtópico (mais específico) vence a seção-pai —
      // as duas podem estar "ativas" ao mesmo tempo (destaque em cascata).
      const target = el?.querySelector(".ms-sidebar__link--active") ?? el?.querySelector(".ms-sidebar__section--active");
      target?.scrollIntoView({ block: "nearest" });
    }
  }, [active]);

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open]);

  const content = sections.map((s) => {
    const sectionActive = active === s.href || (s.items ?? []).some((i) => i.href === active);
    return (
      <div className="ms-sidebar__group" key={s.href}>
        <a
          className={[
            "ms-sidebar__section",
            sectionActive && "ms-sidebar__section--active",
          ]
            .filter(Boolean)
            .join(" ")}
          href={s.href}
          aria-current={active === s.href ? "location" : undefined}
          onClick={() => setOpen(false)}
        >
          {s.label}
        </a>
        {s.items && s.items.length > 0 && (
          <ul className="ms-sidebar__list">
            {s.items.map((i) => (
              <li key={i.href}>
                <a
                  className={[
                    "ms-sidebar__link",
                    active === i.href && "ms-sidebar__link--active",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  href={i.href}
                  aria-current={active === i.href ? "location" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  });

  return (
    <>
      <nav
        ref={navRef}
        className={["ms-sidebar", variant === "fill" && "ms-sidebar--fill", className].filter(Boolean).join(" ")}
        aria-label="Sumário"
        {...rest}
      >
        {content}
      </nav>

      <button
        type="button"
        className="ms-sidebar__toggle"
        aria-label={toggleLabel}
        aria-expanded={open}
        aria-controls={drawerId}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        className="ms-sidebar__drawer-panel"
        backdropClassName="ms-sidebar__drawer-backdrop"
      >
        <nav ref={drawerRef} id={drawerId} className="ms-sidebar__drawer-content" aria-label="Sumário">
          {content}
        </nav>
      </Drawer>
    </>
  );
}

/* ============================================================
   Dock — navegação principal de app: coluna de ícones à esquerda
   que expande para ícone + título. Recolhida, pílula como a Navbar;
   expandida, painel com os cantos e o respiro do Sidebar. Abaixo de 720px a
   coluna vira um único botão, no lugar onde o host a pôs, que abre
   a versão expandida numa gaveta
   (mesmo Drawer do Sidebar) — uma barra de ícones não comporta a
   quantidade de destinos de um app.
   ============================================================ */

export interface DockItem {
  href: string;
  /** Texto, não ReactNode: vira o tooltip (`data-tip`) com a dock recolhida. */
  label: string;
  /** Ícone já renderizado (a lib recomenda Lucide, mas não importa nenhum). */
  icon: React.ReactNode;
  /** Contador sobre o ícone (ex.: pendências). `0` ou ausente esconde. */
  badge?: number;
}

export interface DockProps extends React.HTMLAttributes<HTMLElement> {
  items: DockItem[];
  /** `href` do destino atual — recebe destaque e `aria-current="page"`. */
  active?: string;
  /** Controla o estado expandido de fora. Sem isso, a dock guarda o próprio estado. */
  expanded?: boolean;
  /** Estado inicial quando não controlado. Padrão `false` (só ícones). */
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** Marca no topo. Recolhida, sobra a largura de um ícone: passe algo compacto. */
  brand?: React.ReactNode;
  /** Nome acessível do botão que expande/recolhe. */
  toggleLabel?: string;
  /** Nome acessível do botão que abre a gaveta abaixo de 720px. */
  menuLabel?: string;
  /** Extras no pé (sino, IconButton). Só na dock do desktop, não na gaveta. */
  children?: React.ReactNode;
}

/**
 * Navegação principal de um app: ícones que expandem para ícone +
 * título. Fica no fluxo e estica na altura do pai, como o Sidebar
 * `variant="fill"` num `.ms-app-shell`. Tooltip dos ícones recolhidos
 * depende de um `TooltipProvider` acima na árvore.
 */
export function Dock({
  items,
  active,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  brand,
  toggleLabel = "Mostrar nomes",
  menuLabel = "Abrir navegação",
  className,
  children,
  ...rest
}: DockProps) {
  const [expandedState, setExpandedState] = React.useState(defaultExpanded);
  const expanded = expandedProp ?? expandedState;
  const [open, setOpen] = React.useState(false);
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const listId = `${uid}-list`;
  const drawerId = `${uid}-drawer`;

  const toggle = () => {
    const next = !expanded;
    if (expandedProp === undefined) setExpandedState(next);
    onExpandedChange?.(next);
  };

  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open]);

  const list = (tips: boolean, onNavigate?: () => void) => (
    <ul className="ms-dock__list">
      {items.map((it) => {
        const isActive = active === it.href;
        return (
          <li key={it.href}>
            <a
              className={["ms-dock__item", isActive && "ms-dock__item--active"].filter(Boolean).join(" ")}
              href={it.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={it.badge ? `${it.label} (${it.badge})` : undefined}
              data-tip={tips ? it.label : undefined}
              onClick={onNavigate}
            >
              <span className="ms-dock__icon" aria-hidden="true">{it.icon}</span>
              <span className="ms-dock__label">{it.label}</span>
              {it.badge ? <span className="ms-dock__badge" aria-hidden="true">{it.badge}</span> : null}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <nav
        className={["ms-dock", expanded && "ms-dock--expanded", className].filter(Boolean).join(" ")}
        aria-label="Navegação principal"
        {...rest}
      >
        {brand != null && <div className="ms-dock__brand">{brand}</div>}
        <div id={listId} className="ms-dock__scroll">
          {list(!expanded)}
        </div>
        {children != null && <div className="ms-dock__extras">{children}</div>}
        <button
          type="button"
          className="ms-dock__item ms-dock__toggle"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-label={toggleLabel}
          data-tip={expanded ? undefined : toggleLabel}
          onClick={toggle}
        >
          <span className="ms-dock__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </button>
        <button
          type="button"
          className="ms-dock__menu-toggle"
          aria-label={menuLabel}
          aria-expanded={open}
          aria-controls={drawerId}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        className="ms-dock__drawer-panel"
        backdropClassName="ms-dock__drawer-backdrop"
      >
        <nav id={drawerId} className="ms-dock__drawer-content" aria-label="Navegação principal">
          {brand != null && <div className="ms-dock__brand">{brand}</div>}
          {list(false, () => setOpen(false))}
        </nav>
      </Drawer>
    </>
  );
}
