import { useState } from "react";
import { Link } from "react-router";
import { CheckCircle, Star } from "lucide-react";
import { cn } from "~/lib/utils";
import { getInitials } from "~/modules/contract-requests/utils";
import { DashboardCard } from "~/components/ui/dashboard-card";
import { ConfirmCompletionDialog } from "../dialogs/confirm-completion-dialog";
import { ReviewDialog } from "../dialogs/review-dialog";
import type { PendingActionVm } from "../../types";

function CompanyAvatar({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
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

function PendingActionCard({
  item,
  onConfirm,
  onReview,
}: {
  item: PendingActionVm;
  onConfirm: (item: PendingActionVm) => void;
  onReview: (item: PendingActionVm) => void;
}) {
  const isConfirm = item.kind === "confirm_completion";

  return (
    <DashboardCard shadowTone="neutral" className="p-4">
      <div className="flex items-start gap-3">
        <CompanyAvatar name={item.companyName} logoUrl={item.companyLogoUrl} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#2c2f30]">{item.companyName}</p>
          <p className="truncate text-sm text-[#595c5d]">{item.title}</p>
          {item.dateLabel ? (
            <p className="mt-0.5 text-xs text-[#595c5d]/70">{item.dateLabel}</p>
          ) : null}
          <p
            className={cn(
              "mt-1 text-[10px] font-semibold uppercase tracking-wide",
              isConfirm ? "text-[#6a36d5]" : "text-[#595c5d]/60",
            )}
          >
            {isConfirm ? "Aguardando confirmação" : "Avaliação pendente"}
          </p>
        </div>
      </div>

      <div className="mt-3">
        {isConfirm ? (
          <button
            type="button"
            onClick={() => onConfirm(item)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[32px] bg-[#6a36d5] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#5a2bc5]"
          >
            <CheckCircle className="size-3.5" aria-hidden />
            Confirmar realização
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onReview(item)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[32px] border border-[#6a36d5]/40 py-2.5 text-xs font-semibold text-[#6a36d5] transition hover:bg-[#6a36d5]/5"
          >
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
            Avaliar agora
          </button>
        )}
      </div>
    </DashboardCard>
  );
}

export function PendingActionsSection({
  items,
  hasOverflow,
}: {
  items: PendingActionVm[];
  hasOverflow: boolean;
}) {
  const [confirmTarget, setConfirmTarget] = useState<PendingActionVm | null>(null);
  const [reviewTarget, setReviewTarget] = useState<PendingActionVm | null>(null);

  if (items.length === 0) return null;

  // CTA "Ver contratos":
  // — mobile: aparece quando items.length > 2 (o 3º item fica oculto por CSS)
  // — desktop: aparece apenas quando hasOverflow (há mais de 3 itens no total)
  const showCtaMobile = items.length > 2;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30] lg:text-xl">
          Ações pendentes
        </h2>
        {(hasOverflow || showCtaMobile) ? (
          <Link
            to="/ofertas"
            className={cn(
              "shrink-0 text-sm font-semibold text-[#6a36d5] hover:text-[#5b2fc4]",
              !hasOverflow && "lg:hidden",
            )}
          >
            Ver contratos
          </Link>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div key={item.id} className={cn(idx === 2 && "hidden lg:block")}>
            <PendingActionCard
              item={item}
              onConfirm={(i) => setConfirmTarget(i)}
              onReview={(i) => setReviewTarget(i)}
            />
          </div>
        ))}
      </div>

      <ConfirmCompletionDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null); }}
        item={confirmTarget}
      />

      <ReviewDialog
        open={reviewTarget !== null}
        onOpenChange={(open) => { if (!open) setReviewTarget(null); }}
        item={reviewTarget}
      />
    </section>
  );
}
