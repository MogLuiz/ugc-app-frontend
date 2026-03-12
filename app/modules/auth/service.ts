import { httpClient } from "~/lib/http/client";
import type { SessionResponse } from "~/modules/auth/types";

export async function getSession(signal?: AbortSignal) {
  return httpClient<SessionResponse>("/auth/session", { signal });
}

export async function logout() {
  return httpClient<void>("/auth/logout", { method: "POST" });
}
