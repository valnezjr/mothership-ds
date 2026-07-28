"use client";

import React from "react";
import {
  ThemeProvider,
  AlertsProvider,
  TooltipProvider,
  LivingBackground,
  Navbar,
  Sidebar,
  NotificationBell,
  ThemeSwitch,
  Footer,
} from "../src/index";
import { STORIES, GROUPS, GROUP_IDS } from "./stories";

const GROUP_DESCRIPTIONS: Record<(typeof GROUPS)[number], string> = {
  Fundações: "Os tokens que sustentam o resto: cor, tipografia, espaçamento e os efeitos de vidro que dão identidade visual ao sistema. Todo componente abaixo é construído só com essas variáveis — nunca um valor solto.",
  Componentes: "Os blocos de interface prontos pra montar uma página, do botão ao card de depoimento. Cada um documentado com sua API (props) logo abaixo do exemplo ao vivo.",
  Dados: "Visualização de dados: gráficos, medidores e a tabela já preparada para fluxos de CRUD (status, ordenação, ações de editar/excluir).",
};

const SIDEBAR_SECTIONS = GROUPS.map((group) => ({
  href: `#${GROUP_IDS[group]}`,
  label: group,
  items: STORIES.filter((s) => s.group === group).map((s) => ({ href: `#${s.id}`, label: s.title })),
}));

// Primeira story de cada grupo — pra quando o hash aponta pro cabeçalho
// do grupo (ex. clique em "Fundações" na Sidebar), não numa story.
const GROUP_FIRST_STORY: Record<string, string> = Object.fromEntries(
  GROUPS.map((g) => [GROUP_IDS[g], STORIES.find((s) => s.group === g)!.id])
);

function resolveStoryId(hash: string): string {
  const id = hash.replace(/^#/, "");
  if (STORIES.some((s) => s.id === id)) return id;
  if (GROUP_FIRST_STORY[id]) return GROUP_FIRST_STORY[id];
  return STORIES[0].id;
}

/**
 * Styleguide gerado a partir da própria biblioteca: cada seção renderiza
 * o componente de verdade. Adicionar uma entrada em STORIES basta — a
 * Sidebar e as âncoras se atualizam sozinhas.
 *
 * Uma story por vez, não as 37 juntas: com tudo montado ao mesmo tempo
 * (glass + blur em dezenas de painéis, o parallax do fundo vivo, marquees
 * rodando…) a performance sofria. O clique na Sidebar troca o hash; um
 * listener de hashchange troca qual story está montada na janela —
 * mais barato que rolagem porque só a story ativa existe no DOM.
 */
export function App() {
  const [activeId, setActiveId] = React.useState(() =>
    typeof window !== "undefined" ? resolveStoryId(window.location.hash) : STORIES[0].id
  );
  const mainRef = React.useRef<HTMLElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    // Sem hash na entrada (visitou a raiz): fixa o padrão na URL, sem
    // empilhar uma entrada nova no histórico.
    if (!window.location.hash) {
      window.history.replaceState(null, "", `#${activeId}`);
    }
    const onHashChange = () => setActiveId(resolveStoryId(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
    // Foco no título ao trocar de story — mesma prática de qualquer
    // troca de rota em SPA, pra quem navega por teclado/leitor de tela
    // saber que o conteúdo mudou. Pula na primeira renderização (o
    // usuário ainda não "navegou" pra lugar nenhum).
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    titleRef.current?.focus();
  }, [activeId]);

  const story = STORIES.find((s) => s.id === activeId) ?? STORIES[0];
  const isFirstInGroup = STORIES.find((s) => s.group === story.group)?.id === story.id;

  return (
    <ThemeProvider>
      <AlertsProvider>
        <TooltipProvider>
          <LivingBackground />

          <Navbar brand=".valnezJunior()" brandHref="#topo">
            <NotificationBell />
            <ThemeSwitch />
          </Navbar>

          <div
            style={{
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              maxWidth: 1180,
              margin: "0 auto",
              padding: "112px 24px 0",
            }}
          >
            <header id="topo" style={{ marginBottom: 24, flexShrink: 0 }}>
              <h1 className="ms-h1">Mothership DS</h1>
              <p className="ms-text-sm ms-text-muted">
                Biblioteca React do design system — cada bloco abaixo renderiza o componente
                real, importado de <code>mothership-ds</code>. Outfit, glassmorphism e temas
                claro/escuro; alterne no switch da navbar. Clique no sumário à esquerda pra
                trocar de componente.
              </p>
            </header>

            <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 40 }}>
              <Sidebar
                sections={SIDEBAR_SECTIONS}
                active={`#${story.id}`}
                style={{ position: "static", maxHeight: "none", minHeight: 0, height: "100%" }}
              />

              <main
                ref={mainRef}
                style={{ flex: 1, minWidth: 0, maxWidth: 860, overflowY: "auto", paddingBottom: 24 }}
              >
                {isFirstInGroup && (
                  <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 20 }}>
                    {GROUP_DESCRIPTIONS[story.group]}
                  </p>
                )}
                <p
                  className="ms-text-xs ms-text-muted"
                  style={{ textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}
                >
                  {story.group}
                </p>
                <h2 ref={titleRef} tabIndex={-1} className="ms-h1" style={{ marginBottom: 4, outline: "none" }}>
                  {story.title}
                </h2>
                <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 20 }}>
                  {story.subtitle}
                </p>
                {story.render()}
              </main>
            </div>

            <Footer style={{ flexShrink: 0 }}>
              <p>Mothership DS · styleguide gerado a partir da biblioteca React</p>
            </Footer>
          </div>
        </TooltipProvider>
      </AlertsProvider>
    </ThemeProvider>
  );
}
