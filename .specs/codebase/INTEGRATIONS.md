# External Integrations

## Authentication

**Service:** Supabase Auth

**Purpose:** Login, registro, sessão persistente.

**Implementation:** `app/lib/supabase.ts` (client Supabase), `app/modules/auth/service.ts` (getSession, signIn, signUp, logout).

**Configuration:** Variáveis de ambiente Supabase (URL, anon key).

**Authentication:** Supabase gerencia sessão; access_token enviado como Bearer nas requisições ao backend.

## Backend API

**Service:** API REST do UGC App

**Purpose:** Bootstrap de usuário, perfis, uploads (avatar, portfólio).

**Implementation:** `app/lib/http/client.ts` (httpClient), `app/modules/auth/service.ts`.

**Configuration:** `VITE_API_BASE_URL` ou default por ambiente (dev: localhost:3000, prod: api.ugc-app.com.br).

**Authentication:** Bearer token (Supabase access_token) em header `Authorization`.

**Key endpoints:**

- `GET /profiles/me` – dados do usuário autenticado
- `PATCH /profiles/me` – atualizar perfil
- `PATCH /profiles/me/company` – atualizar perfil empresa
- `POST /users/bootstrap` – bootstrap por role
- `POST /uploads/avatar` – upload de avatar (FormData)
- `POST /uploads/portfolio-media` – upload de mídia (FormData)
- `DELETE /profiles/me/portfolio/media/:mediaId` – remover mídia

## Firebase

**Service:** Firebase

**Purpose:** Integração adicional (configurado no projeto).

**Implementation:** Dependência `firebase` no package.json.

**Configuration:** Variáveis de ambiente conforme setup Firebase.

## Google Maps

**Service:** Google Maps (creators-map)

**Purpose:** Exibir mapa de criadoras.

**Implementation:** `app/modules/creators-map/lib/google-maps.ts`, `app/modules/creators-map/components/google-creators-map.tsx`.

**Configuration:** API key ou configuração específica do módulo.

## Webhooks

Não identificados no frontend.

## Background Jobs

Não aplicável ao frontend.
