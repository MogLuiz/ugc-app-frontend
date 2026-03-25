import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { EmptyState } from "~/components/ui/empty-state";
import type { CompanyCampaignsLocationState } from "~/modules/contract-requests/company-campaigns-location-state";
import type { CompanyDashboardPendingItem } from "../../types";
import { DashboardCard, SectionHeader, SectionMessage, SectionSkeleton } from "./section-primitives";

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
    <DashboardCard className="border-[rgba(106,54,213,0.14)] bg-[linear-gradient(180deg,rgba(106,54,213,0.06),rgba(255,255,255,1))]">
      <SectionHeader
        title="Aguardando resposta"
        description="Solicitações aguardando ação do creator."
        ctaLabel="Ver todas"
        ctaTo="/campanhas"
        addon={
          items.length > 0 ? (
            <span className="rounded-full bg-[#6a36d5]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6a36d5]">
              {items.length} {items.length === 1 ? "novo" : "novos"}
            </span>
          ) : null
        }
      />

      {isRefreshing && !isLoading ? (
        <p className="mt-4 text-xs font-medium text-[#595c5d]/70">Atualizando...</p>
      ) : null}

      <div className="mt-5">
        {isLoading ? <SectionSkeleton rows={2} /> : null}

        {!isLoading && errorMessage ? (
          <SectionMessage message={errorMessage} tone="error" />
        ) : null}

        {!isLoading && !errorMessage && items.length === 0 ? (
          hasCampaignData ? (
            <EmptyState
              title="Nenhuma solicitação pendente"
              description="Tudo que dependia de aceite do creator já foi respondido."
            />
          ) : (
            <EmptyState
              title="Nenhuma campanha encontrada"
              description="Quando houver solicitações criadas, elas aparecerão aqui."
            />
          )
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-[20px] border border-[rgba(106,54,213,0.1)] bg-white p-4"
              >
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
                      navigate("/campanhas", {
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
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </DashboardCard>
  );
}
