"use client";

import React from "react";
import {
  // primitivas
  Button, ButtonLink, IconButton, IconRow, LinkList, Card, CardText, Badge,
  Avatar, Profile, Field, Input, Textarea, Hero, HeroHighlight, Breadcrumbs,
  Footer, Flash, Stack, Divider, Prose, Skeleton, Checkbox, Radio, Switch, Select, Combobox, Pagination,
  // tema e utilitários
  ThemeSwitch, ThemeMenu, HoverEdge,
  // interativos
  Navbar, Dock, Accordion, Tabs, Carousel, Gallery, Marquee,
  // marketing
  PricingCard, TestimonialCard, BentoGrid, BentoTile,
  // alertas
  Alert, NotificationBell, useAlerts,
  // dados
  LineChart, Meter, PieChart, ProgressRing, Sparkline, StatGrid, StatTile, Legend, Table,
  // sobreposições
  Modal, StepModal, StepIndicator, Popover, Drawer, DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuDivider, Tooltip,
  // marca
  Splash, Loader, Mascote, EmptyState,
} from "../src/index";
import { Grafo3D } from "../src/3d/index";
import type { Grafo3DNo, Grafo3DAresta, Grafo3DGrupo } from "../src/3d/index";

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

function GalleryDemo() {
  const { notify } = useAlerts();
  const open = (title: string) =>
    notify({ title: "Item clicado.", message: `Abriria o case de "${title}" — ex. num Modal.`, tone: "neutral" });

  // Hoje menos alguns dias (bem dentro de `newDays`, padrão 30) pra
  // "Kit Aurora" nascer com o badge "Novo" já visível na demo, sem
  // esperar 30 dias reais — mesmo cálculo relativo a Date.now() que o
  // componente usa em produção.
  const recentlyAdded = new Date();
  recentlyAdded.setDate(recentlyAdded.getDate() - 3);

  return (
    <Gallery
      itemsPerPage={4}
      sortable
      categories={[
        { key: "ui", label: "UI Design", tone: "accent" },
        { key: "web", label: "Web", tone: "success" },
        { key: "branding", label: "Branding", tone: "highlight" },
        { key: "motion", label: "Motion", tone: "pink" },
      ]}
      items={[
        { image: "linear-gradient(135deg,#6b4796,#00a7da)", title: "Painel Orbital", description: "Dashboard de telemetria com glassmorphism.", categories: ["ui", "web"], onClick: () => open("Painel Orbital") },
        { image: "linear-gradient(135deg,#63256b,#ffd000)", title: "Marca Mothership", description: "Identidade visual completa.", categories: ["branding"], onClick: () => open("Marca Mothership") },
        { image: "linear-gradient(135deg,#2e3f5e,#00d68f)", title: "Landing Atmosfera", description: "Página de captura com hero flutuante.", categories: ["web"] },
        { image: "linear-gradient(135deg,#004357,#6b4796)", title: "App Constelação", description: "Interface mobile com navegação em pill.", categories: ["ui"] },
        { image: "linear-gradient(135deg,#ff4d6d,#63256b)", title: "Campanha Propulsão", description: "Do manual de marca ao site.", categories: ["branding", "web"] },
        { image: "linear-gradient(135deg,#00a7da,#00d68f)", title: "Kit Aurora", description: "Biblioteca de componentes com escalas 100–900.", categories: ["ui"], addedAt: recentlyAdded },
      ]}
    />
  );
}

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
        dispensar e entra no histórico (<code>AlertHistory</code>, aberto pelo sino no topo).
        Ele é montado automaticamente pelo <code>AlertsProvider</code> quando aberto — não
        precisa renderizar à mão.
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

function DrawerDemo() {
  const [left, setLeft] = React.useState(false);
  const [right, setRight] = React.useState(false);

  return (
    <>
      <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 16 }}>
        <code>side="left" | "right"</code> escolhe de onde a gaveta desliza.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Button inline size="sm" onClick={() => setLeft(true)}>Abrir da esquerda</Button>
        <Button inline size="sm" onClick={() => setRight(true)}>Abrir da direita</Button>
      </div>

      <Drawer open={left} onClose={() => setLeft(false)}>
        <p className="ms-h3" style={{ marginBottom: 8 }}>Gaveta</p>
        <p className="ms-text-sm ms-text-muted">Conteúdo livre, igual ao Popover.</p>
      </Drawer>
      <Drawer open={right} onClose={() => setRight(false)} side="right">
        <p className="ms-h3" style={{ marginBottom: 8 }}>Gaveta à direita</p>
        <p className="ms-text-sm ms-text-muted"><code>side="right"</code>.</p>
      </Drawer>
    </>
  );
}

/* Ícones de traço desenhados à mão só para a story — a lib não traz
   ícone nenhum (recomenda Lucide no app). */
function DemoIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const DOCK_ITEMS = [
  { href: "#dock-hoje", label: "Hoje", icon: <DemoIcon d="M12 3v2M12 19v2M3 12h2M19 12h2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" /> },
  { href: "#dock-aprovacoes", label: "Aprovações", badge: 3, icon: <DemoIcon d="M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6Z" /> },
  { href: "#dock-frentes", label: "Frentes", icon: <DemoIcon d="M4 4h4v16H4ZM10 4h4v10h-4ZM16 4h4v13h-4Z" /> },
  { href: "#dock-copy", label: "Copy", icon: <DemoIcon d="M4 20h4L19 9l-4-4L4 16ZM13 7l4 4" /> },
  { href: "#dock-atividade", label: "Atividade", icon: <DemoIcon d="M3 12h4l3-7 4 14 3-7h4" /> },
  { href: "#dock-ajustes", label: "Ajustes", icon: <DemoIcon d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M16 4v4M10 10v4M18 16v4" /> },
];

function DockDemo() {
  const [active, setActive] = React.useState("#dock-hoje");
  const current = DOCK_ITEMS.find((i) => i.href === active);
  return (
    <div
      style={{ display: "flex", gap: 16, height: 460 }}
      // Só na story: o styleguide roteia por hash, então trocar o hash
      // desmontaria a story. Num app, o href navega de verdade.
      onClickCapture={(e) => {
        const a = (e.target as Element).closest?.("a.ms-dock__item");
        if (!a) return;
        e.preventDefault();
        setActive(a.getAttribute("href") ?? active);
      }}
    >
      <Dock items={DOCK_ITEMS} active={active} brand={<span>MS</span>} />
      <Card style={{ flex: 1 }}>
        <h3 className="ms-card__title">{current?.label}</h3>
        <CardText>
          Recolhida, a dock mostra só os ícones (o nome aparece no tooltip). O botão do pé
          expande para ícone + título. Abaixo de 720px ela vira um botão só, que abre a
          mesma navegação numa gaveta.
        </CardText>
      </Card>
    </div>
  );
}

function DropdownMenuDemo() {
  return (
    <div style={{ display: "flex", gap: 40 }}>
      <DropdownMenu trigger={<Button inline>Ações</Button>}>
        <DropdownMenuLabel>Arquivo</DropdownMenuLabel>
        <DropdownMenuItem>Renomear</DropdownMenuItem>
        <DropdownMenuItem>Duplicar</DropdownMenuItem>
        <DropdownMenuDivider />
        <DropdownMenuItem disabled>Compartilhar (em breve)</DropdownMenuItem>
        <DropdownMenuItem tone="danger">Excluir</DropdownMenuItem>
      </DropdownMenu>

      <DropdownMenu
        triggerOn="context"
        trigger={
          <div
            className="ms-card"
            style={{ padding: 24, cursor: "context-menu", userSelect: "none" }}
          >
            Clique com o botão direito aqui
          </div>
        }
      >
        <DropdownMenuItem>Copiar</DropdownMenuItem>
        <DropdownMenuItem>Colar</DropdownMenuItem>
        <DropdownMenuDivider />
        <DropdownMenuItem tone="danger">Remover</DropdownMenuItem>
      </DropdownMenu>
    </div>
  );
}

function ModalDemo() {
  const [simple, setSimple] = React.useState(false);
  const [steps, setSteps] = React.useState(false);
  const [count, setCount] = React.useState(false);
  const [full, setFull] = React.useState(false);
  const { notify } = useAlerts();

  return (
    <>
      <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 16 }}>
        Entra com o bounce do sistema (sobe e assenta), sai com fade rápido. Fecha no{" "}
        <strong>X</strong>, no clique fora e no <strong>Esc</strong>. A versão em etapas pagina
        o conteúdo com os painéis deslizando na direção da navegação. <code>size="full"</code>{" "}
        preenche quase toda a viewport — pensado pra conteúdo que precisa de espaço de verdade
        (ex.: um PDF ou imagem embutidos), não pra diálogos de texto comuns.
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
        <Button inline size="sm" onClick={() => setFull(true)}>
          Tela cheia
        </Button>
      </div>

      <Modal open={full} onClose={() => setFull(false)} title="Conteúdo de tela cheia" size="full">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            border: "1px dashed var(--color-border)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <p className="ms-text-sm ms-text-muted">
            .ms-modal__body já é flex:1 — um iframe/imagem com height:100% aqui preenche o espaço
            disponível de verdade, não só uma altura arbitrária em vh.
          </p>
        </div>
      </Modal>

      <Modal
        open={simple}
        onClose={() => setSimple(false)}
        title="Confirmar publicação"
        headerExtra={<Badge tone="accent">Rascunho</Badge>}
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
                  Escuro, Darker ou claro — dá para trocar quando quiser pelo menu de tema da navbar.
                </p>
                <ThemeMenu align="start" />
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

interface DemoUser {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string;
  statusKey: "active" | "pending" | "inactive";
}

const DEMO_USERS: DemoUser[] = [
  { id: 1, name: "Marina Alves", email: "marina@orbita.dev", role: "Lead Frontend", joined: "2024-02-10", statusKey: "active" },
  { id: 2, name: "Diego Nascimento", email: "diego@nebulosa.co", role: "Founder", joined: "2023-11-03", statusKey: "active" },
  { id: 3, name: "Cauê Ribeiro", email: "caue@constelacao.io", role: "UI Engineer", joined: "2025-01-22", statusKey: "pending" },
  { id: 4, name: "Renata Souza", email: "renata@aurora.dev", role: "Design Systems Lead", joined: "2022-06-15", statusKey: "active" },
  { id: 5, name: "Felipe Tanaka", email: "felipe@kitaurora.com", role: "CTO", joined: "2021-09-30", statusKey: "inactive" },
];

const STATUS_TONE: Record<DemoUser["statusKey"], { label: string; tone: "success" | "highlight" | "gray" }> = {
  active: { label: "Ativo", tone: "success" },
  pending: { label: "Pendente", tone: "highlight" },
  inactive: { label: "Inativo", tone: "gray" },
};

function TableDemo() {
  const { notify } = useAlerts();
  return (
    <Table<DemoUser>
      rows={DEMO_USERS}
      rowKey={(row) => row.id}
      status={(row) => STATUS_TONE[row.statusKey]}
      onEdit={(row) => notify({ title: "Editar", message: `Editando ${row.name}.`, tone: "accent" })}
      onDelete={(row) => notify({ title: "Excluir", message: `${row.name} removido.`, tone: "danger" })}
      columns={[
        {
          key: "name",
          header: "Nome",
          sortable: true,
          sortValue: (row) => row.name,
          cell: (row) => row.name,
        },
        {
          key: "email",
          header: "E-mail",
          cell: (row) => row.email,
        },
        {
          key: "role",
          header: "Cargo",
          cell: (row) => row.role,
        },
        {
          key: "joined",
          header: "Desde",
          sortable: true,
          sortValue: (row) => row.joined,
          align: "end",
          cell: (row) => new Date(row.joined).toLocaleDateString("pt-BR"),
        },
      ]}
    />
  );
}

/* Lê o gesto dos tokens já resolvidos (var() substituído), então a demo
   acompanha qualquer ajuste em tokens.css — inclusive o 0.01s da redução
   de movimento. */
type Gesto = "assentar" | "recolher" | "pulso" | "deriva";

function motionToken(el: Element, gesto: Gesto) {
  const css = getComputedStyle(el);
  const easing = css.getPropertyValue(`--motion-${gesto}-ease`).trim();
  const duration = parseFloat(css.getPropertyValue(`--motion-${gesto}-duration`)) * 1000;
  return { easing, duration };
}

const motionShape: React.CSSProperties = {
  width: 48,
  height: 48,
  border: 0,
  padding: 0,
  borderRadius: "var(--radius-md)",
  background: "var(--color-accent)",
};

function MotionDemo() {
  const assentar = React.useRef<HTMLDivElement>(null);
  const recolher = React.useRef<HTMLDivElement>(null);
  const pulso = React.useRef<HTMLButtonElement>(null);
  const deriva = React.useRef<HTMLDivElement>(null);
  const resetRecolher = React.useRef<number>();

  React.useEffect(() => () => clearTimeout(resetRecolher.current), []);

  React.useEffect(() => {
    const el = deriva.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anim = el.animate(
      [{ transform: "rotate(0turn)" }, { transform: "rotate(1turn)" }],
      { duration: 6000, iterations: Infinity, easing: motionToken(el, "deriva").easing },
    );
    return () => anim.cancel();
  }, []);

  const playAssentar = () => {
    const el = assentar.current!;
    el.animate(
      [{ opacity: 0, transform: "translateY(16px) scale(0.8)" }, { opacity: 1, transform: "none" }],
      motionToken(el, "assentar"),
    );
  };

  const playRecolher = () => {
    const el = recolher.current!;
    const anim = el.animate(
      [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.8)" }],
      { ...motionToken(el, "recolher"), fill: "forwards" },
    );
    anim.onfinish = () => {
      resetRecolher.current = window.setTimeout(() => anim.cancel(), 600);
    };
  };

  const playPulso = () => {
    const el = pulso.current!;
    el.animate([{ transform: "scale(0.88)" }, { transform: "scale(1)" }], motionToken(el, "pulso"));
  };

  const tiles: { gesto: Gesto; uso: string; stage: React.ReactNode; action?: React.ReactNode }[] = [
    {
      gesto: "assentar",
      uso: "Entrada: chega, passa do ponto e assenta. 0.3s, com overshoot.",
      stage: <div ref={assentar} style={motionShape} />,
      action: <Button inline size="sm" variant="ghost" onClick={playAssentar}>Entrar</Button>,
    },
    {
      gesto: "recolher",
      uso: "Saída: acelera e some, sem overshoot. 0.15s, ease-in.",
      stage: <div ref={recolher} style={motionShape} />,
      action: <Button inline size="sm" variant="ghost" onClick={playRecolher}>Sair</Button>,
    },
    {
      gesto: "pulso",
      uso: "Confirmação de clique. 0.2s, com overshoot. Clique no quadrado.",
      stage: <button ref={pulso} type="button" aria-label="Pulsar" onClick={playPulso} style={{ ...motionShape, cursor: "pointer" }} />,
    },
    {
      gesto: "deriva",
      uso: "Contínuo e linear; o período é de cada uso. Para sob redução de movimento.",
      stage: <div ref={deriva} style={motionShape} />,
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
      {tiles.map((t) => (
        <Card key={t.gesto} title={t.gesto}>
          <div style={{ height: 96, display: "grid", placeItems: "center" }}>{t.stage}</div>
          <CardText>
            <code>--motion-{t.gesto}-*</code>. {t.uso}
          </CardText>
          {t.action && <div style={{ marginTop: 12 }}>{t.action}</div>}
        </Card>
      ))}
    </div>
  );
}

function PaginationDemo() {
  const [page, setPage] = React.useState(1);
  return <Pagination page={page} totalPages={12} onChange={setPage} />;
}

function StepIndicatorDemo() {
  const [dotPage, setDotPage] = React.useState(0);
  const [countPage, setCountPage] = React.useState(0);
  const total = 4;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 12 }}>
          Modo pontos — clicável direto (onChange)
        </p>
        <StepIndicator current={dotPage} total={total} onChange={setDotPage} />
      </div>
      <div>
        <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 12 }}>
          Modo contador — texto puro, combine com botões próprios (label="Página")
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <StepIndicator current={countPage} total={total} showCount label="Página" />
          <Button
            inline
            size="sm"
            variant="ghost"
            disabled={countPage === 0}
            onClick={() => setCountPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <Button
            inline
            size="sm"
            variant="solid"
            disabled={countPage === total - 1}
            onClick={() => setCountPage((p) => p + 1)}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}

function useIsMobile(breakpoint = 720) {
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth <= breakpoint
  );
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [breakpoint]);
  return isMobile;
}

const TESTIMONIALS = [
  {
    rating: 5,
    quote: "Trocamos o CSS solto por tokens em uma tarde. O styleguide gerado da própria lib fez toda a diferença na revisão.",
    author: "Marina Alves",
    role: "Lead Frontend, Órbita",
    initials: "MA",
  },
  {
    rating: 5,
    quote: "O contorno reativo e o fundo vivo deram uma identidade própria pro produto sem escrever uma linha de animação.",
    author: "Diego Nascimento",
    role: "Founder, Nebulosa",
    initials: "DN",
  },
  {
    rating: 4,
    quote: "Documentação densa o suficiente pra eu não precisar perguntar nada — só ler o ARCHITECTURE.md antes de mexer.",
    author: "Cauê Ribeiro",
    role: "UI Engineer, Constelação",
    initials: "CR",
  },
  {
    rating: 5,
    quote: "Migramos de Storybook pro styleguide gerado da própria lib e nunca mais divergiu do código de verdade.",
    author: "Renata Souza",
    role: "Design Systems Lead, Aurora",
    initials: "RS",
  },
  {
    rating: 4,
    quote: "O contorno reativo virou a assinatura visual do nosso dashboard — clientes comentam sem eu precisar apontar.",
    author: "Felipe Tanaka",
    role: "CTO, Kit Aurora",
    initials: "FT",
  },
  {
    rating: 5,
    quote: "Zero dependência de runtime foi o que fechou a decisão — não precisei justificar mais um pacote pro time.",
    author: "Bianca Ferraz",
    role: "Staff Engineer, Constelação",
    initials: "BF",
  },
];

function TestimonialsDemo() {
  // No mobile cada página vira 1 card só — 2 por página faria o segundo
  // quebrar linha e empilhar dentro da mesma página do carrossel.
  const pageSize = useIsMobile() ? 1 : 2;
  const pages: (typeof TESTIMONIALS)[number][][] = [];
  for (let i = 0; i < TESTIMONIALS.length; i += pageSize) {
    pages.push(TESTIMONIALS.slice(i, i + pageSize));
  }
  return (
    <Carousel
      arrows={false}
      items={pages.map((page, p) => (
        <div key={p} style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch" }}>
          {page.map((t) => (
            <TestimonialCard
              key={t.author}
              style={{ flex: "1 1 260px" }}
              rating={t.rating}
              quote={t.quote}
              author={t.author}
              role={t.role}
              avatar={<Avatar size="sm" initials={t.initials} alt={t.author} />}
            />
          ))}
        </div>
      ))}
    />
  );
}

const GITHUB = (
  <svg viewBox="0 0 24 24" aria-label="GitHub">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.68.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
  </svg>
);

/* ---------- catálogo ---------- */

/* ---------- Grafo 3D: base de notas fictícia ----------
   Dados inventados sobre design. Este repositório é público: nunca usar
   aqui nomes de notas, projetos ou clientes de uma base real. */
const GRAFO_GRUPOS: Grafo3DGrupo[] = [
  { id: "fundamentos", rotulo: "Fundamentos", slot: 1 },
  { id: "projetos", rotulo: "Projetos", slot: 2 },
  { id: "referencias", rotulo: "Referências", slot: 3 },
  { id: "rascunhos", rotulo: "Rascunhos", slot: 4 },
  { id: "diario", rotulo: "Diário", slot: 6 },
];

const GRAFO_NOS: Grafo3DNo[] = [
  ["Tipografia", "fundamentos"], ["Cor", "fundamentos"], ["Grid", "fundamentos"],
  ["Contraste", "fundamentos"], ["Movimento", "fundamentos"],
  ["Projeto Aurora", "projetos"], ["Projeto Nimbus", "projetos"], ["Projeto Farol", "projetos"],
  ["Projeto Seiva", "projetos"], ["Projeto Órbita", "projetos"],
  ["Escalas modulares", "referencias"], ["Paletas acessíveis", "referencias"], ["Curvas de easing", "referencias"],
  ["Leitura em tela", "referencias"], ["Sistemas de ícones", "referencias"], ["Ritmo vertical", "referencias"],
  ["Ideia de logotipo", "rascunhos"], ["Texto da landing", "rascunhos"], ["Moodboard", "rascunhos"],
  ["Segunda", "diario"], ["Terça", "diario"], ["Quarta", "diario"], ["Quinta", "diario"],
].map(([rotulo, grupo]) => ({ id: rotulo!, rotulo: rotulo!, grupo: grupo! }));

const GRAFO_ARESTAS: Grafo3DAresta[] = ([
  ["Tipografia", "Escalas modulares"], ["Tipografia", "Ritmo vertical"], ["Tipografia", "Leitura em tela"],
  ["Cor", "Paletas acessíveis"], ["Cor", "Contraste"], ["Contraste", "Paletas acessíveis"],
  ["Grid", "Ritmo vertical"], ["Movimento", "Curvas de easing"], ["Sistemas de ícones", "Grid"],
  ["Projeto Aurora", "Tipografia"], ["Projeto Aurora", "Cor"], ["Projeto Aurora", "Moodboard"],
  ["Projeto Nimbus", "Movimento"], ["Projeto Nimbus", "Grid"], ["Projeto Nimbus", "Sistemas de ícones"],
  ["Projeto Farol", "Texto da landing"], ["Projeto Farol", "Leitura em tela"], ["Projeto Farol", "Contraste"],
  ["Projeto Seiva", "Ideia de logotipo"], ["Projeto Seiva", "Cor"], ["Projeto Órbita", "Curvas de easing"],
  ["Projeto Órbita", "Projeto Nimbus"], ["Moodboard", "Ideia de logotipo"], ["Texto da landing", "Tipografia"],
  ["Segunda", "Projeto Aurora"], ["Terça", "Projeto Farol"], ["Quarta", "Projeto Nimbus"],
  ["Quinta", "Projeto Órbita"], ["Quinta", "Projeto Seiva"], ["Segunda", "Terça"],
  ["Terça", "Quarta"], ["Quarta", "Quinta"],
] as const).map(([origem, destino]) => ({ origem, destino }));

function Grafo3DDemo() {
  const [selecionado, setSelecionado] = React.useState<string | null>(null);
  const [filtro, setFiltro] = React.useState<string[]>([]);
  const [busca, setBusca] = React.useState("");
  const destaque = React.useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return termo ? GRAFO_NOS.filter((n) => n.rotulo.toLowerCase().includes(termo)).map((n) => n.id) : [];
  }, [busca]);
  return (
    <Stack gap={4}>
      <Field label="Realçar notas">
        <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="ex.: projeto, cor, quinta" />
      </Field>
      <div style={{ height: 440 }}>
        <Grafo3D
          nos={GRAFO_NOS}
          arestas={GRAFO_ARESTAS}
          grupos={GRAFO_GRUPOS}
          selecionado={selecionado}
          aoSelecionar={setSelecionado}
          filtro={filtro}
          aoFiltrar={setFiltro}
          destaque={destaque}
          rotulo="Grafo de exemplo de uma base de notas"
        />
      </div>
      <p className="ms-text-xs ms-text-muted">
        Selecionado: <strong>{selecionado ?? "nenhum"}</strong>. Filtro:{" "}
        <strong>{filtro.length ? filtro.join(", ") : "nenhum"}</strong>. Arraste para girar, role
        para aproximar, clique num nó para viajar até ele e no vazio para voltar. Clique nas cores
        da legenda para reunir um grupo num anel no centro; cada grupo a mais ganha um anel por
        fora. Pelo teclado, Tab abre a lista de nós.
      </p>
    </Stack>
  );
}

// Saída típica de um conversor de markdown (marked, remark…), como string.
const PROSE_EXEMPLO = `<h2>Nota do dia</h2>
<p>Revisão da <a href="#prose">proposta da padaria</a> e duas pendências da semana. O texto corre com <code>--line-height-prose</code>, um pouco mais aberto que o do resto da interface.</p>
<ul>
<li>Fechar o orçamento do site</li>
<li>Responder o email do fornecedor
<ul><li>prazo até sexta</li></ul>
</li>
</ul>
<h3>Próximos passos</h3>
<ol>
<li>Mandar o contrato</li>
<li>Agendar a visita</li>
</ol>
<blockquote><p>Citação: recua e passa para o texto secundário.</p></blockquote>
<pre><code>npm install mothership-ds</code></pre>
<hr>
<p>Depois do divisor, o ritmo continua.</p>`;

export const STORIES: Story[] = [
  /* ============ Fundações ============ */
  {
    id: "cores",
    group: "Fundações",
    title: "Cores",
    subtitle: "Cores semânticas (texto, borda, superfície) mudam com o tema; as 8 cores de marca são fixas, extraídas ou harmonizadas a partir da marca Mothership, com escalas de 100 a 900 pra variar intensidade sem inventar um tom novo a cada tela.",
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
          Accent, Pink e Orange são as três paradas exatas do gradiente de{" "}
          <code>assets/logo.svg</code> — extraídas direto da marca; Highlight, Success,
          Danger, Violet e Gray foram harmonizadas pra completar a paleta sem destoar
          dela. Todas com escala completa e versão <code>-soft</code> para badges e alertas.
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
    subtitle: "Uma família só (Outfit, 400 e 500, mais 600 reservado pra exibição) e uma escala fixa de tamanhos — de 12px pras badges até 48px pros números grandes e o título do herói — pra nenhuma tela inventar um font-size avulso. Escolhida por ser limpa, muito legível e versátil, com uma pegada mais orgânica e um charme que foge do óbvio de fontes mais batidas.",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div><span className="ms-display">Exibição — 48px</span> <code className="ms-text-xs ms-text-muted">--text-display · 600</code></div>
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
    subtitle: "Escala de espaçamento (4 a 56px) e os três raios do sistema (10px, pill e círculo) — a régua que toda margem, padding e border-radius do design system usa. Os saltos fogem um pouco da progressão matemática mais comum de propósito, pra um respiro mais orgânico e característico.",
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
    subtitle: "O vidro (glassmorphism), os quatro gestos de movimento (assentar, recolher, pulso, deriva) e o fundo animado com paralaxe — poucos efeitos recorrentes, tratados como token igual o resto dos fundamentos, pra garantir aplicação uniforme em vez de um efeito novo por componente.",
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
            Quatro gestos, cada um com curva e duração em token (<code>--motion-&lt;gesto&gt;-ease</code>{" "}
            e <code>-duration</code>). A regra: <strong>assentar ao entrar, recolher ao sair</strong>.
            Mudança de cor e fundo segue em <code>--transition-fast/base/slow</code>.
          </CardText>
        </Card>
        <MotionDemo />
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
        <p className="ms-text-sm ms-text-muted" style={{ marginTop: 4 }}>
          Poucos efeitos, mas recorrentes: tratá-los como token garante que todo
          componente novo já nasça coerente, sem reinventar um blur ou um easing
          próprio — e mantém a performance sob controle. Junto de uma interface
          moderna e arrojada, os respiros mais orgânicos do espaçamento criam um
          ecossistema agradável, com uma sensação calma de uso.
        </p>
      </div>
    ),
  },

  /* ============ Componentes ============ */
  {
    id: "loader",
    group: "Componentes",
    title: "Loader",
    subtitle: "Indicador de progresso de marca: o rosto do logo enche de líquido conforme o valor sobe. Use no lugar de uma barra genérica quando o carregamento merece destaque.",
    render: () => <LoaderDemo />,
  },
  {
    id: "mascote",
    group: "Componentes",
    title: "Mascote",
    subtitle: "O rosto da marca em quatro expressões, com o olho e o sorriso da logo. Para transições e estados vazios, nunca para algo que fica sempre na tela.",
    render: () => (
      <>
        <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 20 }}>
          <code>piscando</code> é a piscada dupla da splash; <code>procurando</code> salta a
          pupila de um lado para o outro, no pulso; <code>confuso</code> inclina o rosto com um
          &quot;?&quot; e a pupila encolhida (bom para erro); <code>pensando</code> olha para o alto
          e balbucia de boca entreaberta enquanto as bolhas assentam uma a uma (bom para espera). Sem <code>label</code>, o
          mascote é decorativo (<code>aria-hidden</code>): o texto ao lado é quem diz o que está
          acontecendo. Sob <code>prefers-reduced-motion</code>, as quatro ficam paradas.
        </p>
        <div style={{ display: "flex", gap: 48, alignItems: "flex-end", justifyContent: "center", flexWrap: "wrap" }}>
          {(["piscando", "procurando", "confuso", "pensando"] as const).map((e) => (
            <figure key={e} style={{ margin: 0, display: "grid", justifyItems: "center", gap: 8 }}>
              <Mascote expressao={e} size={120} />
              <figcaption className="ms-text-sm ms-text-muted"><code>{e}</code></figcaption>
            </figure>
          ))}
          <figure style={{ margin: 0, display: "grid", justifyItems: "center", gap: 8 }}>
            <Mascote size={48} label="Mothership" />
            <figcaption className="ms-text-sm ms-text-muted"><code>size={"{48}"}</code></figcaption>
          </figure>
        </div>
      </>
    ),
  },
  {
    id: "splash",
    group: "Componentes",
    title: "Splash screen",
    subtitle: "Animação de abertura do app: o olho pisca enquanto carrega, o nome se centraliza a partir do O e o dirigível pousa por último. Existe em versão overlay (tela cheia) e inline (embutida no conteúdo). A marca em si é o LogoMark — SVG exportado do logo.svg, sem uso isolado fora daqui: as partes nascem fora de posição de propósito, prontas pra essa revelação.",
    render: () => <SplashDemo />,
  },
  {
    id: "layout",
    group: "Componentes",
    title: "Page",
    subtitle: "Aplica o fundo, a cor e a tipografia do tema à raiz da aplicação. contained embrulha o conteúdo num teto de 588px — a mesma largura da página original que deu origem ao sistema.",
    render: () => (
      <>
        <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 16, maxWidth: 620 }}>
          Sem exemplo isolado aqui de propósito: um <code>.ms-page</code> dentro de outro
          duplicaria o fundo da página (<code>min-height: 100vh</code> e o gradiente de fundo)
          de forma confusa. Este próprio styleguide já é o exemplo — a classe vai direto no{" "}
          <code>&lt;body&gt;</code>, com o mesmo efeito do componente.
        </p>
        <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 16, maxWidth: 620 }}>
          <code>contained</code> embrulha o conteúdo na mesma largura de 588px (
          <code>--container-max</code>) que a página original usava — sem componente
          dedicado pra isso, só a classe <code>.ms-container</code> que o próprio{" "}
          <code>Page</code> aplica internamente:
        </p>
        <div
          style={{
            border: "1px dashed var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "1px 0",
          }}
        >
          <div className="ms-container">
            <div
              style={{
                background: "var(--color-accent-soft)",
                border: "1px solid var(--color-accent)",
                borderRadius: "var(--radius-md)",
                padding: 16,
                textAlign: "center",
              }}
            >
              <code className="ms-text-xs">588px de largura máxima</code>
            </div>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "hero",
    group: "Componentes",
    title: "Hero",
    subtitle: "Bloco de abertura de página: eyebrow opcional, título (com destaque de uma palavra via HeroHighlight), subtítulo e uma fileira de ações.",
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
          <ButtonLink inline variant="solid" href="#hero">Começar agora</ButtonLink>
          <ButtonLink inline variant="ghost" href="#hero">Ver portfólio</ButtonLink>
        </div>
      </Hero>
    ),
  },
  {
    id: "navbar",
    group: "Componentes",
    title: "Navbar",
    subtitle: "Barra de navegação flutuante em pill de vidro. spy marca o link da seção visível conforme a rolagem; abaixo de 720px os links migram pra um menu de hambúrguer.",
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
              links={[{ href: "#", label: "Fundações" }, { href: "#", label: "Componentes" }, { href: "#", label: "Dados" }]}
            />
          </div>
          <div>
            <p className="ms-text-xs ms-text-muted" style={{ marginBottom: 8 }}>
              Completa, com sino e menu de tema:
            </p>
            <Navbar
              variant="static"
              brand=".valnezJunior()"
              links={[{ href: "#", label: "Links" }, { href: "#", label: "Sobre" }]}
            >
              <NotificationBell />
              <ThemeMenu />
            </Navbar>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "sidebar",
    group: "Componentes",
    title: "Sidebar",
    subtitle: "Sumário completo de seções e subtópicos — é a navegação padrão deste próprio styleguide. Fica fixa à esquerda no desktop e vira botão + gaveta abaixo de 720px.",
    render: () => (
      <p className="ms-text-sm ms-text-muted" style={{ maxWidth: 620 }}>
        Sem exemplo isolado aqui de propósito: você já está usando o componente — é o
        sumário fixo à esquerda desta página (ou o botão flutuante, se estiver no celular).
        Ele monta as seções a partir da mesma lista que gera esta navegação. Este styleguide
        usa <code>active</code> (controlado por qual componente está na janela agora, não
        por rolagem — só uma story fica montada por vez, de propósito) em vez de{" "}
        <code>spy</code>; passando <code>active</code>, o <code>spy</code> desliga sozinho.
        A seção-pai também é marcada quando um subtópico está ativo, nos dois modos.
      </p>
    ),
  },
  {
    id: "dock",
    group: "Componentes",
    title: "Dock",
    subtitle: "Navegação principal de app: coluna de ícones que expande para ícone + título, em pílula como a Navbar; expandida, vira painel no formato do Sidebar. Abaixo de 720px vira um botão que abre a navegação numa gaveta — uma barra de ícones não comporta os destinos de um app.",
    render: () => <DockDemo />,
  },
  {
    id: "breadcrumbs",
    group: "Componentes",
    title: "Breadcrumbs",
    subtitle: "Trilha de navegação em pills, pra mostrar onde a página atual está na hierarquia do site. O último item (a página atual) não é um link.",
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
    id: "paginacao",
    group: "Componentes",
    title: "Paginação",
    subtitle: "100% controlado — quem usa guarda o número da página, o componente só renderiza e dispara onChange. Números distantes viram \"…\"; sempre mostra primeira e última página.",
    render: () => <PaginationDemo />,
  },
  {
    id: "botoes",
    group: "Componentes",
    title: "Botões",
    subtitle: "Três variantes (vidro, sólido e ghost) em três tamanhos, com estado disabled. ButtonLink é a mesma aparência num link de verdade, pra ações que navegam em vez de disparar uma função.",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420, margin: "0 auto" }}>
        <ButtonLink href="#botoes">Padrão (glass)</ButtonLink>
        <ButtonLink href="#botoes" variant="solid">Sólido — accent</ButtonLink>
        <ButtonLink href="#botoes" variant="ghost">Ghost — só borda</ButtonLink>
        <Button disabled>Desabilitado</Button>
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          <ButtonLink href="#botoes" inline size="sm">Pequeno</ButtonLink>
          <ButtonLink href="#botoes" inline>Médio</ButtonLink>
          <ButtonLink href="#botoes" inline size="lg">Grande</ButtonLink>
        </div>
      </div>
    ),
  },
  {
    id: "lista-links",
    group: "Componentes",
    title: "Lista de links",
    subtitle: "Lista vertical de links em pill, no padrão linktree da página original que deu origem a essa biblioteca — útil pra páginas pessoais ou de contato.",
    render: () => (
      <LinkList style={{ maxWidth: 420, margin: "0 auto" }}>
        <li><ButtonLink href="#lista-links">Whatsapp</ButtonLink></li>
        <li><ButtonLink href="#lista-links">E-mail</ButtonLink></li>
        <li><ButtonLink href="#lista-links">Portfólio</ButtonLink></li>
      </LinkList>
    ),
  },
  {
    id: "icones",
    group: "Componentes",
    title: "Botões de ícone",
    subtitle: "Botões circulares só de ícone, pra redes sociais ou ações compactas, em três tamanhos. Sempre exigem aria-label — não há texto visível que dê nome ao controle.",
    render: () => (
      <>
        <IconRow>
          <IconButton href="#icones" aria-label="GitHub">{GITHUB}</IconButton>
          <IconButton href="#icones" aria-label="GitHub">{GITHUB}</IconButton>
          <IconButton href="#icones" aria-label="GitHub">{GITHUB}</IconButton>
        </IconRow>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", alignItems: "center" }}>
          <IconButton href="#icones" size="sm" aria-label="GitHub">{GITHUB}</IconButton>
          <IconButton href="#icones" aria-label="GitHub">{GITHUB}</IconButton>
          <IconButton href="#icones" size="lg" aria-label="GitHub">{GITHUB}</IconButton>
        </div>
      </>
    ),
  },
  {
    id: "switch",
    group: "Componentes",
    title: "Seletor de tema",
    subtitle: "Três temas: escuro (o padrão, vidro claro sobre o fundo escuro), Darker (vidro escuro, para a noite) e claro. O ThemeMenu escolhe entre os três num DropdownMenu — é o que está na navbar deste styleguide. O ThemeSwitch, com o polegar deslizando entre sol e lua, segue disponível para quem só quer claro/escuro.",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <ThemeMenu align="center" />
          <ThemeSwitch />
        </div>
        <p className="ms-text-xs ms-text-muted" style={{ textAlign: "center", maxWidth: 360 }}>
          Usam <code>useTheme()</code>: aplicam as classes <code>light</code> ou <code>darker</code> no <code>&lt;html&gt;</code>.
        </p>
      </div>
    ),
  },
  {
    id: "avatar",
    group: "Componentes",
    title: "Avatar & Perfil",
    subtitle: "Avatar circular em três tamanhos (foto ou iniciais) e o bloco Profile, que junta avatar + nome + cargo numa única unidade reutilizável.",
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
    subtitle: "Input, select e textarea com o mesmo tratamento de foco e disabled. Field junta label + controle numa única unidade acessível. Select tem listbox própria (não o <select> nativo) — vidro, teclado (setas/Enter/Esc) e destaque acompanham o resto do sistema.",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Nome"><Input placeholder="Seu nome" /></Field>
        <Field label="E-mail"><Input placeholder="voce@exemplo.com" /></Field>
        <Field label="Plano">
          <Select
            placeholder="Escolha um plano"
            options={[
              { value: "starter", label: "Starter" },
              { value: "pro", label: "Pro" },
              { value: "enterprise", label: "Enterprise (em breve)", disabled: true },
            ]}
          />
        </Field>
        <Field label="Desabilitado"><Input placeholder="Indisponível" disabled /></Field>
        <Field label="Mensagem"><Textarea placeholder="Escreva sua mensagem…" /></Field>
      </div>
    ),
  },
  {
    id: "combobox",
    group: "Componentes",
    title: "Combobox",
    subtitle: "Campo de texto com autocomplete — filtra as opções conforme digita. Reaproveita a mesma listbox do Select (Setas navegam, Enter escolhe, Esc fecha); a diferença é o gatilho editável e o filtro por texto.",
    render: () => (
      <Field label="Cidade" style={{ maxWidth: 320 }}>
        <Combobox
          placeholder="Digite pra filtrar…"
          options={[
            { value: "sp", label: "São Paulo" },
            { value: "rj", label: "Rio de Janeiro" },
            { value: "bh", label: "Belo Horizonte" },
            { value: "poa", label: "Porto Alegre" },
            { value: "cur", label: "Curitiba" },
            { value: "sal", label: "Salvador" },
          ]}
        />
      </Field>
    ),
  },
  {
    id: "select-overflow",
    group: "Componentes",
    title: "Select dentro de overflow: hidden",
    subtitle: "A lista do Select e do Combobox vive num portal no <body>, então um container que corta o próprio conteúdo (card com overflow: hidden, linha de tabela, modal com rolagem) não corta mais o popup. Perto do pé da tela, ela abre para cima. Dentro de um Popover, escolher uma opção não fecha o Popover.",
    render: () => (
      <Stack gap={4}>
      <div
        style={{
          maxWidth: 320,
          height: 96,
          padding: "var(--space-4)",
          overflow: "hidden",
          border: "var(--border-width) dashed var(--color-border)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Field label="Estado (container de 96px, overflow: hidden)">
          <Select
            placeholder="Escolha…"
            options={["AC", "AL", "AM", "BA", "CE", "PB", "PE", "RN", "SE"].map((uf) => ({ value: uf, label: uf }))}
          />
        </Field>
      </div>
      <Popover trigger={<Button>Filtrar</Button>}>
        <Field label="Ordenar por">
          <Select
            defaultValue="recentes"
            options={[
              { value: "recentes", label: "Mais recentes" },
              { value: "antigos", label: "Mais antigos" },
              { value: "nome", label: "Nome" },
            ]}
          />
        </Field>
      </Popover>
      </Stack>
    ),
  },
  {
    id: "selecao",
    group: "Componentes",
    title: "Checkbox, Radio & Switch",
    subtitle: "Checkbox e Radio são <input> nativo com appearance: none, então mantêm foco/teclado/formulário de graça — só o visual é customizado. Switch é um checkbox com role=\"switch\", participa de <form> normalmente (diferente do ThemeSwitch, que não é um campo de formulário).",
    render: () => (
      <Stack gap={4} style={{ maxWidth: 320 }}>
        <Stack gap={2}>
          <Checkbox label="Aceito os termos" defaultChecked />
          <Checkbox label="Receber novidades por e-mail" />
          <Checkbox label="Desabilitado" disabled />
        </Stack>
        <Divider />
        <Stack gap={2}>
          <Radio name="plano-demo" label="Mensal" defaultChecked />
          <Radio name="plano-demo" label="Anual (2 meses grátis)" />
        </Stack>
        <Divider />
        <Switch label="Notificações ativas" defaultChecked />
      </Stack>
    ),
  },
  {
    id: "cards",
    group: "Componentes",
    title: "Cards",
    subtitle: "Superfície de vidro genérica, com ou sem o contorno reativo (HoverEdge) que acompanha o mouse — a base visual por trás de StatTile, PricingCard e outros.",
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Card title="Card de vidro">
          <CardText>Superfície translúcida, borda suave, raio de 10px e blur de 20px.</CardText>
        </Card>
        <Card title="Card com ações">
          <CardText style={{ marginBottom: 16 }}>Combine com outros componentes.</CardText>
          <div style={{ display: "flex", gap: 12 }}>
            <ButtonLink href="#cards" inline size="sm" variant="solid">Ação</ButtonLink>
            <ButtonLink href="#cards" inline size="sm" variant="ghost">Cancelar</ButtonLink>
          </div>
        </Card>
        <HoverEdge colors={["var(--color-accent)", "var(--color-success)"]}>
          <Card title="Com .ms-hover-edge">
            <CardText>Passe o mouse — o anel gira acompanhando o cursor.</CardText>
          </Card>
        </HoverEdge>
        <Card title="Card selecionado" selected>
          <CardText>
            <code>selected</code> troca a borda pelo anel no gradiente de ativo
            (<code>--gradient-active</code>) e marca <code>aria-current="true"</code>.
          </CardText>
        </Card>
      </div>
    ),
  },
  {
    id: "stack-divider",
    group: "Componentes",
    title: "Stack & Divider",
    subtitle: "Stack: wrapper fino de flexbox — direction/gap/align em tokens do sistema, sem lógica própria. Divider: linha divisória; orientation=\"vertical\" pede altura definida pelo pai (align-self: stretch cobre um Stack em linha).",
    render: () => (
      <Stack gap={5}>
        <Stack direction="row" gap={3} align="center">
          <Badge>Item 1</Badge>
          <Badge tone="accent">Item 2</Badge>
          <Divider orientation="vertical" style={{ height: 20 }} />
          <Badge tone="success">Item 3</Badge>
        </Stack>
        <Divider />
        <Stack gap={2}>
          <CardText>Uma coluna, gap=2 (8px).</CardText>
          <CardText>Segunda linha.</CardText>
        </Stack>
      </Stack>
    ),
  },
  {
    id: "prose",
    group: "Componentes",
    title: "Prose",
    subtitle: "Texto corrido já em HTML — o que sai de um conversor de markdown — com o ritmo vertical e a tipografia do sistema: títulos, parágrafos, listas, links, código e citações. Recebe html (string) ou children (JSX). Não converte nem sanitiza: HTML de terceiros passa por um sanitizador antes de chegar aqui.",
    render: () => (
      <Card>
        <Prose html={PROSE_EXEMPLO} />
      </Card>
    ),
  },
  {
    id: "precificacao",
    group: "Componentes",
    title: "Card de precificação",
    subtitle: "Card de plano com preço, período e lista de recursos (com ou sem check). highlighted/badge destacam o plano recomendado com borda e glow.",
    render: () => (
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch", paddingTop: 20 }}>
        <PricingCard
          style={{ flex: "1 1 240px" }}
          title="Starter"
          description="Pra começar sozinho"
          price="R$0"
          period="/mês"
          features={[
            { text: "1 projeto" },
            { text: "Componentes básicos" },
            { text: "Suporte por e-mail", included: false },
            { text: "Domínio próprio", included: false },
          ]}
          cta={<ButtonLink href="#precificacao" inline variant="ghost">Começar grátis</ButtonLink>}
        />
        <PricingCard
          style={{ flex: "1 1 240px" }}
          badge="Popular"
          title="Pro"
          description="Pra times em produção"
          price="R$49"
          period="/mês"
          features={[
            { text: "Projetos ilimitados" },
            { text: "Todos os componentes" },
            { text: "Suporte por e-mail" },
            { text: "Domínio próprio" },
          ]}
          cta={<ButtonLink href="#precificacao" inline variant="solid">Assinar Pro</ButtonLink>}
        />
        <PricingCard
          style={{ flex: "1 1 240px" }}
          title="Empresa"
          description="Pra escala e governança"
          price="Sob consulta"
          features={[
            { text: "Tudo do Pro" },
            { text: "SSO e permissões" },
            { text: "SLA dedicado" },
            { text: "Suporte prioritário" },
          ]}
          cta={<ButtonLink href="#precificacao" inline variant="ghost">Falar com vendas</ButtonLink>}
        />
      </div>
    ),
  },
  {
    id: "depoimentos",
    group: "Componentes",
    title: "Card de depoimentos",
    subtitle: "Depoimento com avaliação em estrelas opcional e identidade (avatar + nome + cargo) fixada no rodapé. Contorno reativo no hover e no active, pra funcionar também em telas de toque sem hover de verdade.",
    render: () => <TestimonialsDemo />,
  },
  {
    id: "bento",
    group: "Componentes",
    title: "Bento grid",
    subtitle: "Grid de 4 colunas com tiles de tamanho variável (colSpan/rowSpan), no estilo dashboard de app. grid-auto-flow: dense preenche os buracos deixados pelos tamanhos irregulares.",
    render: () => (
      <BentoGrid>
        <BentoTile
          colSpan={2}
          rowSpan={2}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <path d="M3.27 6.96 12 12l8.73-5.04M12 22.08V12" />
            </svg>
          }
          title="Zero dependência de runtime"
          description="Sem framework de UI, sem biblioteca de animação, sem CSS-in-JS. Só React e as folhas de estilo do próprio sistema."
        />
        <BentoTile
          colSpan={2}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
            </svg>
          }
          title="Tokens antes de valores"
          description="Nenhum componente escreve 15px ou uma cor solta — sempre var(--token)."
        />
        <BentoTile
          rowSpan={2}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2 3 6v6c0 5 3.8 8.7 9 10 5.2-1.3 9-5 9-10V6z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          }
          title="Acessibilidade não é opcional"
          description="Estado marcado com aria-*, nunca só com cor. Foco visível em todo controle, contraste e daltonismo validados em cada cor de dado nova."
        />
        <BentoTile
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12h3l3-9 4 18 3-9h7" />
            </svg>
          }
          title="Movimento é identidade"
          description="Um único easing com overshoot assina as microinterações."
        />
        <BentoTile
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2 2 7l10 5 10-5-10-5z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
            </svg>
          }
          title="A biblioteca não invade o app"
          description="Sem reset global, sem estilos fora de .ms-page."
        />
        <BentoTile
          colSpan={3}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          }
          title="Styleguide gerado da própria biblioteca"
          description="Cada bloco desta página importa o componente real de src/ — não existe catálogo paralelo que possa divergir do código."
        />
        <BentoTile
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" />
            </svg>
          }
          title="Contorno reativo"
          description="O anel gira acompanhando o mouse — o mesmo utilitário por trás do hover deste tile."
        />
        <BentoTile
          rowSpan={2}
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          }
          title="Claro e escuro nativos"
          description="Todo token de cor tem par nos dois temas — nenhum componente escreve media query própria pra isso."
        />
      </BentoGrid>
    ),
  },
  {
    id: "badges",
    group: "Componentes",
    title: "Badges",
    subtitle: "Etiqueta pequena pra marcar estado ou categoria — tom neutro ou uma das 8 cores de marca, sempre acompanhada de texto, nunca só a cor.",
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
    subtitle: "Mensagens de feedback: estáticas (embutidas na página) ou como toast disparado por notify(), que soma 20s na tela com barra de tempo e histórico.",
    render: () => <AlertsDemo />,
  },
  {
    id: "modal",
    group: "Componentes",
    title: "Modal & etapas",
    subtitle: "Popup sobre véu escurecido (ou claro, no tema claro), com foco preso dentro do diálogo. StepModal pagina o conteúdo em etapas, com botões de anterior/próximo.",
    render: () => <ModalDemo />,
  },
  {
    id: "step-indicator",
    group: "Componentes",
    title: "StepIndicator",
    subtitle: "Indicador de progresso por etapas/páginas — pontos em pill (mesma linguagem do Carousel) ou texto \"Etapa X de Y\" (showCount). Extraído do rodapé do StepModal pra servir navegação paginada fora de um modal, ex. uma galeria.",
    render: () => <StepIndicatorDemo />,
  },
  {
    id: "popover",
    group: "Componentes",
    title: "Popover",
    subtitle: "Painel flutuante disparado por clique — conteúdo livre e interativo, diferente do Tooltip (hover, só texto). Posição calculada de verdade (não CSS puro): vira de lado se não couber, nunca sai da viewport. \"Popover leve\": clique fora ou Esc fecham, mas não prende o foco dentro como o Modal.",
    render: () => (
      <div style={{ display: "flex", gap: 40 }}>
        <Popover
          placement="bottom"
          align="start"
          trigger={<Button inline>Abrir popover</Button>}
        >
          <p className="ms-h3" style={{ marginBottom: 8 }}>Configurações rápidas</p>
          <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 16 }}>
            Conteúdo livre — inclusive controles interativos de verdade.
          </p>
          <Switch label="Notificações" defaultChecked />
        </Popover>
        <Popover
          placement="bottom"
          align="end"
          trigger={
            <IconButton href="#popover" aria-label="Mais opções">
              <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }} aria-hidden="true">
                <circle cx="5" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="19" cy="12" r="2" />
              </svg>
            </IconButton>
          }
        >
          <p className="ms-text-sm">Alinhado à direita do gatilho (align="end").</p>
        </Popover>
      </div>
    ),
  },
  {
    id: "tooltip",
    group: "Componentes",
    title: "Tooltip",
    subtitle: "Texto curto que aparece no hover e no foco por teclado — só texto, não interativo (para conteúdo livre, use o Popover). Envolva o gatilho em <Tooltip content> ou ponha data-tip direto no elemento: os dois passam pelo mesmo TooltipProvider, com a mesma posição e o mesmo aria-describedby. O gatilho precisa ser focável para chegar por Tab.",
    render: () => (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
        <Tooltip content="Salva o rascunho sem publicar">
          <Button inline>Salvar</Button>
        </Tooltip>
        <Tooltip content={"Duas linhas:\na quebra vira linha nova"}>
          <Button inline variant="solid">Publicar</Button>
        </Tooltip>
        <Badge tone="accent" tabIndex={0} data-tip="Mesmo efeito, via data-tip">
          data-tip
        </Badge>
      </div>
    ),
  },
  {
    id: "drawer",
    group: "Componentes",
    title: "Drawer",
    subtitle: "Painel deslizante com véu de fundo, controlado de fora (open/onClose) — mecânica extraída da gaveta mobile do Sidebar, agora compartilhada. \"Leve\" como o Popover: sem focus trap, sem travar o scroll do fundo, só Esc/clique no véu fecham.",
    render: () => <DrawerDemo />,
  },
  {
    id: "dropdown-menu",
    group: "Componentes",
    title: "DropdownMenu",
    subtitle: "Menu de ações flutuante, navegável por teclado (setas, Home/End, Esc). Absorve o que seria um ContextMenu à parte via triggerOn=\"context\": mesmo menu, só muda o gesto que abre (clique vs. clique direito).",
    render: () => <DropdownMenuDemo />,
  },
  {
    id: "accordion",
    group: "Componentes",
    title: "Accordion",
    subtitle: "Painéis que expandem com leve bounce na abertura e no fechamento. single fecha o painel aberto ao abrir outro — ideal pra FAQs.",
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
    id: "tabs",
    group: "Componentes",
    title: "Tabs",
    subtitle: "Indicador desliza com bounce até a aba ativa (medido via DOM, não CSS puro). Setas ←/→ navegam e já ativam (Home/End pulam pro primeiro/último); pula abas disabled.",
    render: () => (
      <Tabs
        items={[
          { id: "visao", label: "Visão geral", content: <p className="ms-text-sm">Conteúdo da primeira aba — trocar de aba desmonta o conteúdo anterior, como um accordion.</p> },
          { id: "detalhes", label: "Detalhes", content: <p className="ms-text-sm">Segunda aba. O indicador embaixo do texto acompanha com <code>--ease-bounce</code>.</p> },
          { id: "indisponivel", label: "Indisponível", content: null, disabled: true },
          { id: "historico", label: "Histórico", content: <p className="ms-text-sm">Última aba — <code>End</code> pula direto pra cá.</p> },
        ]}
      />
    ),
  },
  {
    id: "carrossel",
    group: "Componentes",
    title: "Carrossel",
    subtitle: "Paginação por fotos (com legenda) ou conteúdo livre via items — ex. um grupo de TestimonialCard. Navegável por setas, bullets e arraste horizontal (toque ou mouse).",
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
    subtitle: "Grade de itens com filtro por categoria, badges e hover em degradê. Pensada pra portfólio — cada item pode ter várias categorias e aparecer em mais de um filtro. itemsPerPage pagina a grade (StepIndicator) em vez de crescer em altura; onClick por item vira o card num botão (ex.: abrir o case completo num Modal). Filtro sem nenhum item (Motion, aqui) mostra um EmptyState.",
    render: () => <GalleryDemo />,
  },
  {
    id: "marquee",
    group: "Componentes",
    title: "Marquee",
    subtitle: "Faixa de rolagem horizontal infinita, 100% CSS (sem JS por trás da animação). Aceita qualquer conteúdo — não só logos — com direction, speed, pauseOnHover e fade nas bordas.",
    render: () => {
      const chips = ["Design Systems", "Tokens", "Glassmorphism", "Acessibilidade", "Movimento", "Performance"];
      const techs = ["React", "TypeScript", "Next.js", "Tailwind", "Node", "Figma", "Storybook"];
      const Chip = ({ children }: { children: React.ReactNode }) => <Badge tone="accent">{children}</Badge>;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <h3 className="ms-h3" style={{ marginBottom: 12 }}>Velocidades</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(["slow", "normal", "fast"] as const).map((speed) => (
                <div key={speed}>
                  <p className="ms-text-xs ms-text-muted" style={{ marginBottom: 8 }}>
                    speed=&quot;{speed}&quot;
                  </p>
                  <Marquee speed={speed} fade>
                    {chips.map((c) => <Chip key={c}>{c}</Chip>)}
                  </Marquee>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="ms-h3" style={{ marginBottom: 12 }}>Direção</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <p className="ms-text-xs ms-text-muted" style={{ marginBottom: 8 }}>direction=&quot;left&quot; (padrão)</p>
                <Marquee fade>{chips.map((c) => <Chip key={c}>{c}</Chip>)}</Marquee>
              </div>
              <div>
                <p className="ms-text-xs ms-text-muted" style={{ marginBottom: 8 }}>direction=&quot;right&quot;</p>
                <Marquee direction="right" fade>{chips.map((c) => <Chip key={c}>{c}</Chip>)}</Marquee>
              </div>
            </div>
          </div>

          <div>
            <h3 className="ms-h3" style={{ marginBottom: 12 }}>pauseOnHover, sem fade</h3>
            <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 8 }}>
              Passe o mouse para pausar. Sem <code>fade</code>, as bordas cortam sem transição.
            </p>
            <Marquee pauseOnHover gap="lg">
              {chips.map((c) => <Chip key={c}>{c}</Chip>)}
            </Marquee>
          </div>

          <div>
            <h3 className="ms-h3" style={{ marginBottom: 12 }}>Playground — stack tecnológico</h3>
            <p className="ms-text-sm ms-text-muted" style={{ marginBottom: 8 }}>
              Qualquer <code>children</code> funciona — nenhum código de logo aqui, só as
              tecnologias deste próprio projeto (e do exemplo Next.js) como chips.
            </p>
            <Marquee speed="slow" fade pauseOnHover gap="lg">
              {techs.map((t) => <Chip key={t}>{t}</Chip>)}
            </Marquee>
          </div>
        </div>
      );
    },
  },
  {
    id: "rodape",
    group: "Componentes",
    title: "Rodapé",
    subtitle: "Rodapé de página com o crédito de marca (ícone de raio + link em accent). Aceita children livre pra colunas de links, redes sociais etc.",
    render: () => (
      <Footer>
        <p>
          Made by <Flash /> <a href="#rodape">Mothership Studios</a>
        </p>
      </Footer>
    ),
  },

  /* ============ Dados ============ */
  {
    id: "grafico-linhas",
    group: "Dados",
    title: "Gráfico de linhas",
    subtitle: "Série temporal com eixos, grade recessiva e tooltip no hover. Aceita múltiplas séries (series), cada uma com sua própria cor de dado.",
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
    subtitle: "Barras horizontais com cor por entidade e valor rotulado — pra comparar algumas categorias lado a lado, sem precisar de um gráfico completo.",
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
    subtitle: "Fatias com respiro de 2px, rótulo com percentual direto na fatia e uma legenda embaixo, sempre junto, pra nomear as cores mesmo se o rótulo interno for pequeno demais.",
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
    subtitle: "Indicador circular de progresso com um número-herói no centro (ou hideValue, útil dentro de um stat tile). size controla o diâmetro em px — o traço e a fonte escalam junto.",
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
    subtitle: "StatTile: número, delta (trend up/down/flat) e sparkline opcional, com o mesmo contorno reativo do Card. StatGrid organiza vários lado a lado num grid responsivo.",
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
    subtitle: "Sparkline: miniatura de série temporal sem eixos, pra caber dentro de um card. Legend identifica as cores de várias séries/categorias num gráfico maior.",
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
  {
    id: "grafo-3d",
    group: "Dados",
    title: "Grafo 3D",
    subtitle: "Grafo navegável em three.js puro, importado de mothership-ds/3d (three é peer opcional). Layout por forças determinístico, cores por grupo nos slots de dados e de marca, deriva e parallax como o fundo animado, nós que respiram como uma malha, viagem suave até o nó e vizinhos acesos no hover. A legenda filtra: cada grupo vira um anel no centro e o resto abre espaço. Com movimento reduzido, fica parado e as transições são instantâneas.",
    render: () => <Grafo3DDemo />,
  },
  {
    id: "tabela",
    group: "Dados",
    title: "Tabela",
    subtitle: "Tabela pronta pro fluxo de CRUD: primeira coluna sempre uma badge de status, última sempre os ícones de ação (editar/excluir). Colunas sortable alternam asc → desc → ordem original no cabeçalho.",
    render: () => <TableDemo />,
  },
  {
    id: "skeleton",
    group: "Dados",
    title: "Skeleton",
    subtitle: "Placeholder de carregamento. O pulso anima entre os dois tokens de superfície já existentes — nada de cor nova, funciona nos dois temas de graça. variant=\"text\"/\"circle\"/\"rect\" (padrão) cobrem os formatos mais comuns.",
    render: () => (
      <Stack gap={5} style={{ maxWidth: 360 }}>
        <Stack direction="row" gap={3} align="center">
          <Skeleton variant="circle" />
          <Stack gap={2} style={{ flex: 1 }}>
            <Skeleton variant="text" style={{ width: "60%" }} />
            <Skeleton variant="text" style={{ width: "40%" }} />
          </Stack>
        </Stack>
        <Skeleton style={{ height: 120 }} />
      </Stack>
    ),
  },
  {
    id: "empty-state",
    group: "Dados",
    title: "Estado vazio",
    subtitle: "Para quando não há nada a mostrar: ilustração, título, descrição e uma ação opcional. A ilustração padrão é o Mascote procurando; qualquer ReactNode entra no lugar. Já é o vazio padrão da Table, da Gallery e do histórico de alertas.",
    render: () => (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
        <Card>
          <EmptyState
            title="Nenhum projeto ainda"
            description="Os projetos que você criar aparecem aqui."
            action={<Button inline size="sm" variant="solid">Criar projeto</Button>}
          />
        </Card>
        <Card>
          <EmptyState
            illustration={<Mascote expressao="confuso" />}
            title="Não deu para carregar"
            description="Confira a conexão e tente de novo."
            action={<Button inline size="sm" variant="ghost">Tentar de novo</Button>}
          />
        </Card>
        <Card>
          <EmptyState compact title="Sem alertas por enquanto." description="compact, para painéis estreitos." />
        </Card>
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
