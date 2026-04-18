import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKeyEnv, getSupabaseUrlEnv } from "~/lib/env";

let browserSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (typeof window === "undefined") {
    throw new Error("Supabase client is only available in the browser");
  }

  if (!browserSupabaseClient) {
    browserSupabaseClient = createClient(
      getSupabaseUrlEnv(),
      getSupabaseAnonKeyEnv()
    );
  }

  return browserSupabaseClient;
}
