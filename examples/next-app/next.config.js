/** @type {import('next').NextConfig} */

// Só usado pelo workflow que publica este exemplo no GitHub Pages, num
// subcaminho do site do styleguide — sem efeito ao copiar este arquivo
// para o seu próprio projeto (GITHUB_PAGES não estará definida).
const forGithubPages = process.env.GITHUB_PAGES === "true";
// Caminhos absolutos (o que o basePath gera) resolvem contra a raiz do
// DOMÍNIO (valnezjr.github.io), não contra a raiz do site do projeto —
// por isso o nome do repo entra aqui, mesmo já aparecendo na URL do
// GitHub Pages. Confirmado ao vivo: com só "/exemplo" os assets
// pediam valnezjr.github.io/exemplo/... (404) em vez de
// valnezjr.github.io/mothership-ds/exemplo/....
const basePath = "/mothership-ds/exemplo";

module.exports = {
  // O pacote é distribuído como código-fonte TS/TSX.
  transpilePackages: ["mothership-ds"],
  ...(forGithubPages && {
    output: "export",
    basePath,
    assetPrefix: `${basePath}/`,
  }),
};
