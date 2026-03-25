import { MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { CreatorInviteVm } from "../../types";
import {
  useAcceptContractRequestMutation,
  useRejectContractRequestMutation,
} from "~/modules/contract-requests/queries";
import {
  DashboardCard,
  SectionHeader,
  SectionMessage,
  SectionSkeleton,
} from "~/modules/business-dashboard/components/sections/section-primitives";

export function PendingInvitesSection({
  items,
  isLoading,
  errorMessage,
  isRefreshing,
}: {
  items: CreatorInviteVm[];
  isLoading: boolean;
  errorMessage: string | null;
  isRefreshing: boolean;
}) {
  const acceptMutation = useAcceptContractRequestMutation();
  const rejectMutation = useRejectContractRequestMutation();

  const busyId =
    acceptMutation.isPending && acceptMutation.variables
      ? acceptMutation.variables
      : rejectMutation.isPending && rejectMutation.variables
        ? rejectMutation.variables.contractRequestId
        : null;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="Convites aguardando resposta" />

      {isRefreshing && !isLoading ? (
        <p className="text-xs font-medium text-[#595c5d]/80">Atualizando convites…</p>
      ) : null}

      {isLoading ? <SectionSkeleton rows={2} /> : null}

      {!isLoading && errorMessage ? (
        <SectionMessage message={errorMessage} tone="error" />
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <SectionMessage message="Nenhum convite pendente no momento." tone="default" />
      ) : null}

      <div className="flex flex-col gap-3">
        {!isLoading &&
          !errorMessage &&
          items.map((invite) => (
            <DashboardCard key={invite.id} className="p-4 lg:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-1 gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#6a36d5]/10 text-sm font-black text-[#6a36d5]">
                    {invite.companyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#2c2f30]">{invite.companyName}</h4>
                    <p className="mt-0.5 text-sm text-[#595c5d]">{invite.campaignTitle}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                      <span className="text-lg font-black text-[#6a36d5]">
                        💰 {invite.paymentDisplay}
                      </span>
                      <span className="text-[#595c5d]">📅 {invite.proposedDateDisplay}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                  <Button
                    type="button"
                    size="sm"
                    className="rounded-full bg-[#6a36d5] font-bold hover:bg-[#5b2fc4]"
                    disabled={busyId !== null}
                    onClick={() => acceptMutation.mutate(invite.id)}
                  >
                    {busyId === invite.id && acceptMutation.isPending ? "Aceitando…" : "Aceitar"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-full border-slate-200 font-semibold"
                    disabled={busyId !== null}
                    onClick={() =>
                      rejectMutation.mutate({ contractRequestId: invite.id })
                    }
                  >
                    {busyId === invite.id && rejectMutation.isPending ? "…" : "Recusar"}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="size-10 rounded-full border-slate-200"
                    asChild
                  >
                    <Link
                      to={`/chat?contractRequestId=${invite.id}`}
                      aria-label="Abrir chat"
                    >
                      <MessageCircle className="size-5 text-[#6a36d5]" />
                    </Link>
                  </Button>
                </div>
              </div>
            </DashboardCard>
          ))}
      </div>
    </section>
  );
}
