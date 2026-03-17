# Tech Stack

**Analyzed:** 2025-03-17

## Core

- Framework: React Router 7.12.0 (Framework Mode)
- Language: TypeScript 5.9.2 (strict)
- Runtime: Node >=20
- Package manager: pnpm 10.5.1

## Frontend

- UI Framework: React 19.2.4
- Styling: Tailwind CSS 4.1.13 + @tailwindcss/vite 4.1.13
- Componentes: Radix UI 1.4.3, class-variance-authority 0.7.1, tailwind-merge 3.5.0
- State Management: TanStack React Query 5.90.21
- Form Handling: react-hook-form 7.71.2 + @hookform/resolvers 5.2.2 + zod 3.25.76
- Ícones: lucide-react 0.575.0

## API & Auth

- API Style: REST via fetch centralizado (`lib/http/client`)
- Auth: @supabase/supabase-js 2.99.2
- Firebase: 12.10.0 (integração adicional)

## Testing

- Unit/Integration: Vitest 4.0.18, @testing-library/react 16.3.2, jsdom 28.1.0
- E2E: Playwright 1.54.2

## External Services

- Supabase: autenticação e sessão
- Firebase: (configurado, uso específico conforme feature)
- Backend API: REST em `VITE_API_BASE_URL` (default: localhost:3000 dev, api.ugc-app.com.br prod)

## Development Tools

- Build: Vite 7.1.7, @vitejs/plugin-react 5.0.4
- Paths: vite-tsconfig-paths 5.1.4
- Lint: @tanstack/eslint-plugin-query 5.91.4
- UI: shadcn 3.8.5, tw-animate-css 1.4.0
