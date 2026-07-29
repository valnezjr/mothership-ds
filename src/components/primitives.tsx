import React from "react";

/* ============================================================
   Primitivas — superfícies e controles do Mothership DS.
   Componentes puramente apresentacionais (sem estado) podem ser
   renderizados no servidor; por isso este arquivo não leva
   "use client".
   ============================================================ */

type Div = React.HTMLAttributes<HTMLDivElement>;

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

/* ---------- Página ---------- */

export interface PageProps extends Div {
  /** Envolve o conteúdo no container de 588px do sistema. */
  contained?: boolean;
}

/** Superfície da página: aplica o fundo vivo, a fonte e as cores do tema. */
export function Page({ contained, className, children, ...rest }: PageProps) {
  return (
    <div className={cx("ms-page", className)} {...rest}>
      {contained ? <div className="ms-container">{children}</div> : children}
    </div>
  );
}

/* ---------- Botões ---------- */

export type ButtonVariant = "glass" | "solid" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonBase {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Largura natural em vez de 100%. */
  inline?: boolean;
}

function buttonClass({ variant = "glass", size = "md", inline }: ButtonBase, extra?: string) {
  return cx(
    "ms-button",
    variant === "solid" && "ms-button--solid",
    variant === "ghost" && "ms-button--ghost",
    size === "sm" && "ms-button--sm",
    size === "lg" && "ms-button--lg",
    inline && "ms-button--inline",
    extra
  );
}

export interface ButtonProps
  extends ButtonBase,
    React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ variant, size, inline, className, ...rest }: ButtonProps) {
  return <button className={buttonClass({ variant, size, inline }, className)} {...rest} />;
}

export interface ButtonLinkProps
  extends ButtonBase,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {}

/** Mesmo visual do Button, para navegação (`<a>`). */
export function ButtonLink({ variant, size, inline, className, ...rest }: ButtonLinkProps) {
  return <a className={buttonClass({ variant, size, inline }, className)} {...rest} />;
}

export interface IconButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "sm" | "md" | "lg";
  /** Obrigatório: sem href o elemento não é focável nem é um link. */
  href: string;
  /** Botões só de ícone precisam de nome acessível. */
  "aria-label": string;
}

/** Botão circular de ícone (redes sociais). */
export function IconButton({ size = "md", className, ...rest }: IconButtonProps) {
  return (
    <a
      className={cx(
        "ms-icon-button",
        size === "sm" && "ms-icon-button--sm",
        size === "lg" && "ms-icon-button--lg",
        className
      )}
      {...rest}
    />
  );
}

export function IconRow({ className, ...rest }: Div) {
  return <div className={cx("ms-icon-row", className)} {...rest} />;
}

/* ---------- Lista de links (padrão linktree) ---------- */

export function LinkList({
  className,
  ...rest
}: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cx("ms-link-list", className)} {...rest} />;
}

/* ---------- Card ---------- */

export interface CardProps extends Omit<Div, "title"> {
  title?: React.ReactNode;
}

export function Card({ title, className, children, ...rest }: CardProps) {
  return (
    <div className={cx("ms-card", className)} {...rest}>
      {title != null && <div className="ms-card__title">{title}</div>}
      {children}
    </div>
  );
}

export function CardText({ className, ...rest }: Div) {
  return <div className={cx("ms-card__text", className)} {...rest} />;
}

/* ---------- Badge ---------- */

/**
 * Cores de marca disponíveis para badges e alertas.
 * `neutral` usa a superfície de vidro (sem cor); `gray` é o cinza sólido
 * de status.
 */
export type Tone =
  | "neutral"
  | "accent"
  | "highlight"
  | "success"
  | "danger"
  | "violet"
  | "pink"
  | "orange"
  | "gray";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ tone = "neutral", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cx("ms-badge", tone !== "neutral" && `ms-badge--${tone}`, className)}
      {...rest}
    />
  );
}

/* ---------- Avatar & perfil ---------- */

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: "sm" | "md" | "lg";
  /** Iniciais exibidas quando não há imagem. */
  initials?: string;
  /** Texto alternativo — exigido quando há `src`. */
  alt?: string;
}

export function Avatar({ size = "lg", initials, alt, className, src, ...rest }: AvatarProps) {
  const cls = cx(
    "ms-avatar",
    size === "sm" && "ms-avatar--sm",
    size === "md" && "ms-avatar--md",
    className
  );
  if (!src) {
    return (
      <span className={cx(cls, "ms-avatar--placeholder")} role="img" aria-label={alt}>
        {initials}
      </span>
    );
  }
  return <img className={cls} src={src} alt={alt ?? ""} {...rest} />;
}

export interface ProfileProps extends Div {
  handle?: React.ReactNode;
}

export function Profile({ handle, className, children, ...rest }: ProfileProps) {
  return (
    <div className={cx("ms-profile", className)} {...rest}>
      {children}
      {handle != null && <p className="ms-profile__handle">{handle}</p>}
    </div>
  );
}

/* ---------- Formulário ---------- */

export interface FieldProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  label?: React.ReactNode;
}

export function Field({ label, className, children, ...rest }: FieldProps) {
  return (
    <label className={cx("ms-field", className)} {...rest}>
      {label != null && <span className="ms-field__label">{label}</span>}
      {children}
    </label>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...rest }, ref) {
  return <input ref={ref} className={cx("ms-input", className)} {...rest} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cx("ms-input", className)} {...rest} />;
});

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Rótulo ao lado da caixa — omita para montar o `<label>` você mesmo. */
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, ...rest },
  ref
) {
  const input = <input ref={ref} type="checkbox" className={cx("ms-checkbox", className)} {...rest} />;
  if (label == null) return input;
  return (
    <label className="ms-checkbox-field">
      {input}
      <span>{label}</span>
    </label>
  );
});

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Rótulo ao lado do círculo — omita para montar o `<label>` você mesmo. */
  label?: React.ReactNode;
}

/** Agrupamento é nativo: radios com o mesmo `name` já formam um grupo (setas do teclado inclusas), sem componente extra. */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, className, ...rest },
  ref
) {
  const input = <input ref={ref} type="radio" className={cx("ms-radio", className)} {...rest} />;
  if (label == null) return input;
  return (
    <label className="ms-radio-field">
      {input}
      <span>{label}</span>
    </label>
  );
});

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Rótulo ao lado do interruptor — omita para montar o `<label>` você mesmo. */
  label?: React.ReactNode;
}

/**
 * Interruptor de formulário — `<input type="checkbox" role="switch">`, participa de
 * `<form>` normalmente. Para o interruptor de tema claro/escuro, use `ThemeSwitch`.
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, className, ...rest },
  ref
) {
  const input = (
    <input ref={ref} type="checkbox" role="switch" className={cx("ms-toggle", className)} {...rest} />
  );
  if (label == null) return input;
  return (
    <label className="ms-checkbox-field">
      {input}
      <span>{label}</span>
    </label>
  );
});

/* ---------- Hero ---------- */

export interface HeroProps extends Omit<Div, "title"> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  actions,
  className,
  children,
  ...rest
}: HeroProps) {
  return (
    <section className={cx("ms-hero", className)} {...rest}>
      {eyebrow}
      {title != null && <h1 className="ms-hero__title">{title}</h1>}
      {subtitle != null && <p className="ms-hero__subtitle">{subtitle}</p>}
      {actions != null && <div className="ms-hero__actions">{actions}</div>}
      {children}
    </section>
  );
}

/** Trecho em destaque do título do Hero (gradiente da escala accent). */
export function HeroHighlight({ className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("ms-hero__highlight", className)} {...rest} />;
}

/* ---------- Breadcrumbs ---------- */

export interface Crumb {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: Crumb[];
  /** Envolve a trilha numa pill de vidro. */
  glass?: boolean;
}

const ChevronRight = (
  <span className="ms-breadcrumbs__sep" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  </span>
);

export function Breadcrumbs({ items, glass, className, ...rest }: BreadcrumbsProps) {
  return (
    <nav
      className={cx("ms-breadcrumbs", glass && "ms-breadcrumbs--glass", className)}
      aria-label="Breadcrumb"
      {...rest}
    >
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last || !item.href ? (
              <span className="ms-breadcrumbs__current" aria-current={last ? "page" : undefined}>
                {item.label}
              </span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
            {!last && ChevronRight}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/* ---------- Rodapé ---------- */

export function Footer({ className, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <footer className={cx("ms-footer", className)} {...rest} />;
}

/** Ícone "flash" do rodapé, na cor de destaque. */
export function Flash() {
  return (
    <span className="ms-flash">
      <svg
        viewBox="0 0 24 24"
        style={{ width: "1em", height: "1em", fill: "currentColor", verticalAlign: -2 }}
        aria-hidden="true"
      >
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    </span>
  );
}

/* ---------- Stack ---------- */

export interface StackProps extends Div {
  /** Eixo principal do flex. */
  direction?: "row" | "column";
  /** Espaço entre itens, na escala de 8 pontos (`--space-1`…`--space-7`). */
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  align?: "start" | "center" | "end" | "stretch";
  wrap?: boolean;
}

/** Wrapper fino de flexbox — só aplica direção/espaço/alinhamento em tokens do sistema. */
export function Stack({
  direction = "column",
  gap = 4,
  align,
  wrap,
  className,
  style,
  ...rest
}: StackProps) {
  return (
    <div
      className={cx("ms-stack", className)}
      style={{
        flexDirection: direction,
        gap: `var(--space-${gap})`,
        alignItems: align,
        flexWrap: wrap ? "wrap" : undefined,
        ...style,
      }}
      {...rest}
    />
  );
}

/* ---------- Divider ---------- */

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: "horizontal" | "vertical";
}

/** Linha divisória — vertical exige altura definida pelo pai (`align-self: stretch` cobre um `Stack`/flex). */
export function Divider({ orientation = "horizontal", className, ...rest }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cx("ms-divider", "ms-divider--vertical", className)}
        {...rest}
      />
    );
  }
  return <hr className={cx("ms-divider", className)} {...rest} />;
}

/* ---------- Skeleton ---------- */

export interface SkeletonProps extends Div {
  /** `text` = linha baixa arredondada; `circle` = avatar/ícone; `rect` = bloco livre (padrão). */
  variant?: "text" | "circle" | "rect";
}

/** Placeholder de carregamento — pulsa entre os tokens de superfície existentes, nunca uma cor nova. */
export function Skeleton({ variant = "rect", className, ...rest }: SkeletonProps) {
  return (
    <div
      className={cx("ms-skeleton", variant !== "rect" && `ms-skeleton--${variant}`, className)}
      aria-hidden="true"
      {...rest}
    />
  );
}
