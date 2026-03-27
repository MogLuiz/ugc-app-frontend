import { AuthGuard } from "~/components/auth-guard";
import { CreateCampaignScreen } from "~/modules/create-campaign/components/create-campaign-screen";

export default function CriarRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <CreateCampaignScreen />
    </AuthGuard>
  );
}
