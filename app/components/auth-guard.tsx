import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import type { UserRole } from "~/modules/auth/types";

type AuthGuardProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="p-4 text-sm text-slate-600">Carregando sessao...</p>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
