// Testes da leitura do token de duração (node --test, sem dependências).
import { test } from "node:test";
import assert from "node:assert/strict";
import { duracaoEmMs } from "./presence.ts";

test("converte segundos em milissegundos", () => {
  assert.equal(duracaoEmMs("0.15s", 999), 150);
  assert.equal(duracaoEmMs(" 0.01s", 999), 10);
});

test("aceita milissegundos", () => {
  assert.equal(duracaoEmMs("150ms", 999), 150);
});

test("valor vazio ou ilegível cai no fallback", () => {
  assert.equal(duracaoEmMs("", 150), 150);
  assert.equal(duracaoEmMs("var(--x)", 150), 150);
});
