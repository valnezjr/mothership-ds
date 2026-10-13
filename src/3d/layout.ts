/* ============================================================
   layoutForca3D — posições de um grafo em 3D por forças
   (Fruchterman-Reingold), escrito à mão e determinístico: a mesma
   entrada dá sempre o mesmo desenho, sem Math.random. Os nós começam
   numa esfera de Fibonacci, na ordem em que chegam. Funciona bem até
   algumas centenas de nós (custo quadrático por iteração).
   Puro: sem three.js, sem DOM — roda e é testado em Node.
   ============================================================ */

export interface NoLayout {
  id: string;
}

export interface ArestaLayout {
  origem: string;
  destino: string;
}

export type Posicao = [number, number, number];

export interface OpcoesLayout {
  /** Raio da esfera em que o resultado é encaixado. Padrão 10. */
  raio?: number;
  /** Iterações de força. Padrão 300. */
  iteracoes?: number;
}

const PHI = Math.PI * (3 - Math.sqrt(5)); // ângulo dourado
/**
 * Puxão ao centro. Fraco demais, as notas sem ligação fogem para a borda e, como o resultado
 * é encaixado pelo nó mais distante, espremem o núcleo ligado num ponto (medido num vault real
 * com 29% de órfãs: núcleo a 1/10 do raio com 0.01, a 1/2 com 0.4).
 */
const GRAVIDADE = 0.4;

function esferaDeFibonacci(n: number, raio: number): Posicao[] {
  if (n === 1) return [[0, 0, 0]];
  const pontos: Posicao[] = [];
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = PHI * i;
    pontos.push([Math.cos(t) * r * raio, y * raio, Math.sin(t) * r * raio]);
  }
  return pontos;
}

export function layoutForca3D(
  nos: NoLayout[],
  arestas: ArestaLayout[],
  opcoes: OpcoesLayout = {},
): Map<string, Posicao> {
  const raio = opcoes.raio ?? 10;
  const iteracoes = opcoes.iteracoes ?? 300;
  const n = nos.length;
  const resultado = new Map<string, Posicao>();
  if (n === 0) return resultado;

  const indice = new Map(nos.map((no, i) => [no.id, i]));
  const pares: [number, number][] = [];
  for (const a of arestas) {
    const i = indice.get(a.origem);
    const j = indice.get(a.destino);
    if (i !== undefined && j !== undefined && i !== j) pares.push([i, j]);
  }

  const pos = esferaDeFibonacci(n, raio);
  // Distância ideal entre nós para o volume da esfera.
  const k = Math.cbrt(((4 / 3) * Math.PI * raio ** 3) / n);
  let temperatura = raio / 2;
  const resfriamento = temperatura / (iteracoes + 1);
  const desloc: Posicao[] = Array.from({ length: n }, () => [0, 0, 0]);

  for (let passo = 0; passo < iteracoes; passo++) {
    for (const d of desloc) d.fill(0);

    // Repulsão entre todos os pares.
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const pi = pos[i]!;
        const pj = pos[j]!;
        let dx = pi[0] - pj[0];
        let dy = pi[1] - pj[1];
        let dz = pi[2] - pj[2];
        let dist = Math.hypot(dx, dy, dz);
        if (dist < 1e-6) {
          // Nós sobrepostos: separa numa direção fixa, derivada dos índices.
          dx = ((i % 3) - 1) * 1e-3;
          dy = ((j % 3) - 1) * 1e-3;
          dz = 1e-3;
          dist = Math.hypot(dx, dy, dz);
        }
        const f = (k * k) / dist;
        const fx = (dx / dist) * f;
        const fy = (dy / dist) * f;
        const fz = (dz / dist) * f;
        desloc[i]![0] += fx;
        desloc[i]![1] += fy;
        desloc[i]![2] += fz;
        desloc[j]![0] -= fx;
        desloc[j]![1] -= fy;
        desloc[j]![2] -= fz;
      }
    }

    // Atração ao longo das arestas.
    for (const [i, j] of pares) {
      const pi = pos[i]!;
      const pj = pos[j]!;
      const dx = pi[0] - pj[0];
      const dy = pi[1] - pj[1];
      const dz = pi[2] - pj[2];
      const dist = Math.max(Math.hypot(dx, dy, dz), 1e-6);
      const f = (dist * dist) / k;
      const fx = (dx / dist) * f;
      const fy = (dy / dist) * f;
      const fz = (dz / dist) * f;
      desloc[i]![0] -= fx;
      desloc[i]![1] -= fy;
      desloc[i]![2] -= fz;
      desloc[j]![0] += fx;
      desloc[j]![1] += fy;
      desloc[j]![2] += fz;
    }

    // Puxão ao centro: componentes soltos e órfãs ficam em volta do núcleo, não longe dele.
    for (let i = 0; i < n; i++) {
      const p = pos[i]!;
      desloc[i]![0] -= p[0] * GRAVIDADE * k;
      desloc[i]![1] -= p[1] * GRAVIDADE * k;
      desloc[i]![2] -= p[2] * GRAVIDADE * k;
    }

    // Move limitado pela temperatura, que esfria a cada passo.
    for (let i = 0; i < n; i++) {
      const d = desloc[i]!;
      const tamanho = Math.hypot(d[0], d[1], d[2]);
      if (tamanho < 1e-9) continue;
      const passoMax = Math.min(tamanho, temperatura);
      const p = pos[i]!;
      p[0] += (d[0] / tamanho) * passoMax;
      p[1] += (d[1] / tamanho) * passoMax;
      p[2] += (d[2] / tamanho) * passoMax;
    }
    temperatura -= resfriamento;
  }

  // Centraliza e encaixa no raio pedido.
  const centro: Posicao = [0, 0, 0];
  for (const p of pos) {
    centro[0] += p[0] / n;
    centro[1] += p[1] / n;
    centro[2] += p[2] / n;
  }
  let maior = 0;
  for (const p of pos) {
    p[0] -= centro[0];
    p[1] -= centro[1];
    p[2] -= centro[2];
    maior = Math.max(maior, Math.hypot(p[0], p[1], p[2]));
  }
  const escala = maior > 1e-9 ? raio / maior : 1;
  nos.forEach((no, i) => {
    const p = pos[i]!;
    resultado.set(no.id, [p[0] * escala, p[1] * escala, p[2] * escala]);
  });
  return resultado;
}
