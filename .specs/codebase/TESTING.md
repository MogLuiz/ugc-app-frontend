# Testing Infrastructure

## Test Frameworks

**Unit/Integration:** Vitest 4.0.18, @testing-library/react 16.3.2, jsdom 28.1.0

**E2E:** Playwright 1.54.2

**Coverage:** Não configurado explicitamente no momento.

## Test Organization

**Location:** Testes unitários em `app/**/*.test.{ts,tsx}`; E2E em `tests/e2e/`

**Naming:** `*.test.ts` ou `*.test.tsx`

**Structure:** Vitest inclui `app/**/*.test.{ts,tsx}`; Playwright usa `tests/e2e/*.spec.ts`

## Testing Patterns

### Unit Tests

**Approach:** Vitest com globals, jsdom, setup em `vitest.setup.ts`.

**Location:** Colocados ao lado do código ou em pastas de teste.

**Configuration:** `vitest.config.ts` usa `vite-tsconfig-paths` e `setupFiles: ["./vitest.setup.ts"]`.

### Integration Tests

**Approach:** Mesmo stack Vitest + Testing Library.

**Location:** `app/**/*.test.{ts,tsx}`

### E2E Tests

**Approach:** Playwright com `@playwright/test`.

**Location:** `tests/e2e/`

**Example:** `home.spec.ts` – redireciona home para login e verifica heading "Bem-vindo de volta".

## Test Execution

**Commands:**

- `pnpm test` – Vitest run
- `pnpm test:watch` – Vitest watch
- `pnpm e2e` – Playwright test

**Configuration:** `vitest.config.ts`, `playwright.config.ts`.

## Coverage Targets

**Current:** Não medido.

**Goals:** Aumentar cobertura conforme features críticas.

**Enforcement:** Não automatizado.
