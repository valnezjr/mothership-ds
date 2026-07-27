"use client";

import React from "react";

/* ============================================================
   Tema, fundo vivo e o utilitário de contorno reativo.
   ============================================================ */

export type Theme = "dark" | "light";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const Ctx = React.createContext<ThemeCtx | null>(null);

export function useTheme(): ThemeCtx {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useTheme precisa estar dentro de <ThemeProvider>");
  return ctx;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Tema inicial. O escuro é o padrão do sistema. */
  defaultTheme?: Theme;
  /** Guarda a escolha em localStorage (aplicada após a hidratação). */
  persist?: boolean;
}

const STORAGE_KEY = "ms-theme";

/**
 * Controla o tema aplicando/removendo a classe `light` no <html> —
 * o mesmo mecanismo do CSS do design system.
 */
export function ThemeProvider({
  children,
  defaultTheme = "dark",
  persist = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(defaultTheme);

  // Lido só depois da hidratação para não divergir do HTML do servidor.
  React.useEffect(() => {
    if (!persist) return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, [persist]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    if (persist) window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, persist]);

  const value = React.useMemo<ThemeCtx>(
    () => ({
      theme,
      setTheme,
      toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
    }),
    [theme]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Interruptor claro/escuro com o deslize animado do sistema. */
export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <div className={["ms-switch", className].filter(Boolean).join(" ")}>
      {/* o próprio botão é o controle: role=switch + aria-checked
          anunciam o estado, em vez de um <div> com onClick */}
      <button
        className="ms-switch__thumb"
        type="button"
        role="switch"
        aria-checked={theme === "light"}
        aria-label="Alternar tema"
        title="Alternar tema"
        onClick={toggle}
      />
      <span className="ms-switch__track" />
    </div>
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
    const conf: Record<number, GlowConfig> = { ...defaultGlowConfig, ...config };

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

export interface HoverEdgeProps extends React.HTMLAttributes<HTMLDivElement> {
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
    (e: React.PointerEvent<HTMLDivElement>) => {
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
