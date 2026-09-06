"use client";

import {
  Navbar, NotificationBell, ThemeSwitch,
  Hero, HeroHighlight, Badge, ButtonLink,
  Gallery, Accordion, Carousel,
  StatGrid, StatTile, LineChart,
  Footer, Flash, Splash,
  useAlerts,
} from "mothership-ds";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { notify } = useAlerts();

  return (
    <>
      {loading && <Splash minDuration={2000} onFinish={() => setLoading(false)} />}

      <Navbar
        brand=".valnezJunior()"
        links={[
          { href: "#projetos", label: "Projetos" },
          { href: "#sobre", label: "Sobre" },
          { href: "#contato", label: "Contato" },
        ]}
        spy
      >
        <NotificationBell />
        <ThemeSwitch />
      </Navbar>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "120px 24px 80px" }}>
        <Hero
          eyebrow={<Badge tone="accent">Disponível para projetos</Badge>}
          title={
            <>
              Design que <HeroHighlight>flutua</HeroHighlight> sobre qualquer fundo
            </>
          }
          subtitle="Landing page construída inteiramente com o Mothership DS."
          actions={
            <>
              <ButtonLink inline variant="solid" href="#projetos">
                Ver projetos
              </ButtonLink>
              <ButtonLink
                inline
                variant="ghost"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  notify({ title: "Olá.", message: "Notificação de exemplo.", tone: "success" });
                }}
              >
                Testar notificação
              </ButtonLink>
            </>
          }
        />

        <section id="projetos" style={{ marginTop: 56 }}>
          <h2 className="ms-h2" style={{ marginBottom: 24 }}>Projetos</h2>
          <Gallery
            categories={[
              { key: "ui", label: "UI Design", tone: "accent" },
              { key: "web", label: "Web", tone: "success" },
              { key: "branding", label: "Branding", tone: "highlight" },
            ]}
            items={[
              {
                image: "linear-gradient(135deg,#6b4796,#00a7da)",
                title: "Painel Orbital",
                description: "Dashboard de telemetria com glassmorphism.",
                categories: ["ui", "web"],
              },
              {
                image: "linear-gradient(135deg,#63256b,#ffd000)",
                title: "Marca Mothership",
                description: "Identidade visual completa.",
                categories: ["branding"],
              },
              {
                image: "linear-gradient(135deg,#2e3f5e,#00d68f)",
                title: "Landing Atmosfera",
                description: "Página de captura com hero flutuante.",
                categories: ["web"],
              },
              {
                image: "linear-gradient(135deg,#004357,#6b4796)",
                title: "App Constelação",
                description: "Interface mobile com navegação em pill.",
                categories: ["ui"],
              },
              {
                image: "linear-gradient(135deg,#ff4d6d,#63256b)",
                title: "Campanha Propulsão",
                description: "Do manual de marca ao site.",
                categories: ["branding", "web"],
              },
              {
                image: "linear-gradient(135deg,#00a7da,#00d68f)",
                title: "Kit Aurora",
                description: "Biblioteca de componentes com escalas 100–900.",
                categories: ["ui"],
              },
              {
                image: "linear-gradient(135deg,#6f61d6,#d4708f)",
                title: "Loja Nébula",
                description: "E-commerce completo com carrinho e checkout.",
                categories: ["web"],
              },
              {
                image: "linear-gradient(135deg,#f26f35,#8b8b9e)",
                title: "Ícone Pulsar",
                description: "Sistema de ícones e identidade para o app.",
                categories: ["ui", "branding"],
              },
            ]}
          />
        </section>

        <section style={{ marginTop: 56 }}>
          <h2 className="ms-h2" style={{ marginBottom: 24 }}>Resultados</h2>
          <StatGrid>
            <StatTile label="Visitas no mês" value="34k" trend="up" delta="21%"
              sparkline={[12, 18, 15, 24, 22, 30, 28, 34]} slot={1} />
            <StatTile label="Leads gerados" value="20k" trend="down" delta="9%"
              sparkline={[8, 10, 14, 12, 18, 16, 22, 20]} slot={2} />
            <StatTile label="Projetos ativos" value="27" trend="flat" delta="estável"
              sparkline={[25, 26, 24, 27, 27, 26, 27, 27]} slot={3} />
          </StatGrid>
          <div style={{ marginTop: 24 }}>
            <LineChart
              labels={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"]}
              unit="k"
              series={[
                { name: "Visitas", data: [12, 18, 15, 24, 22, 30], slot: 1 },
                { name: "Leads", data: [8, 10, 14, 12, 18, 16], slot: 2 },
              ]}
            />
          </div>
        </section>

        <section id="sobre" style={{ marginTop: 56 }}>
          <h2 className="ms-h2" style={{ marginBottom: 24 }}>Sobre</h2>
          <Carousel
            autoplay={5000}
            slides={[
              { image: "linear-gradient(135deg,#6b4796,#63256b)", caption: "Nebulosa — identidade" },
              { image: "linear-gradient(135deg,#2e3f5e,#00a7da)", caption: "Órbita — interface" },
              { image: "linear-gradient(135deg,#63256b,#ff4d6d)", caption: "Propulsão — campanha" },
            ]}
          />
          <div style={{ marginTop: 24 }}>
            <Accordion
              single
              items={[
                { title: "Como trabalho?", content: "Do token ao componente, tudo em sistema.", defaultOpen: true },
                { title: "Prazos", content: "Definidos por escopo, com entregas parciais." },
                { title: "Orçamento", content: "Sob medida — me chame para conversar." },
              ]}
            />
          </div>
        </section>

        <Footer id="contato" style={{ marginTop: 56 }}>
          <p>
            Made by <Flash /> <a href="#contato">Mothership Studios</a>
          </p>
        </Footer>
      </main>
    </>
  );
}
