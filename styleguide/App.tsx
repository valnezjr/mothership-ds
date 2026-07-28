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

/**
 * Styleguide gerado a partir da própria biblioteca: cada seção renderiza
 * o componente de verdade. Adicionar uma entrada em STORIES basta — a
 * Sidebar e as âncoras se atualizam sozinhas.
 */
export function App() {
  return (
    <ThemeProvider>
      <AlertsProvider>
        <TooltipProvider>
          <LivingBackground />

          <Navbar brand=".valnezJunior()" brandHref="#topo">
            <NotificationBell />
            <ThemeSwitch />
          </Navbar>

          <div style={{ maxWidth: 1180, margin: "0 auto", padding: "112px 24px 80px" }}>
            <header id="topo" style={{ marginBottom: 40 }}>
              <h1 className="ms-h1">Mothership DS</h1>
              <p className="ms-text-sm ms-text-muted">
                Biblioteca React do design system — cada bloco abaixo renderiza o componente
                real, importado de <code>mothership-ds</code>. Outfit, glassmorphism e temas
                claro/escuro; alterne no switch da navbar. Use o sumário à esquerda pra pular
                direto pra um componente — ele acompanha a rolagem sozinho.
              </p>
            </header>

            <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
              <Sidebar sections={SIDEBAR_SECTIONS} />

              <main style={{ flex: 1, minWidth: 0, maxWidth: 860 }}>
                {GROUPS.map((group) => {
                  const stories = STORIES.filter((s) => s.group === group);
                  if (!stories.length) return null;
                  return (
                    <section key={group}>
                      <h2
                        className="ms-h1"
                        id={GROUP_IDS[group]}
                        style={{
                          margin: "56px 0 8px",
                          borderBottom: "1px solid var(--color-border)",
                          paddingBottom: 12,
                        }}
                      >
                        {group}
                      </h2>
                      <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 24 }}>
                        {GROUP_DESCRIPTIONS[group]}
                      </p>
                      {stories.map((s) => (
                        <section key={s.id} id={s.id} style={{ margin: "32px 0 48px" }}>
                          <h3 className="ms-h2" style={{ marginBottom: 4 }}>
                            {s.title}
                          </h3>
                          <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 20 }}>
                            {s.subtitle}
                          </p>
                          {s.render()}
                        </section>
                      ))}
                    </section>
                  );
                })}

                <Footer style={{ marginTop: 40 }}>
                  <p>Mothership DS · styleguide gerado a partir da biblioteca React</p>
                </Footer>
              </main>
            </div>
          </div>
        </TooltipProvider>
      </AlertsProvider>
    </ThemeProvider>
  );
}
