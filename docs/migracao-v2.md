# Migração v1 → v2

A v2.0 muda uma coisa só, mas muda a API: o tema passou a ter dois
eixos. Na v1, `theme` era uma lista de três (`"dark" | "darker" |
"light"`) que misturava a identidade com a claridade. Na v2, `theme`
diz a identidade e `mode` diz se ela está em base ou escura:

| | `mode="base"` | `mode="dark"` |
|---|---|---|
| `theme="glass"` — Mothership Glass | o antigo escuro | o antigo Darker |
| `theme="cream"` — Mothership Cream | o antigo claro | novo |
| `theme="paperpen"` — Mothership Paperpen | novo | novo |
| `theme="flat"` — Mothership Flat | novo | novo |

Componentes, tokens e classes `ms-*` não mudam. O que quebra está
abaixo, em ordem de quanto aparece num projeto comum.

## 1. Valores de tema

| v1 | v2 |
|---|---|
| `"dark"` | `theme="glass"`, `mode="base"` |
| `"darker"` | `theme="glass"`, `mode="dark"` |
| `"light"` | `theme="cream"`, `mode="base"` |

No `ThemeProvider`:

```diff
- <ThemeProvider defaultTheme="light">
+ <ThemeProvider defaultTheme="cream">

- <ThemeProvider defaultTheme="darker">
+ <ThemeProvider defaultTheme="glass" defaultMode="dark">
```

Sem `defaultTheme`, nada muda: o padrão continua sendo o antigo escuro
(Glass base). `defaultMode="system"` é novo e segue o
`prefers-color-scheme` do SO.

## 2. `useTheme()`

| v1 | v2 |
|---|---|
| `theme` (`"dark" \| "darker" \| "light"`) | `theme` (`"glass" \| "cream" \| "paperpen" \| "flat"`) + `mode` + `resolvedMode` |
| `setTheme("darker")` | `setTheme("glass"); setMode("dark")` |
| `setTheme("light")` | `setTheme("cream"); setMode("base")` |
| `toggle()` | `toggleMode()` — ver abaixo |
| `theme === "light"` | `theme === "cream"` |
| `theme === "darker"` | `theme === "glass" && resolvedMode === "dark"` |
| "está escuro?" | `resolvedMode === "dark"` só diz o modo; o Glass base também tem fundo escuro |

`toggle` alternava entre o antigo claro e o antigo escuro, ou seja,
trocava de **tema**. `toggleMode` alterna o **modo** dentro do tema
atual: no Cream, vai de Cream base para Cream escuro, não para o Glass.
Se você quer o comportamento antigo:

```tsx
const { theme, setTheme, setMode } = useTheme();
const toggleV1 = () => {
  setTheme(theme === "cream" ? "glass" : "cream");
  setMode("base");
};
```

Leia `resolvedMode`, não `mode`, para saber o que está na tela: `mode`
pode ser `"system"`.

## 3. `ThemeSwitch` e `ThemeMenu`

Sem mudança de props. O comportamento acompanha os dois eixos:

- **`ThemeSwitch`** alterna base ↔ escuro dentro do tema atual
  (`aria-checked` = modo escuro, rótulo "Modo escuro", que era "Alternar tema"). Antes alternava
  claro ↔ escuro.
- **`ThemeMenu`** lista os oito pares, um grupo por tema, e uma opção
  **Seguir o sistema** no topo. Antes eram três itens.

## 4. Classes no `<html>` → atributos

O `ThemeProvider` não escreve mais classes. No lugar de `.light` e
`.darker`, dois atributos prefixados — que não colidem com classes de
quem instala a lib:

```html
<html data-ms-theme="cream" data-ms-mode="dark">
```

`data-ms-mode` é sempre o modo resolvido (`"base"` ou `"dark"`). Sem
atributo nenhum, vale o Glass base — é o que está na tela antes da
hidratação, por isso os seletores do Glass abaixo cobrem também o
`<html>` sem `data-ms-theme`.

Se o seu CSS mirava as classes:

| v1 | v2 |
|---|---|
| `.light` | `[data-ms-theme="cream"]` |
| `.darker` | `[data-ms-mode="dark"]:is([data-ms-theme="glass"], :not([data-ms-theme]))` |
| `:root:not(.light)` (o escuro e o Darker) | `:root:is([data-ms-theme="glass"], :not([data-ms-theme]))` |
| — | `[data-ms-mode="dark"]` (o escuro de qualquer tema) |

```diff
- .light .minha-secao { … }
+ [data-ms-theme="cream"] .minha-secao { … }
```

Se você aplicava as classes à mão, sem o `ThemeProvider` (um script no
`<head>` contra o flash, por exemplo), escreva os atributos:

```diff
- document.documentElement.classList.add("light");
+ document.documentElement.dataset.msTheme = "cream";
+ document.documentElement.dataset.msMode = "base";
```

E se redefine tokens por tema, troque o seletor da mesma forma. Os
seletores dos modos escuros pesam dois atributos; um `:root` seu não
vence neles (ver [Trocando a marca](tokens.md#trocando-a-marca)).

## 5. `persist`

Nada a fazer. A v2 grava tema e modo em duas chaves (`ms-theme` e
`ms-mode`) e, na primeira leitura, converte o valor salvo pela v1
(`ms-theme` = `"dark"`, `"darker"` ou `"light"`) pelo par da tabela
acima. Quem já tinha escolhido o claro abre no Cream base.

## 6. Temas novos

Nenhum é obrigatório. Se for oferecer o **Mothership Paperpen**, carregue
as fontes dele, Patrick Hand e Homemade Apple — a receita está em
[tokens § Fontes do Paperpen](tokens.md#fontes-do-paperpen). Sem elas,
o corpo cai em `"Comic Sans MS", cursive` e os títulos na `cursive` do
sistema.

Se você usa o `reset.css` da lib, ele já pinta o `<html>` com o fundo
de cada par (aparece no overscroll do navegador).
