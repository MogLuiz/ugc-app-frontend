import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { AppSidebar } from "~/components/app-sidebar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useOpportunitiesQuery } from "../queries";
import {
  extractWorkTypeNames,
  filterOpportunities,
  sortOpportunities,
} from "../helpers";
import type { OpportunityFilters, SortOption } from "../types";
import { OpportunityCard } from "./opportunity-card";
import { OpportunityFiltersPanel } from "./opportunity-filters";

function OpportunityCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[28px] border-2 border-slate-100 bg-white p-5 sm:p-6">
      <div className="mb-4 h-5 w-24 rounded-full bg-slate-100" />
      <div className="mb-5">
        <div className="mb-1 h-3 w-28 rounded bg-slate-100" />
        <div className="h-8 w-1/3 rounded bg-slate-200" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 rounded bg-slate-100" />
        ))}
      </div>
    </div>
  );
}

const SORT_LABELS: Record<SortOption, string> = {
  recent: "Mais recentes",
  value: "Maior valor",
  distance: "Mais próximas",
};

export function CreatorOpportunitiesScreen() {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filters, setFilters] = useState<OpportunityFilters>({
    workType: "all",
    distance: "all",
  });

  const { data, isLoading, isError, refetch } = useOpportunitiesQuery();

  const hasActiveFilters =
    filters.workType !== "all" || filters.distance !== "all";

  const allItems = data?.items ?? [];
  const workTypeOptions = extractWorkTypeNames(allItems);
  const filtered = filterOpportunities(allItems, filters);
  const sorted = sortOpportunities(filtered, sortBy);

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:pb-8">
          {/* Título e subtítulo — visível em todas as resoluções */}
          <div className="mb-6 flex flex-col gap-2">
            <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-[#0f172a]">
              Oportunidades
            </h1>
            <p className="text-base text-[#64748b]">
              Encontre vagas abertas e candidate-se para trabalhar com empresas locais.
            </p>
          </div>
          {/* Filtros — só renderiza com opções disponíveis */}
          {!isLoading && allItems.length > 0 ? (
            <div className="mb-6">
              <OpportunityFiltersPanel
                onFilterChange={setFilters}
                workTypeOptions={workTypeOptions}
              />
            </div>
          ) : null}

          {/* Banner educacional */}
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:p-5">
            <div className="flex gap-3">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-blue-600" />
              <div>
                <h3 className="mb-1 font-semibold text-blue-900">
                  Como funcionam as oportunidades?
                </h3>
                <p className="text-sm text-blue-700">
                  Diferente das <strong>Ofertas</strong> (convites diretos),
                  as <strong>Oportunidades</strong> são vagas abertas onde você
                  se candidata. As empresas analisam os perfis e escolhem os
                  creators ideais.
                </p>
              </div>
            </div>
          </div>

          {/* Toolbar: contador + ordenação */}
          {!isLoading && !isError ? (
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Oportunidades disponíveis
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {sorted.length}{" "}
                  {sorted.length === 1 ? "vaga aberta" : "vagas abertas"}
                </p>
              </div>

              {sorted.length > 1 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      {SORT_LABELS[sortBy]}
                      <ChevronDown className="ml-2 size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                      <DropdownMenuItem key={opt} onClick={() => setSortBy(opt)}>
                        <div className="flex w-full items-center justify-between">
                          <span>{SORT_LABELS[opt]}</span>
                          {sortBy === opt ? (
                            <span className="text-[#895af6]">✓</span>
                          ) : null}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : null}
            </div>
          ) : null}

          {/* Conteúdo */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <OpportunityCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-12 text-center">
              <p className="mb-4 text-slate-600">
                Erro ao carregar oportunidades.
              </p>
              <Button variant="outline" onClick={() => void refetch()}>
                Tentar novamente
              </Button>
            </div>
          ) : sorted.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-12 text-center">
              <Sparkles className="mx-auto mb-4 size-12 text-slate-300" />
              {hasActiveFilters ? (
                <>
                  <p className="mb-1 font-semibold text-slate-900">
                    Nenhuma vaga com esses filtros
                  </p>
                  <p className="mb-6 text-sm text-slate-500">
                    Tente ajustar ou limpar os filtros para ver mais oportunidades.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({ workType: "all", distance: "all" })
                    }
                  >
                    Limpar filtros
                  </Button>
                </>
              ) : (
                <>
                  <p className="mb-1 font-semibold text-slate-900">
                    Nenhuma oportunidade disponível
                  </p>
                  <p className="text-sm text-slate-500">
                    Novas oportunidades aparecem aqui quando empresas abrem vagas.
                    Volte em breve!
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 sm:gap-6">
                {sorted.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
                ))}
              </div>

              {data && data.pagination.totalPages > 1 ? (
                <div className="mt-8 flex justify-center">
                  <Button variant="outline" size="lg">
                    Carregar mais oportunidades
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </main>
      </div>

      <CreatorBottomNav />
    </div>
  );
}
