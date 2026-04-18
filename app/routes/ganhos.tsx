import { AuthGuard } from "~/components/auth-guard";
import { GanhosScreen } from "~/modules/payments/components/GanhosScreen";

export default function GanhosRoute() {
  return (
    <AuthGuard allowedRoles={["creator"]}>
      <GanhosScreen />
    </AuthGuard>
  );
}
