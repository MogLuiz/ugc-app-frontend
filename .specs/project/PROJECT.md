# UGC App Frontend

**Vision:** Marketplace mobile-first que conecta empresas e criadoras UGC em Belo Horizonte e região, permitindo descoberta por proximidade, criação de jobs com preço fixo e acompanhamento de campanhas.

**For:** Empresas que precisam de conteúdo para campanhas locais; criadoras UGC que oferecem entregas por nicho e localização.

**Solves:** Conexão direta entre demanda de conteúdo autêntico e oferta de criadoras locais, com transparência de preço e status.

## Goals

- Permitir descoberta de criadoras por mapa e filtros com métricas de sucesso (tempo de busca, conversão).
- Oferecer fluxo completo de job (criação, chat, pagamento, status) com transparência e rastreabilidade.
- Manter experiência simples e rápida no mobile como prioridade de UX.

## Tech Stack

**Core:**

- Framework: React Router 7.12 (Framework Mode, `ssr: false`)
- Language: TypeScript 5.9 (strict)
- Runtime: Node 20+

**Key dependencies:**

- React 19, TanStack React Query 5, React Hook Form + Zod
- Tailwind CSS 4, class-variance-authority, Radix UI
- Supabase Auth, Firebase (integrações)
- Vitest 4, Playwright 1.54

## Scope

**v1 includes:**

- Onboarding e autenticação (login/registro, roles business/creator)
- Descoberta de criadoras por mapa e proximidade
- Dashboards por role (business, creator)
- Perfil de empresa editável (dados, portfólio, mídia)
- Criação de job com preço fixo + transporte variável
- Chat, pagamento e acompanhamento de status

**Explicitly out of scope:**

- SSR/SSG
- PWA offline-first
- Integrações de pagamento reais (MVP com mock)

## Constraints

- Mobile-first obrigatório
- Suporte a dev, test e prod via `VITE_API_BASE_URL` e `import.meta.env.MODE`
- Manter arquivos < 200–300 linhas; refatorar quando ultrapassar
