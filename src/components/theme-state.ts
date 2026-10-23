/* ============================================================
   Tema e modo — lógica pura, sem React e sem DOM, para o
   ThemeProvider e para os testes (node --test).
   ============================================================ */

export type Theme = "glass" | "cream" | "paperpen" | "flat";
/** O modo escolhido: `"system"` acompanha o `prefers-color-scheme` do SO. */
export type ThemeMode = "base" | "dark" | "system";
/** O modo que vale na tela, com `"system"` já resolvido. */
export type ResolvedMode = "base" | "dark";

export const THEMES: readonly Theme[] = ["glass", "cream", "paperpen", "flat"];
const MODES: readonly ThemeMode[] = ["base", "dark", "system"];

/** Valores da chave `ms-theme` da v1, de quando tema e modo eram uma lista só. */
const LEGADO: Record<string, { theme: Theme; mode: ThemeMode }> = {
  dark: { theme: "glass", mode: "base" },
  darker: { theme: "glass", mode: "dark" },
  light: { theme: "cream", mode: "base" },
};

/** Lê o que o `persist` gravou; o que não reconhece fica de fora. */
export function lerSalvo(
  theme: string | null,
  mode: string | null
): { theme?: Theme; mode?: ThemeMode } {
  if (theme && LEGADO[theme]) return LEGADO[theme];
  const lido: { theme?: Theme; mode?: ThemeMode } = {};
  if (theme && (THEMES as readonly string[]).includes(theme)) lido.theme = theme as Theme;
  if (mode && (MODES as readonly string[]).includes(mode)) lido.mode = mode as ThemeMode;
  return lido;
}

/** `prefersDark` é o `matches` de `(prefers-color-scheme: dark)`. */
export function resolverModo(mode: ThemeMode, prefersDark: boolean): ResolvedMode {
  if (mode === "system") return prefersDark ? "dark" : "base";
  return mode;
}
