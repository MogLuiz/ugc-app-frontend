import { supabase } from "~/lib/supabase";
import { httpClient } from "~/lib/http/client";
import type {
  BackendRole,
  BootstrapPayload,
  SessionResponse,
  UserRole,
} from "~/modules/auth/types";
import {
  bootstrapToAuthUser,
  toBackendRole,
  toFrontendRole,
} from "~/modules/auth/types";
import { HttpError } from "~/lib/http/errors";

export type UpdateProfileData = {
  name?: string;
  bio?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
};

export async function updateProfile(
  data: UpdateProfileData,
  token?: string
): Promise<BootstrapPayload> {
  const session = token
    ? { access_token: token }
    : (await supabase.auth.getSession()).data.session;
  const accessToken = session?.access_token;
  if (!accessToken) throw new Error("Usuário não autenticado");
  return httpClient<BootstrapPayload>("/profiles/me", {
    method: "PATCH",
    body: data,
    token: accessToken,
  });
}

export type UpdateCompanyProfileData = {
  documentType?: "CPF" | "CNPJ";
  documentNumber?: string;
  companyName?: string;
  jobTitle?: string;
  businessNiche?: string;
};

export async function updateCompanyProfile(
  data: UpdateCompanyProfileData,
  token?: string
): Promise<BootstrapPayload> {
  const session = token
    ? { access_token: token }
    : (await supabase.auth.getSession()).data.session;
  const accessToken = session?.access_token;
  if (!accessToken) throw new Error("Usuário não autenticado");
  return httpClient<BootstrapPayload>("/profiles/me/company", {
    method: "PATCH",
    body: data,
    token: accessToken,
  });
}

const ROLE_STORAGE_KEY = "ugc_role";

export function getStoredRole(): UserRole | null {
  const stored = localStorage.getItem(ROLE_STORAGE_KEY);
  if (stored === "business" || stored === "creator") return stored;
  return null;
}

export function setStoredRole(role: UserRole): void {
  localStorage.setItem(ROLE_STORAGE_KEY, role);
}

export async function getSession(signal?: AbortSignal): Promise<SessionResponse> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    return { authenticated: false, user: null };
  }

  const token = session.access_token;

  try {
    const payload = await httpClient<BootstrapPayload>("/profiles/me", {
      signal,
      token,
    });
    return {
      authenticated: true,
      user: bootstrapToAuthUser(payload),
    };
  } catch (err) {
    if (err instanceof HttpError && err.status === 404) {
      const metadataRole = session.user?.user_metadata?.role as
        | BackendRole
        | undefined;
      const roleFromMetadata =
        metadataRole === "COMPANY" || metadataRole === "CREATOR"
          ? toFrontendRole(metadataRole)
          : null;
      const role = roleFromMetadata ?? getStoredRole() ?? "business";
      const bootstrapPayload = await bootstrapUser(role, token);
      return {
        authenticated: true,
        user: bootstrapToAuthUser(bootstrapPayload),
      };
    }
    throw err;
  }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function bootstrapUser(
  role: UserRole,
  token?: string
): Promise<BootstrapPayload> {
  const session = token
    ? { access_token: token }
    : (await supabase.auth.getSession()).data.session;
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("Usuário não autenticado");
  }

  return httpClient<BootstrapPayload>("/users/bootstrap", {
    method: "POST",
    body: { role: toBackendRole(role) },
    token: accessToken,
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(
  email: string,
  password: string,
  options?: { name?: string; role?: UserRole }
) {
  const data: Record<string, string> = {};
  if (options?.name) data.name = options.name;
  if (options?.role) data.role = toBackendRole(options.role);
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: Object.keys(data).length > 0 ? data : undefined,
    },
  });
}
