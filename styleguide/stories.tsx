"use client";

import React from "react";
import {
  // primitivas
  Button, ButtonLink, IconButton, IconRow, LinkList, Card, CardText, Badge,
  Avatar, Profile, Field, Input, Textarea, Hero, HeroHighlight, Breadcrumbs,
  Footer, Flash,
  // tema e utilitários
  ThemeSwitch, HoverEdge,
  // interativos
  Navbar, Accordion, Carousel, Gallery,
  // alertas
  Alert, NotificationBell, useAlerts,
  // dados
  LineChart, Meter, PieChart, ProgressRing, Sparkline, StatGrid, StatTile, Legend,
  // sobreposições
  Modal, StepModal,
  // marca
  Splash, Loader,
} from "../src/index";

/* ============================================================
   Catálogo do styleguide.
   Para documentar um componente novo, basta acrescentar uma
   entrada em STORIES — a navegação, o índice e as âncoras se
   atualizam sozinhos.
   ============================================================ */

export type Group = "Fundações" | "Componentes" | "Dados";

export interface Story {
  id: string;
  group: Group;
  title: string;
  subtitle: string;
  render: () => React.ReactNode;
}

/* ---------- amostras de tokens ---------- */

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center", width: 110 }}>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 10,
          background: `var(${token})`,
          border: "1px solid var(--color-border)",
        }}
      />
      <code style={{ fontSize: 11 }}>{token}</code>
      <span className="ms-text-xs ms-text-muted" style={{ textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}

function Ramp({ name }: { name: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <code style={{ fontSize: 11 }}>--color-{name}-100…900</code>
      <div
        style={{
          display: "flex",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          marginTop: 4,
        }}
      >
        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => (
          <div
            key={s}
            title={`--color-${name}-${s}`}
            style={{ flex: 1, height: 36, background: `var(--color-${name}-${s})` }}
          />
        ))}
      </div>
    </div>
  );
}

function SpaceBar({ token, px }: { token: string; px: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <code style={{ width: 90, fontSize: 12 }}>{token}</code>
      <div style={{ height: 16, width: px, background: "var(--chart-1)", borderRadius: 4 }} />
      <span className="ms-text-xs ms-text-muted">{px}px</span>
    </div>
  );
}

/* ---------- demos que precisam de estado ---------- */

function AlertsDemo() {
  const { notify } = useAlerts();
  const tones = [
    { label: "info", tone: undefined, title: "Info.", msg: "Ciano accent — o padrão." },
    { label: "atenção", tone: "highlight" as const, title: "Atenção.", msg: "Algo pede sua atenção." },
    { label: "sucesso", tone: "success" as const, title: "Sucesso.", msg: "Operação concluída." },
    { label: "erro", tone: "danger" as const, title: "Erro.", msg: "Algo deu errado." },
  ];
  return (
    <>
      <h3 className="ms-h3" style={{ marginBottom: 12 }}>Estático (em fluxo)</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
        <Alert title="Info.">Ciano accent — mesmo color code das badges.</Alert>
        <Alert tone="highlight" title="Atenção.">Amarelo do ícone flash da página.</Alert>
        <Alert tone="success" title="Sucesso.">Verde, harmonizado com a paleta.</Alert>
        <Alert tone="danger" title="Erro.">Vermelho, harmonizado com a paleta.</Alert>
        <Alert tone="neutral" title="Neutro.">Superfície de vidro padrão, sem cor.</Alert>
      </div>
      <h3 className="ms-h3" style={{ margin: "24px 0 8px" }}>Como notificação (toast)</h3>
      <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 12 }}>
        <code>useAlerts().notify(...)</code> — vive 20s com barra decrescente, tem X para
        dispensar e entra no histórico do sino (no topo).
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {tones.map((t) => (
          <Button
            key={t.label}
            inline
            size="sm"
            onClick={() => notify({ title: t.title, message: t.msg, tone: t.tone })}
          >
            Disparar {t.label}
          </Button>
        ))}
        <Button
          inline
          size="sm"
          onClick={() =>
            notify({ title: "Rápida.", message: "Esta dura só 5s.", tone: "neutral", duration: 5000 })
          }
        >
          Disparar 5s
        </Button>
      </div>
    </>
  );
}

function SplashDemo() {
  const [ready, setReady] = React.useState(false);
  const [key, setKey] = React.useState(0);
  return (
    <>
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          maxWidth: 640,
          margin: "0 auto",
        }}
      >
        <Splash key={key} inline persistent ready={ready} />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
        <Button inline size="sm" variant="solid" onClick={() => setReady(true)}>
          Concluir carregamento
        </Button>
        <Button
          inline
          size="sm"
          onClick={() => {
            setReady(false);
            setKey((k) => k + 1);
          }}
        >
          Voltar ao carregando
        </Button>
      </div>
      <p className="ms-text-xs ms-text-muted" style={{ marginTop: 16 }}>
        Em produção: <code>&lt;Splash onFinish={"{...}"} /&gt;</code> espera o load da página e some
        sozinha; ou passe <code>ready</code> para controlar quando revelar.
      </p>
    </>
  );
}

function ModalDemo() {
  const [simple, setSimple] = React.useState(false);
  const [steps, setSteps] = React.useState(false);
  const [count, setCount] = React.useState(false);
  const { notify } = useAlerts();

  return (
    <>
      <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 16 }}>
        Entra com o bounce do sistema (sobe e assenta), sai com fade rápido. Fecha no{" "}
        <strong>X</strong>, no clique fora e no <strong>Esc</strong>. A versão em etapas pagina
        o conteúdo com os painéis deslizando na direção da navegação.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button inline size="sm" variant="solid" onClick={() => setSimple(true)}>
          Abrir modal
        </Button>
        <Button inline size="sm" onClick={() => setSteps(true)}>
          Abrir em etapas
        </Button>
        <Button inline size="sm" onClick={() => setCount(true)}>
          Etapas com contador
        </Button>
      </div>

      <Modal
        open={simple}
        onClose={() => setSimple(false)}
        title="Confirmar publicação"
        footer={
          <>
            <Button inline size="sm" variant="ghost" onClick={() => setSimple(false)}>
              Cancelar
            </Button>
            <Button
              inline
              size="sm"
              variant="solid"
              onClick={() => {
                setSimple(false);
                notify({ title: "Publicado.", message: "Seu projeto está no ar.", tone: "success" });
              }}
            >
              Publicar
            </Button>
          </>
        }
      >
        <p>
          O projeto ficará visível para qualquer pessoa com o link. Você pode reverter isso a
          qualquer momento nas configurações.
        </p>
      </Modal>

      <StepModal
        open={steps}
        onClose={() => setSteps(false)}
        onFinish={() => notify({ title: "Tudo pronto.", message: "Configuração concluída.", tone: "success" })}
        steps={[
          {
            title: "Bem-vindo ao Mothership",
            content: (
              <p>
                Em três passos rápidos você configura seu espaço. Use <strong>Próximo</strong> ou
                clique direto em um dos pontos abaixo.
              </p>
            ),
          },
          {
            title: "Escolha seu tema",
            content: (
              <>
                <p style={{ marginBottom: 16 }}>
                  Claro ou escuro — dá para trocar quando quiser pelo switch da navbar.
                </p>
                <ThemeSwitch />
              </>
            ),
          },
          {
            title: "Conecte seus links",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Field label="Whatsapp"><Input placeholder="+55 84 9…" /></Field>
                <Field label="E-mail"><Input placeholder="voce@exemplo.com" /></Field>
              </div>
            ),
          },
        ]}
      />

      <StepModal
        open={count}
        onClose={() => setCount(false)}
        showCount
        size="sm"
        finishLabel="Entendi"
        steps={[
          { title: "Contador em vez de pontos", content: <p>Use <code>showCount</code> quando houver muitas etapas.</p> },
          { title: "Segunda etapa", content: <p>Os painéis deslizam conforme a direção da navegação.</p> },
          { title: "Última etapa", content: <p>O botão vira <strong>Entendi</strong> (via <code>finishLabel</code>).</p> },
        ]}
      />
    </>
  );
}

function LoaderDemo() {
  const [value, setValue] = React.useState(0);
  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setValue((v) => {
        if (v >= 100) { setRunning(false); return 100; }
        return Math.min(100, v + 4);
      });
    }, 220);
    return () => clearInterval(id);
  }, [running]);

  return (
    <>
      <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 20 }}>
        O rosto da marca começa em <strong>vidro</strong> — a mesma superfície translúcida do
        resto do sistema — e vai sendo preenchido de baixo para cima por um líquido de
        superfície ondulada, que desliza continuamente. O olho pisca de tempos em tempos,
        como na splash. Sem a prop <code>value</code>, o nível oscila sozinho (indeterminado).
      </p>
      <div style={{ display: "flex", gap: 40, alignItems: "flex-end", justifyContent: "center", flexWrap: "wrap" }}>
        <Loader value={value} size={120} label="carregando" showValue />
        <Loader size={72} label="indeterminado" />
        <Loader value={value} size={48} />
        <Loader value={value} size={120} color="var(--color-violet)" label="outra cor" />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 24, alignItems: "center" }}>
        <Button inline size="sm" variant="solid" onClick={() => { setValue(0); setRunning(true); }}>
          Simular carregamento
        </Button>
        <Button inline size="sm" onClick={() => setRunning(false)}>Pausar</Button>
        <input
          type="range" min={0} max={100} value={value}
          onChange={(e) => { setRunning(false); setValue(Number(e.target.value)); }}
          style={{ accentColor: "var(--color-accent)", width: 200 }}
          aria-label="Progresso"
        />
        <span className="ms-text-sm ms-text-muted">{value}%</span>
      </div>
    </>
  );
}

const GITHUB = (
  <svg viewBox="0 0 24 24" aria-label="GitHub">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

/* ---------- catálogo ---------- */

export const STORIES: Story[] = [
  /* ============ Fundações ============ */
  {
    id: "cores",
    group: "Fundações",
    title: "Cores",
    subtitle: "Semânticas por tema, 8 cores de marca e escalas 100–900",
    render: () => (
      <>
        <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 16 }}>
          As semânticas mudam com o tema (alterne na navbar); as de marca são fixas.
        </p>
        <h3 className="ms-h3" style={{ marginBottom: 12 }}>Semânticas</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <Swatch token="--color-text" label="Texto" />
          <Swatch token="--color-text-muted" label="Texto secundário" />
          <Swatch token="--color-border" label="Borda" />
          <Swatch token="--color-surface" label="Superfície (vidro)" />
          <Swatch token="--color-surface-hover" label="Superfície hover" />
        </div>
        <h3 className="ms-h3" style={{ marginBottom: 12 }}>Marca</h3>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginBottom: 24 }}>
          <Swatch token="--color-accent" label="Accent" />
          <Swatch token="--color-highlight" label="Highlight" />
          <Swatch token="--color-success" label="Success" />
          <Swatch token="--color-danger" label="Danger" />
          <Swatch token="--color-violet" label="Violet" />
          <Swatch token="--color-pink" label="Pink" />
          <Swatch token="--color-orange" label="Orange" />
          <Swatch token="--color-gray" label="Gray" />
        </div>
        <p className="ms-text-xs ms-text-muted" style={{ marginBottom: 24 }}>
          Violet e Pink são as cores que já apareciam nos gráficos e sparklines
          (<code>--chart-3</code> e <code>--chart-4</code>); Orange vem do gradiente da logo e Gray
          serve a status neutros. Todas com escala completa e versão <code>-soft</code> para
          badges e alertas.
        </p>
        <h3 className="ms-h3" style={{ marginBottom: 4 }}>Escalas</h3>
        <p className="ms-text-xs ms-text-muted" style={{ marginBottom: 12 }}>
          100 mais claro → 900 mais escuro, com 500 = cor base.
        </p>
        {["accent", "highlight", "success", "danger", "violet", "pink", "orange", "gray"].map((n) => (
          <Ramp key={n} name={n} />
        ))}
      </>
    ),
  },
  {
    id: "tipografia",
    group: "Fundações",
    title: "Tipografia",
    subtitle: "Outfit 400/500, escala 12–32px",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div><span className="ms-h1">Título 2xl — 32px</span> <code className="ms-text-xs ms-text-muted">--text-2xl · 500</code></div>
        <div><span className="ms-h2">Título xl — 24px</span> <code className="ms-text-xs ms-text-muted">--text-xl · 500</code></div>
        <div><span className="ms-h3">Título lg — 20px</span> <code className="ms-text-xs ms-text-muted">--text-lg · 500</code></div>
        <div><span>Corpo md — 16px. A raposa ágil salta sobre o cão preguiçoso.</span> <code className="ms-text-xs ms-text-muted">--text-md · 400</code></div>
        <div><span className="ms-text-sm">Apoio sm — 14px, rodapé e legendas.</span> <code className="ms-text-xs ms-text-muted">--text-sm · 400</code></div>
        <div><span className="ms-text-xs">Micro xs — 12px, badges e anotações.</span> <code className="ms-text-xs ms-text-muted">--text-xs · 400</code></div>
      </div>
    ),
  },
  {
    id: "espacamento",
    group: "Fundações",
    title: "Espaçamento & Raios",
    subtitle: "Escala 4–56px, raios 10px / pill / círculo",
    render: () => (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          <SpaceBar token="--space-1" px={4} />
          <SpaceBar token="--space-2" px={8} />
          <SpaceBar token="--space-3" px={12} />
          <SpaceBar token="--space-4" px={16} />
          <SpaceBar token="--space-5" px={24} />
          <SpaceBar token="--space-6" px={32} />
          <SpaceBar token="--space-7" px={56} />
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-end" }}>
          {[
            { r: "var(--radius-md)", w: 72, h: 72, label: "--radius-md · 10px" },
            { r: "var(--radius-pill)", w: 110, h: 40, label: "--radius-pill · 50px" },
            { r: "var(--radius-full)", w: 72, h: 72, label: "--radius-full · 50%" },
          ].map((b) => (
            <div key={b.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: b.w,
                  height: b.h,
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: b.r,
                }}
              />
              <code className="ms-text-xs">{b.label}</code>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "efeitos",
    group: "Fundações",
    title: "Efeitos",
    subtitle: "Glassmorphism, bounce e o fundo vivo",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Vidro">
          <CardText>
            <code>backdrop-filter: blur(var(--blur-glass))</code> — 20px em botões, cards,
            inputs e alertas; <code>--blur-soft</code> (4px) no trilho do switch.
          </CardText>
        </Card>
        <Card title="Movimento">
          <CardText>
            <code>--transition-fast/base/slow</code> (0.1s / 0.2s / 0.3s) e{" "}
            <code>--ease-bounce</code>, o easing com overshoot que assina as microinterações.
          </CardText>
        </Card>
        <Card title="Fundo vivo">
          <CardText>
            Quatro glows (<code>--bg-glow-1..4</code>) com cor, posição e tamanho em tokens.
            O <code>&lt;LivingBackground /&gt;</code> os move em órbitas deformadas, pulsa seus
            tamanhos e soma um parallax do mouse — mexa o cursor.
          </CardText>
        </Card>
        <HoverEdge colors={["var(--color-accent)", "var(--color-success)"]}>
          <Card title="Contorno reativo (.ms-hover-edge)">
            <CardText>
              Passe o mouse: cresce, ganha sombra e o anel em degradê gira acompanhando o
              cursor. Cores via <code>--ms-edge-a</code> / <code>--ms-edge-b</code>.
            </CardText>
          </Card>
        </HoverEdge>
      </div>
    ),
  },

  /* ============ Componentes ============ */
  {
    id: "loader",
    group: "Componentes",
    title: "Loader",
    subtitle: "Rosto da marca enchendo de líquido conforme carrega",
    render: () => <LoaderDemo />,
  },
  {
    id: "splash",
    group: "Componentes",
    title: "Splash screen",
    subtitle: "Olho piscando → nome a partir do O → dirigível",
    render: () => <SplashDemo />,
  },
  {
    id: "hero",
    group: "Componentes",
    title: "Hero",
    subtitle: "Abertura com título em destaque e ações",
    render: () => (
      <Hero style={{ paddingTop: 24 }}>
        <Badge tone="accent">Disponível para projetos</Badge>
        <h1 className="ms-hero__title">
          Design que <HeroHighlight>flutua</HeroHighlight> sobre qualquer fundo
        </h1>
        <p className="ms-hero__subtitle">
          Badge de contexto, título com palavra em destaque, subtítulo e ações.
        </p>
        <div className="ms-hero__actions">
          <ButtonLink inline variant="solid" href="#">Começar agora</ButtonLink>
          <ButtonLink inline variant="ghost" href="#">Ver portfólio</ButtonLink>
        </div>
      </Hero>
    ),
  },
  {
    id: "navbar",
    group: "Componentes",
    title: "Navbar",
    subtitle: "Pill de vidro com scrollspy e hamburguer",
    render: () => (
      <>
        <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 16 }}>
          A navbar deste styleguide é o próprio componente — com <code>spy</code> ligado.
          Abaixo, variantes <code>static</code>. Em telas estreitas os links migram para o
          menu do hamburguer.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p className="ms-text-xs ms-text-muted" style={{ marginBottom: 8 }}>
              Com marca (gap automático até a navegação):
            </p>
            <Navbar
              variant="static"
              responsive={false}
              brand=".valnezJunior()"
              links={[{ href: "#", label: "Início" }, { href: "#", label: "Projetos" }, { href: "#", label: "Contato" }]}
            />
          </div>
          <div>
            <p className="ms-text-xs ms-text-muted" style={{ marginBottom: 8 }}>
              Só links — centralizados automaticamente:
            </p>
            <Navbar
              variant="static"
              responsive={false}
              links={[{ href: "#", label: "Fundações" }, { href: "#", label: "Componentes" }, { href: "#", label: "Dados" }]}
            />
          </div>
          <div>
            <p className="ms-text-xs ms-text-muted" style={{ marginBottom: 8 }}>
              Completa, com sino e switch:
            </p>
            <Navbar
              variant="static"
              responsive={false}
              brand=".valnezJunior()"
              links={[{ href: "#", label: "Links" }, { href: "#", label: "Sobre" }]}
            >
              <NotificationBell />
              <ThemeSwitch />
            </Navbar>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "breadcrumbs",
    group: "Componentes",
    title: "Breadcrumbs",
    subtitle: "Trilha em pills com separadores",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
        <Breadcrumbs
          items={[
            { label: "Início", href: "#" },
            { label: "Projetos", href: "#" },
            { label: "Design Systems", href: "#" },
            { label: "Mothership DS" },
          ]}
        />
        <Breadcrumbs
          glass
          items={[{ label: "Início", href: "#" }, { label: "Galeria", href: "#" }, { label: "Painel Orbital" }]}
        />
      </div>
    ),
  },
  {
    id: "botoes",
    group: "Componentes",
    title: "Botões",
    subtitle: "Glass / sólido / ghost, 3 tamanhos, disabled",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420, margin: "0 auto" }}>
        <ButtonLink href="#">Padrão (glass)</ButtonLink>
        <ButtonLink href="#" variant="solid">Sólido — accent</ButtonLink>
        <ButtonLink href="#" variant="ghost">Ghost — só borda</ButtonLink>
        <Button disabled>Desabilitado</Button>
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          <ButtonLink href="#" inline size="sm">Pequeno</ButtonLink>
          <ButtonLink href="#" inline>Médio</ButtonLink>
          <ButtonLink href="#" inline size="lg">Grande</ButtonLink>
        </div>
      </div>
    ),
  },
  {
    id: "lista-links",
    group: "Componentes",
    title: "Lista de links",
    subtitle: "Padrão linktree da página original",
    render: () => (
      <LinkList style={{ maxWidth: 420, margin: "0 auto" }}>
        <li><ButtonLink href="#">Whatsapp</ButtonLink></li>
        <li><ButtonLink href="#">E-mail</ButtonLink></li>
        <li><ButtonLink href="#">Portfólio</ButtonLink></li>
      </LinkList>
    ),
  },
  {
    id: "icones",
    group: "Componentes",
    title: "Botões de ícone",
    subtitle: "Sociais circulares, 3 tamanhos",
    render: () => (
      <>
        <IconRow>
          <IconButton href="#" aria-label="GitHub">{GITHUB}</IconButton>
          <IconButton href="#" aria-label="GitHub">{GITHUB}</IconButton>
          <IconButton href="#" aria-label="GitHub">{GITHUB}</IconButton>
        </IconRow>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
          <IconButton href="#" size="sm" aria-label="GitHub">{GITHUB}</IconButton>
          <IconButton href="#" aria-label="GitHub">{GITHUB}</IconButton>
          <IconButton href="#" size="lg" aria-label="GitHub">{GITHUB}</IconButton>
        </div>
      </>
    ),
  },
  {
    id: "switch",
    group: "Componentes",
    title: "Switch de tema",
    subtitle: "Claro/escuro com deslize animado",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <ThemeSwitch />
        <p className="ms-text-xs ms-text-muted" style={{ textAlign: "center", maxWidth: 360 }}>
          Usa <code>useTheme()</code>: alterna a classe <code>light</code> no <code>&lt;html&gt;</code>.
        </p>
      </div>
    ),
  },
  {
    id: "avatar",
    group: "Componentes",
    title: "Avatar & Perfil",
    subtitle: "112 / 80 / 48px + bloco de perfil",
    render: () => (
      <>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-end", justifyContent: "center", paddingBottom: 16 }}>
          <Avatar initials="VJ" alt="Valnez Júnior" />
          <Avatar initials="VJ" size="md" alt="Valnez Júnior" />
          <Avatar initials="VJ" size="sm" alt="Valnez Júnior" />
        </div>
        <Profile handle=".valnezJunior()">
          <Avatar initials="VJ" alt="Valnez Júnior" />
        </Profile>
      </>
    ),
  },
  {
    id: "campos",
    group: "Componentes",
    title: "Campos de formulário",
    subtitle: "Input, textarea, foco e disabled",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Nome"><Input placeholder="Seu nome" /></Field>
        <Field label="E-mail (foco = borda accent)"><Input placeholder="voce@exemplo.com" /></Field>
        <Field label="Desabilitado"><Input placeholder="Indisponível" disabled /></Field>
        <Field label="Mensagem"><Textarea placeholder="Escreva sua mensagem…" /></Field>
      </div>
    ),
  },
  {
    id: "cards",
    group: "Componentes",
    title: "Cards",
    subtitle: "Superfície de vidro, com e sem contorno reativo",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Card de vidro">
          <CardText>Superfície translúcida, borda suave, raio de 10px e blur de 20px.</CardText>
        </Card>
        <Card title="Card com ações">
          <CardText style={{ marginBottom: 16 }}>Combine com outros componentes.</CardText>
          <div style={{ display: "flex", gap: 12 }}>
            <ButtonLink href="#" inline size="sm" variant="solid">Ação</ButtonLink>
            <ButtonLink href="#" inline size="sm" variant="ghost">Cancelar</ButtonLink>
          </div>
        </Card>
        <HoverEdge colors={["var(--color-accent)", "var(--color-success)"]}>
          <Card title="Com .ms-hover-edge">
            <CardText>Passe o mouse — o anel gira acompanhando o cursor.</CardText>
          </Card>
        </HoverEdge>
      </div>
    ),
  },
  {
    id: "badges",
    group: "Componentes",
    title: "Badges",
    subtitle: "Neutro + 8 cores de marca",
    render: () => (
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Badge>Neutro</Badge>
        <Badge tone="accent">Accent</Badge>
        <Badge tone="highlight">Highlight</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="danger">Danger</Badge>
        <Badge tone="violet">Violet</Badge>
        <Badge tone="pink">Pink</Badge>
        <Badge tone="orange">Orange</Badge>
        <Badge tone="gray">Gray</Badge>
      </div>
    ),
  },
  {
    id: "alertas",
    group: "Componentes",
    title: "Alertas",
    subtitle: "Estáticos e como notificação (toast de 20s)",
    render: () => <AlertsDemo />,
  },
  {
    id: "modal",
    group: "Componentes",
    title: "Modal & etapas",
    subtitle: "Popup fechável e versão paginada (anterior / próximo)",
    render: () => <ModalDemo />,
  },
  {
    id: "accordion",
    group: "Componentes",
    title: "Accordion",
    subtitle: "Expande com bounce; modo exclusivo opcional",
    render: () => (
      <>
        <h3 className="ms-h3" style={{ marginBottom: 12 }}>Padrão (vários abertos)</h3>
        <div style={{ marginBottom: 24 }}>
          <Accordion
            items={[
              { title: "O que é o Mothership DS?", content: "Design system extraído do Agrupador de links e contatos.", defaultOpen: true },
              { title: "Como uso os tokens?", content: "Importe styles.css e use as variáveis --color-*, --space-*, --radius-*." },
              { title: "Posso animar o fundo?", content: "Sim — <LivingBackground /> dá deriva lava lamp + parallax." },
            ]}
          />
        </div>
        <h3 className="ms-h3" style={{ marginBottom: 12 }}>Exclusivo (<code>single</code>)</h3>
        <div>
          <Accordion
            single
            items={[
              { title: "Primeira pergunta", content: "Só um item fica aberto por vez." },
              { title: "Segunda pergunta", content: "Abrir esta fecha a que estiver aberta." },
              { title: "Terceira pergunta", content: "Ideal pra FAQs compactas." },
            ]}
          />
        </div>
      </>
    ),
  },
  {
    id: "carrossel",
    group: "Componentes",
    title: "Carrossel",
    subtitle: "Fotos com bullets indicando o destaque",
    render: () => (
      <div>
        <Carousel
          autoplay={5000}
          slides={[
            { image: "linear-gradient(135deg, #6b4796, #63256b)", caption: "Nebulosa — identidade visual" },
            { image: "linear-gradient(135deg, #2e3f5e, #00a7da)", caption: "Órbita — interface web" },
            { image: "linear-gradient(135deg, #63256b, #ff4d6d)", caption: "Propulsão — campanha" },
            { image: "linear-gradient(135deg, #004357, #00d68f)", caption: "Atmosfera — landing page" },
          ]}
        />
      </div>
    ),
  },
  {
    id: "galeria",
    group: "Componentes",
    title: "Galeria",
    subtitle: "Filtros por categoria, badges e hover em degradê",
    render: () => (
      <Gallery
        categories={[
          { key: "ui", label: "UI Design", tone: "accent" },
          { key: "web", label: "Web", tone: "success" },
          { key: "branding", label: "Branding", tone: "highlight" },
        ]}
        items={[
          { image: "linear-gradient(135deg,#6b4796,#00a7da)", title: "Painel Orbital", description: "Dashboard de telemetria com glassmorphism.", categories: ["ui", "web"] },
          { image: "linear-gradient(135deg,#63256b,#ffd000)", title: "Marca Mothership", description: "Identidade visual completa.", categories: ["branding"] },
          { image: "linear-gradient(135deg,#2e3f5e,#00d68f)", title: "Landing Atmosfera", description: "Página de captura com hero flutuante.", categories: ["web"] },
          { image: "linear-gradient(135deg,#004357,#6b4796)", title: "App Constelação", description: "Interface mobile com navegação em pill.", categories: ["ui"] },
          { image: "linear-gradient(135deg,#ff4d6d,#63256b)", title: "Campanha Propulsão", description: "Do manual de marca ao site.", categories: ["branding", "web"] },
          { image: "linear-gradient(135deg,#00a7da,#00d68f)", title: "Kit Aurora", description: "Biblioteca de componentes com escalas 100–900.", categories: ["ui"] },
        ]}
      />
    ),
  },
  {
    id: "rodape",
    group: "Componentes",
    title: "Rodapé",
    subtitle: "Crédito com flash e link accent",
    render: () => (
      <Footer>
        <p>
          Made by <Flash /> <a href="#">Mothership Studios</a>
        </p>
      </Footer>
    ),
  },

  /* ============ Dados ============ */
  {
    id: "grafico-linhas",
    group: "Dados",
    title: "Gráfico de linhas",
    subtitle: "Eixos x/y, 2 séries, grade recessiva e hover",
    render: () => (
      <div>
        <LineChart
          labels={["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"]}
          unit="k"
          max={40}
          series={[
            { name: "Visitas", data: [12, 18, 15, 24, 22, 30, 28, 34], slot: 1 },
            { name: "Leads", data: [8, 10, 14, 12, 18, 16, 22, 20], slot: 2 },
          ]}
        />
      </div>
    ),
  },
  {
    id: "barras",
    group: "Dados",
    title: "Barras de progresso",
    subtitle: "Horizontais, cor por entidade, valor rotulado",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Meter label="UI Design" value={82} slot={1} />
        <Meter label="Front-end" value={74} slot={2} />
        <Meter label="Branding" value={61} slot={3} />
        <Meter label="Motion" value={45} slot={4} />
      </div>
    ),
  },
  {
    id: "pizza",
    group: "Dados",
    title: "Gráfico de pizza",
    subtitle: "Fatias com respiro, rótulos diretos e legenda",
    render: () => (
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <PieChart
          slices={[
            { label: "UI Design", value: 38, slot: 1 },
            { label: "Web", value: 27, slot: 2 },
            { label: "Branding", value: 21, slot: 3 },
            { label: "Outros", value: 14, slot: 4 },
          ]}
        />
      </div>
    ),
  },
  {
    id: "anel",
    group: "Dados",
    title: "Anel de progresso",
    subtitle: "Número-herói no centro, qualquer tamanho",
    render: () => (
      <div style={{ display: "flex", gap: 32, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
        <ProgressRing value={72} caption="concluído" />
        <ProgressRing value={48} caption="meta anual" size={110} thickness={10} slot={3} />
        <ProgressRing value={91} caption="uptime" size={90} thickness={8} slot={2} />
      </div>
    ),
  },
  {
    id: "widgets",
    group: "Dados",
    title: "Widgets de dashboard",
    subtitle: "Stat tiles com delta, sparkline e contorno reativo",
    render: () => (
      <>
        <StatGrid>
          <StatTile label="Visitas no mês" value="34k" trend="up" delta="21% vs. mês anterior"
            sparkline={[12, 18, 15, 24, 22, 30, 28, 34]} slot={1} />
          <StatTile label="Leads gerados" value="20k" trend="down" delta="9% vs. mês anterior"
            sparkline={[8, 10, 14, 12, 18, 16, 22, 20]} slot={2} />
          <StatTile label="Projetos ativos" value="27" trend="flat" delta="estável"
            sparkline={[25, 26, 24, 27, 27, 26, 27, 27]} slot={3} />
          <StatTile slot={1} style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <ProgressRing value={72} size={72} thickness={8} hideValue />
            <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span className="ms-stat__label">Meta do trimestre</span>
              <span className="ms-stat__value" style={{ fontSize: 24 }}>72%</span>
            </span>
          </StatTile>
        </StatGrid>
        <p className="ms-text-xs ms-text-muted" style={{ marginTop: 16 }}>
          No hover, o anel combina a cor da série (<code>slot</code>) com a do indicador
          (<code>trend</code>): verde na alta, vermelho na queda.
        </p>
      </>
    ),
  },
  {
    id: "sparkline",
    group: "Dados",
    title: "Sparkline & Legenda",
    subtitle: "Miniaturas de série e identificação",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[1, 2, 3, 4].map((slot) => (
          <Sparkline key={slot} data={[8, 14, 9, 18, 16, 24, 21, 30]} slot={slot as 1 | 2 | 3 | 4} width={280} height={40} style={{ width: "100%" }} />
        ))}
        <Legend
          items={[
            { slot: 1, label: "Visitas" },
            { slot: 2, label: "Leads" },
            { slot: 3, label: "Projetos" },
            { slot: 4, label: "Outros" },
          ]}
        />
      </div>
    ),
  },
];

export const GROUPS: Group[] = ["Fundações", "Componentes", "Dados"];

export const GROUP_IDS: Record<Group, string> = {
  Fundações: "g-fundacoes",
  Componentes: "g-componentes",
  Dados: "g-dados",
};
