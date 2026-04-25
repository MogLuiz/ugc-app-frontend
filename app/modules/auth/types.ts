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
export type GeocodingStatus = "valid" | "invalid" | "pending";

export type ProfilePayload = {
  userId: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  photoUrl?: string;
  rating?: number;
  addressStreet?: string;
  addressNumber?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  formattedAddress?: string | null;
  addressHash?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  geocodingStatus?: GeocodingStatus;
  geocodedAt?: string | null;
  hasValidCoordinates?: boolean;
  bio?: string;
  onboardingStep?: number;
  createdAt: string;
  updatedAt: string;
};

export type BootstrapPayload = {
  id: string;
  authUserId: string;
  email: string;
  phone?: string;
  role: BackendRole;
  status: string;
  createdAt: string;
  updatedAt: string;
  profile?: ProfilePayload;
  creatorProfile?: Record<string, unknown>;
  companyProfile?: CompanyProfilePayload | null;
  portfolio?: PortfolioPayload | null;
  warnings?: string[];
};

export type PortfolioMediaPayload = {
  id: string;
  type: "IMAGE" | "VIDEO";
  url: string;
  thumbnailUrl?: string | null;
  mimeType?: string | null;
  sortOrder: number;
  status: "PROCESSING" | "READY" | "FAILED";
  createdAt: string;
  updatedAt: string;
};

export type PortfolioPayload = {
  id: string;
  userId: string;
  media: PortfolioMediaPayload[];
  createdAt: string;
  updatedAt: string;
};

/** Perfil da empresa retornado por GET /profiles/me */
export type CompanyProfilePayload = {
  userId: string;
  documentType?: "CPF" | "CNPJ" | null;
  documentNumber?: string | null;
  companyName?: string | null;
  jobTitle?: string | null;
  businessNiche?: string | null;
  websiteUrl?: string | null;
  instagramUsername?: string | null;
  tiktokUsername?: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Usuário autenticado no contexto (mapeado para uso no frontend) */
export type AuthUser = {
  id: string;
  authUserId: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profile?: ProfilePayload;
  creatorProfile?: BootstrapPayload["creatorProfile"];
  companyProfile?: BootstrapPayload["companyProfile"];
  portfolio?: BootstrapPayload["portfolio"];
};

/** Converte payload do bootstrap para AuthUser */
export function bootstrapToAuthUser(payload: BootstrapPayload): AuthUser {
  return {
    id: payload.id,
    authUserId: payload.authUserId,
    name: payload.profile?.name ?? "Usuário",
    email: payload.email,
    phone: payload.phone,
    role: toFrontendRole(payload.role),
    profile: payload.profile,
    creatorProfile: payload.creatorProfile,
    companyProfile: payload.companyProfile,
    portfolio: payload.portfolio,
  };
}

export type SessionResponse = {
  authenticated: boolean;
  user: AuthUser | null;
};
