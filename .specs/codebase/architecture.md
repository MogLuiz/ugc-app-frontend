# Arquitetura Frontend

## Estrutura de pastas
- `app/routes`: orquestracao e navegacao.
- `app/modules`: regras de negocio por dominio.
- `app/components`: UI compartilhada.
- `app/hooks`: hooks reutilizaveis.
- `app/lib`: infraestrutura, HTTP, config e utilitarios.

## Decisoes base
- React Router Framework Mode com `ssr: false`.
- TypeScript strict.
- Tailwind CSS v4 + componentes reutilizaveis no estilo shadcn.
- Client HTTP centralizado com `credentials: "include"`.

## Dominios iniciais
- `auth`, `onboarding`, `creators`, `businesses`, `jobs`, `chat`, `payments`, `dashboard`.
