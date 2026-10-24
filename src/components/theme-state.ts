/* ============================================================
   Tema e modo — lógica pura, sem React e sem DOM, para o
   ThemeProvider e para os testes (node --test).
   ============================================================ */

export type Theme = "glass" | "cream" | "paperpen" | "flat";
/** O modo escolhido: `"system"` acompanha o `prefers-color-scheme` do SO. */
export type ThemeMode = "base" | "dark" | "system";
/** O modo que vale na tela, com `"system"` já resolvido. */
export type ResolvedMode = "base" | "dark";

/** Tema e modo escolhidos juntos: o que o `persist` guarda. */
export interface ThemeChoice {
  theme: Theme;
  mode: ThemeMode;
}

export const THEMES: readonly Theme[] = ["glass", "cream", "paperpen", "flat"];
export const RESOLVED_MODES: readonly ResolvedMode[] = ["base", "dark"];
const MODES: readonly ThemeMode[] = [...RESOLVED_MODES, "system"];

export const THEME_LABELS: Record<Theme, string> = {
  glass: "Mothership Glass",
  cream: "Mothership Cream",
  paperpen: "Mothership Paperpen",
  flat: "Mothership Flat",
};

export const MODE_LABELS: Record<ResolvedMode, string> = { base: "Base", dark: "Escuro" };

/** Valores da chave `ms-theme` da v1, de quando tema e modo eram uma lista só. */
const LEGADO: Record<string, ThemeChoice> = {
  dark: { theme: "glass", mode: "base" },
  darker: { theme: "glass", mode: "dark" },
  light: { theme: "cream", mode: "base" },
};

/** Lê o que o `persist` gravou; o que não reconhece fica de fora. */
export function lerEscolhaSalva(theme: string | null, mode: string | null): Partial<ThemeChoice> {
  if (theme && LEGADO[theme]) return LEGADO[theme];
  const lido: Partial<ThemeChoice> = {};
  if (theme && (THEMES as readonly string[]).includes(theme)) lido.theme = theme as Theme;
  if (mode && (MODES as readonly string[]).includes(mode)) lido.mode = mode as ThemeMode;
  return lido;
}

/** `prefersDark` é o `matches` de `(prefers-color-scheme: dark)`. */
export function resolverModo(mode: ThemeMode, prefersDark: boolean): ResolvedMode {
  if (mode === "system") return prefersDark ? "dark" : "base";
  return mode;
}

export type IconeDoModo = "lua" | "sol" | "lua-cheia";

/**
 * Ícone de cada par, no gatilho do `ThemeMenu`, nos itens dele e no
 * polegar do `ThemeSwitch`. O Glass base já é escuro, então ganha a lua
 * vazada no lugar do sol. O polegar desenha por CSS (`--icon-switch`,
 * em tokens.css), que repete esta regra: mudou aqui, muda lá.
 */
export function iconeDoModo(theme: Theme, mode: ResolvedMode): IconeDoModo {
  if (mode === "dark") return "lua-cheia";
  return theme === "glass" ? "lua" : "sol";
}

