# Movimento

O movimento aqui não é enfeite: é parte da identidade. Três coisas
sustentam isso — um easing único que assina as microinterações, um fundo
que nunca fica completamente parado, e duas peças de marca (splash e
loader) construídas sobre a própria logo.

Tudo respeita `prefers-reduced-motion`.

## O easing do sistema

```css
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Um overshoot leve: o elemento passa um pouco do ponto e assenta. Ele
aparece no accordion, na entrada do modal, no deslize dos bullets do
carrossel, no contorno reativo, no nível do loader. Usar sempre o mesmo
easing é o que faz componentes muito diferentes parecerem da mesma
família.

## Fundo vivo

O fundo é uma cor base com quatro manchas de luz. O `LivingBackground`
anima duas camadas somadas:

**Deriva passiva.** Cada glow percorre uma órbita circular deformada por
harmônicos de frequências não múltiplas. A órbita garante velocidade
angular constante — o movimento nunca estagna, como aconteceria com
senos puros que ocasionalmente se alinham — e os harmônicos garantem que
nenhuma volta repita a anterior. Em paralelo, o tamanho de cada mancha
pulsa com dois harmônicos por eixo, o que produz a deformação orgânica de
cera de lava lamp.

**Parallax do mouse.** Por cima da deriva, o cursor soma um deslocamento
com suavização. Glows vizinhos usam direções opostas, o que cria uma
sensação de profundidade.

```tsx
<LivingBackground config={{
  1: { drift: 12, speed: 2.8, pulse: 0.24, amp: 4, dir: -1 },
  2: { drift: 18, speed: 3.2, pulse: 0.32, amp: 8, dir:  1 },
  3: { drift: 14, speed: 2.4, pulse: 0.26, amp: 5, dir:  1 },
  4: { drift: 16, speed: 2.6, pulse: 0.28, amp: 6, dir: -1 },
}} />
```

| Parâmetro | O que faz |
|---|---|
| `drift` | raio da órbita, em % da tela |
| `speed` | velocidade da deriva |
| `pulse` | fração da pulsação de tamanho |
| `amp` | amplitude da resposta ao mouse, em % |
| `dir` | `+1` acompanha o cursor, `−1` contraria |

O hook escreve nas variáveis `--bg-glow-N-pos` e `--bg-glow-N-size`, as
mesmas declaradas nos tokens. Ele lê as posições de origem **uma única
vez** e as guarda num ref: como o efeito escreve nas propriedades que
leria, reler depois de uma remontagem faria a origem derivar a cada
ciclo. No cleanup as propriedades inline são removidas, devolvendo o
fundo ao estado declarado no CSS.

## Splash

O roteiro tem três fases:

1. **Carregando.** Só o olho e o sorriso da logo, ampliados no centro da
   tela, com uma piscada dupla a cada ~4,6s. Esse é o loop: fica assim
   indefinidamente enquanto a página carrega.
2. **Pronto.** Em três tempos encadeados: a palavra se revela
   centralizando-se a partir do O (as letras surgem em cascata, 70ms
   entre cada), segura centralizada por um instante e, quando o dirigível
   finalmente chega voando pela esquerda, assenta na composição final.
3. **Fim.** A tela se dissolve revelando a página.

O SVG original, exportado do CorelDRAW, não tinha grupos nomeados. As
partes foram identificadas pela geometria — medindo o bounding box de
cada path no navegador — e reagrupadas: dirigível e nuvens, uma `<g>` por
letra (com `--i` definindo a ordem de revelação) e o rosto (olho, pupila
e sorriso).

O gradiente da marca corre continuamente pela logo, como um LED: um
único `linearGradient` com `spreadMethod="reflect"` — o espelhamento
elimina a emenda do ciclo — e um `animateTransform` que o desloca por
exatamente um período espacial.

```tsx
// automático: espera o load da página e some sozinha
<Splash onFinish={() => setLoading(false)} />

// controlado: você decide quando revelar
<Splash ready={dadosCarregados} />
```

## Loader

O rosto da marca começa em **vidro** — a mesma superfície translúcida das
outras superfícies do sistema — e vai sendo preenchido de baixo para cima
por um líquido de superfície ondulada, que desliza continuamente. Como o
preenchimento acompanha o contorno real das formas, o sorriso enche
primeiro e o olho depois; em 100% a marca fica inteira na cor.

```tsx
<Loader value={progresso} label="carregando" showValue />
<Loader />  {/* indeterminado: o nível oscila sozinho */}
```

O preenchimento é uma máscara SVG de duas camadas aninhadas: uma controla
o **nível** (um `translateY` ligado ao progresso, com o easing do
sistema) e a outra faz a **onda** deslizar em loop no eixo X. Precisam
ser camadas separadas porque um mesmo elemento não pode receber dois
transforms independentes — e é máscara, não `clipPath`, porque
`clipPath` não aceita grupos aninhados.

## Contorno reativo

O hover que aparece na galeria, nos widgets, nas barras e nos anéis: o
elemento cresce, projeta sombra e a borda vira um anel em degradê que
**gira acompanhando o mouse** — o ângulo aponta do centro do elemento
para o cursor.

O anel é desenhado com `mask-composite: exclude`, o que permite um
degradê só na borda, sem tapar o conteúdo de vidro.

Marcas SVG não aceitam pseudo-elemento com máscara, então nos gráficos o
mesmo vocabulário — "cresce e ganha profundidade" — é traduzido para
escala e `drop-shadow`: as bolinhas do gráfico de linhas crescem 2,1× com
halo na cor da série, e as fatias da pizza crescem a partir do centro do
gráfico, destacando-se radialmente das vizinhas.

## Redução de movimento

Com `prefers-reduced-motion: reduce`, o sistema desliga a deriva e a
pulsação do fundo, a piscada do olho, a flutuação do dirigível, a onda do
loader e encurta as transições do modal e da splash. O parallax do mouse
permanece, por ser resposta direta a uma ação do usuário.
