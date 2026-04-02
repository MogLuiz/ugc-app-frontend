import { supabase } from "~/lib/supabase";
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

export function clearStoredRole(): void {
  localStorage.removeItem(ROLE_STORAGE_KEY);
}

/**
 * Owner único do bootstrap: getSession() é o único responsável por acionar
 * POST /users/bootstrap no fluxo normal. O acionamento ocorre quando o usuário
 * existe no Supabase mas ainda não foi criado no banco da aplicação (primeiro
 * acesso após cadastro ou recuperação de conta via re-link de authUserId).
 *
 * Nenhum outro ponto do frontend deve acionar bootstrap diretamente.
 */
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
      const pendingReferralCode =
        (session.user?.user_metadata?.referralCode as string | undefined)
          ?.trim().toLowerCase() || undefined;
      // Lê nome dos metadados do Supabase para usar na criação do profile.
      const pendingName =
        (session.user?.user_metadata?.name as string | undefined)?.trim() || undefined;
      const bootstrapPayload = await bootstrapUser(role, token, pendingReferralCode, pendingName);

      // storedRole foi usado como fallback neste path (404). Limpa após bootstrap
      // bem-sucedido para evitar contaminação em futuros fluxos no mesmo navegador.
      // Não limpar no path 200 — o fallback nem chegou a ser necessário.
      clearStoredRole();

      // Só limpa referralCode dos metadados se o claim não falhou inesperadamente.
      // undefined = backend antigo sem o campo → tratar como seguro limpar (backward compat).
      // 'error' = erro transiente → manter o código para permitir retry futuro.
      const canClearReferral = bootstrapPayload.referralStatus !== 'error';
      if (pendingReferralCode && canClearReferral) {
        // Non-critical: limpa referralCode dos metadados em background.
        // Não aguardar — não afeta o usuário e pode ocorrer após getSession() retornar.
        void supabase.auth.updateUser({ data: { referralCode: null } }).catch(() => {});
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
  clearStoredRole();
  await supabase.auth.signOut();
}

// Deduplicação de bootstraps em memória — camada de defesa secundária.
// Evita requests HTTP duplicados quando getSession() é chamado concorrentemente
// por múltiplos subscribers da session query. Chave: accessToken (estável na
// janela de race de milissegundos; troca apenas a cada ~1h em token refresh).
const _bootstrapInFlight = new Map<string, Promise<BootstrapPayload>>();

export async function bootstrapUser(
  role: UserRole,
  token?: string,
  referralCode?: string,
  name?: string,
): Promise<BootstrapPayload> {
  const session = token
    ? { access_token: token }
    : (await supabase.auth.getSession()).data.session;
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error("Usuário não autenticado");
  }

  // Se já há uma Promise de bootstrap em voo para este token, reutiliza.
  const inflight = _bootstrapInFlight.get(accessToken);
  if (inflight) return inflight;

  const body: {
    role: ReturnType<typeof toBackendRole>;
    referralCode?: string;
    name?: string;
  } = { role: toBackendRole(role) };
  const trimmed = referralCode?.trim();
  if (trimmed) body.referralCode = trimmed;
  const trimmedName = name?.trim();
  if (trimmedName) body.name = trimmedName;

  const promise = httpClient<BootstrapPayload>("/users/bootstrap", {
    method: "POST",
    body,
    token: accessToken,
  }).finally(() => {
    _bootstrapInFlight.delete(accessToken);
  });

  _bootstrapInFlight.set(accessToken, promise);
  return promise;
}

export async function forgotPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/redefinir-senha`,
  });
}

export async function resetPassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
  // Encerra a sessão de recovery para evitar estado residual no AuthProvider
  await supabase.auth.signOut();
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
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
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(
  email: string,
  password: string,
  options?: { name?: string; role?: UserRole; referralCode?: string }
) {
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
