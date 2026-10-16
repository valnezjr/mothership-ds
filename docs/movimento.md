# Movimento

O movimento aqui não é enfeite: é parte da identidade. Quatro coisas
sustentam isso: um vocabulário de quatro gestos, um easing com
overshoot que assina as entradas e os cliques, um fundo que nunca fica completamente parado,
e duas peças de marca (splash e loader) construídas sobre a própria
logo.

Tudo respeita `prefers-reduced-motion`.

## Os quatro gestos

Todo movimento de componente que entra, sai, confirma um clique ou roda
em loop é um destes quatro gestos. Cada um tem curva e duração em token,
então um modal e um toast entram do mesmo jeito sem combinar nada entre
si.

| Gesto | Curva | Duração | Quando |
|---|---|---|---|
| **assentar** | `--ease-bounce` | 0.3s | algo entra: modal, toast, popover, janela |
| **recolher** | ease-in, sem overshoot | 0.15s | algo sai, qualquer coisa |
| **pulso** | `--ease-bounce` | 0.2s | confirmação de clique |
| **deriva** | linear, contínuo | depende do uso | fundo vivo, giro de borda |

```css
--motion-assentar-ease: var(--ease-bounce);
--motion-assentar-duration: 0.3s;
--motion-recolher-ease: cubic-bezier(0.36, 0, 0.66, 0);
--motion-recolher-duration: 0.15s;
--motion-pulso-ease: var(--ease-bounce);
--motion-pulso-duration: 0.2s;
--motion-deriva-ease: linear;
```

**Assentar ao entrar, recolher ao sair.** A entrada tem tempo para o
overshoot: o elemento chega, passa um pouco do ponto e assenta, e é aí
que a marca aparece. A saída é a metade do tempo e só acelera. Quem
fechou algo já decidiu, e um overshoot na saída faria o elemento
"voltar" por um instante, contrariando o gesto. A curva do recolher é a
do `--ease-spatial` espelhada no tempo: mesma família, só que acelera em
vez de frear.

**Pulso** é o assentar em miniatura: um clique que encolhe o elemento e
o deixa voltar com o mesmo overshoot, mais rápido, para confirmar que a
ação foi registrada.

**Deriva** é o único gesto sem começo nem fim: o fundo vivo, o gradiente
que corre pela logo, o giro de uma borda. É linear porque qualquer curva
num loop marca a emenda de cada volta. Não tem token de duração: o
período de cada uso é escolhido para o seu tamanho e distância.

```css
.meu-painel        { animation: entra var(--motion-assentar-duration) var(--motion-assentar-ease); }
.meu-painel.saindo { animation: sai   var(--motion-recolher-duration) var(--motion-recolher-ease) forwards; }
.meu-botao:active  { animation: pulso var(--motion-pulso-duration) var(--motion-pulso-ease); }
```

Com `prefers-reduced-motion: reduce`, as durações de assentar, recolher
e pulso viram `0.01s` no próprio `tokens.css`: quem usa os tokens já
respeita a preferência. A deriva para em vez de encurtar, e quem a usa
pausa a animação na sua própria regra.

### Transformação em cena

Fica fora dos gestos o que já está na tela e muda de forma ou de ponto
de vista: o `Dock` expandindo em painel, a câmera do `Grafo3D` indo até
um nó, a legenda escurecendo ao filtrar. Nada entra nem sai, e são
objetos grandes. Um overshoot ali lê como solavanco, não como charme.
Esses usam o par espacial, mais longo e sem overshoot:

```css
--transition-spatial: 0.45s;
--ease-spatial: cubic-bezier(0.34, 1, 0.64, 1);
```

O critério é simples: entrou ou saiu de cena, é gesto; já estava e se
transformou, é o par espacial. Uma gaveta (`Drawer`) entra e sai, então
assenta e recolhe como qualquer outra coisa.

## O easing do sistema

```css
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

Um overshoot leve: o elemento passa um pouco do ponto e assenta. Ele
aparece no accordion, na entrada do modal, no deslize dos bullets do
carrossel, no contorno reativo, no nível do loader. É a curva de
assentar e de pulso: usar a mesma curva em toda entrada e todo clique é
o que faz componentes muito diferentes parecerem da mesma família. As
saídas (recolher) e os loops (deriva) usam curvas próprias, pelos
motivos explicados nos gestos acima.

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
loader e encurta as transições do modal e da splash. Os gestos assentar,
recolher e pulso encolhem para `0.01s` direto nos tokens. O parallax do mouse
permanece, por ser resposta direta a uma ação do usuário.
