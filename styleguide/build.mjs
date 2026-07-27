/**
 * Gera o styleguide estático em styleguide/dist/.
 *
 *   node styleguide/build.mjs            # build
 *   node styleguide/build.mjs --serve    # build + servidor local
 *
 * Requer esbuild (devDependency). O CSS entra junto no bundle.
 */
import * as esbuild from "esbuild";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outdir = join(here, "dist");
mkdirSync(outdir, { recursive: true });

const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mothership DS — Styleguide</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./styleguide.css">
<style>html{scroll-behavior:smooth}body{margin:0}</style>
</head>
<body class="ms-page">
<div id="root"></div>
<script src="./styleguide.js"></script>
</body>
</html>
`;

const ctx = {
  entryPoints: [join(here, "main.tsx")],
  bundle: true,
  format: "iife",
  jsx: "automatic",
  target: "es2020",
  outfile: join(outdir, "styleguide.js"),
  define: { "process.env.NODE_ENV": '"production"' },
  minify: true,
  loader: { ".css": "css" },
};

if (process.argv.includes("--serve")) {
  const context = await esbuild.context({ ...ctx, minify: false });
  await context.watch();
  const { host, port } = await context.serve({ servedir: outdir });
  writeFileSync(join(outdir, "index.html"), html);
  console.log(`styleguide em http://${host === "0.0.0.0" ? "localhost" : host}:${port}`);
} else {
  await esbuild.build(ctx);
  writeFileSync(join(outdir, "index.html"), html);
  console.log("styleguide gerado em styleguide/dist/");
}
