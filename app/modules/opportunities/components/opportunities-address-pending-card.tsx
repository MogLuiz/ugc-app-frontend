import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { DashboardCard } from "~/components/ui/dashboard-card";
import { Button } from "~/components/ui/button";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import { cn } from "~/lib/utils";

const COPY = {
  title: "Adicione seu endereço para ver oportunidades",
  description:
    "Adicione seu endereço no perfil para visualizar vagas perto de você.",
  cta: "Completar perfil",
} as const;

function AddressEmptyIllustration() {
  return (
    <div
      className="flex size-8 items-center justify-center rounded-xl bg-[#f0ebff]"
      aria-hidden
    >
      <MapPin className="size-3.5 text-[#6a36d5]" />
    </div>
  );
}

/** Pendência de endereço — mesmo padrão de empty state da dashboard (ex.: convites). */
export function OpportunitiesAddressPendingCard({
  className,
}: {
  className?: string;
}) {
  return (
    <DashboardCard className={cn("p-3 lg:p-3", className)}>
      <MobileEmptyState
        density="compact"
        variant="no-data"
        illustration={<AddressEmptyIllustration />}
        title={COPY.title}
        description={COPY.description}
        actions={
          <div className="flex justify-center">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 rounded-full border-[#6a36d5]/35 px-3.5 text-xs font-semibold text-[#6a36d5] hover:bg-[#6a36d5]/5"
            >
              <Link to="/perfil">{COPY.cta}</Link>
            </Button>
          </div>
        }
      />
    </DashboardCard>
  );
}
