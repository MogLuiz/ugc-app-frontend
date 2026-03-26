import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useLocation, useParams } from "react-router";
import { AuthGuard } from "~/components/auth-guard";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { useAuth } from "~/hooks/use-auth";

type CampanhaSnapshot = {
  company: string;
  title: string;
  description: string | null;
  jobKindLabel: string;
  startLabel: string;
  endLabel: string;
  durationLabel: string;
  locationLine: string | null;
  modeLine: string;
  distanceLabel: string | null;
};

type CampanhaLocationState = {
  snapshot?: CampanhaSnapshot;
};

export default function CampanhaRoute() {
  return (
    <AuthGuard>
      <CampanhaPage />
    </AuthGuard>
  );
}

function CampanhaPage() {
  const { contractRequestId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const state = (location.state as CampanhaLocationState | null) ?? null;
  const snap = state?.snapshot;

  if (user?.role !== "creator") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f6f5f8] lg:min-h-screen lg:flex-row">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>
      <main className="flex w-full min-w-0 flex-1 flex-col px-5 pb-28 pt-6 lg:px-10 lg:pb-10 lg:pt-10">
        <Link
          to="/agenda"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600"
        >
          <ArrowLeft className="size-4" />
          Voltar à agenda
        </Link>

        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Campanha
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {snap?.title ?? "Detalhes da campanha"}
        </h1>
        {contractRequestId ? (
          <p className="mt-1 font-mono text-xs text-slate-400">{contractRequestId}</p>
        ) : null}

        {snap ? (
          <div className="mx-auto mt-8 w-full max-w-lg space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">{snap.company}</p>
              <p className="mt-1 text-sm text-slate-600">{snap.jobKindLabel}</p>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase text-slate-400">
                Horário
              </h2>
              <p className="mt-2 text-sm text-slate-800">
                {snap.startLabel} — {snap.endLabel} · {snap.durationLabel}
              </p>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xs font-bold uppercase text-slate-400">
                Local
              </h2>
              <p className="mt-2 text-sm text-slate-800">
                {snap.locationLine ?? snap.modeLine}
              </p>
              {snap.distanceLabel ? (
                <p className="mt-1 text-sm text-slate-600">
                  Distância: {snap.distanceLabel}
                </p>
              ) : null}
            </section>
            {snap.description ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xs font-bold uppercase text-slate-400">
                  Descrição
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {snap.description}
                </p>
              </section>
            ) : null}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-6 text-sm text-slate-600">
            Abra a campanha completa a partir da agenda para carregar o resumo.
          </p>
        )}
      </main>
      <CreatorBottomNav />
    </div>
  );
}
