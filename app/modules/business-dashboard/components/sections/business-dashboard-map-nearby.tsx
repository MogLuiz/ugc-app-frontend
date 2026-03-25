import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { DashboardCard } from "./section-primitives";

export function BusinessDashboardMapNearby({ highlights }: { highlights: string[] }) {
  return (
    <DashboardCard className="overflow-hidden bg-[linear-gradient(145deg,rgba(106,54,213,0.08),rgba(255,255,255,1)_55%)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#6a36d5]/10">
            <MapPin className="size-5 text-[#6a36d5]" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30]">Criadores por perto</h2>
            <p className="mt-1 text-sm text-[#595c5d]">Visualize creators no mapa e refine por região.</p>
          </div>
        </div>
        <Link
          to="/mapa"
          className="shrink-0 rounded-full bg-[#6a36d5] px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm hover:bg-[#5b2fc4]"
        >
          Ver mapa
        </Link>
      </div>

      {highlights.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {highlights.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-[#595c5d] shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5 h-32 rounded-2xl border border-dashed border-[rgba(106,54,213,0.25)] bg-[#e8eaed]/40" aria-hidden />
    </DashboardCard>
  );
}
