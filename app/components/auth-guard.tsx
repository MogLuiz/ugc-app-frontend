import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import type { UserRole } from "~/modules/auth/types";
import { AppLoadingSplash } from "~/components/ui/app-loading-splash";

type AuthGuardProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <AppLoadingSplash />;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
