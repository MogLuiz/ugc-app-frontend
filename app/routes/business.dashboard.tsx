import { AuthGuard } from "~/components/auth-guard";
import { DashboardOverview } from "~/modules/dashboard/components/dashboard-overview";

export default function BusinessDashboardRoute() {
  return (
    <AuthGuard allowedRoles={["business"]}>
      <section className="space-y-4">
        <h1 className="text-lg font-semibold">Dashboard da Empresa</h1>
        <DashboardOverview role="business" />
      </section>
    </AuthGuard>
  );
}
