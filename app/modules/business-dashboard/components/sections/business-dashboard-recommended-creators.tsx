import { Link } from "react-router";
import { EmptyState } from "~/components/ui/empty-state";
import type { CompanyDashboardRecommendedCreator } from "../../types";
import {
  DashboardCard,
  SectionHeader,
  SectionMessage,
  SectionSkeleton,
} from "./section-primitives";

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
    <section className="flex flex-col gap-4">
      <SectionHeader
        title="Criadores recomendados"
        description="Creators que combinam com suas campanhas."
        ctaLabel="Ver todos"
        ctaTo="/marketplace"
      />

      {isLoading ? <SectionSkeleton rows={3} /> : null}

      {!isLoading && errorMessage ? (
        <SectionMessage message={errorMessage} tone="error" />
      ) : null}

      {!isLoading && !errorMessage && items.length === 0 ? (
        <DashboardCard shadowTone="neutral" className="p-3 lg:p-3">
          {hasRecommendedCreators ? (
            <EmptyState
              title="Nenhum creator para exibir"
              description="Abra o marketplace para ver mais opções."
            />
          ) : (
            <EmptyState
              title="Sem creators recomendados"
              description="Quando houver creators disponíveis, eles aparecerão aqui."
            />
          )}
        </DashboardCard>
      ) : null}

      {!isLoading && !errorMessage && items.length > 0 ? (
        <div className="lg:rounded-2xl lg:border lg:border-slate-100 lg:bg-white lg:p-4 lg:shadow-sm">
          <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory lg:flex-col lg:overflow-visible lg:snap-none">
            {items.map((creator) => (
              <div
                key={creator.id}
                className="w-[280px] shrink-0 snap-start rounded-2xl border border-slate-100 bg-white p-4 lg:w-auto"
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
                    <p className="truncate font-bold text-[#2c2f30]">
                      {creator.name}
                    </p>
                    <p className="mt-0.5 text-sm text-[#595c5d]">
                      {creator.niche}
                      {creator.rating != null
                        ? ` · ${creator.rating.toFixed(1)} ★`
                        : ""}
                    </p>
                    <p className="mt-1 text-xs text-[#595c5d]/80">
                      {creator.location}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/criador/${creator.id}`}
                  state={{ marketplaceCreator: creator }}
                  className="mt-4 flex w-full items-center justify-center rounded-full border-2 border-[#6a36d5] py-2.5 text-sm font-bold text-[#6a36d5] transition hover:bg-[#6a36d5]/5"
                >
                  Ver perfil
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
