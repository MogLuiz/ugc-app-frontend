import { AuthGuard } from "~/components/auth-guard";
import { CreatorProfileScreen } from "~/modules/creator-profile/components/creator-profile-screen";

export default function CreatorProfileRoute() {
  return (
    <AuthGuard>
      <CreatorProfileScreen />
    </AuthGuard>
  );
}
