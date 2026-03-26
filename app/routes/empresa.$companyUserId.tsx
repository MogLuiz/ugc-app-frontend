import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useLocation, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { AuthGuard } from "~/components/auth-guard";
import { AppSidebar } from "~/components/app-sidebar";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { CompanyPreview } from "~/components/company/company-preview";
import { useAuth } from "~/hooks/use-auth";
import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";

type EmpresaNavState = {
  companyName?: string;
  companyPhotoUrl?: string | null;
  companyRating?: number | null;
};

type CompanyApiPayload = {
  companyName?: string;
  photoUrl?: string | null;
  rating?: number | null;
  description?: string | null;
  instagramUsername?: string | null;
  tiktokUsername?: string | null;
  websiteUrl?: string | null;
};

export default function EmpresaRoute() {
  return (
    <AuthGuard>
      <EmpresaPage />
    </AuthGuard>
  );
}

function EmpresaPage() {
  const { companyUserId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const nav = (location.state as EmpresaNavState | null) ?? null;

  const q = useQuery({
    queryKey: ["company-profile", companyUserId],
    queryFn: async () => {
      const token = await getAccessToken();
      return httpClient<CompanyApiPayload>(`/companies/${companyUserId}`, {
        token,
      });
    },
    enabled: Boolean(companyUserId),
    retry: false,
  });

  if (user?.role !== "creator") {
    return <Navigate to="/dashboard" replace />;
  }

  const id = companyUserId ?? "";
  const name =
    q.data?.companyName?.trim() ||
    nav?.companyName?.trim() ||
    "Empresa";
  const photo = q.data?.photoUrl ?? nav?.companyPhotoUrl ?? null;
  const rating =
    q.data?.rating ?? nav?.companyRating ?? null;
  const hasApiData = q.isSuccess && q.data;
  const showUnavailable = q.isError && !nav?.companyName;

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

        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Perfil da empresa
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Informações públicas e de confiança para o seu próximo trabalho.
        </p>

        <div className="mx-auto mt-8 w-full max-w-lg space-y-6">
          {q.isLoading ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          ) : null}

          {showUnavailable ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-6 text-sm text-slate-600">
              Perfil indisponível no momento. Quando a API{" "}
              <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">
                GET /companies/:id
              </code>{" "}
              estiver ativa, os dados completos aparecerão aqui. Abra este perfil
              a partir da agenda para ver o que já temos em cache.
            </p>
          ) : null}

          {!q.isLoading && (hasApiData || nav?.companyName) ? (
            <>
              <CompanyPreview
                name={name}
                photoUrl={photo}
                rating={rating}
                className="bg-white"
              />
              {q.data?.description ? (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Sobre
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    {q.data.description}
                  </p>
                </section>
              ) : null}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Redes
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {q.data?.websiteUrl ? (
                    <li>
                      <a
                        href={q.data.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-violet-600 underline-offset-2 hover:underline"
                      >
                        Site
                      </a>
                    </li>
                  ) : null}
                  {q.data?.instagramUsername ? (
                    <li>Instagram: @{q.data.instagramUsername}</li>
                  ) : null}
                  {q.data?.tiktokUsername ? (
                    <li>TikTok: @{q.data.tiktokUsername}</li>
                  ) : null}
                  {!q.data?.websiteUrl &&
                  !q.data?.instagramUsername &&
                  !q.data?.tiktokUsername ? (
                    <li className="text-slate-500">
                      Nenhuma rede cadastrada ainda.
                    </li>
                  ) : null}
                </ul>
              </section>
            </>
          ) : null}
        </div>
      </main>
      <CreatorBottomNav />
    </div>
  );
}
