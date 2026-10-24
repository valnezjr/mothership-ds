// Testes da leitura do tema salvo e da resolução do modo (node --test, sem dependências).
import { test } from "node:test";
import assert from "node:assert/strict";
import { iconeDoModo, lerEscolhaSalva, resolverModo, RESOLVED_MODES, THEMES, THEME_LABELS } from "./theme-state.ts";

test("converte a chave antiga ms-theme", () => {
  assert.deepEqual(lerEscolhaSalva("dark", null), { theme: "glass", mode: "base" });
  assert.deepEqual(lerEscolhaSalva("darker", null), { theme: "glass", mode: "dark" });
  assert.deepEqual(lerEscolhaSalva("light", null), { theme: "cream", mode: "base" });
});

test("aceita tema e modo da v2", () => {
  assert.deepEqual(lerEscolhaSalva("paperpen", "system"), { theme: "paperpen", mode: "system" });
  assert.deepEqual(lerEscolhaSalva("cream", "dark"), { theme: "cream", mode: "dark" });
});

test("ignora o que não reconhece, eixo por eixo", () => {
  assert.deepEqual(lerEscolhaSalva(null, null), {});
  assert.deepEqual(lerEscolhaSalva("neon", "dark"), { mode: "dark" });
  assert.deepEqual(lerEscolhaSalva("flat", "noite"), { theme: "flat" });
});

test("system segue o prefers-color-scheme; os outros modos o ignoram", () => {
  assert.equal(resolverModo("system", true), "dark");
  assert.equal(resolverModo("system", false), "base");
  assert.equal(resolverModo("base", true), "base");
  assert.equal(resolverModo("dark", false), "dark");
});

test("ícone: lua vazada no Glass base, sol no base dos outros, lua cheia em qualquer escuro", () => {
  assert.equal(iconeDoModo("glass", "base"), "lua");
  for (const t of ["cream", "paperpen", "flat"] as const) assert.equal(iconeDoModo(t, "base"), "sol");
  for (const t of THEMES) assert.equal(iconeDoModo(t, "dark"), "lua-cheia");
});

test("os oito pares: quatro temas com rótulo, dois modos resolvidos", () => {
  assert.deepEqual([...RESOLVED_MODES], ["base", "dark"]);
  for (const t of THEMES) assert.match(THEME_LABELS[t], /^Mothership /);
});
