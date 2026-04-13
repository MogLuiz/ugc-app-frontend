import { MessageCircle, Send } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import type { CompanyCampaignsLocationState } from "~/modules/contract-requests/company-campaigns-location-state";
import type { CompanyDashboardPendingItem } from "../../types";
import { DashboardCard, SectionHeader, SectionMessage, SectionSkeleton } from "./section-primitives";

function PendingRequestsEmptyIllustration() {
  return (
    <div
      className="flex size-8 items-center justify-center rounded-xl bg-[#f0ebff]"
      aria-hidden
    >
      <Send className="size-3.5 text-[#6a36d5]" />
    </div>
  );
}

export function BusinessDashboardPendingRequests({
  items,
  isLoading,
  errorMessage,
  hasCampaignData,
  isRefreshing,
  getCreatorFallbackInitials,
}: {
  items: CompanyDashboardPendingItem[];
  isLoading: boolean;
  errorMessage: string | null;
  hasCampaignData: boolean;
  isRefreshing: boolean;
  getCreatorFallbackInitials: (name: string) => string;
}) {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Aguardando resposta"
        description="Solicitações aguardando ação do creator."
        ctaLabel="Ver todas"
        ctaTo="/ofertas"
        addon={
          items.length > 0 ? (
            <span className="rounded-full bg-[#6a36d5]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6a36d5]">
              {items.length} {items.length === 1 ? "novo" : "novos"}
            </span>
          ) : null
        }
      />

      {isLoading ? <SectionSkeleton rows={2} /> : null}

      {!isLoading && errorMessage ? (
        <SectionMessage message={errorMessage} tone="error" />
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <DashboardCard shadowTone="neutral" className="p-3 lg:p-3">
          {hasCampaignData ? (
            <MobileEmptyState
              density="compact"
              variant="no-data"
              illustration={<PendingRequestsEmptyIllustration />}
              title="Nenhuma solicitação pendente"
              description="Tudo que dependia de aceite do creator já foi respondido."
              actions={
                <div className="flex justify-center">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-[#6a36d5]/35 px-3.5 text-xs font-semibold text-[#6a36d5] hover:bg-[#6a36d5]/5"
                  >
                    <Link to="/ofertas">Ver ofertas</Link>
                  </Button>
                </div>
              }
            />
          ) : (
            <MobileEmptyState
              density="compact"
              variant="no-data"
              illustration={<PendingRequestsEmptyIllustration />}
              title="Nenhuma campanha encontrada"
              description="Quando houver solicitações criadas, elas aparecerão aqui."
              actions={
                <div className="flex justify-center">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full border-[#6a36d5]/35 px-3.5 text-xs font-semibold text-[#6a36d5] hover:bg-[#6a36d5]/5"
                  >
                    <Link to="/marketplace">Explorar marketplace</Link>
                  </Button>
                </div>
              }
            />
          )}
        </DashboardCard>
      ) : null}

      {!isLoading && !errorMessage && items.length > 0 ? (
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
                    {getCreatorFallbackInitials(item.creatorName)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#2c2f30]">{item.title}</p>
                  <p className="mt-0.5 text-sm text-[#595c5d]">{item.creatorName}</p>
                  <p className="mt-2 text-xs text-[#595c5d]/80">
                    {item.statusLabel} · {item.waitingLabel}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/ofertas", {
                      state: { openContractRequestId: item.id } satisfies CompanyCampaignsLocationState,
                    })
                  }
                  className="min-h-11 flex-1 rounded-[32px] bg-[#6a36d5] py-3 text-center text-xs font-bold text-white shadow-sm transition hover:bg-[#5b2fc4]"
                >
                  Aprovar / Revisar
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/chat?contractRequestId=${item.id}`)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-[rgba(106,54,213,0.2)] bg-white text-[#6a36d5] transition hover:bg-[#6a36d5]/5"
                  aria-label="Abrir chat"
                >
                  <MessageCircle className="size-5" />
                </button>
              </div>
            </DashboardCard>
          ))}
        </div>
      ) : null}
    </section>
  );
}
