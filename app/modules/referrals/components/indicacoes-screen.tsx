import type { ReactNode } from "react";
import {
  CheckCircle2,
  CircleUserRound,
  Copy,
  Info,
  Loader2,
  Wallet,
} from "lucide-react";
import { AppSidebar } from "~/components/app-sidebar";
import { AppHeader } from "~/components/layout/app-header";
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
import type { CommissionStatusApi, ReferralStatusApi } from "../types";
import { formatMoneyFromCents } from "../lib/format-money";
import {
  useActivatePartnerMutation,
  useCommissionsListQuery,
  usePartnerProfileQuery,
  useReferralsDashboardQuery,
  useReferralsListQuery,
} from "../hooks/use-referrals-data";

const DATE_FMT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function referralStatusLabel(status: ReferralStatusApi): string {
  switch (status) {
    case "PENDING":
      return "Aguardando primeiro trabalho";
    case "QUALIFIED":
      return "Primeiro trabalho concluído";
    case "EXPIRED":
      return "Indicação expirada";
    default:
      return status;
  }
}

function commissionStatusLabel(status: CommissionStatusApi): string {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "APPROVED":
      return "Aprovada";
    case "PAID":
      return "Finalizada";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
}

async function copyText(label: string, text: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copiado.`);
  } catch {
    toast.error("Não foi possível copiar. Tente selecionar manualmente.");
  }
}

export function IndicacoesScreen() {
  const { user } = useAuth();
  const role = user?.role ?? "creator";

  const profileQuery = usePartnerProfileQuery();
  const isPartnerReady = profileQuery.data?.kind === "active";

  const dashboardQuery = useReferralsDashboardQuery(isPartnerReady);
  const referralsQuery = useReferralsListQuery(isPartnerReady);
  const commissionsQuery = useCommissionsListQuery(isPartnerReady);

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
      : null) ||
    (commissionsQuery.isError && commissionsQuery.error instanceof Error
      ? commissionsQuery.error.message
      : null);

  const dashboard = dashboardQuery.data;
  const referrals = referralsQuery.data?.items ?? [];
  const commissions = commissionsQuery.data?.items ?? [];
  const profile =
    profileQuery.data?.kind === "active" ? profileQuery.data.profile : null;

  const ratePercent = profile?.commissionRatePercent ?? 10;

  return (
    <div className="min-h-screen bg-[#f5f6f7] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant={role === "business" ? "business" : "creator"} />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 pb-24 pt-4 lg:gap-8 lg:p-8 lg:pt-8">
        <AppHeader title="Indicações" />

        <div className="flex min-w-0 flex-1 flex-col gap-6 px-4 lg:gap-8 lg:px-0">
          <div className="hidden lg:block">
            <h1 className="text-2xl font-black tracking-[-0.5px] text-[#2c2f30]">
              Indicações
            </h1>
            <p className="mt-1 text-sm text-[#595c5d]">
              Ganhe comissão quando o indicado concluir o primeiro trabalho válido
              na plataforma. Não há saque automático nem extrato financeiro
              completo neste momento.
            </p>
          </div>

          {profileQuery.isLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
              <Loader2 className="size-6 animate-spin" />
              <span>Carregando…</span>
            </div>
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

              {profile &&
              (profile.referralLink || profile.referralCode) ? (
                <section className="overflow-hidden rounded-[24px] bg-gradient-to-br from-[#895af6] to-[#6a2fc4] p-5 text-white shadow-lg lg:p-8">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/90">
                    Seu link de indicação
                  </p>
                  <h2 className="mt-2 text-xl font-black leading-tight lg:text-2xl">
                    Compartilhe e convide novos criadores
                  </h2>

                  {profile.referralLink ? (
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1 rounded-xl bg-white/15 px-3 py-2.5 text-sm backdrop-blur-sm">
                        <span className="block truncate font-medium">
                          {profile.referralLink}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="shrink-0 rounded-xl border-0 bg-white font-bold text-[#6a2fc4] hover:bg-white/95"
                        onClick={() =>
                          void copyText("Link", profile.referralLink!)
                        }
                      >
                        <Copy className="mr-1.5 size-4" />
                        Copiar link
                      </Button>
                    </div>
                  ) : null}

                  {profile.referralCode ? (
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/15 px-3 py-2.5 backdrop-blur-sm">
                        <span className="text-xs font-semibold uppercase text-white/80">
                          Código
                        </span>
                        <span className="font-mono text-base font-bold tracking-wide">
                          {profile.referralCode}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        className="shrink-0 rounded-xl border-0 bg-white font-bold text-[#6a2fc4] hover:bg-white/95"
                        onClick={() =>
                          void copyText("Código", profile.referralCode!)
                        }
                      >
                        <Copy className="mr-1.5 size-4" />
                        Copiar código
                      </Button>
                    </div>
                  ) : null}

                  <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-white/85">
                    <Info className="mt-0.5 size-4 shrink-0" />
                    A comissão é calculada sobre o valor base do trabalho quando
                    o indicado concluir o primeiro contrato válido. Não há crédito
                    imediato em conta nem fluxo de saque neste MVP.
                  </p>
                </section>
              ) : null}

              {dashboard ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
                  <MetricTile
                    label="Total de indicados"
                    value={String(dashboard.totalReferrals)}
                  />
                  <MetricTile
                    label="Aguardando 1º trabalho"
                    value={String(dashboard.pendingReferrals)}
                    hint="Cadastro feito; trabalho ainda não concluído"
                  />
                  <MetricTile
                    label="Com primeiro trabalho concluído"
                    value={String(dashboard.qualifiedReferrals)}
                  />
                  <MetricTile
                    label="Total em comissões (registrado)"
                    value={formatMoneyFromCents(
                      dashboard.totalCommissionAmountCents,
                      dashboard.currency,
                    )}
                  />
                </div>
              ) : null}

              <JourneyBlock ratePercent={ratePercent} />

              <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] lg:gap-8">
                <DashboardCard>
                  <SectionHeader
                    title="Indicados recentes"
                    description="Dados conforme a API de indicações (sem localização ou redes sociais)."
                  />
                  {referralsQuery.isLoading ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                      Carregando…
                    </p>
                  ) : referrals.length === 0 ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                      Nenhuma indicação ainda.
                    </p>
                  ) : (
                    <ul className="mt-4 flex flex-col gap-3">
                      {referrals.map((r) => (
                        <li
                          key={r.id}
                          className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3"
                        >
                          <Avatar
                            name={r.referredUser.name}
                            photoUrl={r.referredUser.photoUrl}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-[#2c2f30]">
                              {r.referredUser.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {referralStatusLabel(r.status)} · desde{" "}
                              {DATE_FMT.format(new Date(r.createdAt))}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase",
                              r.status === "QUALIFIED"
                                ? "bg-emerald-100 text-emerald-800"
                                : r.status === "PENDING"
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-slate-200 text-slate-700",
                            )}
                          >
                            {referralStatusLabel(r.status)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </DashboardCard>

                <div className="flex flex-col gap-6">
                  <DashboardCard>
                    <SectionHeader
                      title="Resumo de comissões"
                      description="Valores registrados no sistema (sem saque neste MVP)."
                    />
                    {dashboard ? (
                      <div className="mt-4 space-y-3 rounded-2xl bg-[rgba(137,90,246,0.08)] p-4">
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="text-[#595c5d]">
                            Total registrado
                          </span>
                          <span className="font-bold text-[#2c2f30]">
                            {formatMoneyFromCents(
                              dashboard.totalCommissionAmountCents,
                              dashboard.currency,
                            )}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="flex items-center gap-1.5 text-[#595c5d]">
                            <Wallet className="size-4 text-[#895af6]" />
                            Pendentes de processamento
                          </span>
                          <span className="font-bold text-[#2c2f30]">
                            {formatMoneyFromCents(
                              dashboard.pendingCommissionAmountCents,
                              dashboard.currency,
                            )}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-[#2c2f30]">
                        Últimas comissões
                      </h3>
                      {commissionsQuery.isLoading ? (
                        <p className="mt-3 text-sm text-slate-500">
                          Carregando…
                        </p>
                      ) : commissions.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-500">
                          Nenhuma comissão registrada ainda.
                        </p>
                      ) : (
                        <ul className="mt-3 flex flex-col gap-2">
                          {commissions.map((c) => (
                            <li
                              key={c.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm"
                            >
                              <span className="font-medium text-[#2c2f30]">
                                {c.referredUserName}
                              </span>
                              <span className="font-semibold text-[#6a36d5]">
                                {formatMoneyFromCents(
                                  c.commissionAmountCents,
                                  c.currency,
                                )}
                              </span>
                              <span className="w-full text-xs text-slate-500">
                                {commissionStatusLabel(c.status)} ·{" "}
                                {DATE_FMT.format(new Date(c.createdAt))}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </DashboardCard>

                  <DashboardCard>
                    <SectionHeader
                      title="Como funciona"
                      addon={
                        <Info className="size-4 text-[#895af6]" aria-hidden />
                      }
                    />
                    <ol className="mt-4 space-y-4 text-sm text-[#595c5d]">
                      <li className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#895af6] text-xs font-bold text-white">
                          1
                        </span>
                        <span>
                          Compartilhe seu link ou código com quem ainda não está
                          na plataforma.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#895af6] text-xs font-bold text-white">
                          2
                        </span>
                        <span>
                          Quando a pessoa se cadastrar pelo seu link, ela entra
                          como sua indicação.
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#895af6] text-xs font-bold text-white">
                          3
                        </span>
                        <span>
                          Quando o indicado concluir o primeiro trabalho válido
                          (contrato concluído), geramos a comissão de{" "}
                          <strong>{ratePercent}%</strong> sobre a base do
                          trabalho, conforme regras do programa.
                        </span>
                      </li>
                    </ol>
                  </DashboardCard>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {role === "business" ? <BusinessBottomNav /> : <CreatorBottomNav />}
    </div>
  );
}

function MetricTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div
      className="rounded-[20px] border border-[rgba(106,54,213,0.08)] bg-white p-4 shadow-sm"
      style={{
        boxShadow:
          "0px 4px 6px -1px rgba(106,54,213,0.04), 0px 20px 40px -1px rgba(44,47,48,0.08)",
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-[#2c2f30]">{value}</p>
      {hint ? (
        <p className="mt-1 text-[10px] leading-tight text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function JourneyBlock({ ratePercent }: { ratePercent: number }) {
  return (
    <DashboardCard>
      <SectionHeader
        title="Jornada da indicação"
        description="Estágios possíveis após o cadastro do indicado."
      />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <JourneyStep
          icon={<CircleUserRound className="size-6" />}
          title="Cadastro realizado"
          body="A pessoa entrou na plataforma usando seu link ou código."
        />
        <JourneyStep
          icon={<CheckCircle2 className="size-6" />}
          title="Primeiro trabalho concluído"
          body="O indicado finaliza o primeiro contrato válido."
        />
        <JourneyStep
          icon={<Wallet className="size-6" />}
          title="Comissão gerada"
          body={`Comissão de ${ratePercent}% registrada sobre a base do trabalho, sem fluxo de saque neste MVP.`}
        />
      </div>
    </DashboardCard>
  );
}

function JourneyStep({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-white text-[#895af6] shadow-sm">
        {icon}
      </div>
      <h3 className="mt-3 text-sm font-bold text-[#2c2f30]">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-[#595c5d]">{body}</p>
    </div>
  );
}

function Avatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string | null;
}) {
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
