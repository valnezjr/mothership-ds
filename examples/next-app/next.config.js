/** @type {import('next').NextConfig} */

// Só usado pelo workflow que publica este exemplo no GitHub Pages, num
// subcaminho do site do styleguide — sem efeito ao copiar este arquivo
// para o seu próprio projeto (GITHUB_PAGES não estará definida).
const forGithubPages = process.env.GITHUB_PAGES === "true";
// Relativo à raiz do site (valnezjr.github.io/mothership-ds/) — o nome
// do repo já faz parte do domínio, não deve ser repetido aqui.
const basePath = "/exemplo";

module.exports = {
  // O pacote é distribuído como código-fonte TS/TSX.
  transpilePackages: ["mothership-ds"],
  ...(forGithubPages && {
    output: "export",
    basePath,
    assetPrefix: `${basePath}/`,
  }),
};
