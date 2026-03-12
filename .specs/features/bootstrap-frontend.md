# Feature Spec - Bootstrap Frontend

## Escopo
- Inicializar base React Router + Vite + TypeScript strict.
- Criar estrutura modular por dominio.
- Configurar design system base e componentes essenciais.
- Configurar Vitest, Storybook e Playwright.

## Entregaveis
- Layout mobile-first com navegação principal.
- Rotas iniciais para home, login, dashboard de empresa, dashboard de criadora e criacao de job.
- Wrapper HTTP com tratamento de erros.
- Estrutura de autenticacao com sessao persistente por cookie.
- Testes iniciais de calculo de preco e renderizacao por role.

## Criterios de aceite
- `pnpm typecheck`, `pnpm test` e `pnpm build` devem executar sem erro.
- Projeto deve estar pronto para expandir os fluxos de empresa e criadora por feature.
