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

export const env = {
  VITE_API_BASE_URL: requireEnv(
    "VITE_API_BASE_URL",
    import.meta.env.VITE_API_BASE_URL
  ),
  VITE_SUPABASE_URL: requireEnv(
    "VITE_SUPABASE_URL",
    import.meta.env.VITE_SUPABASE_URL
  ),
  VITE_SUPABASE_ANON_KEY: requireEnv(
    "VITE_SUPABASE_ANON_KEY",
    import.meta.env.VITE_SUPABASE_ANON_KEY
  ),
} as const;
