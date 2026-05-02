import { Clock, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { getInitials } from "~/modules/contract-requests/utils";
import type { CompanyCampaignsLocationState } from "~/modules/contract-requests/company-campaigns-location-state";
import type { BusinessAwaitingCreatorConfirmVm } from "../../types";
import { DashboardCard, SectionHeader, SectionSkeleton, SectionMessage } from "./section-primitives";

// TODO: extrair CreatorAvatar para componente compartilhado se chegar a 3+ usos na dashboard
function CreatorAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="size-10 shrink-0 rounded-xl object-cover"
      />
    );
  }
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#6a36d5]/10 text-xs font-bold text-[#6a36d5]">
      {getInitials(name)}
    </div>
  );
}

function AwaitingCreatorCard({ item }: { item: BusinessAwaitingCreatorConfirmVm }) {
  const navigate = useNavigate();

  return (
    <DashboardCard shadowTone="neutral" className="p-4">
      <div className="flex items-start gap-3">
        <CreatorAvatar name={item.creatorName} avatarUrl={item.creatorAvatarUrl} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#2c2f30]">{item.creatorName}</p>
          <p className="truncate text-sm text-[#595c5d]">{item.title}</p>
          {item.dateLabel ? (
            <p className="mt-0.5 text-xs text-[#595c5d]/70">{item.dateLabel}</p>
          ) : null}
          {item.deadlineLabel ? (
            <p className="mt-1 flex items-center gap-1 text-[10px] text-[#595c5d]/60">
              <Clock className="size-3 shrink-0" aria-hidden />
              {item.deadlineLabel}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() =>
            navigate("/ofertas?tab=IN_PROGRESS", {
              state: { openContractRequestId: item.id } satisfies CompanyCampaignsLocationState,
            })
          }
          className="flex-1 rounded-[32px] border border-slate-200 bg-slate-50 py-2 text-center text-xs font-bold text-[#2c2f30] transition hover:bg-slate-100"
        >
          Ver campanha
        </button>
        <button
          type="button"
          onClick={() => navigate(`/chat?contractRequestId=${item.id}`)}
          className="flex items-center justify-center gap-1.5 rounded-[32px] bg-[#6a36d5] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#5b2fc4]"
          aria-label="Abrir chat"
        >
          <MessageCircle className="size-3.5" aria-hidden />
          Chat
        </button>
      </div>
    </DashboardCard>
  );
}

export function BusinessDashboardAwaitingCreator({
  items,
  isLoading,
  errorMessage,
}: {
  items: BusinessAwaitingCreatorConfirmVm[];
  isLoading: boolean;
  errorMessage: string | null;
}) {
  if (!isLoading && !errorMessage && items.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Em confirmação final"
        description="Você já confirmou estes trabalhos. Agora aguardamos o creator ou a conclusão automática."
      />

      {isLoading ? <SectionSkeleton rows={1} /> : null}

      {!isLoading && errorMessage ? (
        <SectionMessage message={errorMessage} tone="error" />
      ) : null}

      {!isLoading && !errorMessage && items.length > 0 ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map((item) => (
            <AwaitingCreatorCard key={item.id} item={item} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
