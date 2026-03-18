import { Navigate } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { useAuth } from "~/hooks/use-auth";
import { CreatorCalendarScreen } from "~/modules/creator-calendar/components/creator-calendar-screen";

export default function AgendaRoute() {
  const { user } = useAuth();

  return (
    <AuthGuard>
      {user?.role === "creator" ? (
        <CreatorCalendarScreen />
      ) : (
        <Navigate to="/dashboard" replace />
      )}
    </AuthGuard>
  );
}
