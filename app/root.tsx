import "./instrument.client";
import type { ReactNode } from "react";
import type { LinksFunction, MetaFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { UGC_APP_ICON_PATH } from "~/components/ui/app-logo-mark";
import { AppToaster } from "~/components/ui/toast";
import "./app.css";

export const links: LinksFunction = () => [
  { rel: "icon", href: UGC_APP_ICON_PATH, type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: UGC_APP_ICON_PATH },
];

export const meta: MetaFunction = () => [
  { title: "UGC Local | Conecte sua empresa a criadores de conteúdo locais" },
  { name: "theme-color", content: "#895af6" },
  {
    name: "description",
    content:
      "Encontre criadores da sua cidade para produzir vídeos reais e autênticos para o seu negócio. Contrate com agilidade, organize demandas e gere conteúdo que vende.",
  },
  {
    property: "og:title",
    content: "UGC Local | Conecte sua empresa a criadores de conteúdo locais",
  },
  {
    property: "og:description",
    content:
      "Encontre criadores da sua cidade para produzir vídeos reais e autênticos para o seu negócio. Contrate com agilidade, organize demandas e gere conteúdo que vende.",
  },
  { property: "og:type", content: "website" },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <AppToaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
