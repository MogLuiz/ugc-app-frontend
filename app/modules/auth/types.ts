export type UserRole = "business" | "creator";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type SessionResponse = {
  authenticated: boolean;
  user: AuthUser | null;
};
