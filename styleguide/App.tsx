"use client";

import React from "react";
import {
  ThemeProvider,
  AlertsProvider,
  TooltipProvider,
  LivingBackground,
  Navbar,
  Sidebar,
  useHashRoute,
  NotificationBell,
  ThemeMenu,
  Footer,
  Combobox,
} from "../src/index";
import { STORIES, GROUPS, GROUP_IDS, type Story } from "./stories";
import { version } from "../package.json";

const GROUP_DESCRIPTIONS: Record<(typeof GROUPS)[number], string> = {
  Fundações: "Os tokens que sustentam o resto: cor, temas, tipografia, espaçamento e os efeitos de vidro que dão identidade visual ao sistema. Todo componente abaixo é construído só com essas variáveis — nunca um valor solto.",
  Componentes: "Os blocos de interface prontos pra montar uma página, do botão ao card de depoimento. Cada um documentado com sua API (props) logo abaixo do exemplo ao vivo.",
  Dados: "Visualização de dados: gráficos, medidores e a tabela já preparada para fluxos de CRUD (status, ordenação, ações de editar/excluir).",
};

const SIDEBAR_SECTIONS = GROUPS.map((group) => ({
  href: `#${GROUP_IDS[group]}`,
  label: group,
  items: STORIES.filter((s) => s.group === group).map((s) => ({ href: `#${s.id}`, label: s.title })),
}));

const STORY_IDS = STORIES.map((s) => s.id);

// Primeira story de cada grupo — pra quando o hash aponta pro cabeçalho
// do grupo (ex. clique em "Fundações" na Sidebar), não numa story.
const GROUP_FIRST_STORY: Record<string, string> = Object.fromEntries(
  GROUPS.map((g) => [GROUP_IDS[g], STORIES.find((s) => s.group === g)!.id])
);

function resolveStoryId(hash: string, ids: string[]): string {
  const id = hash.replace(/^#/, "");
  if (ids.includes(id)) return id;
  if (GROUP_FIRST_STORY[id]) return GROUP_FIRST_STORY[id];
  return ids[0];
}

// Sem acento e sem caixa: "botoes" acha "Botões".
function normalize(text: string): string {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Título e nome do componente pesam mais que o texto de apoio, para
// "card" trazer os cards antes das stories que só citam a palavra.
function score(story: Story, q: string): number {
  const title = normalize(story.title);
  const keywords = (story.keywords ?? []).map(normalize);
  if (title.startsWith(q) || keywords.some((k) => k.startsWith(q))) return 3;
  if (title.includes(q) || keywords.some((k) => k.includes(q))) return 2;
  if (normalize(`${story.group} ${story.subtitle}`).includes(q)) return 1;
  return 0;
}

function rankStories(query: string): Story[] {
  const q = normalize(query.trim());
  if (!q) return STORIES;
  return STORIES.map((story) => ({ story, s: score(story, q) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.story);
}

/**
 * Busca de stories no cabeçalho. É o `Combobox` da lib, com as opções já
 * filtradas e ordenadas aqui (o filtro dele só sabe "contém", sem peso).
 * `/` ou Ctrl+K focam o campo de qualquer lugar.
 */
function StorySearch() {
  const [query, setQuery] = React.useState("");
  // Remonta o Combobox depois de escolher, para o campo voltar vazio
  // em vez de ficar com o título da story escolhida.
  const [round, setRound] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const typing = (e.target as HTMLElement).closest("input, textarea, select, [contenteditable]");
      if ((e.key === "/" && !typing) || (e.key === "k" && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const options = rankStories(query).map((s) => ({ value: s.id, label: s.title }));

  return (
    <Combobox
      key={round}
      ref={inputRef}
      options={options}
      filter={() => true}
      emptyLabel="Nenhum componente encontrado."
      placeholder="Buscar componente  ( / )"
      aria-label="Buscar componente"
      onInput={(e) => setQuery(e.currentTarget.value)}
      onChange={(id) => {
        window.location.hash = id;
        setQuery("");
        setRound((r) => r + 1);
      }}
    />
  );
}

/**
 * Styleguide gerado a partir da própria biblioteca: cada seção renderiza
 * o componente de verdade. Adicionar uma entrada em STORIES basta — a
 * Sidebar e as âncoras se atualizam sozinhas.
 *
 * Uma story por vez, não as 37 juntas: com tudo montado ao mesmo tempo
 * (glass + blur em dezenas de painéis, o parallax do fundo vivo, marquees
 * rodando…) a performance sofria. `useHashRoute` + `Sidebar active` +
 * `.ms-app-shell` são o trio nativo da biblioteca pra esse padrão —
 * documentado em ARCHITECTURE.md § Performance do styleguide.
 */
export function App() {
  const [activeId] = useHashRoute({ ids: STORY_IDS, resolve: resolveStoryId });
  const [fundoClaro, setFundoClaro] = React.useState(false);
  React.useEffect(() => {
    document.documentElement.toggleAttribute("data-ms-estudo-fundo-claro", fundoClaro);
    if (fundoClaro) document.documentElement.setAttribute("data-ms-background", "light");
    else document.documentElement.removeAttribute("data-ms-background");
    return () => {
      document.documentElement.removeAttribute("data-ms-estudo-fundo-claro");
      document.documentElement.removeAttribute("data-ms-background");
    };
  }, [fundoClaro]);
  const mainRef = React.useRef<HTMLElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const firstRender = React.useRef(true);

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
    <ThemeProvider defaultTheme="glass">
      <AlertsProvider>
        <TooltipProvider>
          <LivingBackground adaptiveContrast />

          <Navbar brand=".valnezJunior()" brandHref="#topo">
            <NotificationBell />
            <ThemeMenu />
          </Navbar>

          <div
            className="ms-app-shell"
            style={{ maxWidth: 1180, margin: "0 auto", padding: "112px 24px 0" }}
          >
            <header
              id="topo"
              style={{ marginBottom: 24, flexShrink: 0, display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}
            >
              <div style={{ flex: "1 1 420px" }}>
                <h1 className="ms-h1">Mothership DS</h1>
                <p className="ms-text-sm ms-text-muted">
                  Biblioteca React do design system — cada bloco abaixo renderiza o componente
                  real, importado de <code>mothership-ds</code>. Quatro temas (Mothership Aerobubble,
                  Cream, Paperpen e Flat), cada um em base e escuro; alterne no menu da navbar. Busque ao lado ou clique no
                  sumário à esquerda pra trocar de componente.
                </p>
              </div>
              <div role="search" style={{ flex: "1 1 260px", maxWidth: 320 }}>
                <button className="estudo-vidro__fundo-controle" type="button" aria-pressed={fundoClaro} onClick={() => setFundoClaro((atual) => !atual)}>{fundoClaro ? "Fundo claro de teste: ligado" : "Fundo claro de teste: desligado"}</button>
                <StorySearch />
              </div>
            </header>

            <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 40 }}>
              <Sidebar sections={SIDEBAR_SECTIONS} active={`#${story.id}`} variant="fill" />

              {/* padding lateral e superior de propósito: overflow-y:auto vira
                  overflow-x:auto sozinho por especificação (não dá pra ter só
                  um eixo com scroll e o outro "visible") — sem esse respiro,
                  o scale(1.03) do hover reativo (.ms-hover-edge) crescia o
                  card pra fora da caixa e a borda cortava o crescimento.
                  tabIndex: painel que rola por dentro precisa ser alcançável
                  pelo teclado quando a story não tem nada focável. */}
              <main
                ref={mainRef}
                tabIndex={0}
                style={{ flex: 1, minWidth: 0, maxWidth: 900, overflowY: "auto", padding: "8px 32px 32px" }}
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
              <p>Mothership DS · styleguide gerado a partir da biblioteca React · v{version}</p>
            </Footer>
          </div>
        </TooltipProvider>
      </AlertsProvider>
    </ThemeProvider>
  );
}
