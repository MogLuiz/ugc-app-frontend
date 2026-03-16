/** Role usado no frontend (AuthGuard, UI) */
export type UserRole = "business" | "creator";

/** Role do backend (API) */
export type BackendRole = "COMPANY" | "CREATOR";

/** Mapeia role do backend para frontend */
export function toFrontendRole(backendRole: BackendRole): UserRole {
  return backendRole === "COMPANY" ? "business" : "creator";
}

/** Mapeia role do frontend para backend */
export function toBackendRole(frontendRole: UserRole): BackendRole {
  return frontendRole === "business" ? "COMPANY" : "CREATOR";
}

/** Payload retornado por POST /users/bootstrap e GET /profiles/me */
export type BootstrapPayload = {
  id: string;
  authUserId: string;
  email: string;
  phone?: string;
  role: BackendRole;
  status: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    userId: string;
    name?: string;
    birthDate?: string;
    gender?: string;
    photoUrl?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressCity?: string;
    addressState?: string;
    addressZipCode?: string;
    bio?: string;
    onboardingStep?: number;
    createdAt: string;
    updatedAt: string;
  };
  creatorProfile?: Record<string, unknown>;
  companyProfile?: Record<string, unknown>;
};

/** Usuário autenticado no contexto (mapeado para uso no frontend) */
export type AuthUser = {
  id: string;
  authUserId: string;
  name: string;
  email: string;
  role: UserRole;
  profile?: BootstrapPayload["profile"];
  creatorProfile?: BootstrapPayload["creatorProfile"];
  companyProfile?: BootstrapPayload["companyProfile"];
};

/** Converte payload do bootstrap para AuthUser */
export function bootstrapToAuthUser(payload: BootstrapPayload): AuthUser {
  return {
    id: payload.id,
    authUserId: payload.authUserId,
    name: payload.profile?.name ?? payload.email?.split("@")[0] ?? "Usuário",
    email: payload.email,
    role: toFrontendRole(payload.role),
    profile: payload.profile,
    creatorProfile: payload.creatorProfile,
    companyProfile: payload.companyProfile,
  };
}

export type SessionResponse = {
  authenticated: boolean;
  user: AuthUser | null;
};
