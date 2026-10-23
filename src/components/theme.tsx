"use client";

import React from "react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel } from "./dropdown-menu";
import { THEMES, lerSalvo, resolverModo, type Theme, type ThemeMode, type ResolvedMode } from "./theme-state";

/* ============================================================
   Tema, fundo vivo e o utilitário de contorno reativo.
   ============================================================ */

export type { Theme, ThemeMode, ResolvedMode } from "./theme-state";

interface ThemeCtx {
  theme: Theme;
  /** O modo escolhido, que pode ser `"system"`. */
  mode: ThemeMode;
  /** O modo que vale na tela: `"system"` já resolvido pelo SO. */
  resolvedMode: ResolvedMode;
  setTheme: (t: Theme) => void;
  setMode: (m: ThemeMode) => void;
  /** Alterna base ↔ escuro dentro do tema atual (sai do `"system"`). */
  toggleMode: () => void;
}

const Ctx = React.createContext<ThemeCtx | null>(null);

export function useTheme(): ThemeCtx {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useTheme precisa estar dentro de <ThemeProvider>");
  return ctx;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Tema inicial (padrão: `"glass"`). */
  defaultTheme?: Theme;
  /** Modo inicial (padrão: `"base"`). `"system"` acompanha o `prefers-color-scheme`. */
  defaultMode?: ThemeMode;
  /** Guarda tema e modo em localStorage (aplicados após a hidratação). */
  persist?: boolean;
}

const THEME_KEY = "ms-theme";
const MODE_KEY = "ms-mode";
const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribeDark(onChange: () => void) {
  const mq = window.matchMedia(DARK_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}
const getDark = () => window.matchMedia(DARK_QUERY).matches;
const getDarkServer = () => false;

/**
 * Controla o tema escrevendo `data-ms-theme` e `data-ms-mode` (o modo
 * resolvido) no <html>, os dois eixos que o CSS do design system lê.
 */
export function ThemeProvider({
  children,
  defaultTheme = "glass",
  defaultMode = "base",
  persist = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);
  const [mode, setMode] = React.useState<ThemeMode>(defaultMode);
  // Lido na hora, não num efeito: com um estado próprio, o render em que
  // o modo vira "system" ainda resolveria com o valor velho e o primeiro
  // frame sairia em "base" com o SO escuro.
  const prefersDark = React.useSyncExternalStore(subscribeDark, getDark, getDarkServer);
  // Só grava depois de ler: senão o padrão sobrescreve a escolha salva
  // antes de ela ser lida (o StrictMode roda o efeito de leitura duas vezes).
  const [loaded, setLoaded] = React.useState(!persist);
  const resolvedMode = resolverModo(mode, prefersDark);

  // Lido só depois da hidratação para não divergir do HTML do servidor.
  React.useEffect(() => {
    if (!persist) return;
    const saved = lerSalvo(
      window.localStorage.getItem(THEME_KEY),
      window.localStorage.getItem(MODE_KEY)
    );
    if (saved.theme) setTheme(saved.theme);
    if (saved.mode) setMode(saved.mode);
    setLoaded(true);
  }, [persist]);

  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.msTheme = theme;
    root.dataset.msMode = resolvedMode;
  }, [theme, resolvedMode]);

  React.useEffect(() => {
    if (!persist || !loaded) return;
    window.localStorage.setItem(THEME_KEY, theme);
    window.localStorage.setItem(MODE_KEY, mode);
  }, [theme, mode, persist, loaded]);

  const value = React.useMemo<ThemeCtx>(
    () => ({
      theme,
      mode,
      resolvedMode,
      setTheme,
      setMode,
      toggleMode: () => setMode(resolvedMode === "dark" ? "base" : "dark"),
    }),
    [theme, mode, resolvedMode]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/**
 * Interruptor base/escuro com o deslize animado do sistema: alterna o
 * modo dentro do tema atual. Para trocar de tema, use `ThemeMenu`.
 */
export function ThemeSwitch({ className }: { className?: string }) {
  const { resolvedMode, toggleMode } = useTheme();
  return (
    // onClick no wrapper (não só no botão) pra clicar no trilho também
    // alternar o modo — o clique do botão sobe até aqui por bubbling,
    // então fica num só lugar (nunca dispara duas vezes).
    <div className={["ms-switch", className].filter(Boolean).join(" ")} onClick={toggleMode}>
      {/* o próprio botão é o controle acessível: role=switch +
          aria-checked anunciam o estado; o wrapper só amplia a área de
          clique, não substitui o botão como alvo de foco/teclado */}
      <button
        className="ms-switch__thumb"
        type="button"
        role="switch"
        aria-checked={resolvedMode === "dark"}
        aria-label="Modo escuro"
        title="Modo escuro"
      />
      <span className="ms-switch__track" />
    </div>
  );
}

/* ---------- Menu de tema ---------- */

const MoonIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
  </svg>
);

/** Mesmo par do polegar do `ThemeSwitch` (`--icon-switch`): o Glass base
 *  já é escuro, então ganha a lua vazada no lugar do sol. */
function modeIcon(theme: Theme, mode: ResolvedMode) {
  if (mode === "dark") return <MoonIcon filled />;
  return theme === "glass" ? <MoonIcon /> : <SunIcon />;
}

const THEME_LABELS: Record<Theme, string> = {
  glass: "Mothership Glass",
  cream: "Mothership Cream",
  paperpen: "Mothership Paperpen",
  flat: "Mothership Flat",
};

const MODE_LABELS: Record<ResolvedMode, string> = { base: "Base", dark: "Escuro" };

export interface ThemeMenuProps {
  className?: string;
  /** Alinhamento do menu em relação ao botão (padrão: `"end"`, para a ponta direita da Navbar). */
  align?: "start" | "center" | "end";
}

/**
 * Seletor dos oito pares tema × modo num menu flutuante: um
 * `DropdownMenu` aberto por um botão redondo (o mesmo do sino da Navbar)
 * com o ícone do par ativo. Um grupo por tema, com Base e Escuro como
 * itens marcáveis (`menuitemradio`). O par ativo é o do modo resolvido,
 * então com `mode="system"` o check segue o SO.
 */
export function ThemeMenu({ className, align = "end" }: ThemeMenuProps) {
  const { theme, resolvedMode, setTheme, setMode } = useTheme();
  const baseId = React.useId();
  return (
    <DropdownMenu
      align={align}
      trigger={
        <button
          type="button"
          className={["ms-theme-menu__trigger", className].filter(Boolean).join(" ")}
          aria-label={`Tema: ${THEME_LABELS[theme]}, ${MODE_LABELS[resolvedMode]}`}
          title="Escolher tema"
        >
          {modeIcon(theme, resolvedMode)}
        </button>
      }
    >
      {THEMES.map((t) => (
        <div key={t} role="group" aria-labelledby={`${baseId}-${t}`}>
          <DropdownMenuLabel id={`${baseId}-${t}`}>{THEME_LABELS[t]}</DropdownMenuLabel>
          {(["base", "dark"] as const).map((m) => (
            <DropdownMenuItem
              key={m}
              checked={theme === t && resolvedMode === m}
              onClick={() => {
                setTheme(t);
                setMode(m);
              }}
            >
              {modeIcon(t, m)}
              {MODE_LABELS[m]}
            </DropdownMenuItem>
          ))}
        </div>
      ))}
    </DropdownMenu>
  );
}

/* ---------- Fundo vivo (lava lamp + parallax) ---------- */

export interface GlowConfig {
  /** Raio da deriva passiva, em % da tela. */
  drift: number;
  /** Velocidade da deriva (1 = ciclo base). */
  speed: number;
  /** Pulsação de tamanho — a "respiração" da cera. */
  pulse: number;
  /** Amplitude da resposta ao mouse, em %. */
  amp: number;
  /** +1 acompanha o cursor, −1 contraria. */
  dir: 1 | -1;
}

export const defaultGlowConfig: Record<number, GlowConfig> = {
  1: { drift: 12, speed: 2.8, pulse: 0.24, amp: 4, dir: -1 },
  2: { drift: 18, speed: 3.2, pulse: 0.32, amp: 8, dir: 1 },
  3: { drift: 14, speed: 2.4, pulse: 0.26, amp: 5, dir: 1 },
  4: { drift: 16, speed: 2.6, pulse: 0.28, amp: 6, dir: -1 },
};

/**
 * Anima os glows do fundo: órbitas deformadas por harmônicos (movimento
 * contínuo, nunca repete o mesmo caminho), pulsação de tamanho e um
 * parallax somado por cima em resposta ao mouse. Respeita
 * `prefers-reduced-motion`.
 */
export function useLivingBackground(config: Partial<Record<number, GlowConfig>> = defaultGlowConfig) {
  // Guardado num ref: o efeito escreve as mesmas propriedades que lê, então
  // reler depois de uma remontagem faria a origem derivar a cada ciclo.
  const homeRef = React.useRef<
    { n: number; hx: number; hy: number; hw: number; hh: number }[] | null
  >(null);
  // Serializada: um objeto literal inline não reinicia a animação a cada render.
  const confKey = JSON.stringify(config);

  React.useEffect(() => {
    const root = document.documentElement;
    const cs = getComputedStyle(root);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conf = { ...defaultGlowConfig, ...config } as Record<number, GlowConfig>;

    if (!homeRef.current) {
      homeRef.current = [1, 2, 3, 4].map((n) => {
        const pos = cs.getPropertyValue(`--bg-glow-${n}-pos`).trim().split(/\s+/);
        const size = cs.getPropertyValue(`--bg-glow-${n}-size`).trim().split(/\s+/);
        return {
          n,
          hx: parseFloat(pos[0]) || 0,
          hy: parseFloat(pos[1]) || 0,
          hw: parseFloat(size[0]) || 45,
          hh: parseFloat(size[1]) || 45,
        };
      });
    }

    const glows = homeRef.current.map((h) => {
      const n = h.n;
      return {
        n,
        c: conf[n],
        hx: h.hx,
        hy: h.hy,
        hw: h.hw,
        hh: h.hh,
        mx: 0,
        my: 0,
      };
    });

    let pmx = 0;
    let pmy = 0;
    const onMove = (e: PointerEvent) => {
      pmx = (e.clientX / window.innerWidth) * 2 - 1;
      pmy = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);

    let raf = 0;
    const tick = (now: number) => {
      const t = now / 1000;
      for (const g of glows) {
        const { c, n } = g;
        const s = c.speed;
        const dx = reduced
          ? 0
          : c.drift *
            (0.55 * Math.cos(t * 0.1 * s + n * 1.7) +
              0.3 * Math.sin(t * 0.163 * s + n * 4.1) +
              0.15 * Math.sin(t * 0.271 * s + n * 0.6));
        const dy = reduced
          ? 0
          : c.drift *
            (0.55 * Math.sin(t * 0.1 * s + n * 1.7) +
              0.3 * Math.sin(t * 0.137 * s + n * 2.9) +
              0.15 * Math.cos(t * 0.229 * s + n * 5.3));

        g.mx += (pmx * c.amp * c.dir - g.mx) * 0.05;
        g.my += (pmy * c.amp * c.dir - g.my) * 0.05;

        root.style.setProperty(
          `--bg-glow-${n}-pos`,
          `${(g.hx + dx + g.mx).toFixed(2)}% ${(g.hy + dy + g.my).toFixed(2)}%`
        );

        if (!reduced && c.pulse) {
          const w =
            g.hw *
            (1 + c.pulse * (0.7 * Math.sin(t * 0.13 * s + n * 2.4) + 0.3 * Math.sin(t * 0.211 * s + n * 4.8)));
          const h =
            g.hh *
            (1 + c.pulse * (0.7 * Math.sin(t * 0.104 * s + n * 5.2) + 0.3 * Math.sin(t * 0.179 * s + n * 1.3)));
          root.style.setProperty(`--bg-glow-${n}-size`, `${w.toFixed(2)}% ${h.toFixed(2)}%`);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      // devolve o fundo ao estado declarado no CSS
      for (const { n } of glows) {
        root.style.removeProperty(`--bg-glow-${n}-pos`);
        root.style.removeProperty(`--bg-glow-${n}-size`);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confKey]);
}

/** Liga o fundo vivo. Renderize uma vez, perto da raiz da aplicação. */
export function LivingBackground({ config }: { config?: Partial<Record<number, GlowConfig>> }) {
  useLivingBackground(config ?? defaultGlowConfig);
  return null;
}

/* ---------- Contorno reativo no hover ---------- */

/**
 * Handler do contorno reativo: aponta o degradê do centro do elemento
 * para o cursor. Compartilhado por HoverEdge e pelos componentes de dados.
 */
export function useEdgeAngle() {
  return React.useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const angle =
      (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) /
        Math.PI +
      90;
    el.style.setProperty("--ms-grad-angle", `${angle.toFixed(1)}deg`);
  }, []);
}

export interface HoverEdgeProps extends React.HTMLAttributes<HTMLElement> {
  /** Cores do anel — use as cores vivas do próprio conteúdo. */
  colors?: [string, string];
  /** Raio do anel (padrão: --radius-md). */
  radius?: string;
  /** Deslocamento vertical no hover (padrão: -4px). */
  lift?: string;
  /** Escala no hover (padrão: 1.03). */
  scale?: number;
  as?: "div" | "article" | "section" | "li";
}

/**
 * Envolve qualquer superfície com o hover do sistema: cresce, ganha
 * sombra e a borda vira um anel em degradê que gira acompanhando o mouse.
 */
export function HoverEdge({
  colors,
  radius,
  lift,
  scale,
  as: Tag = "div",
  className,
  style,
  onPointerMove,
  children,
  ...rest
}: HoverEdgeProps) {
  const setAngle = useEdgeAngle();
  const handleMove = React.useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      setAngle(e);
      onPointerMove?.(e);
    },
    [setAngle, onPointerMove]
  );

  const vars: React.CSSProperties = { ...style };
  if (colors) {
    (vars as Record<string, string>)["--ms-edge-a"] = colors[0];
    (vars as Record<string, string>)["--ms-edge-b"] = colors[1];
  }
  if (radius) (vars as Record<string, string>)["--ms-edge-radius"] = radius;
  if (lift) (vars as Record<string, string>)["--ms-edge-lift"] = lift;
  if (scale != null) (vars as Record<string, string>)["--ms-edge-scale"] = String(scale);

  return (
    <Tag
      className={["ms-hover-edge", className].filter(Boolean).join(" ")}
      style={vars}
      onPointerMove={handleMove}
      {...rest}
    >
      {children}
    </Tag>
  );
}
