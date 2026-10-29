import { test } from "node:test";
import { strict as assert } from "node:assert";
import { chooseSurface, contrastRatio } from "./aerobubble-contrast.ts";

test("escolhe os materiais e informa o contraste estimado sem ocultar suas limitações", () => {
  assert.equal(contrastRatio([0, 0, 0], [255, 255, 255]), 21);
  assert.equal(chooseSurface([0, 0, 0]).variant, "light");
  assert.equal(chooseSurface([255, 255, 255]).variant, "dark");
  for (let v = 0; v <= 255; v++) {
    const result = chooseSurface([v, v, v]);
    if (result.variant === "light") assert.ok(result.ratio >= 4.5);
  }
  assert.equal(chooseSurface([150, 150, 150]).variant, "light");
  assert.equal(chooseSurface([180, 180, 180]).variant, "dark");
  assert.equal(chooseSurface([0, 0, 0]).alpha, .08);
  assert.equal(chooseSurface([255, 255, 255]).alpha, .38);
  assert.ok(chooseSurface([255, 255, 255]).ratio < 4.5);
});

test("calcula média apenas de pixels opacos válidos", async () => {
  const { averageOpaquePixels } = await import("./aerobubble-contrast.ts");
  assert.deepEqual(averageOpaquePixels(new Uint8ClampedArray([0, 10, 20, 255, 200, 110, 40, 255])), [100, 60, 30]);
  assert.equal(averageOpaquePixels(new Uint8ClampedArray()), null);
  assert.equal(averageOpaquePixels(new Uint8ClampedArray([0, 0, 0, 0])), null);
  assert.equal(averageOpaquePixels(new Uint8ClampedArray([1, 2, 3])), null);
});
