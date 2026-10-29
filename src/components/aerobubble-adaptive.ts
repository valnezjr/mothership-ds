import { chooseSurface } from "./aerobubble-contrast";
import { buildLivingBackgroundFrame, sampleLivingBackgroundFrame } from "./living-background-frame";

/** Piloto para superfícies diretamente sobre o LivingBackground, sem camadas intermediárias. */
export function startAerobubbleAdaptiveContrast() {
  const selector = '[data-ms-aerobubble-auto="living"]';
  const canvas = document.createElement("canvas");
  const managed = new Set<HTMLElement>();
  let pending = 0;
  const clear = (element: HTMLElement) => {
    element.removeAttribute("data-ms-aerobubble-tone");
    element.style.removeProperty("--ms-aerobubble-alpha");
    managed.delete(element);
  };
  const update = () => {
    pending = 0;
    if (document.visibilityState !== "visible") return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    for (const element of managed) if (!elements.includes(element)) clear(element);
    if (!elements.length) return;
    const frame = buildLivingBackgroundFrame(canvas);
    for (const element of elements) {
      const mean = frame && sampleLivingBackgroundFrame(frame, element.getBoundingClientRect());
      if (!mean) { if (managed.has(element)) clear(element); continue; }
      const result = chooseSurface(mean);
      const alpha = result.alpha.toFixed(3);
      if (element.dataset.msAerobubbleTone !== result.variant) element.dataset.msAerobubbleTone = result.variant;
      if (element.style.getPropertyValue("--ms-aerobubble-alpha") !== alpha) element.style.setProperty("--ms-aerobubble-alpha", alpha);
      managed.add(element);
    }
  };
  const schedule = () => { if (!pending) pending = requestAnimationFrame(update); };
  const timer = window.setInterval(schedule, 700);
  window.addEventListener("resize", schedule);
  window.addEventListener("scroll", schedule, true);
  document.addEventListener("visibilitychange", schedule);
  schedule();
  return () => {
    window.clearInterval(timer);
    if (pending) cancelAnimationFrame(pending);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("scroll", schedule, true);
    document.removeEventListener("visibilitychange", schedule);
    for (const element of managed) clear(element);
  };
}
