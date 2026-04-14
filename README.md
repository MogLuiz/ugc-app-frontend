# UGC — Frontend

Aplicação web do marketplace UGC: autenticação via Supabase, consumo da API REST do backend e UI responsiva alinhada ao design system do projeto.

## Stack

| Área | Tecnologia |
|------|------------|
| Framework | **React 19** + **React Router 7** (framework mode, Vite) |
| Linguagem | **TypeScript** (strict), Node **≥ 20** |
| Pacotes | **pnpm** 10.5.x |
| Estilo | **Tailwind CSS 4**, **Radix UI**, padrão estilo shadcn (CVA, `tailwind-merge`) |
| Dados remotos | **TanStack React Query**, cliente HTTP centralizado (`app/lib`) |
| Formulários | **react-hook-form** + **Zod** |
| Auth | **@supabase/supabase-js** |
| Observabilidade | **Sentry** (`@sentry/react`, opcional) |
| Testes | **Vitest** + Testing Library; **Playwright** (E2E) |
| Outros | **Firebase** (dependência presente para integrações específicas) |

Especificação detalhada: [`.specs/codebase/STACK.md`](./.specs/codebase/STACK.md).

## Arquitetura

- **Rotas:** `app/routes` — orquestração e navegação.
- **Domínios:** `app/modules` — por feature (`service.ts`, `queries.ts`, `types.ts`, componentes e hooks).
- **Compartilhado:** `app/components`, `app/hooks`, `app/lib` (HTTP, config, utilitários).
- **Modo:** React Router em framework mode com SSR desabilitado no setup atual.
- **Design:** referência visual em [`.specs/design-system.md`](./.specs/design-system.md).

Mais contexto: [`.specs/codebase/ARCHITECTURE.md`](./.specs/codebase/ARCHITECTURE.md) e [`.specs/codebase/STRUCTURE.md`](./.specs/codebase/STRUCTURE.md).

## Pré-requisitos

- Node.js **20+**
- **pnpm** 10.5.1 (ver `package.json`)

## Scripts

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Serve o artefato SSR (`react-router-serve`) |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Testes unitários / componentes (Vitest) |
| `pnpm e2e` | Testes E2E (Playwright) |

## Variáveis de ambiente

Definir no Vercel ou em `.env` local (prefixo `VITE_`):

| Variável | Uso |
|----------|-----|
| `VITE_API_BASE_URL` | URL base da API NestJS |
| `VITE_SUPABASE_URL` | Projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anon (cliente) |
| `VITE_GOOGLE_MAPS_API_KEY` | Mapas (opcional) |
| `VITE_SENTRY_DSN` | Sentry browser (opcional) |
| `VITE_SENTRY_ENABLED` | `false` desliga o SDK mesmo com DSN |
| `VITE_SENTRY_ENVIRONMENT` | Nome lógico do ambiente no Sentry (ex.: `staging`) |
| `VITE_SENTRY_RELEASE` | Release (ex.: SHA do git); alinha com sourcemaps no build |

**Upload de sourcemaps (só no ambiente de build — Vercel / CI, nunca `VITE_`):** `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT`. O Vite injeta `VITE_VERCEL_GIT_COMMIT_SHA` a partir de `VERCEL_GIT_COMMIT_SHA` para alinhar release quando `VITE_SENTRY_RELEASE` não está definido.

### Sentry — validação rápida

1. Defina `VITE_SENTRY_DSN` no `.env` local e confirme `VITE_SENTRY_ENABLED` diferente de `false`.
2. Rode `pnpm dev`; numa rota qualquer, dispare um erro **dentro da app** (ex.: botão que executa `throw new Error("Sentry test")` ou `import * as Sentry from "@sentry/react"; Sentry.captureException(new Error("test"))` no console **não** conta — use código na UI).
3. No Sentry: confira **Issue**, **Replay** (amostragem em erro é 100%) e, em **Performance**, transações após navegar entre rotas.
4. Para sourcemaps: build com `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` e `VITE_SENTRY_RELEASE` (ou só `VERCEL_GIT_COMMIT_SHA` na Vercel); confira stack legível no evento de produção.

**Tracing de navegação:** o app usa React Router 7 em **framework mode** (`app/routes.ts` + `ssr: false`), sem `createBrowserRouter` no código da app. A instrumentação usa `reactRouterV7BrowserTracingIntegration` de `@sentry/react`. Se as transações de navegação não aparecerem como esperado, o próximo passo objetivo é expor `entry.client` com `npx react-router reveal` e avaliar `@sentry/react-router` + `reactRouterTracingIntegration()` conforme a documentação oficial do Sentry para framework mode.

## Deploy (Vercel)

- **Root directory:** `frontend`
- **Build:** `pnpm build` (ver [`vercel.json`](./vercel.json))
- **Output:** `build/client` com rewrites SPA
- Branches típicas: **`main`** (produção), **`develop`** (staging/preview)

Passo a passo completo (incluindo URLs por ambiente): [`../docs/deploy-setup.md`](../docs/deploy-setup.md).

## Qualidade

- CI no repositório: typecheck + build em pushes/PRs relevantes.
- ESLint: plugin TanStack Query (ver `package.json`).

## Repositório

Este diretório faz parte do monorepo UGC; visão geral, entidades e infraestrutura: [`../README.md`](../README.md).
