import { Star } from "lucide-react";
import { useNavigate } from "react-router";
import { getInitials } from "~/modules/contract-requests/utils";
import type { CompanyDashboardPendingReviewItem } from "../../types";
import { DashboardCard, SectionHeader } from "./section-primitives";

export function BusinessDashboardPendingReviews({
  items,
  hasOverflow,
}: {
  items: CompanyDashboardPendingReviewItem[];
  hasOverflow: boolean;
}) {
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Avaliações pendentes"
        description="Contratos concluídos aguardando sua avaliação."
        ctaLabel={hasOverflow ? "Ver todas" : undefined}
        ctaTo={hasOverflow ? "/ofertas?tab=FINALIZED" : undefined}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {items.map((item) => (
          <DashboardCard key={item.id} shadowTone="neutral" className="p-4">
            <div className="flex gap-3">
              {item.creatorAvatarUrl ? (
                <img
                  src={item.creatorAvatarUrl}
                  alt=""
                  className="size-12 shrink-0 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#6a36d5]/10 text-sm font-bold text-[#6a36d5]">
                  {getInitials(item.creatorName)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#2c2f30]">{item.creatorName}</p>
                <p className="mt-0.5 truncate text-sm text-[#595c5d]">{item.title}</p>
                <p className="mt-1 text-xs text-[#595c5d]/70">{item.completedLabel}</p>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate(`/ofertas/${item.contractRequestId}`)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[32px] bg-[#6a36d5] py-3 text-xs font-bold text-white shadow-sm transition hover:bg-[#5b2fc4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6a36d5]/50"
              >
                <Star className="size-3.5 fill-white" aria-hidden />
                Avaliar creator
              </button>
            </div>
          </DashboardCard>
        ))}
      </div>
    </section>
  );
}
