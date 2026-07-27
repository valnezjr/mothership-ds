"use client";

import React from "react";
import { LogoMark } from "./LogoMark";

/* ============================================================
   Splash screen: olho piscando enquanto carrega → o nome se
   centraliza a partir do O → o dirigível chega por último.
   ============================================================ */

export interface SplashProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Controlado: `false` mantém o loop da piscada, `true` dispara a
   * revelação. Se omitido, o componente espera o `load` da página.
   */
  ready?: boolean;
  /** Tempo mínimo em tela antes de revelar (modo automático). */
  minDuration?: number;
  /** Quanto tempo a composição final fica em tela antes de sumir. */
  revealDuration?: number;
  /** Chamado quando a splash termina de sair. */
  onFinish?: () => void;
  /** Não some sozinha (útil para demonstrar). */
  persistent?: boolean;
  /** Renderiza preso ao container em vez de tela cheia. */
  inline?: boolean;
}

export function Splash({
  ready,
  minDuration = 1800,
  revealDuration = 4600,
  onFinish,
  persistent,
  inline,
  className,
  ...rest
}: SplashProps) {
  const controlled = ready !== undefined;
  const [isReady, setIsReady] = React.useState(controlled ? !!ready : false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (controlled) setIsReady(!!ready);
  }, [controlled, ready]);

  /* Modo automático: espera o load da página cumprindo o tempo mínimo. */
  React.useEffect(() => {
    if (controlled) return;
    const start = Date.now();
    let t: ReturnType<typeof setTimeout>;
    const finish = () => {
      t = setTimeout(() => setIsReady(true), Math.max(0, minDuration - (Date.now() - start)));
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish);
    return () => {
      clearTimeout(t);
      window.removeEventListener("load", finish);
    };
  }, [controlled, minDuration]);

  /* onFinish num ref: como o uso canônico é uma arrow inline
     (`onFinish={() => setLoading(false)}`), tê-lo nas dependências
     reiniciaria o timer a cada render do pai — e a splash nunca sairia. */
  const onFinishRef = React.useRef(onFinish);
  React.useEffect(() => {
    onFinishRef.current = onFinish;
  });

  /* Some depois que a composição final teve seu tempo em tela. */
  React.useEffect(() => {
    if (!isReady || persistent) return;
    let fade: ReturnType<typeof setTimeout>;
    const t = setTimeout(() => {
      setDone(true);
      fade = setTimeout(() => onFinishRef.current?.(), 800);
    }, revealDuration);
    return () => {
      clearTimeout(t);
      clearTimeout(fade);
    };
  }, [isReady, persistent, revealDuration]);

  return (
    <div
      className={[
        "ms-splash",
        inline && "ms-splash--inline",
        isReady && "ms-splash--ready",
        done && "ms-splash--done",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      <LogoMark />
    </div>
  );
}
