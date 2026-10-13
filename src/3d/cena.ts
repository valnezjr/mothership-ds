/* ============================================================
   CenaGrafo — o motor imperativo do Grafo3D, em three.js puro
   (sem react-three-fiber: assim o componente serve a React 18 e 19).
   Segue docs/3d.md: cor sempre lida dos tokens (getComputedStyle) e
   convertida uma vez para o espaço linear de trabalho; o sinal (nó em
   foco) ignora a luz da cena (MeshBasicMaterial). O movimento repete o
   LivingBackground: interpolação amortecida por quadro, nunca salto.
   ============================================================ */

import * as THREE from "three";
import { layoutForca3D } from "./layout";

export type SlotGrafo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface NoCena {
  id: string;
  rotulo: string;
  grupo: string;
  peso?: number;
}
export interface ArestaCena {
  origem: string;
  destino: string;
}
export interface GrupoCena {
  id: string;
  rotulo: string;
  slot: SlotGrafo;
}

/** Slots 1–4: cores de dados (validadas para daltonismo). 5–8: cores de marca, para mais grupos. */
const TOKEN_DO_SLOT: Record<SlotGrafo, string> = {
  1: "--chart-1",
  2: "--chart-2",
  3: "--chart-3",
  4: "--chart-4",
  5: "--color-accent",
  6: "--color-violet",
  7: "--color-pink",
  8: "--color-orange",
};

interface Retornos {
  aoPassar: (id: string | null) => void;
  aoSelecionar: (id: string | null) => void;
}

const RAIO_LAYOUT = 10;
const MAX_ROTULOS = 18;
/** Distância da câmera na visão geral: o grafo inteiro cabe no campo de visão de 50°. */
const RAIO_GERAL = RAIO_LAYOUT * 2.4;
/** Respiração da malha: amplitude (unidades de cena) e períodos (s) de cada eixo. */
const RESPIRO = 0.22;
const PERIODOS = [5.3, 6.7, 7.9];
/** Anéis do filtro: espaço por nó na circunferência e folga entre anéis. */
const ESPACO_NO_ANEL = 1.9;
const FOLGA_ANEIS = 2.2;

/** Avalia uma cubic-bezier CSS (x1, y1, x2, y2) em t, por bisseção em x. */
function bezier(curva: [number, number, number, number], t: number) {
  const [x1, y1, x2, y2] = curva;
  const c = (a: number, b: number, s: number) =>
    3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  let lo = 0;
  let hi = 1;
  let s = t;
  for (let i = 0; i < 20; i++) {
    s = (lo + hi) / 2;
    if (c(x1, x2, s) < t) lo = s;
    else hi = s;
  }
  return c(y1, y2, s);
}

function lerCurva(valor: string): [number, number, number, number] {
  const m = /cubic-bezier\(([^)]+)\)/.exec(valor);
  const n = m?.[1]?.split(",").map((x) => Number(x.trim()));
  return n && n.length === 4 && n.every(Number.isFinite)
    ? (n as [number, number, number, number])
    : [0.34, 1, 0.64, 1];
}

export class CenaGrafo {
  private renderer: THREE.WebGLRenderer;
  private cena = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(50, 1, 0.1, 500);
  private raycaster = new THREE.Raycaster();
  private nosMesh: THREE.InstancedMesh | null = null;
  private linhas: THREE.LineSegments | null = null;
  private quadro = 0;
  private ultimo = 0;
  private observadorTamanho: ResizeObserver;

  // Dados
  private nos: NoCena[] = [];
  private arestas: [number, number][] = [];
  /** Lugar de descanso dado pelo layout. */
  private posicoes: THREE.Vector3[] = [];
  /** Onde o nó está agora, a caminho do lugar pedido (layout ou anel do filtro). */
  private atual: THREE.Vector3[] = [];
  /** O que se desenha: `atual` mais a respiração. Rótulos, arestas e clique leem daqui. */
  private exibida: THREE.Vector3[] = [];
  private fase: [number, number, number][] = [];
  private grupoDoNo: string[] = [];
  private vizinhos: Set<number>[] = [];
  private corDoNo: THREE.Color[] = [];
  private corDoNoSlot: string[] = [];
  private maisPesados: number[] = [];
  private raioDoNo: number[] = [];
  private indice = new Map<string, number>();
  private rotulos: HTMLDivElement[] = [];

  // Estado de interação
  private passando: number | null = null;
  private selecionado: number | null = null;
  private destaque = new Set<number>();
  private filtro: string[] = [];
  /** Para cada nó filtrado: [raio do anel, ângulo]. */
  private noAnel = new Map<number, [number, number]>();
  private raioExterno = 0;
  private arrastando = false;
  private moveu = 0;
  private ultimoPonteiro = { x: 0, y: 0 };
  private ponteiro = new THREE.Vector2(9, 9); // fora da tela até o mouse entrar
  private parallax = new THREE.Vector2(0, 0);
  private parallaxDesejado = new THREE.Vector2(0, 0);

  // Câmera em coordenadas esféricas em volta do alvo
  private theta = 0.6;
  private phi = 1.15;
  private raio = RAIO_GERAL;
  private raioDesejado = RAIO_GERAL;
  private alvo = new THREE.Vector3();
  private viagem: {
    de: THREE.Vector3;
    para: THREE.Vector3;
    raioDe: number;
    raioPara: number;
    /** Giro da órbita durante a viagem (zero quando a câmera só se aproxima). */
    thetaDe: number;
    thetaGiro: number;
    phiDe: number;
    phiPara: number;
    inicio: number;
    duracao: number;
  } | null = null;

  // Tokens
  private corFundo = new THREE.Color();
  private corTexto = new THREE.Color();
  private corAcento = new THREE.Color();
  private coresSlot = new Map<string, THREE.Color>();
  private curva: [number, number, number, number] = [0.34, 1, 0.64, 1];
  private duracaoViagem = 450;

  constructor(
    private readonly caixa: HTMLElement,
    private readonly camadaRotulos: HTMLElement,
    private readonly retornos: Retornos,
    private readonly reduzido: boolean,
  ) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    caixa.appendChild(this.renderer.domElement);
    this.cena.fog = new THREE.Fog(0x000000, 20, 60);

    for (let i = 0; i < MAX_ROTULOS; i++) {
      const r = document.createElement("div");
      r.className = "ms-grafo3d__rotulo";
      r.style.opacity = "0";
      this.camadaRotulos.appendChild(r);
      this.rotulos.push(r);
    }

    const tela = this.renderer.domElement;
    tela.addEventListener("pointerdown", this.aoApertar);
    tela.addEventListener("pointermove", this.aoMover);
    tela.addEventListener("pointerleave", this.aoSair);
    window.addEventListener("pointerup", this.aoSoltar);
    tela.addEventListener("wheel", this.aoRolar, { passive: false });

    this.observadorTamanho = new ResizeObserver(() => this.redimensionar());
    this.observadorTamanho.observe(caixa);
    this.relerTema();
    this.redimensionar();
    this.quadro = requestAnimationFrame(this.tick);
  }

  /** Lê os tokens do DS (no escopo da caixa, que herda o tema) e repinta. */
  relerTema() {
    const estilo = getComputedStyle(this.caixa);
    // setStyle trata a entrada como sRGB e converte para o espaço linear de trabalho:
    // é a conversão única pedida em docs/3d.md.
    const ler = (token: string, alvo = new THREE.Color()) =>
      alvo.setStyle(estilo.getPropertyValue(token).trim() || "#888888");
    ler("--bg-base", this.corFundo);
    ler("--color-text", this.corTexto);
    ler("--color-accent", this.corAcento);
    (this.cena.fog as THREE.Fog).color.copy(this.corFundo);
    for (const [slot, token] of Object.entries(TOKEN_DO_SLOT)) {
      this.coresSlot.set(slot, ler(token));
    }
    this.curva = lerCurva(estilo.getPropertyValue("--ease-spatial"));
    const duracao = parseFloat(estilo.getPropertyValue("--transition-spatial"));
    this.duracaoViagem = Number.isFinite(duracao) ? duracao * 1000 : 450;
    this.pintar();
  }

  definirDados(nos: NoCena[], arestas: ArestaCena[], grupos: GrupoCena[]) {
    const selecionadoId = this.selecionado !== null ? this.nos[this.selecionado]?.id : null;
    // Atualização ao vivo: quem já existia sai de onde está, sem salto; nó novo nasce no layout.
    const anteriores = new Map(this.nos.map((n, i) => [n.id, this.atual[i]]).filter((e): e is [string, THREE.Vector3] => !!e[1]));
    this.nos = nos;
    this.indice = new Map(nos.map((n, i) => [n.id, i]));
    this.arestas = [];
    this.vizinhos = nos.map(() => new Set<number>());
    const vistos = new Set<string>();
    for (const a of arestas) {
      const i = this.indice.get(a.origem);
      const j = this.indice.get(a.destino);
      if (i === undefined || j === undefined || i === j) continue;
      const chave = i < j ? `${i}|${j}` : `${j}|${i}`;
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      this.arestas.push([i, j]);
      this.vizinhos[i]!.add(j);
      this.vizinhos[j]!.add(i);
    }
    const layout = layoutForca3D(nos, arestas, { raio: RAIO_LAYOUT });
    this.posicoes = nos.map((n) => new THREE.Vector3(...(layout.get(n.id) ?? [0, 0, 0])));
    this.atual = nos.map((n, i) => (anteriores.get(n.id) ?? this.posicoes[i]!).clone());
    this.exibida = this.atual.map((p) => p.clone());
    // Fases determinísticas (ângulo dourado): cada nó respira no seu tempo, sem Math.random.
    this.fase = nos.map((_, i) => [i * 2.39996, i * 2.39996 * 2 + 1, i * 2.39996 * 3 + 2]);
    this.grupoDoNo = nos.map((n) => n.grupo);
    this.maisPesados = nos
      .map((n, i) => [i, n.peso ?? this.vizinhos[i]!.size] as const)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([i]) => i);
    const slotDoGrupo = new Map(grupos.map((g) => [g.id, String(g.slot)]));
    this.corDoNo = nos.map((n) => this.coresSlot.get(slotDoGrupo.get(n.grupo) ?? "1") ?? new THREE.Color(0x888888));
    this.corDoNoSlot = nos.map((n) => slotDoGrupo.get(n.grupo) ?? "1");

    // Nós: um InstancedMesh, raio pelo peso (padrão: número de ligações).
    if (this.nosMesh) {
      this.cena.remove(this.nosMesh);
      this.nosMesh.geometry.dispose();
      (this.nosMesh.material as THREE.Material).dispose();
    }
    const geometria = new THREE.SphereGeometry(1, 20, 14);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mesh = new THREE.InstancedMesh(geometria, material, Math.max(nos.length, 1));
    mesh.count = nos.length;
    const matriz = new THREE.Matrix4();
    nos.forEach((n, i) => {
      const peso = n.peso ?? this.vizinhos[i]!.size;
      const r = 0.24 + Math.min(Math.sqrt(peso), 6) * 0.1;
      this.raioDoNo[i] = r;
      matriz.makeScale(r, r, r).setPosition(this.posicoes[i]!);
      mesh.setMatrixAt(i, matriz);
      mesh.setColorAt(i, this.corDoNo[i]!);
    });
    mesh.instanceMatrix.needsUpdate = true;
    // Os nós se movem a cada quadro: a esfera de colisão é fixa e larga, e nada é recortado.
    mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(), RAIO_LAYOUT * 8);
    mesh.frustumCulled = false;
    this.nosMesh = mesh;
    this.cena.add(mesh);

    // Arestas: LineSegments com cor por vértice.
    if (this.linhas) {
      this.cena.remove(this.linhas);
      this.linhas.geometry.dispose();
      (this.linhas.material as THREE.Material).dispose();
    }
    const pontos = new Float32Array(this.arestas.length * 6);
    this.arestas.forEach(([i, j], k) => {
      this.posicoes[i]!.toArray(pontos, k * 6);
      this.posicoes[j]!.toArray(pontos, k * 6 + 3);
    });
    const geoLinhas = new THREE.BufferGeometry();
    geoLinhas.setAttribute("position", new THREE.BufferAttribute(pontos, 3));
    geoLinhas.setAttribute("color", new THREE.BufferAttribute(new Float32Array(pontos.length), 3));
    this.linhas = new THREE.LineSegments(
      geoLinhas,
      new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55 }),
    );
    this.linhas.frustumCulled = false;
    this.cena.add(this.linhas);
    this.calcularAneis();

    // Mantém a seleção se o nó continua existindo (atualização ao vivo sem perder a câmera).
    this.selecionado = selecionadoId ? (this.indice.get(selecionadoId) ?? null) : null;
    this.passando = null;
    this.pintar();
  }

  definirSelecao(id: string | null) {
    const i = id ? (this.indice.get(id) ?? null) : null;
    if (i === this.selecionado) return;
    this.selecionado = i;
    if (i !== null) this.viajar(this.atual[i]!, RAIO_LAYOUT * 1.3, true);
    else this.viajar(new THREE.Vector3(), this.raioDaVisaoGeral());
    this.pintar();
  }

  /** Grupos filtrados, na ordem dos anéis: o primeiro é o de dentro. */
  definirFiltro(grupos: string[]) {
    if (grupos.join("|") === this.filtro.join("|")) return;
    this.filtro = grupos;
    this.calcularAneis();
    if (this.selecionado === null) this.viajar(new THREE.Vector3(), this.raioDaVisaoGeral());
    this.pintar();
  }

  private raioDaVisaoGeral() {
    // Com filtro, recua até os de fora (afastados para além do anel) caberem sem encostar na lente.
    return this.noAnel.size ? Math.max(RAIO_GERAL, (this.raioExterno + 2 + RAIO_LAYOUT * 0.7) * 1.6) : RAIO_GERAL;
  }

  /** Um anel por grupo filtrado, concêntricos, cada um com o tamanho que seus nós pedem. */
  private calcularAneis() {
    this.noAnel = new Map();
    this.raioExterno = 0;
    let anterior = 0;
    for (const grupo of this.filtro) {
      const membros = this.grupoDoNo.flatMap((g, i) => (g === grupo ? [i] : []));
      if (!membros.length) continue;
      const pedido = Math.max(2.6, (membros.length * ESPACO_NO_ANEL) / (2 * Math.PI));
      const raio = anterior ? Math.max(anterior + FOLGA_ANEIS, pedido) : pedido;
      // Cada anel começa num ângulo diferente, para os nós não se alinharem em raios.
      const giro = this.filtro.indexOf(grupo) * 0.7;
      membros.forEach((i, j) => this.noAnel.set(i, [raio, giro + (2 * Math.PI * j) / membros.length]));
      anterior = raio;
      this.raioExterno = raio;
    }
  }

  definirDestaque(ids: string[]) {
    this.destaque = new Set(ids.map((id) => this.indice.get(id)).filter((i): i is number => i !== undefined));
    this.pintar();
  }

  /**
   * Leva a câmera até `para`. Com `deFora`, ela também gira até chegar pelo lado de fora do
   * grafo (alinhada com o centro e o nó), para as outras notas ficarem atrás, não na frente.
   */
  private viajar(para: THREE.Vector3, raioPara: number, deFora = false) {
    let thetaPara = this.theta;
    let phiPara = this.phi;
    const dist = para.length();
    if (deFora && dist > RAIO_LAYOUT * 0.15) {
      thetaPara = Math.atan2(para.x, para.z);
      phiPara = Math.min(Math.max(Math.acos(para.y / dist), 0.35), Math.PI - 0.35);
    }
    // Pelo caminho mais curto em volta do grafo.
    const giro = ((((thetaPara - this.theta + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
    if (this.reduzido) {
      this.alvo.copy(para);
      this.raio = this.raioDesejado = raioPara;
      this.theta += giro;
      this.phi = phiPara;
      this.viagem = null;
      return;
    }
    this.viagem = {
      de: this.alvo.clone(),
      para: para.clone(),
      raioDe: this.raio,
      raioPara,
      thetaDe: this.theta,
      thetaGiro: giro,
      phiDe: this.phi,
      phiPara,
      inicio: performance.now(),
      // Meia volta em 0.45s seria um tranco: o giro grande alonga a viagem até o dobro.
      duracao: this.duracaoViagem * (1 + Math.max(Math.abs(giro), Math.abs(phiPara - this.phi)) / Math.PI),
    };
    this.raioDesejado = raioPara;
  }

  /** O conjunto em foco: o nó sob o mouse ou o selecionado, mais os vizinhos dele. */
  /**
   * O que fica aceso: sob o mouse, o nó e os vizinhos; senão o destaque (com o selecionado),
   * que vence a seleção para um caminho destacado continuar visível com a câmera no destino;
   * senão o selecionado e os vizinhos; senão os nós do filtro.
   */
  private emFoco(): Set<number> | null {
    if (this.passando !== null) return new Set([this.passando, ...this.vizinhos[this.passando]!]);
    if (this.destaque.size) {
      return this.selecionado === null ? this.destaque : new Set([...this.destaque, this.selecionado]);
    }
    if (this.selecionado !== null) return new Set([this.selecionado, ...this.vizinhos[this.selecionado]!]);
    return this.noAnel.size ? new Set(this.noAnel.keys()) : null;
  }

  private pintar() {
    if (!this.nosMesh || !this.linhas) return;
    // Recolore a partir dos tokens atuais (o tema pode ter mudado).
    this.corDoNo = this.corDoNoSlot.map((s) => this.coresSlot.get(s) ?? new THREE.Color(0x888888));
    const foco = this.emFoco();
    const cor = new THREE.Color();
    this.nos.forEach((_, i) => {
      cor.copy(this.corDoNo[i]!);
      if (foco && !foco.has(i)) cor.lerp(this.corFundo, 0.78);
      if (i === this.selecionado) cor.lerp(this.corTexto, 0.25);
      this.nosMesh!.setColorAt(i, cor);
    });
    if (this.nosMesh.instanceColor) this.nosMesh.instanceColor.needsUpdate = true;

    const cores = this.linhas.geometry.getAttribute("color") as THREE.BufferAttribute;
    const base = this.corTexto.clone().lerp(this.corFundo, 0.7);
    const apagada = this.corTexto.clone().lerp(this.corFundo, 0.93);
    // No filtro puro, a ligação de um nó de fora com o anel continua visível.
    const soFiltro = this.passando === null && this.selecionado === null && !this.destaque.size;
    this.arestas.forEach(([i, j], k) => {
      const acesa = foco ? foco.has(i) && foco.has(j) : true;
      const meia = foco !== null && soFiltro && (foco.has(i) || foco.has(j));
      const c = foco ? (acesa ? this.corAcento : meia ? base : apagada) : base;
      cores.setXYZ(k * 2, c.r, c.g, c.b);
      cores.setXYZ(k * 2 + 1, c.r, c.g, c.b);
    });
    cores.needsUpdate = true;
  }

  private redimensionar() {
    const { clientWidth: w, clientHeight: h } = this.caixa;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  private tick = (agora: number) => {
    this.quadro = requestAnimationFrame(this.tick);
    const dt = Math.min((agora - (this.ultimo || agora)) / 1000, 0.05);
    this.ultimo = agora;

    // Deriva lenta quando ninguém mexe (desligada com movimento reduzido).
    if (!this.reduzido && !this.arrastando && this.passando === null) this.theta += dt * 0.05;

    if (this.viagem) {
      const t = Math.min((agora - this.viagem.inicio) / this.viagem.duracao, 1);
      const e = bezier(this.curva, t);
      this.alvo.lerpVectors(this.viagem.de, this.viagem.para, e);
      this.raio = this.viagem.raioDe + (this.viagem.raioPara - this.viagem.raioDe) * e;
      this.theta = this.viagem.thetaDe + this.viagem.thetaGiro * e;
      this.phi = this.viagem.phiDe + (this.viagem.phiPara - this.viagem.phiDe) * e;
      if (t >= 1) this.viagem = null;
    } else {
      const k = 1 - Math.exp(-dt * 6);
      this.raio += (this.raioDesejado - this.raio) * k;
      // O nó selecionado pode estar indo para um anel: a câmera vai junto.
      if (this.selecionado !== null) {
        const alvoNo = this.atual[this.selecionado];
        if (alvoNo) this.alvo.lerp(alvoNo, this.reduzido ? 1 : 1 - Math.exp(-dt * 4));
      }
    }

    // Parallax: o ponteiro desloca o olhar de leve, com amortecimento.
    if (!this.reduzido) this.parallax.lerp(this.parallaxDesejado, 1 - Math.exp(-dt * 4));

    const sinPhi = Math.sin(this.phi);
    const pos = new THREE.Vector3(
      this.raio * sinPhi * Math.sin(this.theta),
      this.raio * Math.cos(this.phi),
      this.raio * sinPhi * Math.cos(this.theta),
    ).add(this.alvo);
    const direita = new THREE.Vector3().subVectors(pos, this.alvo).cross(this.camera.up).normalize();
    const olhar = this.alvo
      .clone()
      .addScaledVector(direita, this.parallax.x * 1.2)
      .addScaledVector(this.camera.up, this.parallax.y * 0.8);
    this.camera.position.copy(pos);
    this.camera.lookAt(olhar);
    const fog = this.cena.fog as THREE.Fog;
    fog.near = this.raio * 0.6;
    fog.far = this.raio + RAIO_LAYOUT * 2.2;

    this.moverNos(dt, agora / 1000);
    this.encolherPertoDaLente();
    this.atualizarRotulos();
    this.renderer.render(this.cena, this.camera);
  };

  /**
   * Leva cada nó rumo ao seu lugar (layout, ou anel quando há filtro) e soma a respiração.
   * Os anéis ficam sempre de frente para a câmera: a base sai dos ângulos da órbita.
   */
  private moverNos(dt: number, t: number) {
    const k = this.reduzido ? 1 : 1 - Math.exp(-dt * 3.5);
    const frente = new THREE.Vector3(
      Math.sin(this.phi) * Math.sin(this.theta),
      Math.cos(this.phi),
      Math.sin(this.phi) * Math.cos(this.theta),
    );
    const direita = new THREE.Vector3().crossVectors(this.camera.up, frente).normalize();
    const cima = new THREE.Vector3().crossVectors(frente, direita);
    const destino = new THREE.Vector3();
    const afastar = this.raioExterno + 2;
    this.atual.forEach((atual, i) => {
      const base = this.posicoes[i]!;
      const anel = this.noAnel.get(i);
      if (anel) {
        const [raio, angulo] = anel;
        destino
          .copy(direita)
          .multiplyScalar(Math.cos(angulo) * raio)
          .addScaledVector(cima, Math.sin(angulo) * raio);
      } else if (this.noAnel.size) {
        // Os de fora abrem espaço: mesma direção do layout, empurrados para além do anel externo.
        const dist = base.length();
        if (dist > 1e-6) destino.copy(base).multiplyScalar((afastar + dist * 0.7) / dist);
        else destino.copy(direita).multiplyScalar(afastar);
      } else {
        destino.copy(base);
      }
      atual.lerp(destino, k);
      const exibida = this.exibida[i]!.copy(atual);
      if (!this.reduzido) {
        const [f1, f2, f3] = this.fase[i]!;
        exibida.x += Math.sin((t * 2 * Math.PI) / PERIODOS[0]! + f1) * RESPIRO;
        exibida.y += Math.sin((t * 2 * Math.PI) / PERIODOS[1]! + f2) * RESPIRO;
        exibida.z += Math.sin((t * 2 * Math.PI) / PERIODOS[2]! + f3) * RESPIRO;
      }
    });
    if (this.linhas) {
      const pontos = this.linhas.geometry.getAttribute("position") as THREE.BufferAttribute;
      this.arestas.forEach(([i, j], n) => {
        const a = this.exibida[i]!;
        const b = this.exibida[j]!;
        pontos.setXYZ(n * 2, a.x, a.y, a.z);
        pontos.setXYZ(n * 2 + 1, b.x, b.y, b.z);
      });
      pontos.needsUpdate = true;
    }
  }

  /** Nó quase encostado na câmera encolhe até sumir, em vez de virar uma bola que tapa a tela. */
  private encolherPertoDaLente() {
    if (!this.nosMesh) return;
    const matriz = new THREE.Matrix4();
    const perto = 1.5;
    const longe = 5;
    this.exibida.forEach((p, i) => {
      const d = this.camera.position.distanceTo(p);
      const t = Math.min(Math.max((d - perto) / (longe - perto), 0), 1);
      // Nunca zero: matriz singular atrapalha o raycast.
      const r = Math.max(this.raioDoNo[i]! * t * t * (3 - 2 * t), 1e-4);
      matriz.makeScale(r, r, r).setPosition(p);
      this.nosMesh!.setMatrixAt(i, matriz);
    });
    this.nosMesh.instanceMatrix.needsUpdate = true;
  }

  private atualizarRotulos() {
    const visiveis = new Set<number>();
    if (this.selecionado !== null) {
      visiveis.add(this.selecionado);
      for (const v of this.vizinhos[this.selecionado]!) visiveis.add(v);
    }
    if (this.passando !== null) visiveis.add(this.passando);
    for (const d of this.destaque) visiveis.add(d);
    // Sem seleção, ganham nome os do filtro ou, sem filtro, os de maior peso.
    if (this.selecionado === null) {
      for (const i of this.noAnel.size ? this.noAnel.keys() : this.maisPesados) visiveis.add(i);
    }
    // Os fortes (selecionado, sob o mouse) vêm primeiro para nunca perderem a vez.
    const forte = (i: number) => i === this.selecionado || i === this.passando;
    const lista = [...visiveis].sort((a, b) => Number(forte(b)) - Number(forte(a))).slice(0, MAX_ROTULOS);
    const ocupados: { x0: number; x1: number; y: number }[] = [];
    const { clientWidth: w, clientHeight: h } = this.caixa;
    const p = new THREE.Vector3();
    this.rotulos.forEach((r, k) => {
      const i = lista[k];
      if (i === undefined) {
        r.style.opacity = "0";
        return;
      }
      p.copy(this.exibida[i]!).project(this.camera);
      if (p.z > 1 || p.z < -1) {
        r.style.opacity = "0";
        return;
      }
      const x = (p.x * 0.5 + 0.5) * w;
      const y = (-p.y * 0.5 + 0.5) * h;
      const distancia = this.camera.position.distanceTo(this.exibida[i]!);
      const fog = this.cena.fog as THREE.Fog;
      const nevoa = Math.min(Math.max((distancia - fog.near) / (fog.far - fog.near), 0), 1);
      if (r.textContent !== this.nos[i]!.rotulo) r.textContent = this.nos[i]!.rotulo;
      // Rótulo fraco que cairia em cima de outro já posto fica escondido.
      const meia = r.offsetWidth / 2;
      const caixa = { x0: x - meia, x1: x + meia, y };
      if (!forte(i) && ocupados.some((o) => o.x0 < caixa.x1 && caixa.x0 < o.x1 && Math.abs(o.y - y) < 20)) {
        r.style.opacity = "0";
        return;
      }
      ocupados.push(caixa);
      r.dataset.forte = forte(i) ? "1" : "";
      r.style.transform = `translate(-50%, -140%) translate(${x}px, ${y}px)`;
      r.style.opacity = String(forte(i) ? 1 : Math.max(0.15, 1 - nevoa) * 0.85);
    });
  }

  private alvoSobPonteiro(): number | null {
    if (!this.nosMesh || this.ponteiro.x > 1.5) return null;
    this.raycaster.setFromCamera(this.ponteiro, this.camera);
    const hit = this.raycaster.intersectObject(this.nosMesh, false)[0];
    return hit?.instanceId ?? null;
  }

  private aoApertar = (e: PointerEvent) => {
    this.arrastando = true;
    this.moveu = 0;
    this.ultimoPonteiro = { x: e.clientX, y: e.clientY };
    this.renderer.domElement.setPointerCapture(e.pointerId);
  };

  private aoMover = (e: PointerEvent) => {
    const caixa = this.renderer.domElement.getBoundingClientRect();
    this.ponteiro.set(
      ((e.clientX - caixa.left) / caixa.width) * 2 - 1,
      -((e.clientY - caixa.top) / caixa.height) * 2 + 1,
    );
    this.parallaxDesejado.set(this.ponteiro.x, this.ponteiro.y);
    if (this.arrastando) {
      const dx = e.clientX - this.ultimoPonteiro.x;
      const dy = e.clientY - this.ultimoPonteiro.y;
      this.moveu += Math.abs(dx) + Math.abs(dy);
      this.theta -= dx * 0.006;
      this.phi = Math.min(Math.max(this.phi - dy * 0.006, 0.25), Math.PI - 0.25);
      this.ultimoPonteiro = { x: e.clientX, y: e.clientY };
      return;
    }
    const alvo = this.alvoSobPonteiro();
    if (alvo !== this.passando) {
      this.passando = alvo;
      this.renderer.domElement.style.cursor = alvo === null ? "grab" : "pointer";
      this.retornos.aoPassar(alvo === null ? null : this.nos[alvo]!.id);
      this.pintar();
    }
  };

  private aoSoltar = () => {
    if (!this.arrastando) return;
    this.arrastando = false;
    if (this.moveu < 5) {
      const alvo = this.alvoSobPonteiro();
      this.retornos.aoSelecionar(alvo === null ? null : this.nos[alvo]!.id);
    }
  };

  private aoSair = () => {
    this.ponteiro.set(9, 9);
    this.parallaxDesejado.set(0, 0);
    if (this.passando !== null) {
      this.passando = null;
      this.retornos.aoPassar(null);
      this.pintar();
    }
  };

  private aoRolar = (e: WheelEvent) => {
    e.preventDefault();
    this.viagem = null;
    this.raioDesejado = Math.min(Math.max(this.raioDesejado * Math.exp(e.deltaY * 0.001), 6), 80);
  };

  destruir() {
    cancelAnimationFrame(this.quadro);
    this.observadorTamanho.disconnect();
    const tela = this.renderer.domElement;
    tela.removeEventListener("pointerdown", this.aoApertar);
    tela.removeEventListener("pointermove", this.aoMover);
    tela.removeEventListener("pointerleave", this.aoSair);
    window.removeEventListener("pointerup", this.aoSoltar);
    tela.removeEventListener("wheel", this.aoRolar);
    this.nosMesh?.geometry.dispose();
    (this.nosMesh?.material as THREE.Material | undefined)?.dispose();
    this.linhas?.geometry.dispose();
    (this.linhas?.material as THREE.Material | undefined)?.dispose();
    this.renderer.dispose();
    tela.remove();
    for (const r of this.rotulos) r.remove();
  }
}
