import { getSupabaseClient } from "~/lib/supabase";
import { httpClient } from "~/lib/http/client";
import { getApiBaseUrl } from "~/lib/config/env";
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
  birthDate?: string;
  bio?: string;
  phone?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
};

export type UpdateCreatorProfileData = {
  instagramUsername?: string;
  tiktokUsername?: string;
  cpf?: string;
  referralSource?: string;
  portfolioUrl?: string;
};

export async function updateProfile(
  data: UpdateProfileData,
  token?: string
): Promise<BootstrapPayload> {
  const supabase = getSupabaseClient();
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

export async function getAccessToken(token?: string): Promise<string> {
  const supabase = getSupabaseClient();
  const session = token
    ? { access_token: token }
    : (await supabase.auth.getSession()).data.session;
  const accessToken = session?.access_token;
  if (!accessToken) throw new Error("Usuário não autenticado");
  return accessToken;
}

export async function updateCompanyProfile(
  data: UpdateCompanyProfileData,
  token?: string
): Promise<BootstrapPayload> {
  const accessToken = await getAccessToken(token);
  return httpClient<BootstrapPayload>("/profiles/me/company", {
    method: "PATCH",
    body: data,
    token: accessToken,
  });
}

export async function updateCreatorProfile(
  data: UpdateCreatorProfileData,
  token?: string
): Promise<BootstrapPayload> {
  const accessToken = await getAccessToken(token);
  return httpClient<BootstrapPayload>("/profiles/me/creator", {
    method: "PATCH",
    body: data,
    token: accessToken,
  });
}

export async function uploadAvatar(
  file: File,
  token?: string
): Promise<BootstrapPayload> {
  const accessToken = await getAccessToken(token);

  const formData = new FormData();
  formData.append("file", file);

  const url = `${getApiBaseUrl()}/uploads/avatar`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as { message?: string }).message)
        : "Erro no upload";
    throw new Error(message);
  }

  return response.json() as Promise<BootstrapPayload>;
}

export async function uploadPortfolioMedia(
  file: File,
  token?: string
): Promise<BootstrapPayload> {
  const accessToken = await getAccessToken(token);

  const formData = new FormData();
  formData.append("file", file);

  const url = `${getApiBaseUrl()}/uploads/portfolio-media`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as { message?: string }).message)
        : "Erro no upload";
    throw new Error(message);
  }

  return response.json() as Promise<BootstrapPayload>;
}

export async function deletePortfolioMedia(
  mediaId: string,
  token?: string
): Promise<BootstrapPayload> {
  const accessToken = await getAccessToken(token);
  return httpClient<BootstrapPayload>(`/profiles/me/portfolio/media/${mediaId}`, {
    method: "DELETE",
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
  const supabase = getSupabaseClient();
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
      const pendingReferralCode =
        (session.user?.user_metadata?.referralCode as string | undefined)
          ?.trim().toLowerCase() || undefined;
      const bootstrapPayload = await bootstrapUser(role, token, pendingReferralCode);
      if (pendingReferralCode) {
        // Clear from metadata after successful bootstrap to avoid stale state.
        // Non-critical: if this fails, no double-claim risk since this 404 path won't run again.
        await supabase.auth.updateUser({ data: { referralCode: null } }).catch(() => { });
      }
      return {
        authenticated: true,
        user: bootstrapToAuthUser(bootstrapPayload),
      };
    }
    throw err;
  }
}

export async function logout(): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
}

export async function bootstrapUser(
  role: UserRole,
  token?: string,
  referralCode?: string
): Promise<BootstrapPayload> {
  const supabase = getSupabaseClient();
  const session = token
    ? { access_token: token }
    : (await supabase.auth.getSession()).data.session;
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("Usuário não autenticado");
  }

  const body: { role: ReturnType<typeof toBackendRole>; referralCode?: string } = {
    role: toBackendRole(role),
  };
  const trimmed = referralCode?.trim();
  if (trimmed) {
    body.referralCode = trimmed;
  }

  return httpClient<BootstrapPayload>("/users/bootstrap", {
    method: "POST",
    body,
    token: accessToken,
  });
}

export async function forgotPassword(email: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://app.ugclocal.com.br/auth/redefinir-senha',
  });
  if (error) throw new Error(error.message);
}

export async function resetPassword(newPassword: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
  // Encerra a sessão de recovery para evitar estado residual no AuthProvider
  await supabase.auth.signOut();
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const supabase = getSupabaseClient();
  const session = (await supabase.auth.getSession()).data.session;
  if (!session?.user?.email) throw new Error("Usuário não autenticado");

  // Re-autentica para validar a senha atual.
  // Nota: signInWithPassword dispara SIGNED_IN no onAuthStateChange global (AuthProvider),
  // que invalida queries e causa um refetch da sessão em background. Isso não desloga o
  // usuário nem afeta o estado visível (React Query usa isFetching, não isLoading, em
  // refetches quando há cache). Validar se há flash visual durante os testes.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: session.user.email,
    password: currentPassword,
  });
  if (signInError) throw new Error("Senha atual incorreta");

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient();
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(
  email: string,
  password: string,
  options?: { name?: string; role?: UserRole; referralCode?: string }
) {
  const supabase = getSupabaseClient();
  const data: Record<string, string> = {};
  if (options?.name) data.name = options.name;
  if (options?.role) data.role = toBackendRole(options.role);
  const sanitizedReferralCode = options?.referralCode?.trim().toLowerCase();
  if (sanitizedReferralCode) data.referralCode = sanitizedReferralCode;
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: Object.keys(data).length > 0 ? data : undefined,
    },
  });
}
