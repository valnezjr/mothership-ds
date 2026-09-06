# Exemplo — Next.js (App Router)

Landing page completa usando o Mothership DS.

[**Ver funcionando →**](https://valnezjr.github.io/mothership-ds/exemplo/)
— publicada automaticamente a partir desta pasta a cada push na `master`
(`.github/workflows/pages.yml`), como export estático do Next.js.

## Copiando para o seu projeto

```bash
npx create-next-app@latest meu-site --ts --app
cd meu-site
npm install file:../mothership-ds
# copie next.config.js, app/layout.tsx e app/page.tsx daqui
npm run dev
```

Pontos importantes:

- `transpilePackages: ["mothership-ds"]` no `next.config.js`, porque o
  pacote é distribuído como código-fonte TSX.
- Os providers ficam no `layout.tsx` (server component), envolvendo a
  aplicação; eles próprios são client components.
- `app/page.tsx` leva `"use client"` porque usa `useState` e `useAlerts`.
  Páginas que só compõem componentes visuais (Hero, Card, Footer) podem
  continuar sendo server components.

`package.json`, `tsconfig.json` e `next-env.d.ts` desta pasta existem só
para o build de CI/Pages rodar sozinho dentro do monorepo — não fazem
parte do que se copia. O `basePath` condicional em `next.config.js`
(`GITHUB_PAGES=true`) também é só para publicar num subcaminho; sem
essa variável o arquivo se comporta exatamente como documentado acima.
