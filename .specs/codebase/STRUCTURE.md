# Project Structure

**Root:** `frontend/`

## Directory Tree

```
frontend/
├── app/
│   ├── components/          # UI compartilhada
│   │   ├── ui/              # Button, Input, Card, etc.
│   │   ├── app-sidebar.tsx
│   │   ├── auth-guard.tsx
│   │   └── layout/
│   ├── hooks/               # Hooks globais
│   ├── lib/                 # Infra
│   │   ├── config/
│   │   ├── http/
│   │   └── query/
│   ├── modules/             # Domínios
│   │   ├── auth/
│   │   ├── business-dashboard/
│   │   ├── company-profile/
│   │   ├── creator-dashboard/
│   │   ├── creator-profile/
│   │   └── creators-map/
│   └── routes/              # Rotas React Router
├── .specs/
│   ├── codebase/
│   ├── features/
│   ├── project/
│   └── design-system.md
├── tests/
│   └── e2e/
├── package.json
├── react-router.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

## Module Organization

### auth

**Purpose:** Autenticação, sessão, bootstrap, mutations de perfil.

**Location:** `app/modules/auth/`

**Key files:** `service.ts`, `mutations.ts`, `types.ts`, `context.tsx`, `schemas/`

### company-profile

**Purpose:** Perfil editável da empresa (dados, avatar, portfólio).

**Location:** `app/modules/company-profile/`

**Key files:** `company-profile-screen.tsx`, `use-company-profile-controller.ts`, `company-profile-sections.tsx`, `company-portfolio-section.tsx`, `schemas/company-profile.ts`

### business-dashboard

**Purpose:** Dashboard da empresa (stats, jobs, recomendações).

**Location:** `app/modules/business-dashboard/`

**Key files:** `business-dashboard-screen.tsx`, `use-business-dashboard-controller.ts`, `business-dashboard-sections.tsx`, `data/mock-business-dashboard.ts`

### creator-dashboard

**Purpose:** Dashboard da criadora.

**Location:** `app/modules/creator-dashboard/`

**Key files:** `creator-dashboard-screen.tsx`, `use-creator-dashboard-controller.ts`, `creator-dashboard-sections.tsx`

### creator-profile

**Purpose:** Perfil público da criadora.

**Location:** `app/modules/creator-profile/`

**Key files:** `creator-profile-screen.tsx`, `use-creator-profile-controller.ts`, `creator-profile-sections.tsx`

### creators-map

**Purpose:** Mapa de criadoras (Google Maps).

**Location:** `app/modules/creators-map/`

**Key files:** `creators-map-screen.tsx`, `use-creators-map-controller.ts`, `google-creators-map.tsx`, `lib/google-maps.ts`

## Where Things Live

**UI/Interface:**

- Screens: `modules/*/components/*-screen.tsx`
- Sections: `modules/*/components/sections/*-sections.tsx`
- Componentes globais: `components/ui/`, `components/app-sidebar.tsx`

**Business Logic:**

- Controllers: `modules/*/hooks/use-*-controller.ts`
- Mutations: `modules/auth/mutations.ts`
- Service: `modules/auth/service.ts`

**Data Access:**

- HTTP: `lib/http/client.ts`
- Query keys: `lib/query/query-keys.ts`
- Mock data: `modules/*/data/mock-*.ts`

**Configuration:**

- Env: `lib/config/env.ts`
- Routes: `routes.ts`, `app/routes/*.tsx`

## Special Directories

**`.specs/`:** Documentação do projeto (PROJECT, ROADMAP, STATE, codebase, features).

**`components/ui/`:** Componentes base (Button, Input, Card, etc.) no estilo shadcn.

**`lib/query/`:** React Query provider, client e keys.
