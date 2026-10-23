/* PROTÓTIPO DESCARTÁVEL — tickets 01 (Cream escuro) e 07 (Paperpen).
   Componentes reais de src/, temas como sobreposição de tokens
   (temas.css). Troca pela barra de baixo, ou ← / → para o tema. */
import React from "react";
import { createRoot } from "react-dom/client";
import "../../../src/styles.css";
import "./temas.css";
import {
  Alert, Badge, Button, Card, Checkbox, Field, Hero, HeroHighlight, Input,
  LivingBackground, Pagination, Radio, Select, StatGrid, StatTile,
  StepIndicator, Switch, Table, Tabs, Textarea,
} from "../../../src";

type Opcao = { id: string; nome: string };

const TEMAS: (Opcao & { classe?: "light" | "darker" })[] = [
  { id: "glass-base", nome: "Glass base · referência" },
  { id: "glass-escuro", nome: "Glass escuro (Darker) · referência", classe: "darker" },
  { id: "cream-base", nome: "Cream base · referência", classe: "light" },
  { id: "cream-final", nome: "Cream escuro G · vidro Latte + Doce de leite" },
  { id: "cream-latte", nome: "Cream escuro D · Latte (rodada 2)" },
  { id: "cream-doce", nome: "Cream escuro E · Doce de leite (rodada 2)" },
  { id: "paper-base", nome: "Paperpen base" },
  { id: "flat-base", nome: "Flat base" },
  { id: "flat-escuro", nome: "Flat escuro" },
  { id: "paper-eink-1", nome: "Paperpen escuro · e-ink, luz média" },
  { id: "paper-eink-2", nome: "Paperpen escuro · e-ink, luz baixa" },
  { id: "paper-eink-3", nome: "Paperpen escuro · e-ink, luz âmbar" },
];

const OPCOES_PAPER: Record<string, { rotulo: string; itens: Opcao[] }> = {
  titulo: {
    rotulo: "Título (corpo: Patrick Hand)",
    itens: [
      { id: "dancing", nome: "Dancing Script" },
      { id: "cedarville", nome: "Cedarville" },
      { id: "nothing", nome: "Nothing You Could Do" },
      { id: "homemade", nome: "Homemade Apple" },
      { id: "nanum", nome: "Nanum Pen" },
      { id: "kalam", nome: "Kalam" },
      { id: "gochi", nome: "Gochi Hand" },
    ],
  },
  preench: {
    rotulo: "Preenchimento",
    itens: [
      { id: "rabisco", nome: "Rabisco" },
      { id: "marcador", nome: "Marcador" },
      { id: "hachura", nome: "Hachura" },
      { id: "solido", nome: "Sólido (rodada 1)" },
    ],
  },
  contorno: {
    rotulo: "Contorno",
    itens: [
      { id: "sutil", nome: "Meio-termo sutil" },
      { id: "medio", nome: "Meio-termo médio" },
      { id: "reto", nome: "Reto" },
      { id: "rabiscado", nome: "Rabiscado" },
    ],
  },
  ativo: {
    rotulo: "Ativo",
    itens: [
      { id: "logo", nome: "Gradiente da logo" },
      { id: "marca-texto", nome: "Marca-texto" },
      { id: "caneta", nome: "Caneta vermelha" },
    ],
  },
};

/* ---------- rabisco de caneta (SVG gerado com a cor do tema) ---------- */

// Pseudoaleatório com semente fixa: o mesmo rabisco a cada render.
function aleatorio(semente: number) {
  return () => ((semente = (semente * 16807) % 2147483647) - 1) / 2147483646;
}

function rabisco(cor: string, estilo: string) {
  const r = aleatorio(7);
  let d = "";
  let largura = 3;
  if (estilo === "marcador") {
    // faixas horizontais largas, com leve ondulação, como colorir com marcador
    largura = 9;
    for (let y = 2; y < 40; y += 6.5) {
      d += `M${-2 + r() * 3} ${y + r() * 2} Q50 ${y + (r() - 0.5) * 4} ${102 - r() * 3} ${y + r() * 2} `;
    }
  } else {
    // zigue-zague diagonal de ida e volta, duas passadas
    largura = 2.6;
    for (let passada = 0; passada < 2; passada++) {
      d += `M${-4 + passada * 2} ${passada ? 40 : 0} `;
      for (let x = -4 + passada * 2, i = 0; x < 106; x += 3.2 + r() * 1.6, i++) {
        const y = (i + passada) % 2 ? 42 + r() * 2 : -2 - r() * 2;
        d += `L${(x + (r() - 0.5) * 2).toFixed(1)} ${y.toFixed(1)} `;
      }
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40' preserveAspectRatio='none'><path d='${d}' fill='none' stroke='${cor}' stroke-width='${largura}' stroke-linecap='round' stroke-linejoin='round' vector-effect='non-scaling-stroke' opacity='0.9'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function aplicarRabiscos(estilo: string) {
  const root = document.documentElement;
  const nomes = ["accent", "success", "danger", "highlight", "text"];
  if (estilo === "hachura" || estilo === "solido" || !root.dataset.pTema?.startsWith("paper")) {
    for (const n of nomes) root.style.removeProperty(`--p-rab-${n}`);
    if (estilo === "solido") for (const n of nomes) root.style.setProperty(`--p-rab-${n}`, "none");
    return;
  }
  const probe = document.createElement("div");
  document.body.appendChild(probe);
  for (const n of nomes) {
    probe.style.color = `var(--color-${n})`;
    root.style.setProperty(`--p-rab-${n}`, rabisco(getComputedStyle(probe).color, estilo));
  }
  probe.remove();
}

// Escolhido pelo Valnez na rodada 2.
const ESCOLHA: Record<string, string> = { titulo: "homemade", preench: "hachura", contorno: "medio", ativo: "caneta" };

function lerUrl() {
  const q = new URLSearchParams(location.search);
  const estado: Record<string, string> = { tema: q.get("tema") ?? "flat-base", separa: q.get("separa") ?? "ambos" };
  for (const [k, g] of Object.entries(OPCOES_PAPER)) estado[k] = q.get(k) ?? ESCOLHA[k] ?? g.itens[0].id;
  return estado;
}

/* ---------- contraste medido ---------- */

type RGBA = [number, number, number, number];

function resolver(probe: HTMLElement, cor: string): RGBA {
  probe.style.backgroundColor = "";
  probe.style.backgroundColor = cor;
  const s = getComputedStyle(probe).backgroundColor;
  const n = s.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  // "color(srgb r g b / a)" vem em 0–1; "rgb(a)" em 0–255
  const k = s.startsWith("color(") ? 255 : 1;
  return [n[0] * k, n[1] * k, n[2] * k, n[3] ?? 1];
}

const sobre = (c: RGBA, f: RGBA): RGBA => [
  c[0] * c[3] + f[0] * (1 - c[3]),
  c[1] * c[3] + f[1] * (1 - c[3]),
  c[2] * c[3] + f[2] * (1 - c[3]),
  1,
];

function lum([r, g, b]: RGBA) {
  const f = (v: number) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

const razao = (a: RGBA, b: RGBA) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

function Contraste({ chave }: { chave: string }) {
  const [linhas, setLinhas] = React.useState<[string, number, number][]>([]);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      const probe = document.createElement("div");
      document.body.appendChild(probe);
      const v = (t: string) => resolver(probe, `var(${t})`);
      const fundo = v("--bg-base");
      const vidro = sobre(v("--color-surface"), fundo);
      const accent = sobre(v("--color-accent"), fundo);
      setLinhas([
        ["texto / fundo", razao(sobre(v("--color-text"), fundo), fundo), 4.5],
        ["texto / vidro", razao(sobre(v("--color-text"), vidro), vidro), 4.5],
        ["texto mudo / vidro", razao(sobre(v("--color-text-muted"), vidro), vidro), 4.5],
        ["borda / fundo", razao(sobre(v("--color-border"), fundo), fundo), 3],
        ["accent-text / vidro", razao(sobre(v("--color-accent-text"), vidro), vidro), 4.5],
        ["on-accent / accent", razao(sobre(v("--color-on-accent"), accent), accent), 4.5],
        ["danger / vidro", razao(sobre(v("--color-danger"), vidro), vidro), 3],
      ]);
      probe.remove();
    });
    return () => cancelAnimationFrame(id);
  }, [chave]);
  return (
    <table className="p-contraste">
      <tbody>
        {linhas.map(([nome, r, min]) => (
          <tr key={nome}>
            <td>{nome}</td>
            <td className={r >= min ? "p-ok" : "p-nok"}>{r.toFixed(2)}:1</td>
            <td style={{ opacity: 0.6 }}>mín. {min}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------- amostra ---------- */

type Pessoa = { id: number; nome: string; email: string; cargo: string; st: "ok" | "pend" | "off" };
const PESSOAS: Pessoa[] = [
  { id: 1, nome: "Marina Alves", email: "marina@orbita.dev", cargo: "Lead Frontend", st: "ok" },
  { id: 2, nome: "Diego Nascimento", email: "diego@nebulosa.co", cargo: "Founder", st: "pend" },
  { id: 3, nome: "Felipe Tanaka", email: "felipe@kitaurora.com", cargo: "CTO", st: "off" },
];
const ST = {
  ok: { label: "Ativo", tone: "success" as const },
  pend: { label: "Pendente", tone: "highlight" as const },
  off: { label: "Inativo", tone: "gray" as const },
};

function Amostra({ chave }: { chave: string }) {
  const [pag, setPag] = React.useState(3);
  const [passo, setPasso] = React.useState(1);
  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "var(--space-5)",
  };
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 16px 160px", display: "grid", gap: 32 }}>
      <Hero>
        <Badge tone="accent">Disponível para projetos</Badge>
        <h1 className="ms-hero__title">
          Design que <HeroHighlight>flutua</HeroHighlight> sobre qualquer fundo
        </h1>
        <p className="ms-hero__subtitle">Badge de contexto, título com palavra em destaque, subtítulo e ações.</p>
        <div className="ms-hero__actions">
          <Button inline variant="solid">Começar agora</Button>
          <Button inline>Vidro</Button>
          <Button inline variant="ghost">Ver portfólio</Button>
        </div>
      </Hero>

      <div style={grid}>
        <Card title="Formulário">
          <div style={{ display: "grid", gap: 12 }}>
            <Field label="E-mail"><Input placeholder="voce@exemplo.com" defaultValue="valnez@mothership.dev" /></Field>
            <Field label="Plano">
              <Select
                placeholder="Escolha um plano"
                options={[
                  { value: "starter", label: "Starter" },
                  { value: "pro", label: "Pro" },
                ]}
              />
            </Field>
            <Field label="Mensagem"><Textarea placeholder="Escreva sua mensagem…" /></Field>
            <Checkbox label="Aceito os termos" defaultChecked />
            <Radio name="p-plano" label="Mensal" defaultChecked />
            <Radio name="p-plano" label="Anual (2 meses grátis)" />
            <Switch label="Notificações ativas" defaultChecked />
          </div>
        </Card>

        <div style={{ display: "grid", gap: 24, alignContent: "start" }}>
          <Card title="Plano Pro" selected>
            <p className="ms-text-sm">Card com <code>selected</code>: o sinal de ativo como anel.</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <Badge tone="accent">Novo</Badge>
              <Badge tone="success">Pago</Badge>
              <Badge tone="danger">Vencido</Badge>
              <Badge tone="highlight">Atenção</Badge>
            </div>
          </Card>
          <Card title="Terminal">
            <pre style={{ margin: 0, fontSize: 14, whiteSpace: "pre-wrap" }}>
              <code>{`$ npm run styleguide:dev\n> styleguide em http://localhost:8000\nconst tema = { theme: "paperpen", mode: "dark" };`}</code>
            </pre>
          </Card>
          <Card title="Contraste medido">
            <Contraste chave={chave} />
          </Card>
        </div>
      </div>

      <Card title="Navegação">
        <Tabs
          items={[
            { id: "visao", label: "Visão geral", content: <p className="ms-text-sm">Conteúdo da primeira aba, em texto pequeno (14px) para julgar a legibilidade da fonte de corpo.</p> },
            { id: "detalhes", label: "Detalhes", content: <p className="ms-text-sm">Segunda aba.</p> },
            { id: "historico", label: "Histórico", content: <p className="ms-text-sm">Terceira aba.</p> },
          ]}
        />
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center", marginTop: 16 }}>
          <StepIndicator current={passo} total={4} onChange={setPasso} />
          <Pagination page={pag} totalPages={12} onChange={setPag} />
        </div>
      </Card>

      <div style={grid}>
        <Alert title="Info.">Mensagem neutra do sistema, com o accent do tema.</Alert>
        <Alert tone="success" title="Pronto.">Alterações salvas.</Alert>
        <Alert tone="danger" title="Erro.">Não foi possível enviar o formulário.</Alert>
        <Alert tone="highlight" title="Atenção.">Seu plano vence em 3 dias.</Alert>
      </div>

      <StatGrid>
        <StatTile label="Visitas no mês" value="34k" trend="up" delta="21% vs. mês anterior" sparkline={[12, 18, 15, 24, 22, 30, 28, 34]} slot={1} />
        <StatTile label="Leads gerados" value="20k" trend="down" delta="9% vs. mês anterior" sparkline={[8, 10, 14, 12, 18, 16, 22, 20]} slot={2} />
        <StatTile label="Projetos ativos" value="27" trend="flat" delta="estável" sparkline={[25, 26, 24, 27, 27, 26, 27, 27]} slot={3} />
      </StatGrid>

      <Table<Pessoa>
        rows={PESSOAS}
        rowKey={(r) => r.id}
        status={(r) => ST[r.st]}
        onEdit={() => {}}
        onDelete={() => {}}
        columns={[
          { key: "nome", header: "Nome", sortable: true, sortValue: (r) => r.nome, cell: (r) => r.nome },
          { key: "email", header: "E-mail", cell: (r) => r.email },
          { key: "cargo", header: "Cargo", cell: (r) => r.cargo },
        ]}
      />

      <Card title="Texto corrido">
        <p>
          Um parágrafo longo no tamanho de corpo, para ver como a fonte se comporta numa leitura de verdade e não só num
          título. O Mothership DS nasceu de uma landing page em HTML e CSS puro, e os tokens vêm daquele CSS original.
          Números e pontuação também contam: 0123456789, R$ 1.234,56 — (parênteses), "aspas" e reticências…
        </p>
      </Card>
    </div>
  );
}

/* ---------- barra flutuante ---------- */

function App() {
  const [estado, setEstado] = React.useState(lerUrl);
  const tema = TEMAS.find((t) => t.id === estado.tema) ?? TEMAS[0];
  const ehPaper = tema.id.startsWith("paper");
  const ehFlat = tema.id.startsWith("flat");

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", tema.classe === "light");
    root.classList.toggle("darker", tema.classe === "darker");
    root.dataset.pTema = tema.id;
    for (const k of Object.keys(OPCOES_PAPER)) root.dataset[`p${k[0].toUpperCase()}${k.slice(1)}`] = estado[k];
    root.dataset.pPapel = "quad-aquarela";
    root.dataset.pSepara = estado.separa;
    aplicarRabiscos(estado.preench);
    history.replaceState(null, "", `?${new URLSearchParams(estado)}`);
  }, [estado, tema]);

  const passo = React.useCallback((d: number) => {
    setEstado((e) => {
      const i = TEMAS.findIndex((t) => t.id === e.tema);
      return { ...e, tema: TEMAS[(i + d + TEMAS.length) % TEMAS.length].id };
    });
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (alvo.closest("input, textarea, [contenteditable], [role=tablist], [role=combobox], .ms-pagination")) return;
      if (e.key === "ArrowLeft") passo(-1);
      if (e.key === "ArrowRight") passo(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [passo]);

  const chave = JSON.stringify(estado);
  return (
    <>
      <LivingBackground />
      <Amostra chave={chave} />
      <div className="p-bar" role="toolbar" aria-label="Protótipo: variantes">
        <div className="p-grupo">
          <button type="button" onClick={() => passo(-1)} aria-label="Tema anterior">←</button>
          <span className="p-label">{tema.nome}</span>
          <button type="button" onClick={() => passo(1)} aria-label="Próximo tema">→</button>
        </div>
        {ehFlat && (
          <div className="p-grupo">
            <span>Separação</span>
            {[
              { id: "borda", nome: "Só borda" },
              { id: "tom", nome: "Só tom" },
              { id: "ambos", nome: "Tom + borda fraca" },
            ].map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={estado.separa === o.id}
                onClick={() => setEstado((e) => ({ ...e, separa: o.id }))}
              >
                {o.nome}
              </button>
            ))}
          </div>
        )}
        {ehPaper &&
          Object.entries(OPCOES_PAPER).map(([k, g]) => (
            <div className="p-grupo" key={k}>
              <span>{g.rotulo}</span>
              {g.itens.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  aria-pressed={estado[k] === o.id}
                  onClick={() => setEstado((e) => ({ ...e, [k]: o.id }))}
                >
                  {o.nome}
                </button>
              ))}
            </div>
          ))}
      </div>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
