// Testes do layout (node --test, sem dependências: o Node 24 roda TypeScript direto).
import { test } from "node:test";
import assert from "node:assert/strict";
import { layoutForca3D } from "./layout.ts";

const nos = Array.from({ length: 30 }, (_, i) => ({ id: `n${i}` }));
const arestas = nos.slice(1).map((no, i) => ({ origem: `n${Math.floor(i / 3)}`, destino: no.id }));

const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);

test("é determinístico: a mesma entrada dá as mesmas posições", () => {
  const a = layoutForca3D(nos, arestas);
  const b = layoutForca3D(nos, arestas);
  for (const no of nos) assert.deepEqual(a.get(no.id), b.get(no.id));
});

test("encaixa tudo dentro do raio pedido, centralizado", () => {
  const p = layoutForca3D(nos, arestas, { raio: 5 });
  let centro = [0, 0, 0];
  for (const v of p.values()) {
    assert.ok(Math.hypot(...v) <= 5 + 1e-9);
    centro = centro.map((c, i) => c + v[i]! / p.size);
  }
  assert.ok(Math.hypot(...centro) < 1e-6);
});

test("nós ligados ficam mais perto que a média", () => {
  const p = layoutForca3D(nos, arestas);
  const ligados =
    arestas.reduce((s, a) => s + dist(p.get(a.origem)!, p.get(a.destino)!), 0) / arestas.length;
  let soma = 0;
  let pares = 0;
  for (let i = 0; i < nos.length; i++)
    for (let j = i + 1; j < nos.length; j++) {
      soma += dist(p.get(nos[i]!.id)!, p.get(nos[j]!.id)!);
      pares++;
    }
  assert.ok(ligados < soma / pares);
});

test("casos de borda: vazio, um nó e arestas para nós que não existem", () => {
  assert.equal(layoutForca3D([], []).size, 0);
  assert.deepEqual(layoutForca3D([{ id: "a" }], []).get("a"), [0, 0, 0]);
  const p = layoutForca3D([{ id: "a" }, { id: "b" }], [{ origem: "a", destino: "fantasma" }]);
  assert.equal(p.size, 2);
  for (const v of p.values()) assert.ok(v.every(Number.isFinite));
});
