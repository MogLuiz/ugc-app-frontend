import { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Star, Users } from "lucide-react";
import { getInitials } from "~/modules/contract-requests/utils";
import { cn } from "~/lib/utils";
import type {
  BusinessPendingApplicationVm,
  BusinessPendingConfirmVm,
  BusinessPendingReviewVm,
} from "../../types";
import { BusinessConfirmCompletionDialog } from "../dialogs/business-confirm-completion-dialog";
import { BusinessReviewDialog } from "../dialogs/business-review-dialog";
import { DashboardCard, SectionSkeleton, SectionMessage } from "./section-primitives";

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

function ConfirmCard({
  item,
  onConfirm,
}: {
  item: BusinessPendingConfirmVm;
  onConfirm: (item: BusinessPendingConfirmVm) => void;
}) {
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
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#6a36d5]">
            Aguardando confirmação
          </p>
        </div>
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => onConfirm(item)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[32px] bg-[#6a36d5] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#5b2fc4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6a36d5]/50"
        >
          <CheckCircle className="size-3.5" aria-hidden />
          Confirmar serviço
        </button>
      </div>
    </DashboardCard>
  );
}

function ReviewCard({
  item,
  onReview,
}: {
  item: BusinessPendingReviewVm;
  onReview: (item: BusinessPendingReviewVm) => void;
}) {
  return (
    <DashboardCard shadowTone="neutral" className="p-4">
      <div className="flex items-start gap-3">
        <CreatorAvatar name={item.creatorName} avatarUrl={item.creatorAvatarUrl} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#2c2f30]">{item.creatorName}</p>
          <p className="truncate text-sm text-[#595c5d]">{item.title}</p>
          <p className="mt-0.5 text-xs text-[#595c5d]/70">{item.completedLabel}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#595c5d]/60">
            Avaliação pendente
          </p>
        </div>
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => onReview(item)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[32px] border border-[#6a36d5]/40 py-2.5 text-xs font-semibold text-[#6a36d5] transition hover:bg-[#6a36d5]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6a36d5]/30"
        >
          <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
          Avaliar agora
        </button>
      </div>
    </DashboardCard>
  );
}

function ApplicationCard({ item }: { item: BusinessPendingApplicationVm }) {
  const navigate = useNavigate();

  const expiresLabel = (() => {
    if (!item.expiresAt) return null;
    const d = new Date(item.expiresAt);
    if (Number.isNaN(d.getTime())) return null;
    const diffDays = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Expira hoje";
    if (diffDays === 1) return "Expira amanhã";
    return `Expira em ${diffDays} dias`;
  })();

  return (
    <DashboardCard shadowTone="neutral" className="p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#6a36d5]/10">
          <Users className="size-4 text-[#6a36d5]" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[#2c2f30]">{item.title}</p>
          <p className="mt-0.5 text-sm text-[#595c5d]">
            {item.applicationsCount}{" "}
            {item.applicationsCount === 1 ? "candidatura pendente" : "candidaturas pendentes"}
          </p>
          {expiresLabel ? (
            <p className="mt-0.5 text-xs text-[#595c5d]/70">{expiresLabel}</p>
          ) : null}
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[#595c5d]/60">
            Candidaturas para revisar
          </p>
        </div>
      </div>
      <div className="mt-3">
        <button
          type="button"
          onClick={() => navigate("/ofertas")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[32px] border border-[#6a36d5]/40 py-2.5 text-xs font-semibold text-[#6a36d5] transition hover:bg-[#6a36d5]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6a36d5]/30"
        >
          <Users className="size-3.5" aria-hidden />
          Ver candidatos
        </button>
      </div>
    </DashboardCard>
  );
}

export function BusinessDashboardPendingActions({
  confirmItems,
  reviewItems,
  applicationItems,
  isLoading,
  errorMessage,
}: {
  confirmItems: BusinessPendingConfirmVm[];
  reviewItems: BusinessPendingReviewVm[];
  applicationItems: BusinessPendingApplicationVm[];
  isLoading: boolean;
  errorMessage: string | null;
}) {
  const [confirmTarget, setConfirmTarget] = useState<BusinessPendingConfirmVm | null>(null);
  const [reviewTarget, setReviewTarget] = useState<BusinessPendingReviewVm | null>(null);

  const total = confirmItems.length + reviewItems.length + applicationItems.length;

  if (!isLoading && !errorMessage && total === 0) return null;

  // confirmações primeiro, depois avaliações, depois candidaturas
  const confirmVisible = confirmItems.slice(0, 3);
  const reviewVisible = reviewItems.slice(0, 3 - confirmVisible.length);
  const appVisible = applicationItems.slice(0, Math.max(0, 3 - confirmVisible.length - reviewVisible.length));
  const hasOverflow = total > 3;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30] lg:text-xl">
            Ações pendentes
          </h2>
          {!isLoading && total > 0 ? (
            <span className="rounded-full bg-[#6a36d5]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6a36d5]">
              {total} {total === 1 ? "ação" : "ações"}
            </span>
          ) : null}
        </div>
        {hasOverflow ? (
          <a
            href="/ofertas"
            className="shrink-0 text-sm font-semibold text-[#6a36d5] hover:text-[#5b2fc4]"
          >
            Ver todas
          </a>
        ) : null}
      </div>

      {isLoading ? <SectionSkeleton rows={2} /> : null}

      {!isLoading && errorMessage ? (
        <SectionMessage message={errorMessage} tone="error" />
      ) : null}

      {!isLoading && !errorMessage && total > 0 ? (
        <div className={cn(
          "grid gap-3",
          confirmVisible.length + reviewVisible.length + appVisible.length > 1
            ? "lg:grid-cols-2"
            : "grid-cols-1",
        )}>
          {confirmVisible.map((item) => (
            <ConfirmCard key={item.id} item={item} onConfirm={setConfirmTarget} />
          ))}
          {reviewVisible.map((item) => (
            <ReviewCard key={item.id} item={item} onReview={setReviewTarget} />
          ))}
          {appVisible.map((item) => (
            <ApplicationCard key={item.id} item={item} />
          ))}
        </div>
      ) : null}

      <BusinessConfirmCompletionDialog
        open={confirmTarget !== null}
        onOpenChange={(open) => { if (!open) setConfirmTarget(null); }}
        item={confirmTarget}
      />

      <BusinessReviewDialog
        open={reviewTarget !== null}
        onOpenChange={(open) => { if (!open) setReviewTarget(null); }}
        item={reviewTarget}
      />
    </section>
  );
}
