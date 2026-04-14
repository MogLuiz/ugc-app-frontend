/** Sentry: init antes do restante do módulo — ver `~/lib/sentry-init`. */
import "~/lib/sentry-init";

import type { ReactNode } from "react";
import { useEffect } from "react";
import type { LinksFunction, MetaFunction } from "react-router";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "react-router";
import * as Sentry from "@sentry/react";
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

export function ErrorBoundary() {
  const error = useRouteError();

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      if (error.status >= 500) {
        Sentry.captureException(error, {
          extra: {
            status: error.status,
            statusText: error.statusText,
          },
        });
      }
      return;
    }
    Sentry.captureException(error);
  }, [error]);

  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-lg font-semibold text-neutral-900">
          {error.status === 404 ? "Página não encontrada" : "Algo deu errado"}
        </h1>
        <p className="max-w-md text-sm text-neutral-600">
          {error.status === 404
            ? "O endereço que você acessou não existe ou foi movido."
            : "Não foi possível carregar esta página. Tente novamente em instantes."}
        </p>
        <Link
          to="/dashboard"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
        >
          Ir ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-lg font-semibold text-neutral-900">
        Algo deu errado
      </h1>
      <p className="max-w-md text-sm text-neutral-600">
        Ocorreu um erro inesperado. Se o problema persistir, entre em contato
        com o suporte.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
      >
        Ir ao início
      </Link>
    </div>
  );
}

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
