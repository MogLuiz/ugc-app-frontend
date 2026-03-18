# Architecture

**Pattern:** Modular feature-based, com Controller + Screen + Sections

## High-Level Structure

```
app/
├── routes/           # Orquestração e navegação (thin)
├── modules/          # Regras de negócio por domínio
│   └── [domain]/
│       ├── components/     # Screen + Sections
│       ├── hooks/          # Controller (use-*-controller)
│       ├── data/           # Mock data (teste)
│       ├── schemas/        # Zod schemas
│       ├── types/          # Tipos do domínio
│       └── lib/            # Utilitários do domínio
├── components/       # UI compartilhada (layout, ui)
├── hooks/            # Hooks globais (use-auth)
└── lib/              # Infra (http, config, query, utils)
```

## Identified Patterns

### Screen + Controller

**Location:** `app/modules/*/components/*-screen.tsx` + `app/modules/*/hooks/use-*-controller.ts`

**Purpose:** Separar apresentação (Screen) da lógica (Controller). O Screen é thin e apenas compõe Sections com dados do Controller.

**Implementation:** O Controller retorna `viewModel` (dados) e `actions` (handlers). Em fluxos com formulário, retorna também `form`, `submit`, `mutations`, etc.

**Example:**

```tsx
// business-dashboard-screen.tsx
const controller = useBusinessDashboardController();
return (
  <BusinessDashboardStats stats={controller.viewModel.stats} />
);

// use-business-dashboard-controller.ts
return {
  actions: { setSearch },
  viewModel: { companyName, jobs, planName, search, stats, ... },
};
```

### Sections

**Location:** `app/modules/*/components/sections/*-sections.tsx`

**Purpose:** Agrupar blocos de UI reutilizáveis dentro do módulo. Cada Section recebe props do Controller.

**Implementation:** Sections exportam componentes nomeados (ex: `CompanyProfileFormSection`, `CompanyProfileSummarySection`). Podem ter `density` (compact/comfortable) para responsividade.

**Example:** `company-profile-sections.tsx` exporta `CompanyProfileCardHeader`, `CompanyProfileFormSection`, `CompanyProfileSummarySection`, `CompanyPortfolioSection`.

### Mutations centralizadas em auth

**Location:** `app/modules/auth/mutations.ts`

**Purpose:** Mutations de perfil, avatar, portfólio invalidam `authKeys.session()` e são usadas por vários módulos.

**Implementation:** Hooks `useUpdateProfileMutation`, `useUploadAvatarMutation`, etc. Chamam `modules/auth/service` e invalidam sessão no `onSuccess`.

### HTTP Client centralizado

**Location:** `app/lib/http/client.ts`

**Purpose:** Requisições REST com `credentials: "include"`, Bearer token opcional, normalização de erros.

**Implementation:** `httpClient<T>(path, options)` usa `getApiBaseUrl()`, lança `HttpError` em falhas.

## Data Flow

### Autenticação

1. Supabase `getSession` → se há sessão, `httpClient("/profiles/me", { token })`
2. Se 404, `bootstrapUser(role)` → `httpClient("/users/bootstrap", { body: { role } })`
3. `bootstrapToAuthUser(payload)` → `AuthUser` com `profile`, `companyProfile`, `portfolio`
4. React Query `authKeys.session()` mantém cache; mutations invalidam

### Perfil de Empresa (edição)

1. `CompanyProfileScreen` usa `useCompanyProfileController(user)`
2. Controller: `useForm` + mutations (`updateProfile`, `updateCompanyProfile`, `uploadAvatar`, etc.)
3. Modo edição: `CompanyProfileFormSection` com `register`, `errors`, `onSubmit`
4. Modo leitura: `CompanyProfileSummarySection` com dados do `user`

### Dashboard (read-only com mock)

1. `useBusinessDashboardController()` retorna `viewModel` com dados de `mock-business-dashboard`
2. Sections recebem `stats`, `jobs`, `recommendedCreators` etc.
3. Sem mutations; apenas estado local (ex: `search`)

## Code Organization

**Approach:** Feature-based / domain-driven. Cada módulo é autocontido.

**Module boundaries:**

- `auth`: tipos, service, mutations, schemas, context
- `company-profile`: components, hooks, schemas, types, lib (feedback)
- `business-dashboard`: components, hooks, data (mock)
- `creator-dashboard`: idem
- `creator-profile`: idem
- `creators-map`: components, hooks, data, lib (google-maps)
