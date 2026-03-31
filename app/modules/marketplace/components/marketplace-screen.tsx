import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { useMarketplaceController } from "../hooks/use-marketplace-controller";
import {
  MarketplaceCreatorCardDesktop,
  MarketplaceCreatorCardMobile,
  MarketplaceHeader,
  MarketplacePagination,
  MarketplaceSearchAndFilters,
} from "./sections/marketplace-sections";

export function MarketplaceScreen() {
  const controller = useMarketplaceController();
  const { viewModel, actions } = controller;
  const showEmptyState =
    !viewModel.isInitialLoading &&
    !viewModel.errorMessage &&
    viewModel.creators.length === 0;

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden pb-24 pt-4 lg:gap-8 lg:px-8 lg:py-8">
        <div className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden px-4 lg:gap-8 lg:px-0">
        <h1 className="text-xl font-black tracking-[-0.4px] text-[#2c2f30] lg:hidden">Criadores</h1>
        <MarketplaceHeader />

        <div className="flex flex-col gap-4 lg:gap-8">
          <MarketplaceSearchAndFilters
            search={viewModel.search}
            onSearchChange={actions.setSearch}
            serviceTypeId={viewModel.serviceTypeId}
            onServiceTypeChange={actions.setServiceTypeId}
            serviceTypes={viewModel.serviceTypes}
            isServiceTypesLoading={viewModel.isInitialLoading}
          />

          {viewModel.errorMessage ? (
            <section className="rounded-3xl border border-rose-100 bg-white p-6 text-center text-sm text-rose-500 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              {viewModel.errorMessage}
            </section>
          ) : null}

          {viewModel.isInitialLoading ? (
            <div className="animate-pulse grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
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
                Ajuste a busca ou troque o tipo de servico para ampliar os
                resultados.
              </p>
            </section>
          ) : null}

          {!viewModel.isInitialLoading && !viewModel.errorMessage && viewModel.creators.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {viewModel.totalCreators} creator
                  {viewModel.totalCreators === 1 ? "" : "es"} encontrado
                  {viewModel.totalCreators === 1 ? "" : "s"}
                </p>
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

          <MarketplacePagination
            currentPage={viewModel.currentPage}
            totalPages={viewModel.totalPages}
            onPageChange={actions.setCurrentPage}
          />
        </div>
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
