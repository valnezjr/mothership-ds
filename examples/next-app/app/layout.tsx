import "mothership-ds/styles.css";
import type { Metadata } from "next";
import {
  ThemeProvider,
  AlertsProvider,
  TooltipProvider,
  LivingBackground,
} from "mothership-ds";

export const metadata: Metadata = {
  title: "Mothership",
  description: "Feito com o Mothership DS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Navbar usa spy + links âncora (#projetos, #sobre, #contato);
            sem isso o clique pula direto, sem rolagem. */}
        <style>{`@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }`}</style>
      </head>
      <body className="ms-page">
        <ThemeProvider>
          <AlertsProvider>
            <TooltipProvider>
              <LivingBackground />
              {children}
            </TooltipProvider>
          </AlertsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
