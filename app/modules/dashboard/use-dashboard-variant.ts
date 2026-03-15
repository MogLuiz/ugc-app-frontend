import { useAuth } from "~/hooks/use-auth";
import type { UserRole } from "~/modules/auth/types";

/**
 * Define qual variante do dashboard exibir (criador ou empresa).
 *
 * Quando integrado com o backend, a informação virá do perfil do usuário (user.role).
 * Por enquanto, usa o role do usuário autenticado quando disponível.
 *
 * Para testar a dashboard da empresa sem backend:
 * altere para DASHBOARD_VARIANT_MOCK = "business"
 */
const DASHBOARD_VARIANT_MOCK: UserRole | null = null;

export function useDashboardVariant(): UserRole {
  const { user } = useAuth();

  // Permite override para testes locais (ex: DASHBOARD_VARIANT_MOCK = "business")
  if (DASHBOARD_VARIANT_MOCK) {
    return DASHBOARD_VARIANT_MOCK;
  }

  // Quando integrado: user.role vem do backend e define a variante
  if (user?.role) {
    return user.role;
  }

  // Fallback para usuário não autenticado ou sessão em carregamento
  return "business";
}
