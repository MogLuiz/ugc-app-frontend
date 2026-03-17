# State (Memory Between Sessions)

**Last updated:** 2025-03-17

## Current Focus

- Nenhum foco ativo no momento.

## Recently Completed

- Setup do projeto conforme TLC Spec-Driven (2025-03-17)
- Documentação da nova arquitetura modular (Screen + Controller + Sections) em `.specs/codebase/`

## Decisions

- **Arquitetura modular:** Cada feature vive em `app/modules/[domain]/` com `components/`, `hooks/`, `data/`, `schemas/`, `types/`, `lib/`.
- **Controller pattern:** Hooks `use-*-controller` centralizam estado, mutations e viewModel; Screens são thin e delegam para Sections.
- **Rotas:** `routes/` apenas orquestram; componentes de tela vêm de `modules/*/components/*-screen`.
- **Auth:** Mutations em `modules/auth/mutations`; service em `modules/auth/service`; tipos em `modules/auth/types`.

## Blockers

- Nenhum no momento.

## Preferences

- Responder em pt-BR.
- Preferir soluções simples; evitar duplicação.
- Não sobrescrever `.env` sem confirmação.
