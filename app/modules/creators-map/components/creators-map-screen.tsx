import { useEffect, useRef, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { AppLogoMark } from "~/components/ui/app-logo-mark";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { AppSidebar } from "~/components/app-sidebar";
import { GoogleCreatorsMap } from "~/modules/creators-map/components/google-creators-map";
import {
  useCreatorsMapController,
  type DistanceFilter,
} from "../hooks/use-creators-map-controller";
import { CreatorMapCard } from "./creator-map-card";
import {
  CreatorMapMobileSheet,
  type SheetState,
} from "./creator-map-mobile-sheet";

const DISTANCE_FILTERS: Array<{ id: DistanceFilter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "1km", label: "Até 1km" },
  { id: "3km", label: "Até 3km" },
  { id: "5km", label: "Até 5km" },
];

export function CreatorsMapScreen() {
  const controller = useCreatorsMapController();
  const { viewModel, actions } = controller;
  const [mobileSheetState, setMobileSheetState] =
    useState<SheetState>("collapsed");
  const [mobileTopInset, setMobileTopInset] = useState(118);
  const [bottomNavHeight, setBottomNavHeight] = useState(88);
  const mobileTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topEl = mobileTopRef.current;
    if (!topEl) return;

    const measureTop = () => {
      setMobileTopInset(Math.ceil(topEl.getBoundingClientRect().height));
    };

    measureTop();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measureTop);
      return () => window.removeEventListener("resize", measureTop);
    }

    const observer = new ResizeObserver(measureTop);
    observer.observe(topEl);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const measureBottomNav = () => {
      const navEl = document.querySelector<HTMLElement>(
        "[data-business-bottom-nav]",
      );
      if (!navEl) return;
      setBottomNavHeight(Math.ceil(navEl.getBoundingClientRect().height));
    };

    measureBottomNav();
    window.addEventListener("resize", measureBottomNav);

    const navEl = document.querySelector<HTMLElement>(
      "[data-business-bottom-nav]",
    );
    if (typeof ResizeObserver === "undefined" || !navEl) {
      return () => window.removeEventListener("resize", measureBottomNav);
    }

    const observer = new ResizeObserver(measureBottomNav);
    observer.observe(navEl);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureBottomNav);
    };
  }, []);

  const mobileBottomOffset = `${bottomNavHeight}px`;

  return (
    <div className="bg-[#f6f5f8]">
      {/* ── Desktop layout ── */}
      <div className="hidden h-screen overflow-hidden lg:flex">
        {/* Global nav sidebar */}
        <AppSidebar variant="business" />

        {/* Discovery panel */}
        <aside className="flex min-w-[300px] w-[400px] flex-shrink-0 flex-col border-r border-slate-200 bg-white">
          {/* Panel header */}
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="mb-4 flex items-center gap-2.5">
              {/* <AppLogoMark preset="lg" /> */}
              <div>
                <h1 className="text-base font-semibold text-slate-900">
                  Mapa de Criadores
                </h1>
                <p className="text-xs text-slate-500">
                  Encontre creators próximos à sua empresa
                </p>
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
                placeholder="Buscar por nome"
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
            </div>

            {/* Results count */}
            <div className="flex items-center gap-2 rounded-lg border border-purple-100/60 bg-purple-50/50 px-3 py-2">
              <MapPin size={14} className="text-purple-600" />
              <span className="text-xs text-slate-600">
                <span className="font-semibold text-slate-900">
                  {viewModel.creators.length} creators
                </span>{" "}
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
                <p className="text-sm text-slate-500">
                  Nenhum creator encontrado.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Tente ajustar os filtros.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Map area */}
        <div className="relative min-w-0 flex-1 p-4">
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
        <div
          ref={mobileTopRef}
          className="pointer-events-none absolute inset-x-0 top-0 z-20 px-4 pt-4"
        >
          <div className="pointer-events-auto rounded-[28px] border border-white/70 bg-white/92 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <div className="pointer-events-auto flex items-center gap-3">
              <AppLogoMark
                preset="sm"
                className="size-10 rounded-[14px] shadow-[0_10px_24px_rgba(137,90,246,0.2)]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">
                  UGC Local
                </p>
                <p className="truncate text-xs text-slate-500">
                  Mapa de Criadores
                </p>
              </div>
            </div>

            <div className="pointer-events-auto mt-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 shadow-inner shadow-slate-100/70">
                <Search size={16} className="text-slate-400" />
                <input
                  value={viewModel.search}
                  onChange={(e) => actions.setSearch(e.target.value)}
                  placeholder="Buscar creators próximos..."
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pointer-events-auto mt-2.5 flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {DISTANCE_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => actions.setDistanceFilter(filter.id)}
                  className={
                    viewModel.distanceFilter === filter.id
                      ? "shrink-0 rounded-full bg-[#895af6] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_8px_18px_rgba(137,90,246,0.28)]"
                      : "shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600"
                  }
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map — fills space between header and bottom nav */}
        <div className="relative flex-1">
          <GoogleCreatorsMap
            className="h-full w-full"
            creators={viewModel.creators}
            selectedCreatorId={viewModel.selectedCreatorId}
            onSelectCreator={(id) => {
              actions.setSelectedCreatorId(id);
              if (mobileSheetState === "collapsed")
                setMobileSheetState("medium");
            }}
            distanceFilter={viewModel.distanceFilter}
            companyLatLng={viewModel.companyLatLng}
            onSearchInArea={(bounds) => actions.setBoundsFilter(bounds)}
            onReturnToCompany={() => actions.setBoundsFilter(null)}
            uiVariant="mobile"
            showCreatorCountBadge={false}
            topInset={mobileTopInset}
            bottomInset={bottomNavHeight}
            mobileSheetState={mobileSheetState}
          />
        </div>

        {/* Bottom sheet — sits above the bottom nav */}
        <CreatorMapMobileSheet
          creators={viewModel.creators}
          selectedCreatorId={viewModel.selectedCreatorId}
          onSelectCreator={actions.setSelectedCreatorId}
          state={mobileSheetState}
          onStateChange={setMobileSheetState}
          bottomOffset={mobileBottomOffset}
        />

        <BusinessBottomNav />
      </div>
    </div>
  );
}
