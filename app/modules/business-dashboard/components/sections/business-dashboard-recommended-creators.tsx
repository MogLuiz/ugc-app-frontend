import { Link } from "react-router";
import { EmptyState } from "~/components/ui/empty-state";
import type { CompanyDashboardRecommendedCreator } from "../../types";
import { DashboardCard, SectionHeader, SectionMessage, SectionSkeleton } from "./section-primitives";

export function BusinessDashboardRecommendedCreators({
  items,
  isLoading,
  errorMessage,
  hasRecommendedCreators,
  isRefreshing,
  getCreatorFallbackInitials,
}: {
  items: CompanyDashboardRecommendedCreator[];
  isLoading: boolean;
  errorMessage: string | null;
  hasRecommendedCreators: boolean;
  isRefreshing: boolean;
  getCreatorFallbackInitials: (name: string) => string;
}) {
  return (
    <DashboardCard>
      <SectionHeader
        title="Criadores recomendados"
        description="Sugestões do marketplace."
        ctaLabel="Ver todos"
        ctaTo="/marketplace"
      />

      {isRefreshing && !isLoading ? (
        <p className="mt-4 text-xs font-medium text-[#595c5d]/70">Atualizando...</p>
      ) : null}

      <div className="mt-5">
        {isLoading ? <SectionSkeleton rows={3} /> : null}

        {!isLoading && errorMessage ? (
          <SectionMessage message={errorMessage} tone="error" />
        ) : null}

        {!isLoading && !errorMessage && items.length === 0 ? (
          hasRecommendedCreators ? (
            <EmptyState
              title="Nenhum creator para exibir"
              description="Abra o marketplace para ver mais opções."
            />
          ) : (
            <EmptyState
              title="Sem creators recomendados"
              description="Quando houver creators disponíveis, eles aparecerão aqui."
            />
          )
        ) : null}

        {!isLoading && !errorMessage && items.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {items.map((creator) => (
              <div
                key={creator.id}
                className="min-w-[280px] shrink-0 rounded-2xl border border-slate-100 p-4 lg:min-w-0"
              >
                <div className="flex items-start gap-3">
                  {creator.avatarUrl ? (
                    <img
                      src={creator.avatarUrl}
                      alt=""
                      className="size-14 rounded-full object-cover ring-2 ring-white"
                    />
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#6a36d5]/10 text-sm font-bold text-[#6a36d5] ring-2 ring-white">
                      {getCreatorFallbackInitials(creator.name)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[#2c2f30]">{creator.name}</p>
                    <p className="mt-0.5 text-sm text-[#595c5d]">
                      {creator.niche}
                      {creator.rating != null ? ` · ${creator.rating.toFixed(1)} ★` : ""}
                    </p>
                    <p className="mt-1 text-xs text-[#595c5d]/80">{creator.location}</p>
                  </div>
                </div>
                <Link
                  to={`/criador/${creator.id}`}
                  state={{ marketplaceCreator: creator }}
                  className="mt-4 flex w-full items-center justify-center rounded-full border-2 border-[#6a36d5] py-2.5 text-sm font-bold text-[#6a36d5] transition hover:bg-[#6a36d5]/5"
                >
                  Convidar
                </Link>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </DashboardCard>
  );
}
