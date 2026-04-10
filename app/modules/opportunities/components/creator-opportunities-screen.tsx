import { useState } from "react";
import { ChevronDown, Filter, Sparkles, X } from "lucide-react";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { AppSidebar } from "~/components/app-sidebar";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useOpportunitiesQuery } from "../queries";
import { isOpportunitiesAddressRequiredError } from "../errors";
import {
  extractWorkTypeNames,
  filterOpportunities,
  sortOpportunities,
} from "../helpers";
import type { OpportunityFilters, SortOption } from "../types";
import { OpportunitiesAddressPendingCard } from "./opportunities-address-pending-card";
import { OpportunityCard } from "./opportunity-card";

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

const DEFAULT_FILTERS: OpportunityFilters = {
  workType: "all",
  distance: "all",
};

export function CreatorOpportunitiesScreen() {
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filters, setFilters] = useState<OpportunityFilters>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [tempFilters, setTempFilters] =
    useState<OpportunityFilters>(DEFAULT_FILTERS);

  const { data, isLoading, isError, error, refetch } = useOpportunitiesQuery();

  const hasActiveFilters =
    filters.workType !== "all" || filters.distance !== "all";

  const activeFilterCount = [
    filters.workType !== "all",
    filters.distance !== "all",
  ].filter(Boolean).length;

  const allItems = data?.items ?? [];
  const workTypeOptions = extractWorkTypeNames(allItems);
  const filtered = filterOpportunities(allItems, filters);
  const sorted = sortOpportunities(filtered, sortBy);

  const openFiltersSheet = () => {
    setTempFilters(filters);
    setFiltersOpen(true);
  };

  const applyTempFilters = () => {
    setFilters(tempFilters);
    setFiltersOpen(false);
  };

  const clearAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setTempFilters(DEFAULT_FILTERS);
    setFiltersOpen(false);
  };

  const addressBlocked = isError && isOpportunitiesAddressRequiredError(error);

  const SortDropdown = ({ size = "md" }: { size?: "sm" | "md" }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={size === "sm" ? "h-9 gap-1 text-sm" : "gap-1.5"}
        >
          {SORT_LABELS[sortBy]}
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
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
  );

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="mx-auto w-full max-w-7xl px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:pb-8">
          {/* Título e subtítulo */}
          <div className="mb-6 flex flex-col gap-2">
            <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-[#0f172a]">
              Oportunidades
            </h1>
            <p className="text-base text-[#64748b]">
              Encontre vagas abertas e candidate-se para trabalhar com empresas
              locais.
            </p>
          </div>

          {/* Banner educacional — oculto quando falta endereço (evita ruído com o estado guiado) */}
          {!addressBlocked ? (
            <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
              <div className="flex gap-2.5">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-blue-600" />
                <p className="text-sm leading-snug text-blue-700">
                  <strong className="text-blue-900">
                    Como funcionam as oportunidades?
                  </strong>{" "}
                  São vagas abertas para candidatura. As empresas analisam os
                  perfis e escolhem os creators.
                </p>
              </div>
            </div>
          ) : null}

          {/* Toolbar: título + contador + filtros + ordenação */}
          {!isLoading && !isError ? (
            <div className="mb-6 flex items-center justify-between gap-3">
              {/* Esquerda */}
              <div className="min-w-0">
                <h2 className="hidden text-xl font-semibold text-slate-900 sm:block">
                  Oportunidades disponíveis
                </h2>
                <p className="mt-0.5 text-sm text-slate-500 sm:block">
                  {sorted.length}{" "}
                  {sorted.length === 1 ? "vaga aberta" : "vagas abertas"}
                </p>
              </div>

              {/* Direita — desktop: filtros inline + ordenação */}
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                {workTypeOptions.length > 0 ? (
                  <Select
                    value={filters.workType}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, workType: e.target.value }))
                    }
                    className="h-9 w-auto min-w-[148px]"
                  >
                    <option value="all">Todos os tipos</option>
                    {workTypeOptions.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                ) : null}

                <Select
                  value={filters.distance}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      distance: e.target
                        .value as OpportunityFilters["distance"],
                    }))
                  }
                  className="h-9 w-auto min-w-[148px]"
                >
                  <option value="all">Qualquer distância</option>
                  <option value="5">Até 5 km</option>
                  <option value="10">Até 10 km</option>
                  <option value="20">Até 20 km</option>
                  <option value="50">Até 50 km</option>
                </Select>

                {sorted.length > 1 ? <SortDropdown size="sm" /> : null}
              </div>

              {/* Direita — mobile: botão Filtros + ordenação */}
              <div className="flex shrink-0 items-center gap-2 sm:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openFiltersSheet}
                  className="h-9 gap-1.5"
                >
                  <Filter className="size-3.5" />
                  Filtros
                  {activeFilterCount > 0 ? (
                    <span className="flex size-4 items-center justify-center rounded-full bg-[#895af6] text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  ) : null}
                </Button>

                {sorted.length > 1 ? <SortDropdown size="sm" /> : null}
              </div>
            </div>
          ) : null}

          {/* Conteúdo */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <OpportunityCardSkeleton key={i} />
              ))}
            </div>
          ) : addressBlocked ? (
            <div className="mx-auto w-full max-w-xl">
              <OpportunitiesAddressPendingCard />
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
                    Tente ajustar ou limpar os filtros para ver mais
                    oportunidades.
                  </p>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Limpar filtros
                  </Button>
                </>
              ) : (
                <>
                  <p className="mb-1 font-semibold text-slate-900">
                    Nenhuma oportunidade disponível
                  </p>
                  <p className="text-sm text-slate-500">
                    Novas oportunidades aparecem aqui quando empresas abrem
                    vagas. Volte em breve!
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
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

      {/* Mobile filters bottom sheet */}
      {filtersOpen ? (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white px-5 pb-8 pt-5 shadow-xl">
            {/* Handle */}
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />

            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Filtros</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="flex size-8 items-center justify-center rounded-full hover:bg-slate-100"
              >
                <X className="size-4 text-slate-500" />
              </button>
            </div>

            {/* Tipo de trabalho */}
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-600">
                Tipo de trabalho
              </label>
              <Select
                value={tempFilters.workType}
                onChange={(e) =>
                  setTempFilters((f) => ({ ...f, workType: e.target.value }))
                }
              >
                <option value="all">Todos os tipos</option>
                {workTypeOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Distância */}
            <div className="mb-6">
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-600">
                Distância máxima
              </label>
              <Select
                value={tempFilters.distance}
                onChange={(e) =>
                  setTempFilters((f) => ({
                    ...f,
                    distance: e.target.value as OpportunityFilters["distance"],
                  }))
                }
              >
                <option value="all">Qualquer distância</option>
                <option value="5">Até 5 km</option>
                <option value="10">Até 10 km</option>
                <option value="20">Até 20 km</option>
                <option value="50">Até 50 km</option>
              </Select>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearAllFilters}
              >
                Limpar filtros
              </Button>
              <Button
                className="flex-1 bg-[#895af6] hover:bg-[#6a36d5]"
                onClick={applyTempFilters}
              >
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
