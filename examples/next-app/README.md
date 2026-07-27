# Exemplo — Next.js (App Router)

Landing page completa usando o Mothership DS.

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
