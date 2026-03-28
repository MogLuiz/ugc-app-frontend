import {
  CalendarDays,
  ChevronRight,
  MessageCircle,
  Navigation,
  Wallet,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
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

/** Gera iniciais a partir das primeiras letras das palavras (até 2 letras). */
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

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
  const navigate = useNavigate();
  const acceptMutation = useAcceptContractRequestMutation();
  const rejectMutation = useRejectContractRequestMutation();

  const handleInviteClick = (id: string) => {
    const isDesktop = window.innerWidth >= 640;
    void navigate(isDesktop ? "/ofertas" : `/ofertas/${id}`);
  };

  const busyId =
    acceptMutation.isPending && acceptMutation.variables
      ? acceptMutation.variables
      : rejectMutation.isPending && rejectMutation.variables
        ? rejectMutation.variables.contractRequestId
        : null;

  return (
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Convites de trabalho"
        ctaLabel="Ver todos"
        ctaTo="/ofertas"
      />

      {isRefreshing && !isLoading ? (
        <p className="text-xs font-medium text-[#595c5d]/80">
          Atualizando convites…
        </p>
      ) : null}

      {isLoading ? <SectionSkeleton rows={2} /> : null}

      {!isLoading && errorMessage ? (
        <SectionMessage message={errorMessage} tone="error" />
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <SectionMessage
          message="Nenhum convite pendente no momento."
          tone="default"
        />
      ) : null}

      <div className="flex flex-col gap-3">
        {!isLoading &&
          !errorMessage &&
          items.map((invite) => (
            <DashboardCard key={invite.id} className="overflow-hidden p-0">
              {/* Blocos 1+2: área clicável → detalhamento */}
              <button
                type="button"
                onClick={() => handleInviteClick(invite.id)}
                className="group w-full text-left transition-colors hover:bg-slate-50 active:bg-slate-100"
              >
                {/* Bloco 1: Identidade */}
                <div className="flex items-center gap-3 p-4 lg:p-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#6a36d5]/10 text-sm font-black text-[#6a36d5]">
                    {getInitials(invite.companyName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold leading-snug text-[#2c2f30]">
                      {invite.companyName}
                    </h4>
                    <p className="mt-0.5 line-clamp-2 text-sm text-[#595c5d]">
                      {invite.campaignTitle}
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-[#6a36d5]/60" />
                </div>

                {/* Bloco 2: Metadados */}
                <div className="flex flex-wrap items-center gap-2 px-4 pb-4 lg:px-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6a36d5]/10 px-3 py-1 text-sm font-black text-[#6a36d5]">
                    <Wallet className="size-3.5 shrink-0" />
                    {invite.paymentDisplay}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-[#595c5d]">
                    <CalendarDays className="size-3.5 shrink-0" />
                    {invite.proposedDateDisplay}
                  </span>
                  {invite.distanceDisplay ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-[#595c5d]">
                      <Navigation className="size-3.5 shrink-0" />
                      {invite.distanceDisplay}
                    </span>
                  ) : null}
                </div>
              </button>

              {/* Bloco 3: Ações */}
              <div className="flex items-center gap-2 border-t border-[rgba(106,54,213,0.06)] px-4 py-3 lg:px-5">
                <Button
                  type="button"
                  size="sm"
                  className="flex-1 rounded-full bg-[#6a36d5] font-bold hover:bg-[#5b2fc4]"
                  disabled={busyId !== null}
                  onClick={() => acceptMutation.mutate(invite.id)}
                >
                  {busyId === invite.id && acceptMutation.isPending
                    ? "Aceitando…"
                    : "Aceitar"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1 rounded-full border-slate-200 font-semibold"
                  disabled={busyId !== null}
                  onClick={() =>
                    rejectMutation.mutate({ contractRequestId: invite.id })
                  }
                >
                  {busyId === invite.id && rejectMutation.isPending
                    ? "…"
                    : "Recusar"}
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="size-9 shrink-0 rounded-full border-slate-200 text-[#6a36d5]"
                  asChild
                >
                  <Link
                    to={`/chat?contractRequestId=${invite.id}`}
                    aria-label="Abrir chat"
                  >
                    <MessageCircle className="size-4" />
                  </Link>
                </Button>
              </div>
            </DashboardCard>
          ))}
      </div>
    </section>
  );
}
