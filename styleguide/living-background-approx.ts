import { buildLivingBackgroundFrame, sampleLivingBackgroundFrame } from "../src/components/living-background-frame";

/** Aproximação do fundo vivo, sem captura de tela. */
export function sampleLivingBackground(element: HTMLElement) {
  const frame = buildLivingBackgroundFrame(document.createElement("canvas"));
  return frame ? sampleLivingBackgroundFrame(frame, element.getBoundingClientRect()) : null;
}
