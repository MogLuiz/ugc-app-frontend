function requireEnv(
  name: 'VITE_API_BASE_URL' | 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY',
  viteValue: string | undefined,
): string {
  const value = readEnv(name, viteValue);

  if (!value || value.trim() === '') {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

function readEnv(name: string, viteValue: string | undefined): string | undefined {
  const processValue =
    typeof process !== "undefined" ? process.env?.[name] : undefined;
  return viteValue ?? processValue;
}

export function getApiBaseUrlEnv(): string {
  return requireEnv("VITE_API_BASE_URL", import.meta.env.VITE_API_BASE_URL);
}

export function getSupabaseUrlEnv(): string {
  return requireEnv("VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL);
}

export function getSupabaseAnonKeyEnv(): string {
  return requireEnv(
    "VITE_SUPABASE_ANON_KEY",
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

export function getSupportWhatsAppNumberEnv(): string | null {
  const value = readEnv(
    "VITE_SUPPORT_WHATSAPP_NUMBER",
    import.meta.env.VITE_SUPPORT_WHATSAPP_NUMBER
  );

  return value?.trim() ? value.trim() : null;
}
