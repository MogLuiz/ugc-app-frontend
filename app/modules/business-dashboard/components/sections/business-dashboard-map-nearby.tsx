import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { DashboardCard } from "./section-primitives";

export function BusinessDashboardMapNearby({ highlights }: { highlights: string[] }) {
  const city = highlights[0] ?? null;

  return (
    <DashboardCard>
      <div className="flex items-start gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#6a36d5]/10">
          <MapPin className="size-5 text-[#6a36d5]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30]">
            Creators por perto
          </h2>
          <p className="mt-1 text-sm text-[#595c5d]">
            {city
              ? `Creators disponíveis em ${city}`
              : "Encontre creators na sua região."}
          </p>
        </div>
      </div>
      <Link
        to="/mapa"
        className="mt-4 flex w-full items-center justify-center rounded-full bg-[#6a36d5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5b2fc4]"
      >
        Ver mapa
      </Link>
    </DashboardCard>
  );
}
