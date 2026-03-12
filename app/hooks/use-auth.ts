import { useAuthContext } from "~/modules/auth/context";

export function useAuth() {
  return useAuthContext();
}
