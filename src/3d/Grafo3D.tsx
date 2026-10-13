"use client";

import React from "react";
import { CenaGrafo } from "./cena";
import type { ArestaCena, GrupoCena, NoCena, SlotGrafo } from "./cena";

/* ============================================================
   Grafo3D — grafo navegável em 3D (nós, ligações, grupos por cor).
   A cena é three.js puro (./cena), montada uma vez por instância;
   o React só entrega dados e seleção. Para leitor de tela e teclado,
   a mesma informação existe como lista de botões escondida e um
   anúncio aria-live do nó selecionado.
   ============================================================ */

export type Grafo3DNo = NoCena;
export type Grafo3DAresta = ArestaCena;
export type Grafo3DGrupo = GrupoCena;
export type Grafo3DSlot = SlotGrafo;

export interface Grafo3DProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  nos: Grafo3DNo[];
  arestas: Grafo3DAresta[];
  /** Grupos e a cor de cada um: slots 1–4 são as cores de dados, 5–8 as de marca. */
  grupos: Grafo3DGrupo[];
  /** Nó selecionado. Passe para controlar a seleção; omita para o componente cuidar dela. */
  selecionado?: string | null;
  aoSelecionar?: (id: string | null) => void;
  aoPassar?: (id: string | null) => void;
  /** Nós realçados (ex.: resultado de uma busca), quando nada está sob o mouse ou selecionado. */
  destaque?: string[];
  /** Mostra a legenda dos grupos no canto. Padrão true. */
  legenda?: boolean;
  /** Rótulo acessível do grafo. */
  rotulo?: string;
}

const COR_DO_SLOT: Record<SlotGrafo, string> = {
  1: "var(--chart-1)",
  2: "var(--chart-2)",
  3: "var(--chart-3)",
  4: "var(--chart-4)",
  5: "var(--color-accent)",
  6: "var(--color-violet)",
  7: "var(--color-pink)",
  8: "var(--color-orange)",
};

export function Grafo3D({
  nos,
  arestas,
  grupos,
  selecionado,
  aoSelecionar,
  aoPassar,
  destaque,
  legenda = true,
  rotulo = "Grafo",
  className,
  ...rest
}: Grafo3DProps) {
  const caixaRef = React.useRef<HTMLDivElement>(null);
  const rotulosRef = React.useRef<HTMLDivElement>(null);
  const cenaRef = React.useRef<CenaGrafo | null>(null);
  const [semWebGL, setSemWebGL] = React.useState(false);

  const controlado = selecionado !== undefined;
  const [selecaoInterna, setSelecaoInterna] = React.useState<string | null>(null);
  const atual = controlado ? selecionado : selecaoInterna;

  // Os retornos mudam a cada render; a cena guarda só uma ponte estável.
  const retornosRef = React.useRef({ aoSelecionar, aoPassar, controlado });
  retornosRef.current = { aoSelecionar, aoPassar, controlado };

  React.useEffect(() => {
    const caixa = caixaRef.current;
    const camada = rotulosRef.current;
    if (!caixa || !camada) return;
    const reduzido = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let cena: CenaGrafo;
    try {
      cena = new CenaGrafo(
        caixa,
        camada,
        {
          aoPassar: (id) => retornosRef.current.aoPassar?.(id),
          aoSelecionar: (id) => {
            if (!retornosRef.current.controlado) setSelecaoInterna(id);
            retornosRef.current.aoSelecionar?.(id);
          },
        },
        reduzido,
      );
    } catch {
      setSemWebGL(true);
      return;
    }
    cenaRef.current = cena;
    // O tema troca pela classe no <html>: relê os tokens quando ela muda.
    const observador = new MutationObserver(() => cena.relerTema());
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });
    return () => {
      observador.disconnect();
      cena.destruir();
      cenaRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    cenaRef.current?.definirDados(nos, arestas, grupos);
  }, [nos, arestas, grupos, semWebGL]);

  React.useEffect(() => {
    cenaRef.current?.definirSelecao(atual ?? null);
  }, [atual, nos]);

  React.useEffect(() => {
    cenaRef.current?.definirDestaque(destaque ?? []);
  }, [destaque, nos]);

  const selecionar = (id: string | null) => {
    if (!controlado) setSelecaoInterna(id);
    aoSelecionar?.(id);
  };

  const noAtual = atual ? nos.find((n) => n.id === atual) : undefined;
  const ligacoes = noAtual
    ? arestas.filter((a) => a.origem === noAtual.id || a.destino === noAtual.id).length
    : 0;
  const nomeDoGrupo = new Map(grupos.map((g) => [g.id, g.rotulo]));

  return (
    <div
      className={["ms-grafo3d", className].filter(Boolean).join(" ")}
      role="group"
      aria-label={rotulo}
      {...rest}
    >
      <div ref={caixaRef} className="ms-grafo3d__cena" aria-hidden="true" />
      <div ref={rotulosRef} className="ms-grafo3d__rotulos" aria-hidden="true" />
      {semWebGL && (
        <p className="ms-grafo3d__aviso">
          Este navegador não conseguiu abrir o WebGL, então o grafo não pode ser desenhado.
        </p>
      )}
      {legenda && grupos.length > 0 && (
        <div className="ms-grafo3d__legenda" aria-hidden="true">
          {grupos.map((g) => (
            <span className="ms-grafo3d__legenda-item" key={g.id}>
              <span className="ms-grafo3d__legenda-cor" style={{ background: COR_DO_SLOT[g.slot] }} />
              {g.rotulo}
            </span>
          ))}
        </div>
      )}
      <ul className="ms-grafo3d__lista">
        {nos.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              aria-pressed={n.id === atual}
              onClick={() => selecionar(n.id === atual ? null : n.id)}
            >
              {n.rotulo} ({nomeDoGrupo.get(n.grupo) ?? n.grupo})
            </button>
          </li>
        ))}
      </ul>
      <div className="ms-grafo3d__anuncio" aria-live="polite">
        {noAtual ? `${noAtual.rotulo} selecionado, ${ligacoes} ${ligacoes === 1 ? "ligação" : "ligações"}` : ""}
      </div>
    </div>
  );
}
