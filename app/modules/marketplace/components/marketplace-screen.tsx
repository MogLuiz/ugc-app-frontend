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

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <main className="flex min-w-0 flex-1 flex-col gap-6 overflow-hidden px-4 pb-24 pt-4 lg:gap-8 lg:px-8 lg:py-8">
        <MarketplaceHeader />

        <div className="flex flex-col gap-4 lg:gap-8">
          <MarketplaceSearchAndFilters
            search={viewModel.search}
            onSearchChange={actions.setSearch}
            nicheFilter={viewModel.nicheFilter}
            onNicheFilterChange={actions.setNicheFilter}
            sortBy={viewModel.sortBy}
            onSortByChange={actions.setSortBy}
          />

          {/* Desktop: grid 4 colunas - items-stretch para cards terem mesma altura */}
          <section className="hidden gap-6 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-6 xl:grid-cols-4">
            {viewModel.creators.map((creator) => (
              <MarketplaceCreatorCardDesktop
                key={creator.id}
                creator={creator}
                onHire={actions.onHire}
              />
            ))}
          </section>

          {/* Mobile: lista vertical */}
          <section className="flex flex-col gap-4 lg:hidden">
            {viewModel.creators.map((creator) => (
              <MarketplaceCreatorCardMobile
                key={creator.id}
                creator={creator}
                onHire={actions.onHire}
              />
            ))}
          </section>

          <MarketplacePagination
            currentPage={viewModel.currentPage}
            totalPages={viewModel.totalPages}
            onPageChange={actions.setCurrentPage}
          />
        </div>
      </main>

      <BusinessBottomNav />
    </div>
  );
}
