import { AuthGuard } from "~/components/auth-guard";
import { DashboardOverview } from "~/modules/dashboard/components/dashboard-overview";

export default function CreatorDashboardRoute() {
  return (
    <AuthGuard allowedRoles={["creator"]}>
      <section className="space-y-4">
        <h1 className="text-lg font-semibold">Dashboard da Criadora</h1>
        <DashboardOverview role="creator" />
      </section>
    </AuthGuard>
  );
}
