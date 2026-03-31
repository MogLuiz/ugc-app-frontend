import type { ReactNode } from "react";
import {
  Banknote,
  CheckCircle2,
  CircleUserRound,
  Info,
  Loader2,
  Share2,
  ShieldCheck,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { Link } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { Button } from "~/components/ui/button";
import { toast } from "~/components/ui/toast";
import { useAuth } from "~/hooks/use-auth";
import { cn } from "~/lib/utils";
import {
  DashboardCard,
  SectionHeader,
  SectionMessage,
} from "~/modules/business-dashboard/components/sections/section-primitives";
import type { ReferralListItem, ReferralsDashboardResponse, ReferralStatusApi } from "../types";
import { formatMoneyFromCents } from "../lib/format-money";
import {
  useActivatePartnerMutation,
  usePartnerProfileQuery,
  useReferralsDashboardQuery,
  useReferralsListQuery,
} from "../hooks/use-referrals-data";

const DATE_FMT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function referralStatusConfig(status: ReferralStatusApi): {
  label: string;
  className: string;
} {
  switch (status) {
    case "PENDING":
      return { label: "Aguardando primeiro trabalho", className: "bg-amber-100 text-amber-900" };
    case "QUALIFIED":
      return { label: "Qualificado", className: "bg-emerald-100 text-emerald-800" };
    case "EXPIRED":
      return { label: "Expirado", className: "bg-slate-200 text-slate-600" };
    default:
      return { label: status, className: "bg-slate-100 text-slate-700" };
  }
}

function initialsAvatarTint(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = name.charCodeAt(i) + ((h << 5) - h);
  }
  return Math.abs(h) % 2 === 0
    ? "bg-[#e0e7ff] text-[#6366f1]"
    : "bg-[#f0ebff] text-[#895af6]";
}

async function copyText(label: string, text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado.`);
  } catch {
    toast.error("Não foi possível copiar. Tente selecionar manualmente.");
  }
}

function IndicacoesScreenSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      {/* Mobile hero */}
      <div className="h-[148px] rounded-[32px] bg-[#895af6]/15 lg:hidden" />

      {/* Desktop: “Compartilhe e convide” + resumo — espelha o layout real */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,1fr)] lg:items-stretch lg:gap-8">
        <div
          className="relative min-h-[220px] overflow-hidden rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm lg:p-6"
          style={{
            boxShadow:
              "0px 4px 6px -1px rgba(106,54,213,0.04), 0px 20px 40px -1px rgba(44,47,48,0.08)",
          }}
        >
          <div className="h-3 w-28 rounded bg-slate-200" />
          <div className="mt-2 space-y-2">
            <div className="h-7 max-w-md rounded bg-slate-200" />
            <div className="h-7 max-w-[280px] rounded bg-slate-100" />
          </div>
          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3 w-32 rounded bg-slate-200" />
              <div className="h-11 w-full rounded-xl bg-slate-100" />
            </div>
            <div className="w-full shrink-0 space-y-2 lg:max-w-[220px]">
              <div className="h-3 w-14 rounded bg-slate-200" />
              <div className="h-11 w-full rounded-xl bg-slate-100" />
            </div>
          </div>
          <div className="mt-5 flex items-start gap-2">
            <div className="mt-0.5 size-4 shrink-0 rounded bg-slate-200" />
            <div className="h-3 flex-1 rounded bg-slate-100" />
          </div>
        </div>
        <div className="flex min-h-[200px] flex-col justify-between rounded-[28px] bg-gradient-to-br from-[#895af6] to-[#6a2fc4] p-6 shadow-lg">
          <div className="space-y-3">
            <div className="h-3 w-36 rounded bg-white/30" />
            <div className="h-10 w-44 max-w-full rounded bg-white/20" />
            <div className="h-4 w-52 max-w-full rounded bg-white/15" />
          </div>
          <div className="my-4 h-px shrink-0 bg-white/25" role="presentation" />
          <div className="space-y-2">
            <div className="h-3.5 w-32 rounded bg-white/30" />
            <div className="h-8 w-28 rounded bg-white/20" />
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex min-h-[121px] flex-col justify-between rounded-[32px] bg-slate-100 p-5 lg:min-h-0 lg:rounded-[20px] lg:p-4"
          >
            <div className="size-10 rounded-full bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded bg-slate-200" />
              <div className="h-6 w-12 rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: lista recente + como funciona */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] lg:gap-8">
        <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-4 w-16 rounded bg-slate-100" />
          </div>
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <div className="size-11 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-28 rounded bg-slate-200" />
                  <div className="h-3 w-20 rounded bg-slate-100" />
                </div>
                <div className="h-5 w-20 rounded-full bg-slate-100 shrink-0" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 h-4 w-28 rounded bg-slate-200" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="size-7 rounded-full bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="h-3 w-24 rounded bg-slate-200" />
                  <div className="h-2.5 w-36 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: recentes + resumo + como funciona */}
      <div className="flex flex-col gap-6 lg:hidden">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-4 w-16 rounded bg-slate-100" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-[32px] bg-white p-4 shadow-sm">
              <div className="size-10 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-24 rounded bg-slate-200" />
                <div className="h-3 w-16 rounded bg-slate-100" />
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-100 shrink-0" />
            </div>
          ))}
        </div>
        <div className="h-[160px] rounded-[32px] bg-slate-100" />
        <div className="h-[140px] rounded-[32px] bg-slate-100" />
      </div>
    </div>
  );
}

export function IndicacoesScreen() {
  const { user } = useAuth();
  const role = user?.role ?? "creator";

  const profileQuery = usePartnerProfileQuery();
  const isPartnerReady = profileQuery.data?.kind === "active";

  const dashboardQuery = useReferralsDashboardQuery(isPartnerReady);
  const referralsQuery = useReferralsListQuery(isPartnerReady);

  const activateMutation = useActivatePartnerMutation();

  const profileError =
    profileQuery.isError && profileQuery.error instanceof Error
      ? profileQuery.error.message
      : null;

  const dataError =
    (dashboardQuery.isError && dashboardQuery.error instanceof Error
      ? dashboardQuery.error.message
      : null) ||
    (referralsQuery.isError && referralsQuery.error instanceof Error
      ? referralsQuery.error.message
      : null);

  const dashboard = dashboardQuery.data;
  const allReferrals = referralsQuery.data?.items ?? [];
  const profile =
    profileQuery.data?.kind === "active" ? profileQuery.data.profile : null;

  return (
    <div className="min-h-screen bg-[#f5f6f7] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant={role === "business" ? "business" : "creator"} />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:gap-8 lg:p-8 lg:pt-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 lg:gap-8 lg:px-0">
          <div>
            <h1 className="text-2xl font-black tracking-[-0.5px] text-[#2c2f30]">
              Indicações
            </h1>
            <p className="mt-1 text-sm text-[#595c5d]">
              Convide novos criadores para a plataforma e acompanhe o progresso das suas indicações.
            </p>
          </div>

          {profileQuery.isLoading ? (
            <IndicacoesScreenSkeleton />
          ) : profileError ? (
            <SectionMessage message={profileError} tone="error" />
          ) : profileQuery.data?.kind === "not_activated" ? (
            <DashboardCard className="max-w-lg">
              <h2 className="text-lg font-bold text-[#2c2f30]">
                Ative o programa de indicações
              </h2>
              <p className="mt-2 text-sm text-[#595c5d]">
                Ao ativar, você recebe um link e um código para convidar novos
                criadores. A comissão é gerada quando o indicado concluir o
                primeiro trabalho válido.
              </p>
              <Button
                className="mt-6 w-full rounded-full bg-[#895af6] font-bold text-white hover:bg-[#7c4aeb] lg:w-auto"
                disabled={activateMutation.isPending}
                onClick={() => {
                  activateMutation.mutate(undefined, {
                    onError: (e) => {
                      toast.error(
                        e instanceof Error
                          ? e.message
                          : "Não foi possível ativar. Tente novamente.",
                      );
                    },
                    onSuccess: () => {
                      toast.success("Programa de indicações ativado.");
                    },
                  });
                }}
              >
                {activateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Ativando…
                  </>
                ) : (
                  "Ativar indicações"
                )}
              </Button>
            </DashboardCard>
          ) : (
            <>
              {dataError ? (
                <SectionMessage message={dataError} tone="error" />
              ) : null}

              {profile && (profile.referralLink || profile.referralCode) ? (
                <>
                  {/* Mobile hero */}
                  <section
                    className="relative min-w-0 overflow-hidden rounded-[32px] bg-[#895af6] p-6 text-white sm:rounded-[40px] lg:hidden"
                    style={{
                      boxShadow:
                        "0px 10px 15px -3px rgba(137,90,246,0.2), 0px 4px 6px -4px rgba(137,90,246,0.2)",
                    }}
                  >
                    <div
                      className="pointer-events-none absolute bottom-[-40px] right-[-40px] size-40 rounded-full bg-white/10 blur-[32px]"
                      aria-hidden
                    />
                    <div className="relative z-[1] flex flex-col gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-[1px] text-white/80">
                        Seu link de indicação
                      </p>
                      <h2 className="text-[20px] font-black leading-snug tracking-[-0.5px]">
                        <span className="block">Ganhe por cada novo criador</span>
                        <span className="block">indicado</span>
                      </h2>
                      <div className="flex flex-col gap-3 pt-2">
                        {profile.referralLink ? (
                          <div className="flex min-h-[44px] items-center justify-between gap-3 rounded-full bg-white/10 px-4 py-3 backdrop-blur-[6px]">
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                              {profile.referralLink}
                            </span>
                            <Button
                              type="button"
                              className="h-8 shrink-0 rounded-full bg-white px-4 text-xs font-bold text-[#895af6] hover:bg-white/95"
                              onClick={() => void copyText("Link", profile.referralLink!)}
                            >
                              Copiar
                            </Button>
                          </div>
                        ) : null}
                        {profile.referralCode ? (
                          <div className="flex min-h-[44px] items-center justify-between gap-3 rounded-full bg-white/10 px-4 py-3 backdrop-blur-[6px]">
                            <p className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                              <span>CÓDIGO: </span>
                              <span className="font-bold">{profile.referralCode}</span>
                            </p>
                            <Button
                              type="button"
                              className="h-8 shrink-0 rounded-full bg-white px-4 text-xs font-bold text-[#895af6] hover:bg-white/95"
                              onClick={() => void copyText("Código", profile.referralCode!)}
                            >
                              Copiar
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </section>

                  {/* Desktop hero + card resumo */}
                  <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(260px,1fr)] lg:items-stretch lg:gap-8">
                    <section
                      className="relative min-w-0 overflow-hidden rounded-[28px] border border-slate-100 bg-white p-5 shadow-sm lg:p-6"
                      style={{
                        boxShadow:
                          "0px 4px 6px -1px rgba(106,54,213,0.04), 0px 20px 40px -1px rgba(44,47,48,0.08)",
                      }}
                    >
                      <Share2
                        className="pointer-events-none absolute right-3 top-[27%] size-[7.5rem] -translate-y-1/2 text-slate-100 sm:right-5"
                        strokeWidth={1}
                        aria-hidden
                      />
                      <div className="relative z-[1]">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#895af6]">
                          Seu link exclusivo
                        </p>
                        <h2 className="mt-2 text-xl font-black leading-tight text-[#2c2f30] lg:text-2xl">
                          Compartilhe e convide novos criadores
                        </h2>
                        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
                          {profile.referralLink ? (
                            <div className="min-w-0 flex-1 space-y-2">
                              <p className="text-xs font-medium text-slate-600">
                                Link de indicação
                              </p>
                              <div className="flex min-h-[44px] items-center gap-1 rounded-xl border border-slate-200/90 bg-slate-100/90 py-1.5 pl-3 pr-1">
                                <span className="min-w-0 flex-1 break-all text-sm leading-snug text-[#0f172a] lg:truncate lg:break-normal lg:leading-normal">
                                  {profile.referralLink}
                                </span>
                                <Button
                                  type="button"
                                  className="h-9 shrink-0 rounded-lg bg-[#895af6] px-4 text-xs font-bold text-white hover:bg-[#7c4aeb]"
                                  onClick={() => void copyText("Link", profile.referralLink!)}
                                >
                                  Copiar
                                </Button>
                              </div>
                            </div>
                          ) : null}
                          {profile.referralCode ? (
                            <div className="w-full shrink-0 space-y-2 lg:max-w-[220px]">
                              <p className="text-xs font-medium text-slate-600">Código</p>
                              <div className="flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-slate-200/90 bg-slate-100/90 px-3 py-1">
                                <span className="font-mono text-sm font-bold tracking-wide text-[#0f172a]">
                                  {profile.referralCode}
                                </span>
                                <Button
                                  type="button"
                                  className="h-9 shrink-0 rounded-lg bg-[#895af6] px-3 text-xs font-bold text-white hover:bg-[#7c4aeb]"
                                  onClick={() => void copyText("Código", profile.referralCode!)}
                                >
                                  Copiar
                                </Button>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-600">
                          <Info className="mt-0.5 size-4 shrink-0 text-[#895af6]" aria-hidden />
                          A comissão é gerada conforme as regras vigentes da plataforma.
                        </p>
                      </div>
                    </section>

                    {dashboardQuery.isLoading ? (
                      <div className="flex min-h-[200px] items-center justify-center rounded-[28px] bg-gradient-to-br from-[#895af6] to-[#6a2fc4] p-6 text-white shadow-lg">
                        <Loader2 className="size-8 animate-spin text-white/90" />
                      </div>
                    ) : dashboard ? (
                      <section className="relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[28px] bg-gradient-to-br from-[#895af6] to-[#6a2fc4] p-6 text-white shadow-lg">
                        <Wallet
                          className="pointer-events-none absolute bottom-3 right-3 size-16 text-white/25"
                          aria-hidden
                        />
                        <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">
                            Resumo de comissões
                          </p>
                          <p className="mt-3 text-3xl font-black tabular-nums tracking-tight">
                            {formatMoneyFromCents(
                              dashboard.totalCommissionAmountCents,
                              dashboard.currency,
                            )}
                          </p>
                          <p className="mt-1 text-sm text-white/75">Total registrado até hoje</p>
                          <div className="my-4 h-px shrink-0 bg-white/25" role="separator" />
                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <p className="text-sm text-white/80">Comissões pendentes</p>
                              <p className="mt-1 text-xl font-bold tabular-nums">
                                {formatMoneyFromCents(
                                  dashboard.pendingCommissionAmountCents,
                                  dashboard.currency,
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>
                    ) : null}
                  </div>
                </>
              ) : null}

              {dashboard ? (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
                  <ReferralMetricCard
                    icon={<Users className="size-5" strokeWidth={2} />}
                    iconTone="sky"
                    label="Total de indicados"
                    value={String(dashboard.totalReferrals)}
                  />
                  <ReferralMetricCard
                    icon={<UserPlus className="size-5" strokeWidth={2} />}
                    iconTone="violet"
                    label="Aguardando 1º trabalho"
                    value={String(dashboard.pendingReferrals)}
                    hint="Cadastro feito; trabalho ainda não concluído"
                  />
                  <ReferralMetricCard
                    icon={<CheckCircle2 className="size-5" strokeWidth={2} />}
                    iconTone="emerald"
                    label="Com primeiro trabalho concluído"
                    value={String(dashboard.qualifiedReferrals)}
                  />
                  <ReferralMetricCard
                    icon={<Banknote className="size-5" strokeWidth={2} />}
                    iconTone="amber"
                    label="Comissões geradas"
                    value={formatMoneyFromCents(
                      dashboard.totalCommissionAmountCents,
                      dashboard.currency,
                    )}
                  />
                </div>
              ) : null}

              {/* Desktop layout (≥lg): métricas já são full-width; aqui tabela + como funciona) */}
              <div className="hidden lg:flex lg:flex-col lg:gap-6">
                <JourneyBlock />
                <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] lg:gap-8">
                  <DashboardCard>
                    <div className="flex items-center justify-between gap-3">
                      <SectionHeader title="Indicações recentes" />
                      {allReferrals.length > 0 ? (
                        <Link
                          to="/indicacoes/todas"
                          className="shrink-0 text-xs font-bold text-[#895af6] hover:underline"
                        >
                          Ver todas →
                        </Link>
                      ) : null}
                    </div>
                    {referralsQuery.isLoading ? (
                      <div className="animate-pulse space-y-3 py-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="h-14 rounded-2xl bg-slate-100" />
                        ))}
                      </div>
                    ) : allReferrals.length === 0 ? (
                      <p className="py-8 text-center text-sm text-slate-500">
                        Nenhuma indicação ainda.
                      </p>
                    ) : (
                      <ul className="mt-4 flex flex-col gap-3">
                        {allReferrals.slice(0, 5).map((r) => (
                          <ReferralListRow key={r.id} referral={r} />
                        ))}
                      </ul>
                    )}
                  </DashboardCard>

                  <DashboardCard>
                    <SectionHeader
                      title="Como funciona"
                      addon={<Info className="size-4 text-[#895af6]" aria-hidden />}
                    />
                    <ol className="mt-4 space-y-4 text-sm text-[#595c5d]">
                      <li className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#895af6] text-xs font-bold text-white">
                          1
                        </span>
                        <span>
                          Compartilhe seu link ou código com quem ainda não está na plataforma.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#895af6] text-xs font-bold text-white">
                          2
                        </span>
                        <span>
                          Quando a pessoa se cadastrar pelo seu link, ela entra como sua indicação.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#895af6] text-xs font-bold text-white">
                          3
                        </span>
                        <span>
                          Quando o indicado concluir o primeiro trabalho válido, a comissão é
                          registrada conforme as regras vigentes da plataforma.
                        </span>
                      </li>
                    </ol>
                  </DashboardCard>
                </div>
              </div>

              {/* Mobile layout (<lg) */}
              <div className="flex flex-col gap-6 lg:hidden">
                <RecentReferralsMobileBlock
                  isLoading={referralsQuery.isLoading}
                  referrals={allReferrals}
                />
                <ResumoGanhosMobileBlock
                  isLoading={dashboardQuery.isLoading}
                  dashboard={dashboard}
                />
                <ComoFuncionaMobileBlock />
              </div>
            </>
          )}
        </div>
      </main>

      {role === "business" ? <BusinessBottomNav /> : <CreatorBottomNav />}
    </div>
  );
}

function ReferralListRow({ referral: r }: { referral: ReferralListItem }) {
  const badge = referralStatusConfig(r.status);
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
      <Avatar name={r.referredUser.name} photoUrl={r.referredUser.photoUrl} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-[#2c2f30]">{r.referredUser.name}</p>
        <p className="text-xs text-slate-500">
          Desde{" "}
          {r.createdAt ? DATE_FMT.format(new Date(r.createdAt)) : "—"}
        </p>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
          badge.className,
        )}
      >
        {badge.label}
      </span>
    </li>
  );
}

const METRIC_ICON_TONE: Record<"sky" | "violet" | "emerald" | "amber", string> = {
  sky: "bg-sky-100 text-sky-600",
  violet: "bg-[rgba(137,90,246,0.15)] text-[#895af6]",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-800",
};

function ReferralMetricCard({
  icon,
  iconTone,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  iconTone: keyof typeof METRIC_ICON_TONE;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[32px] border border-slate-300/30 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
        "min-h-[121px] lg:min-h-0 lg:rounded-[20px] lg:border-[rgba(106,54,213,0.08)] lg:p-4 lg:shadow-[0px_4px_6px_-1px_rgba(106,54,213,0.04),0px_20px_40px_-1px_rgba(44,47,48,0.08)]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full",
            METRIC_ICON_TONE[iconTone],
          )}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black tabular-nums tracking-tight text-[#2c2f30]">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[10px] leading-tight text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function ComoFuncionaMobileBlock() {
  return (
    <section className="rounded-[32px] bg-[#f1f0f3] p-5">
      <div className="flex items-center gap-2">
        <Info className="size-3.5 shrink-0 text-[#895af6]" strokeWidth={2.5} aria-hidden />
        <h2 className="text-sm font-bold text-[#0f172a]">Como funciona</h2>
      </div>
      <div className="relative mt-5 flex flex-col gap-4">
        <div
          className="absolute bottom-2 left-[13px] top-2 w-0.5 bg-[rgba(137,90,246,0.2)]"
          aria-hidden
        />
        <div className="relative z-[1] flex gap-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#895af6] text-[10px] font-black text-white shadow-[0px_4px_6px_-1px_rgba(137,90,246,0.2),0px_2px_4px_-2px_rgba(137,90,246,0.2)]">
            1
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-xs font-bold text-[#0f172a]">Cadastro realizado</p>
            <p className="mt-1 text-[10px] leading-snug text-[#64748b]">
              O criador usa seu link para entrar na plataforma.
            </p>
          </div>
        </div>
        <div className="relative z-[1] flex gap-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#895af6] text-[10px] font-black text-white shadow-[0px_4px_6px_-1px_rgba(137,90,246,0.2),0px_2px_4px_-2px_rgba(137,90,246,0.2)]">
            2
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-xs font-bold text-[#0f172a]">Primeiro trabalho concluído</p>
            <p className="mt-1 text-[10px] leading-snug text-[#64748b]">
              O indicado entrega com sucesso o seu primeiro conteúdo UGC.
            </p>
          </div>
        </div>
        <div className="relative z-[1] flex gap-3">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#e7e6e9] text-[10px] font-black text-[#64748b]">
            3
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-xs font-bold text-[#0f172a]">Comissão gerada</p>
            <p className="mt-1 text-[10px] leading-snug text-[#64748b]">
              Comissão registrada conforme as regras vigentes da plataforma.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RecentReferralsMobileBlock({
  isLoading,
  referrals,
}: {
  isLoading: boolean;
  referrals: ReferralListItem[];
}) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-[#0f172a]">Indicações recentes</h2>
        {referrals.length > 0 ? (
          <Link
            to="/indicacoes/todas"
            className="text-xs font-bold text-[#895af6] hover:underline"
          >
            Ver todas →
          </Link>
        ) : null}
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-[32px] bg-white p-4 shadow-sm">
              <div className="size-10 rounded-full bg-slate-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-24 rounded bg-slate-200" />
                <div className="h-3 w-16 rounded bg-slate-100" />
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-100 shrink-0" />
            </div>
          ))}
        </div>
      ) : referrals.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-500">Nenhuma indicação ainda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {referrals.slice(0, 3).map((r) => {
            const badge = referralStatusConfig(r.status);
            return (
              <li
                key={r.id}
                className="flex items-start gap-3 rounded-[32px] border border-slate-200/10 bg-white p-[17px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
              >
                <AvatarMobile name={r.referredUser.name} photoUrl={r.referredUser.photoUrl} />
                <div className="min-w-0 flex-1 flex flex-col gap-2">
                  <p className="break-words text-sm font-bold leading-snug text-[#0f172a]">
                    {r.referredUser.name}
                  </p>
                  <span
                    className={cn(
                      "w-fit max-w-full rounded-full px-2.5 py-1 text-[10px] font-bold uppercase leading-tight",
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function ResumoGanhosMobileBlock({
  isLoading,
  dashboard,
}: {
  isLoading: boolean;
  dashboard: ReferralsDashboardResponse | undefined;
}) {
  if (isLoading) {
    return (
      <section className="flex min-h-[160px] items-center justify-center rounded-[32px] border-2 border-dashed border-[rgba(137,90,246,0.2)] bg-[#f6f5f8] p-6">
        <Loader2 className="size-7 animate-spin text-[#895af6]" aria-hidden />
      </section>
    );
  }
  if (!dashboard) return null;

  const confirmedCents = Math.max(
    0,
    dashboard.totalCommissionAmountCents - dashboard.pendingCommissionAmountCents,
  );

  return (
    <section className="flex flex-col gap-4 rounded-[32px] border-2 border-dashed border-[rgba(137,90,246,0.2)] bg-[#f6f5f8] p-[26px]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#895af6]/15">
          <Wallet className="size-5 text-[#895af6]" strokeWidth={2} aria-hidden />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[1px] text-[#64748b]">
          Resumo de Ganhos
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-end justify-between gap-2 text-sm">
          <span className="text-[#64748b]">Comissões pendentes</span>
          <span className="font-bold tabular-nums text-[#0f172a]">
            {formatMoneyFromCents(dashboard.pendingCommissionAmountCents, dashboard.currency)}
          </span>
        </div>
        <div className="flex items-end justify-between gap-2 text-sm">
          <span className="text-[#64748b]">Ganhos confirmados</span>
          <span className="font-bold tabular-nums text-[#0f172a]">
            {formatMoneyFromCents(confirmedCents, dashboard.currency)}
          </span>
        </div>
        <div className="flex items-end justify-between border-t border-slate-200/20 pt-4">
          <span className="text-sm font-bold text-[#0f172a]">Saldo acumulado</span>
          <span className="text-xl font-black tabular-nums text-[#895af6]">
            {formatMoneyFromCents(dashboard.totalCommissionAmountCents, dashboard.currency)}
          </span>
        </div>
      </div>
    </section>
  );
}

function JourneyBlock() {
  return (
    <DashboardCard>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
        <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30] lg:text-xl">
          Jornada da indicação
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-[#595c5d] lg:text-right">
          Acompanhe o progresso dos seus indicados.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-10 md:mt-10 md:flex-row md:items-start md:gap-0 md:pt-1">
        <JourneyStep
          icon={<CircleUserRound className="size-7 text-white" strokeWidth={2} />}
          tone="brand"
          title="Cadastro realizado"
          body="Perfil criado na plataforma após usar seu link ou código."
        />
        <div
          className="hidden min-w-[1.5rem] shrink-0 self-center border-t border-dashed border-slate-200 md:mx-1 md:mt-7 md:block md:flex-1 lg:mx-3"
          aria-hidden
        />
        <JourneyStep
          icon={<ShieldCheck className="size-7 text-white" strokeWidth={2} />}
          tone="brand"
          title="Primeiro trabalho concluído"
          body="Entrega da primeira campanha válida (contrato concluído)."
        />
        <div
          className="hidden min-w-[1.5rem] shrink-0 self-center border-t border-dashed border-slate-200 md:mx-1 md:mt-7 md:block md:flex-1 lg:mx-3"
          aria-hidden
        />
        <JourneyStep
          icon={<Wallet className="size-7 text-slate-600" strokeWidth={2} />}
          tone="muted"
          title="Comissão gerada"
          body="Comissão registrada após o primeiro trabalho concluído, conforme as regras vigentes da plataforma."
        />
      </div>
    </DashboardCard>
  );
}

function JourneyStep({
  icon,
  tone,
  title,
  body,
}: {
  icon: ReactNode;
  tone: "brand" | "muted";
  title: string;
  body: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-1 text-center">
      <div
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-full shadow-sm",
          tone === "brand"
            ? "bg-[#895af6] text-white shadow-[0_4px_14px_rgba(137,90,246,0.35)]"
            : "bg-slate-200 text-slate-600",
        )}
      >
        {icon}
      </div>
      <h3 className="mt-4 text-sm font-bold text-[#2c2f30]">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-[#595c5d]">{body}</p>
    </div>
  );
}

function Avatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-bold text-slate-600">
      {photoUrl ? (
        <img src={photoUrl} alt="" className="size-full object-cover" />
      ) : (
        initials || "?"
      )}
    </div>
  );
}

function AvatarMobile({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const tint = initialsAvatarTint(name);
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold uppercase",
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
