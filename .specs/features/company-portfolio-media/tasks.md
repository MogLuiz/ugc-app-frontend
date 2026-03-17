# Company Portfolio Media Tasks

**Design**: `frontend/.specs/features/company-portfolio-media/design.md`
**Status**: In Progress

---

## Execution Plan

### Phase 1: Foundation (Sequential)

`T1 -> T2 -> T3 -> T4`

### Phase 2: UI (Parallel after T4)

`T4 -> T5`

`T5 -> T6`

`T5 -> T7`

`T5 -> T8 -> T9 -> T10`

### Phase 3: Integration (Sequential)

`T6 + T7 + T8 + T9 + T10 -> T11 -> T12 -> T13`

---

## Task Breakdown

### T1: Extend auth/profile types

**What**: Incluir `portfolio` no payload autenticado
**Where**: `frontend/app/modules/auth/types.ts`
**Depends on**: None
**Reuses**: Tipos atuais de `BootstrapPayload` e `AuthUser`

**Done when**:

- [ ] `BootstrapPayload` expõe `portfolio`
- [ ] `AuthUser` expõe `portfolio`
- [ ] `bootstrapToAuthUser` mapeia o campo

### T2: Extend company profile data model

**What**: Adicionar `websiteUrl`, `instagramUsername` e `tiktokUsername`
**Where**: `frontend/app/modules/auth/types.ts`, `frontend/app/modules/company-profile/schemas/company-profile.ts`
**Depends on**: T1
**Reuses**: Campos existentes do schema

**Done when**:

- [ ] Schema aceita os campos
- [ ] Payload tipado inclui os novos dados
- [ ] Sem erros de TypeScript

### T3: Add portfolio services and mutations

**What**: Criar serviços e mutations para upload e remoção do portfólio
**Where**: `frontend/app/modules/auth/service.ts`, `frontend/app/modules/auth/mutations.ts`
**Depends on**: T1
**Reuses**: Upload de avatar e invalidation pattern

**Done when**:

- [ ] Serviço de upload criado
- [ ] Serviço de remoção criado
- [ ] Mutations invalidam sessão

### T4: Map backend payload to AuthUser

**What**: Garantir que a sessão reflita o novo contrato de empresa e portfólio
**Where**: `frontend/app/modules/auth/types.ts`
**Depends on**: T2, T3

**Done when**:

- [ ] `AuthUser` recebe dados do backend
- [ ] Portfólio chega pronto para renderização

### T5: Create shared portfolio section

**What**: Criar componente compartilhado `CompanyPortfolioSection`
**Where**: `frontend/app/modules/company-profile/components/company-portfolio-section.tsx`
**Depends on**: T4
**Reuses**: `Button`, `toast`, ícones existentes

**Done when**:

- [ ] Estado vazio renderiza
- [ ] Cards de mídia renderizam imagem e vídeo
- [ ] Ação de remover está conectada por callback

### T6: Integrate desktop layout

**What**: Integrar a seção e reorganizar o formulário desktop conforme o layout enviado
**Where**: `frontend/app/modules/company-profile/components/company-profile-desktop.tsx`
**Depends on**: T5
**Reuses**: Estrutura atual da tela desktop

**Done when**:

- [ ] Seção `Informações da Empresa` reflete o layout
- [ ] Seção `Portfólio & Mídia` aparece na posição correta
- [ ] CTA e ações batem com o fluxo novo

### T7: Integrate mobile layout

**What**: Integrar a seção e reorganizar o formulário mobile conforme o layout enviado
**Where**: `frontend/app/modules/company-profile/components/company-profile-mobile.tsx`
**Depends on**: T5
**Reuses**: Estrutura atual da tela mobile

**Done when**:

- [ ] Layout mobile segue os frames enviados
- [ ] Seção de portfólio funciona com scroll horizontal
- [ ] Ações de upload/remoção estão acessíveis

### T8: Add remove action

**What**: Conectar remoção individual de mídia
**Where**: `frontend/app/modules/company-profile/components/company-portfolio-section.tsx`
**Depends on**: T5

**Done when**:

- [ ] Cada card tem ação de remoção
- [ ] Remoção dispara mutation correta

### T9: Add empty/upload state

**What**: Implementar card de upload e estado vazio
**Where**: `frontend/app/modules/company-profile/components/company-portfolio-section.tsx`
**Depends on**: T5

**Done when**:

- [ ] Estado vazio mostra CTA
- [ ] Upload card permanece disponível com mídias existentes

### T10: Evolve company info fields

**What**: Adicionar site oficial, Instagram e TikTok ao formulário
**Where**: `frontend/app/modules/company-profile/components/company-profile-desktop.tsx`, `frontend/app/modules/company-profile/components/company-profile-mobile.tsx`
**Depends on**: T2

**Done when**:

- [ ] Campos aparecem no formulário
- [ ] Valores são enviados no submit

### T11: Connect to real APIs

**What**: Conectar UI às APIs reais de portfólio
**Where**: `frontend/app/modules/company-profile/components/`
**Depends on**: T3, T6, T7, T8, T9, T10

**Done when**:

- [ ] Upload usa endpoint real
- [ ] Remoção usa endpoint real
- [ ] Sessão é invalidada corretamente

### T12: Remove mock dependency from this area

**What**: Garantir que a tela da empresa não dependa de mock para o portfólio
**Where**: `frontend/app/modules/company-profile/`
**Depends on**: T11

**Done when**:

- [ ] Portfólio vem só do `user`

### T13: Validate responsive consistency

**What**: Validar consistência desktop/mobile
**Where**: verify commands
**Depends on**: T11, T12

**Done when**:

- [ ] Typecheck passa
- [ ] Layout desktop/mobile compila sem regressão
