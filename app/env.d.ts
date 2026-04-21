/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_PUBLIC_APP_URL?: string;
  readonly VITE_GOOGLE_MAPS_API_KEY?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_SUPPORT_WHATSAPP_NUMBER?: string;
  /** DSN público do projeto Sentry (browser). */
  readonly VITE_SENTRY_DSN?: string;
  /** `false` desliga o SDK mesmo com DSN configurado. */
  readonly VITE_SENTRY_ENABLED?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  /** Alinha eventos e upload de sourcemaps; na Vercel pode espelhar o commit. */
  readonly VITE_SENTRY_RELEASE?: string;
  /**
   * Preenchido no build a partir de `VERCEL_GIT_COMMIT_SHA` (ver `vite.config.ts`).
   * Não definir manualmente no `.env` em geral.
   */
  readonly VITE_VERCEL_GIT_COMMIT_SHA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
