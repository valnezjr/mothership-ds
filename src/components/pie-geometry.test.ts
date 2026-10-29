import { test } from "node:test";
import { strict as assert } from "node:assert";
import { glassSlice } from "./pie-geometry.ts";

test("as laterais da fatia mantêm o mesmo afastamento da fronteira radial", () => {
  for (const degrees of [4, 30, 90, 180, 270, 355]) {
    const start = -Math.PI / 3;
    const { path, halfGap } = glassSlice(200, 106, 84, start, start + degrees * Math.PI / 180);
    const points = /^M(-?\d+\.\d+),(-?\d+\.\d+) L(-?\d+\.\d+),(-?\d+\.\d+)/.exec(path);
    assert.ok(points, `caminho válido para ${degrees}°`);
    const normal = [-Math.sin(start), Math.cos(start)];
    for (const i of [1, 3]) {
      const distance = (Number(points[i]) - 200) * normal[0] + (Number(points[i + 1]) - 106) * normal[1];
      assert.ok(Math.abs(distance - halfGap) < 0.002, `lateral paralela em ${degrees}°`);
    }
    assert.ok(!/NaN|Infinity/.test(path));
  }
});

test("fatias vazias ou círculos completos não geram caminhos inválidos", () => {
  assert.equal(glassSlice(0, 0, 84, 0, 0).path, "");
  assert.equal(glassSlice(0, 0, 84, 0, 2 * Math.PI).path, "");
});
