/**
 * Gera o styleguide estático em styleguide/dist/.
 *
 *   node styleguide/build.mjs            # build
 *   node styleguide/build.mjs --serve    # build + servidor local
 *
 * Requer esbuild (devDependency). O CSS entra junto no bundle.
 *
 * O build de produção nomeia styleguide.js/.css com hash de conteúdo
 * (styleguide-<hash>.js/.css) — sem isso, o navegador e a CDN do
 * GitHub Pages (cache-control: max-age=600) podem servir uma versão
 * de até 10 minutos atrás depois de um deploy novo, com o mesmo nome
 * de arquivo não dando nenhum sinal de que mudou. O modo --serve local
 * mantém nome fixo (sem hash) — não há CDN nem cache de navegador
 * relevante num servidor de desenvolvimento com watch.
 */
import * as esbuild from "esbuild";
import { writeFileSync, mkdirSync, copyFileSync, rmSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outdir = join(here, "dist");

rmSync(outdir, { recursive: true, force: true });
mkdirSync(outdir, { recursive: true });

for (const asset of ["favicon.svg", "favicon-16.png", "favicon-32.png", "favicon-180.png"]) {
  copyFileSync(join(here, "..", "assets", asset), join(outdir, asset));
}

function html(jsFile, cssFile) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mothership DS — Styleguide</title>
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="icon" href="./favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="./favicon-16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="./favicon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./${cssFile}">
<style>body{margin:0}@media (prefers-reduced-motion: no-preference){html{scroll-behavior:smooth}}</style>
</head>
<body class="ms-page">
<div id="root"></div>
<script src="./${jsFile}"></script>
</body>
</html>
`;
}

const shared = {
  entryPoints: [join(here, "main.tsx")],
  bundle: true,
  format: "iife",
  jsx: "automatic",
  target: "es2020",
  define: { "process.env.NODE_ENV": '"production"' },
  loader: { ".css": "css" },
};

if (process.argv.includes("--serve")) {
  const context = await esbuild.context({
    ...shared,
    outfile: join(outdir, "styleguide.js"),
    minify: false,
  });
  await context.watch();
  const { host, port } = await context.serve({ servedir: outdir });
  writeFileSync(join(outdir, "index.html"), html("styleguide.js", "styleguide.css"));
  console.log(`styleguide em http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
} else {
  const result = await esbuild.build({
    ...shared,
    outdir,
    entryNames: "styleguide-[hash]",
    minify: true,
    metafile: true,
  });
  const outputs = Object.keys(result.metafile.outputs).map((p) => basename(p));
  const jsFile = outputs.find((f) => f.endsWith(".js"));
  const cssFile = outputs.find((f) => f.endsWith(".css"));
  writeFileSync(join(outdir, "index.html"), html(jsFile, cssFile));
  console.log(`styleguide gerado em styleguide/dist/ (${jsFile}, ${cssFile})`);
}
