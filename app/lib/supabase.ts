import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKeyEnv, getSupabaseUrlEnv } from "~/lib/env";

let browserSupabaseClient: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
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

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getSupabaseClient(), prop, receiver);
  },
});
