import { useState } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { Link } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { SectionMessage } from "~/modules/business-dashboard/components/sections/section-primitives";
import { MarketplacePagination } from "~/modules/marketplace/components/sections/marketplace-sections";
import { useAuth } from "~/hooks/use-auth";
import { cn } from "~/lib/utils";
import type { ReferralStatusApi } from "../types";
import {
  usePartnerProfileQuery,
  useReferralsPagedQuery,
} from "../hooks/use-referrals-data";

const DATE_FMT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** Data legível e compacta: "31 mar. 2026" (sem "de" repetido). */
function formatDateCompact(iso: string | null | undefined): string {
  if (!iso) return "—";
  const raw = DATE_FMT.format(new Date(iso));
  return raw.replace(/\s*de\s*/gi, " ").replace(/\s+/g, " ").trim();
}

/** Texto completo para `title` / acessibilidade; badge na lista usa `shortLabel`. */
function referralStatusListUi(status: ReferralStatusApi): {
  shortLabel: string;
  fullLabel: string;
  badgeClassName: string;
} {
  switch (status) {
    case "PENDING":
      return {
        shortLabel: "Aguardando 1º trabalho",
        fullLabel: "Aguardando primeiro trabalho",
        badgeClassName:
          "border border-amber-200/80 bg-amber-50/90 text-[10px] font-medium leading-tight text-amber-900/85",
      };
    case "QUALIFIED":
      return {
        shortLabel: "Qualificado",
        fullLabel: "Qualificado — primeiro trabalho concluído",
        badgeClassName:
          "border border-emerald-200/70 bg-emerald-50/90 text-[10px] font-medium leading-tight text-emerald-800/90",
      };
    case "EXPIRED":
      return {
        shortLabel: "Expirado",
        fullLabel: "Expirado",
        badgeClassName:
          "border border-slate-200/90 bg-slate-50 text-[10px] font-medium leading-tight text-slate-600",
      };
    default:
      return {
        shortLabel: status,
        fullLabel: status,
        badgeClassName:
          "border border-slate-200/90 bg-slate-50 text-[10px] font-medium leading-tight text-slate-600",
      };
  }
}

type StatusFilter = ReferralStatusApi | "ALL";

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "Todos", value: "ALL" },
  { label: "1º trabalho", value: "PENDING" },
  { label: "Qualificados", value: "QUALIFIED" },
  { label: "Expirados", value: "EXPIRED" },
];

function TodasIndicacoesSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      <div className="h-8 w-52 rounded-lg bg-slate-200" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-32 rounded-full bg-slate-100" />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-2xl border border-slate-100/80 bg-white p-4 shadow-sm"
          >
            <div className="size-11 shrink-0 rounded-full bg-slate-200" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="h-4 max-w-[70%] flex-1 rounded bg-slate-200" />
                <div className="h-5 w-16 shrink-0 rounded-md bg-slate-100" />
              </div>
              <div className="h-3 w-40 max-w-full rounded bg-slate-100" />
              <div className="h-3 w-32 max-w-full rounded bg-slate-50" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TodasIndicacoesScreen() {
  const { user } = useAuth();
  const role = user?.role ?? "creator";

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);

  const profileQuery = usePartnerProfileQuery();
  const isPartnerReady = profileQuery.data?.kind === "active";

  const apiStatus = statusFilter === "ALL" ? undefined : statusFilter;

  const referralsQuery = useReferralsPagedQuery(page, apiStatus, isPartnerReady);

  const items = referralsQuery.data?.items ?? [];
  const total = referralsQuery.data?.total ?? 0;
  const limit = referralsQuery.data?.limit ?? 10;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;

  function handleFilterChange(value: StatusFilter) {
    setStatusFilter(value);
    setPage(1);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isLoading = profileQuery.isLoading || referralsQuery.isLoading;
  const errorMessage =
    (profileQuery.isError && profileQuery.error instanceof Error
      ? profileQuery.error.message
      : null) ||
    (referralsQuery.isError && referralsQuery.error instanceof Error
      ? referralsQuery.error.message
      : null);

  return (
    <div className="min-h-screen bg-[#f5f6f7] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant={role === "business" ? "business" : "creator"} />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:gap-8 lg:p-8 lg:pt-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 lg:gap-8 lg:px-0">
          {/* Header */}
          <div>
            <Link
              to="/indicacoes"
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[#895af6] hover:underline"
            >
              <ArrowLeft className="size-4" />
              Indicações
            </Link>
            <h1 className="text-2xl font-black tracking-[-0.5px] text-[#2c2f30]">
              Todas as indicações
            </h1>
            <p className="mt-1 text-sm text-[#595c5d]">
              Todos os criadores vinculados ao seu programa de indicações.
            </p>
          </div>

          {errorMessage ? (
            <SectionMessage message={errorMessage} tone="error" />
          ) : isLoading ? (
            <TodasIndicacoesSkeleton />
          ) : (
            <>
              {/* Filtros */}
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => handleFilterChange(f.value)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-bold transition-colors sm:px-4 sm:text-sm",
                      statusFilter === f.value
                        ? "bg-[#895af6] text-white"
                        : "bg-white text-slate-600 shadow-sm hover:bg-slate-50",
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Lista */}
              {items.length === 0 ? (
                <EmptyState hasFilter={statusFilter !== "ALL"} onClearFilter={() => handleFilterChange("ALL")} />
              ) : (
                <>
                  <ul className="flex flex-col gap-3">
                    {items.map((r) => {
                      const statusUi = referralStatusListUi(r.status);
                      return (
                        <li
                          key={r.id}
                          className="flex gap-3 rounded-2xl border border-slate-100/80 bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]"
                        >
                          <ReferralAvatar
                            name={r.referredUser.name}
                            photoUrl={r.referredUser.photoUrl}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
                              <p className="min-w-0 flex-1 break-words text-[15px] font-semibold leading-snug tracking-tight text-[#2c2f30]">
                                {r.referredUser.name}
                              </p>
                              <span
                                className={cn(
                                  "inline-flex w-fit max-w-full items-center rounded-md px-1.5 py-0.5 sm:mt-0.5 sm:max-w-[min(11.5rem,46%)] sm:shrink-0 sm:text-right",
                                  statusUi.badgeClassName,
                                )}
                                title={statusUi.fullLabel}
                              >
                                {statusUi.shortLabel}
                              </span>
                            </div>
                            <div className="mt-2.5 flex flex-col gap-1 text-[12px] leading-snug">
                              <p className="text-slate-600">
                                <span className="font-medium text-slate-500">Cadastro</span>
                                <span className="mx-1.5 text-slate-300" aria-hidden>
                                  ·
                                </span>
                                <span className="text-slate-700">
                                  {formatDateCompact(r.createdAt)}
                                </span>
                              </p>
                              {r.qualifiedAt ? (
                                <p>
                                  <span className="font-medium text-emerald-700/85">
                                    Qualificação
                                  </span>
                                  <span className="mx-1.5 text-emerald-300/90" aria-hidden>
                                    ·
                                  </span>
                                  <span className="text-emerald-800/90">
                                    {formatDateCompact(r.qualifiedAt)}
                                  </span>
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <MarketplacePagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </>
          )}
        </div>
      </main>

      {role === "business" ? <BusinessBottomNav /> : <CreatorBottomNav />}
    </div>
  );
}

function ReferralAvatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = name.charCodeAt(i) + ((h << 5) - h);
  }
  const tint =
    Math.abs(h) % 2 === 0
      ? "bg-[#e0e7ff] text-[#6366f1]"
      : "bg-[#f0ebff] text-[#895af6]";

  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold uppercase",
        photoUrl ? "bg-slate-200" : tint,
      )}
    >
      {photoUrl ? (
        <img src={photoUrl} alt="" className="size-full object-cover" />
      ) : (
        initials || "?"
      )}
    </div>
  );
}

function EmptyState({
  hasFilter,
  onClearFilter,
}: {
  hasFilter: boolean;
  onClearFilter: () => void;
}) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-slate-100">
          <Users className="size-7 text-slate-400" />
        </div>
        <div>
          <p className="font-bold text-[#2c2f30]">Nenhuma indicação com esse status</p>
          <p className="mt-1 text-sm text-slate-500">
            Tente outro filtro para ver suas indicações.
          </p>
        </div>
        <button
          type="button"
          onClick={onClearFilter}
          className="rounded-full bg-[#895af6] px-5 py-2 text-sm font-bold text-white hover:bg-[#7c4aeb]"
        >
          Ver todos
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-slate-100">
        <Users className="size-7 text-slate-400" />
      </div>
      <div>
        <p className="font-bold text-[#2c2f30]">Nenhuma indicação ainda</p>
        <p className="mt-1 text-sm text-slate-500">
          Compartilhe seu link para começar a indicar novos criadores.
        </p>
      </div>
      <Link
        to="/indicacoes"
        className="rounded-full bg-[#895af6] px-5 py-2 text-sm font-bold text-white hover:bg-[#7c4aeb]"
      >
        Voltar para Indicações
      </Link>
    </div>
  );
}
