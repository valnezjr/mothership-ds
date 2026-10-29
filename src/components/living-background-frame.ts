import { averageOpaquePixels } from "./aerobubble-contrast";

/** Reconstrói apenas os quatro glows conhecidos do LivingBackground. Não captura a tela. */
export function buildLivingBackgroundFrame(canvas: HTMLCanvasElement) {
  const root = document.documentElement;
  const theme = root.getAttribute("data-ms-theme");
  if (theme && theme !== "glass") return null;
  const width = window.innerWidth, height = window.innerHeight;
  if (!width || !height) return null;
  canvas.width = 192;
  canvas.height = Math.max(1, Math.round(192 * height / width));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const tokens = getComputedStyle(root);
  const get = (name: string) => tokens.getPropertyValue(name).trim();
  const pair = (value: string) => {
    const parts = value.split(/\s+/);
    if (parts.length !== 2 || parts.some((part) => !/^-?\d+(?:\.\d+)?%$/.test(part))) return null;
    return parts.map((part) => parseFloat(part) / 100) as [number, number];
  };
  const base = get("--bg-base");
  if (!CSS.supports("color", base)) return null;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Os fundos CSS são desenhados de trás para frente (4, 3, 2, 1).
  const stops = [78, 82, 80, 80];
  try {
    for (let n = 4; n >= 1; n--) {
      const color = get(`--bg-glow-${n}`), position = pair(get(`--bg-glow-${n}-pos`)), size = pair(get(`--bg-glow-${n}-size`));
      if (!position || !size || !CSS.supports("color", color) || size[0] <= 0 || size[1] <= 0) return null;
      ctx.save();
      ctx.translate(position[0] * canvas.width, position[1] * canvas.height);
      ctx.scale(size[0] * canvas.width, size[1] * canvas.height);
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
      glow.addColorStop(0, color);
      glow.addColorStop(stops[n - 1]! / 100, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(-4, -4, 8, 8);
      ctx.restore();
    }
    return { ctx, width, height };
  } catch {
    return null;
  }
}

/** Amostra uma região visível da reconstrução compartilhada. */
export function sampleLivingBackgroundFrame(frame: NonNullable<ReturnType<typeof buildLivingBackgroundFrame>>, rect: DOMRect): readonly [number, number, number] | null {
  const { ctx, width, height } = frame;
  const canvas = ctx.canvas;
  const left = Math.max(0, Math.floor(rect.left / width * canvas.width));
  const top = Math.max(0, Math.floor(rect.top / height * canvas.height));
  const right = Math.min(canvas.width, Math.ceil(rect.right / width * canvas.width));
  const bottom = Math.min(canvas.height, Math.ceil(rect.bottom / height * canvas.height));
  if (right <= left || bottom <= top) return null;
  try { return averageOpaquePixels(ctx.getImageData(left, top, right - left, bottom - top).data); } catch { return null; }
}
