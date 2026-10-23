/**
 * PROTÓTIPO DESCARTÁVEL — tickets 01 (Cream escuro) e 07 (Paperpen).
 * Não é código de produção: some quando as variantes forem escolhidas.
 *
 *   node .scratch/temas-v2/prototipo/build.mjs   → http://localhost:8001
 */
import * as esbuild from "esbuild";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outdir = join(here, "dist");
mkdirSync(outdir, { recursive: true });

const fonts = [
  "Outfit:wght@400;500;600",
  "Caveat:wght@400;600",
  "Patrick+Hand",
  "Kalam:wght@400;700",
  "Shadows+Into+Light",
  "Gloria+Hallelujah",
  "Dancing+Script:wght@600",
  "Cedarville+Cursive",
  "Nothing+You+Could+Do",
  "Homemade+Apple",
  "Nanum+Pen+Script",
  "Gochi+Hand",
].join("&family=");

writeFileSync(
  join(outdir, "index.html"),
  `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Protótipo — temas v2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${fonts}&display=swap" rel="stylesheet">
<style>
@font-face { font-family: "Maple Mono"; font-style: normal; font-weight: 400;
  src: url(https://cdn.jsdelivr.net/fontsource/fonts/maple-mono@latest/latin-400-normal.woff2) format("woff2"); }
@font-face { font-family: "Maple Mono"; font-style: italic; font-weight: 400;
  src: url(https://cdn.jsdelivr.net/fontsource/fonts/maple-mono@latest/latin-400-italic.woff2) format("woff2"); }
body { margin: 0 }
</style>
<link rel="stylesheet" href="./main.css">
</head>
<body class="ms-page">
<div id="root"></div>
<script src="./main.js"></script>
</body>
</html>
`
);

const ctx = await esbuild.context({
  entryPoints: [join(here, "main.tsx")],
  bundle: true,
  format: "iife",
  jsx: "automatic",
  target: "es2020",
  define: { "process.env.NODE_ENV": '"development"' },
  loader: { ".css": "css" },
  outdir,
});
await ctx.watch();
const { port } = await ctx.serve({ servedir: outdir, port: 8001 });
console.log(`protótipo em http://localhost:${port}`);
