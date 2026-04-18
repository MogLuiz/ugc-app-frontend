function requireEnv(
  name: 'VITE_API_BASE_URL' | 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY',
  viteValue: string | undefined,
): string {
  const processValue =
    typeof process !== "undefined" ? process.env?.[name] : undefined;
  const value = viteValue ?? processValue;

  if (!value || value.trim() === '') {
    throw new Error(`Missing ${name}`);
  }

  return value;
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
