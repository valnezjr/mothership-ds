"use client";

import React from "react";

/* ============================================================
   Presença com saída animada — interno, não exportado no index.
   Mantém montado o que acabou de fechar pelo tempo do gesto
   recolher, para a animação de saída rodar antes de sumir do DOM.
   ============================================================ */

const RECOLHER_FALLBACK_MS = 150;

/** Converte uma duração CSS ("0.15s", "150ms") em milissegundos. */
export function duracaoEmMs(valor: string, fallback: number): number {
  const m = /^\s*(\d*\.?\d+)(ms|s)\s*$/.exec(valor);
  if (!m) return fallback;
  return Math.round(Number(m[1]) * (m[2] === "s" ? 1000 : 1));
}

// Folga de um quadro: desmontar junto com o fim da animação pode cortar
// o último quadro do recolher.
const FOLGA_MS = 20;

/**
 * Quanto esperar antes de desmontar o que recolhe: a duração lida do
 * token (acompanha quem o sobrescreve e o 0.01s de
 * `prefers-reduced-motion` declarado em `tokens.css`) mais um quadro.
 */
export function recolherMs(): number {
  if (typeof document === "undefined") return RECOLHER_FALLBACK_MS + FOLGA_MS;
  const valor = getComputedStyle(document.documentElement).getPropertyValue("--motion-recolher-duration");
  return duracaoEmMs(valor, RECOLHER_FALLBACK_MS) + FOLGA_MS;
}

/**
 * `present`: renderizar ou não. `leaving`: fechou e está recolhendo —
 * quem usa aplica a classe de saída e ignora interação nesse intervalo.
 */
export function usePresence(open: boolean): { present: boolean; leaving: boolean } {
  const [present, setPresent] = React.useState(open);
  if (open && !present) setPresent(true);

  React.useEffect(() => {
    if (open || !present) return;
    const t = setTimeout(() => setPresent(false), recolherMs());
    return () => clearTimeout(t);
  }, [open, present]);

  return { present, leaving: present && !open };
}
