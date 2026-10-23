// Testes da leitura do tema salvo e da resolução do modo (node --test, sem dependências).
import { test } from "node:test";
import assert from "node:assert/strict";
import { lerSalvo, resolverModo } from "./theme-state.ts";

test("converte a chave antiga ms-theme", () => {
  assert.deepEqual(lerSalvo("dark", null), { theme: "glass", mode: "base" });
  assert.deepEqual(lerSalvo("darker", null), { theme: "glass", mode: "dark" });
  assert.deepEqual(lerSalvo("light", null), { theme: "cream", mode: "base" });
});

test("aceita tema e modo da v2", () => {
  assert.deepEqual(lerSalvo("paperpen", "system"), { theme: "paperpen", mode: "system" });
  assert.deepEqual(lerSalvo("cream", "dark"), { theme: "cream", mode: "dark" });
});

test("ignora o que não reconhece, eixo por eixo", () => {
  assert.deepEqual(lerSalvo(null, null), {});
  assert.deepEqual(lerSalvo("neon", "dark"), { mode: "dark" });
  assert.deepEqual(lerSalvo("flat", "noite"), { theme: "flat" });
});

test("system segue o prefers-color-scheme; os outros modos o ignoram", () => {
  assert.equal(resolverModo("system", true), "dark");
  assert.equal(resolverModo("system", false), "base");
  assert.equal(resolverModo("base", true), "base");
  assert.equal(resolverModo("dark", false), "dark");
});
