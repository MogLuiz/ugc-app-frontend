import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { AppLogoMark } from "~/components/ui/app-logo-mark";
import { AppHeader } from "~/components/layout/app-header";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { GoogleCreatorsMap } from "~/modules/creators-map/components/google-creators-map";
import {
  useCreatorsMapController,
  type CategoryFilter,
  type DistanceFilter,
} from "../hooks/use-creators-map-controller";
import { CreatorMapCard } from "./creator-map-card";
import { CreatorMapMobileSheet } from "./creator-map-mobile-sheet";

const DISTANCE_FILTERS: Array<{ id: DistanceFilter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "1km", label: "Até 1km" },
  { id: "3km", label: "Até 3km" },
  { id: "5km", label: "Até 5km" },
];

const CATEGORIES: Array<{ id: CategoryFilter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "beleza", label: "Beleza" },
  { id: "gastronomia", label: "Gastronomia" },
  { id: "tech", label: "Tech" },
  { id: "fitness", label: "Saúde" },
];

export function CreatorsMapScreen() {
  const controller = useCreatorsMapController();
  const { viewModel, actions } = controller;

  return (
    <div className="bg-[#f6f5f8]">
      {/* ── Desktop layout ── */}
      <div className="hidden h-screen overflow-hidden lg:flex">
        {/* Discovery panel */}
        <aside className="flex w-[400px] flex-shrink-0 flex-col border-r border-slate-200 bg-white">
          {/* Panel header */}
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="mb-4 flex items-center gap-2.5">
              <AppLogoMark preset="lg" />
              <div>
                <h1 className="text-base font-semibold text-slate-900">Mapa de Criadores</h1>
                <p className="text-xs text-slate-500">Encontre creators próximos à sua empresa</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={viewModel.search}
                onChange={(e) => actions.setSearch(e.target.value)}
                placeholder="Buscar por nome, nicho ou região..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            {/* Distance filters */}
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              {DISTANCE_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => actions.setDistanceFilter(f.id)}
                  className={
                    viewModel.distanceFilter === f.id
                      ? "rounded-lg bg-[#895af6] px-3 py-1.5 text-xs font-semibold text-white"
                      : "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-purple-200 hover:bg-purple-50/50"
                  }
                >
                  {f.label}
                </button>
              ))}
              <button
                type="button"
                className="ml-auto rounded-lg border border-slate-200 p-1.5 hover:bg-slate-50"
                aria-label="Mais filtros"
              >
                <SlidersHorizontal size={15} className="text-slate-500" />
              </button>
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 rounded-lg border border-purple-100/60 bg-purple-50/50 px-3 py-2">
              <MapPin size={14} className="text-purple-600" />
              <span className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">{viewModel.creators.length} creators</span>{" "}
                na sua região
              </span>
            </div>
          </div>

          {/* Creators list */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {viewModel.creators.map((creator) => (
              <CreatorMapCard
                key={creator.id}
                creator={creator}
                isActive={viewModel.selectedCreatorId === creator.id}
                onSelect={() => actions.setSelectedCreatorId(creator.id)}
              />
            ))}
            {viewModel.creators.length === 0 && (
              <div className="py-16 text-center">
                <MapPin size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="text-sm text-slate-500">Nenhum creator encontrado.</p>
                <p className="mt-1 text-xs text-slate-400">Tente ajustar os filtros.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Map area */}
        <div className="relative flex-1 p-4">
          <GoogleCreatorsMap
            className="h-full w-full overflow-hidden rounded-2xl"
            creators={viewModel.creators}
            selectedCreatorId={viewModel.selectedCreatorId}
            onSelectCreator={actions.setSelectedCreatorId}
            distanceFilter={viewModel.distanceFilter}
            companyLatLng={viewModel.companyLatLng}
            onSearchInArea={(bounds) => {
              actions.setBoundsFilter(bounds);
            }}
            onReturnToCompany={() => {
              actions.setBoundsFilter(null);
            }}
          />
        </div>
      </div>

      {/* ── Mobile layout ── */}
      <div className="relative flex h-screen flex-col lg:hidden">
        <AppHeader title="Mapa de Criadores" />

        {/* Map — fills space between header and bottom nav */}
        <div className="relative flex-1">
          <GoogleCreatorsMap
            className="absolute inset-0"
            creators={viewModel.creators}
            selectedCreatorId={viewModel.selectedCreatorId}
            onSelectCreator={actions.setSelectedCreatorId}
            distanceFilter={viewModel.distanceFilter}
            companyLatLng={viewModel.companyLatLng}
            onSearchInArea={(bounds) => actions.setBoundsFilter(bounds)}
            onReturnToCompany={() => actions.setBoundsFilter(null)}
          />

          {/* Mobile search overlay */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-white/80 to-transparent px-4 pb-6 pt-3">
            <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2.5 shadow-sm">
              <Search size={15} className="text-purple-500" />
              <input
                value={viewModel.search}
                onChange={(e) => actions.setSearch(e.target.value)}
                placeholder="Buscar em BH..."
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
            </div>

            {/* Category chips */}
            <div className="pointer-events-auto mt-2.5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => actions.setActiveCategory(cat.id)}
                  className={
                    viewModel.activeCategory === cat.id
                      ? "shrink-0 rounded-full bg-[#895af6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
                      : "shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600"
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom sheet — sits above the bottom nav */}
        <CreatorMapMobileSheet
          creators={viewModel.creators}
          selectedCreatorId={viewModel.selectedCreatorId}
          onSelectCreator={actions.setSelectedCreatorId}
        />

        <BusinessBottomNav />
      </div>
    </div>
  );
}
