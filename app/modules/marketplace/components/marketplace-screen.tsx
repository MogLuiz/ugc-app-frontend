import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { Link, useLocation } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { useMarketplaceController } from "../hooks/use-marketplace-controller";
import { useIntersectionObserver } from "../hooks/use-intersection-observer";
import {
  MarketplaceCreatorCardDesktop,
  MarketplaceCreatorCardMobile,
  MarketplaceHeader,
  MarketplaceSearchAndFilters,
} from "./sections/marketplace-sections";

const SCROLL_KEY = "mkt_scroll";

export function MarketplaceScreen() {
  const location = useLocation();
  const controller = useMarketplaceController();
  const { viewModel, actions } = controller;
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasRestoredRef = useRef(false);

  const showEmptyState =
    !viewModel.isInitialLoading &&
    !viewModel.errorMessage &&
    viewModel.creators.length === 0;

  const showEndMessage =
    !viewModel.isInitialLoading &&
    !viewModel.isFetchingNextPage &&
    !viewModel.hasNextPage &&
    viewModel.creators.length > 0;

  useIntersectionObserver(sentinelRef, actions.fetchNextPage, {
    enabled:
      viewModel.hasNextPage &&
      !viewModel.isFetchingNextPage &&
      !viewModel.isInitialLoading,
  });

  // Save scroll position on every scroll event, keyed by location.key
  useEffect(() => {
    const save = () =>
      sessionStorage.setItem(
        SCROLL_KEY,
        JSON.stringify({ key: location.key, y: window.scrollY }),
      );
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [location.key]);

  // Restore scroll once data is ready (handles back navigation from creator profile)
  useEffect(() => {
    if (hasRestoredRef.current || viewModel.isInitialLoading) return;
    try {
      const raw = sessionStorage.getItem(SCROLL_KEY);
      if (!raw) return;
      const { key, y } = JSON.parse(raw) as { key: string; y: number };
      if (key === location.key && y > 0) {
        hasRestoredRef.current = true;
        requestAnimationFrame(() =>
          window.scrollTo({ top: y, behavior: "instant" }),
        );
      }
    } catch {}
  }, [viewModel.isInitialLoading, location.key]);

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden pb-24 pt-4 lg:gap-8 lg:px-8 lg:py-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden px-4 lg:gap-8 lg:px-0">
          <h1 className="text-xl font-black tracking-[-0.4px] text-[#2c2f30] lg:hidden">
            Marketplace de Criadores
          </h1>
          <MarketplaceHeader />

          <div className="flex flex-col gap-4 lg:gap-8">
            <MarketplaceSearchAndFilters
              search={viewModel.search}
              onSearchChange={actions.setSearch}
              serviceTypeId={viewModel.serviceTypeId}
              onServiceTypeChange={actions.setServiceTypeId}
              serviceTypes={viewModel.serviceTypes}
              isServiceTypesLoading={viewModel.isInitialLoading}
              sortBy={viewModel.sortBy}
              onSortChange={actions.setSortBy}
              minAge={viewModel.minAge}
              maxAge={viewModel.maxAge}
              onMinAgeChange={actions.setMinAge}
              onMaxAgeChange={actions.setMaxAge}
            />

            {viewModel.errorMessage ? (
              <section className="rounded-3xl border border-rose-100 bg-white p-6 text-center text-sm text-rose-500 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                {viewModel.errorMessage}
              </section>
            ) : null}

            {viewModel.isInitialLoading ? (
              <div className="animate-pulse grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[196px] rounded-[28px] border border-slate-100 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                  />
                ))}
              </div>
            ) : null}

            {showEmptyState ? (
              <section className="rounded-3xl border border-[rgba(137,90,246,0.05)] bg-white p-8 text-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
                <h3 className="text-lg font-bold text-slate-900">
                  Nenhum creator encontrado
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Ajuste a busca ou troque o tipo de serviço para ampliar os
                  resultados.
                </p>
              </section>
            ) : null}

            {!viewModel.isInitialLoading &&
            !viewModel.errorMessage &&
            viewModel.creators.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {viewModel.totalCreators} criador
                    {viewModel.totalCreators === 1
                      ? "encontrado perto de você"
                      : "es encontrados perto de você"}
                  </p>
                  <Link
                    to="/mapa"
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 lg:hidden"
                  >
                    <MapPin className="size-3.5" />
                    Ver no mapa
                  </Link>
                </div>

                <section className="hidden gap-6 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-6 xl:grid-cols-4">
                  {viewModel.creators.map((creator) => (
                    <MarketplaceCreatorCardDesktop
                      key={creator.id}
                      creator={creator}
                      onHire={actions.onHire}
                    />
                  ))}
                </section>

                <section className="flex flex-col gap-4 lg:hidden">
                  {viewModel.creators.map((creator) => (
                    <MarketplaceCreatorCardMobile
                      key={creator.id}
                      creator={creator}
                      onHire={actions.onHire}
                    />
                  ))}
                </section>
              </>
            ) : null}

            {/* Sentinel: fires fetchNextPage 200px before the user reaches this point */}
            {viewModel.hasNextPage ? (
              <div ref={sentinelRef} className="h-1" aria-hidden />
            ) : null}

            {/* Skeleton for next page — appears below existing cards while loading */}
            {viewModel.isFetchingNextPage ? (
              <div className="animate-pulse grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[196px] rounded-[28px] border border-slate-100 bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
                  />
                ))}
              </div>
            ) : null}

            {showEndMessage ? (
              <p className="py-4 text-center text-sm text-slate-400">
                Você viu todos os creators disponíveis.
              </p>
            ) : null}
          </div>
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
