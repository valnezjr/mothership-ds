"use client";

import React from "react";
import {
  ThemeProvider,
  AlertsProvider,
  TooltipProvider,
  LivingBackground,
  Navbar,
  NotificationBell,
  ThemeSwitch,
  Footer,
} from "../src/index";
import { STORIES, GROUPS, GROUP_IDS } from "./stories";

/**
 * Styleguide gerado a partir da própria biblioteca: cada seção renderiza
 * o componente de verdade. Adicionar uma entrada em STORIES basta — a
 * navegação, o índice e as âncoras se atualizam sozinhos.
 */
export function App() {
  return (
    <ThemeProvider>
      <AlertsProvider>
        <TooltipProvider>
          <LivingBackground />

          <Navbar
            brand=".valnezJunior()"
            brandHref="#topo"
            links={GROUPS.map((g) => ({ href: `#${GROUP_IDS[g]}`, label: g }))}
            spy
          >
            <NotificationBell />
            <ThemeSwitch />
          </Navbar>

          <div style={{ maxWidth: 860, margin: "0 auto", padding: "112px 24px 80px" }}>
            <header id="topo" style={{ marginBottom: 8 }}>
              <h1 className="ms-h1">Mothership DS</h1>
              <p className="ms-text-sm ms-text-muted" style={{ maxWidth: 620 }}>
                Biblioteca React do design system — cada bloco abaixo renderiza o componente
                real, importado de <code>mothership-ds</code>. Outfit, glassmorphism e temas
                claro/escuro; alterne no switch da navbar.
              </p>
            </header>

            <nav style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", padding: "16px 0 8px" }}>
              {STORIES.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="ms-text-sm" style={{ textDecoration: "none" }}>
                  {s.title}
                </a>
              ))}
            </nav>

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
          </div>
        </TooltipProvider>
      </AlertsProvider>
    </ThemeProvider>
  );
}
