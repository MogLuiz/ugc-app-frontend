import { useParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { OpportunityDetailScreen } from "~/modules/opportunities/components/opportunity-detail-screen";

export default function OportunidadeDetailRoute() {
  const { id } = useParams<{ id: string }>();

  return (
    <AuthGuard allowedRoles={["creator"]}>
      <OpportunityDetailScreen id={id!} />
    </AuthGuard>
  );
}
