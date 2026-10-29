/* Contraste de uma cor conhecida: não captura conteúdo arbitrário da página. */
type Rgb = readonly [number, number, number];
const WHITE: Rgb = [255, 255, 255];
const LIGHT_GREY: Rgb = [223, 229, 233];
const DARK_GLASS: Rgb = [17, 17, 20];
const LIGHT_GLASS: Rgb = [255, 255, 255];

function luminance(rgb: Rgb) {
  const linear = (v: number) => {
    const c = v / 255;
    return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  };
  return .2126 * linear(rgb[0]) + .7152 * linear(rgb[1]) + .0722 * linear(rgb[2]);
}
function composite(foreground: Rgb, alpha: number, background: Rgb): Rgb {
  return foreground.map((v, i) => v * alpha + background[i]! * (1 - alpha)) as unknown as Rgb;
}
export function contrastRatio(a: Rgb, b: Rgb) {
  const l1 = luminance(a), l2 = luminance(b);
  return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05);
}
export function chooseSurface(background: Rgb) {
  // Fundo escuro: vidro claro e texto branco. Fundo claro: vidro escuro
  // e texto cinza-claro. O limiar usa a cor conhecida, não pixels da página.
  // A versão clara escurece suavemente o fundo antes de compor o vidro.
  const dimmed = background.map((channel) => channel * .72) as unknown as Rgb;
  const variant = contrastRatio(WHITE, dimmed) >= 4.5 ? "light" as const : "dark" as const;
  const glass = variant === "light" ? LIGHT_GLASS : DARK_GLASS;
  const text = variant === "light" ? WHITE : LIGHT_GREY;
  // O escuro segue o véu do modo escuro do tema, sem escurecer o fundo.
  // Sua transparência pode resultar em contraste abaixo de 4,5:1.
  const effectiveBackground = variant === "light" ? dimmed : background;
  let alpha = variant === "light" ? .08 : .38;
  if (variant === "light" && contrastRatio(text, composite(glass, alpha, effectiveBackground)) < 4.5) {
    let lo = 0, hi = alpha;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      if (contrastRatio(text, composite(glass, mid, effectiveBackground)) >= 4.5) lo = mid;
      else hi = mid;
    }
    alpha = lo;
  }
  return { variant, alpha, ratio: contrastRatio(text, composite(glass, alpha, effectiveBackground)) };
}

/** Média sRGB de pixels RGBA já opacos, como na cena controlada. */
export function averageOpaquePixels(data: Uint8ClampedArray): Rgb | null {
  if (data.length === 0 || data.length % 4 !== 0) return null;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] !== 255) return null;
    r += data[i]!; g += data[i + 1]!; b += data[i + 2]!;
  }
  const n = data.length / 4;
  return [r / n, g / n, b / n];
}
