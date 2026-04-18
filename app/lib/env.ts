function requireEnv(name: 'VITE_API_BASE_URL' | 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  const value = import.meta.env[name];

  if (!value || value.trim() === '') {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

export const env = {
  VITE_API_BASE_URL: requireEnv('VITE_API_BASE_URL'),
  VITE_SUPABASE_URL: requireEnv('VITE_SUPABASE_URL'),
  VITE_SUPABASE_ANON_KEY: requireEnv('VITE_SUPABASE_ANON_KEY'),
} as const;
