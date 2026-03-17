import { Bell, ChevronDown, MapPin, Menu, Search, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { GoogleCreatorsMap } from "~/modules/creators-map/components/google-creators-map";
import type { CreatorCategory, CreatorMapModel } from "~/modules/creators-map/types";
import {
  useCreatorsMapController,
  type CategoryFilter,
  type SortTab,
} from "../hooks/use-creators-map-controller";

const CATEGORIES: Array<{ id: CategoryFilter; label: string }> = [
  { id: "all", label: "Beleza" },
  { id: "gastronomia", label: "Gastronomia" },
  { id: "tech", label: "Tech" },
  { id: "fitness", label: "Saude" }
];

export function CreatorsMapScreen() {
  const controller = useCreatorsMapController();

  return (
    <div className="min-h-screen bg-[#f6f5f8]">
      <DesktopLayout
        creators={controller.viewModel.creators}
        search={controller.viewModel.search}
        onSearch={controller.actions.setSearch}
        activeSortTab={controller.viewModel.activeSortTab}
        onSortTabChange={controller.actions.setActiveSortTab}
        activeCategory={controller.viewModel.activeCategory}
        onCategoryChange={controller.actions.setActiveCategory}
        selectedCreator={controller.viewModel.selectedCreator}
        selectedCreatorId={controller.viewModel.selectedCreatorId}
        onSelectCreator={controller.actions.setSelectedCreatorId}
      />
      <MobileLayout
        creators={controller.viewModel.creators}
        search={controller.viewModel.search}
        onSearch={controller.actions.setSearch}
        activeCategory={controller.viewModel.activeCategory}
        onCategoryChange={controller.actions.setActiveCategory}
        selectedCreator={controller.viewModel.selectedCreator}
        selectedCreatorId={controller.viewModel.selectedCreatorId}
        onSelectCreator={controller.actions.setSelectedCreatorId}
      />
    </div>
  );
}

type LayoutProps = {
  creators: CreatorMapModel[];
  search: string;
  onSearch: (value: string) => void;
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  selectedCreatorId: string;
  selectedCreator: CreatorMapModel | null;
  onSelectCreator: (creatorId: string) => void;
};

function DesktopLayout({
  creators,
  search,
  onSearch,
  activeSortTab,
  onSortTabChange,
  activeCategory,
  onCategoryChange,
  selectedCreatorId,
  selectedCreator,
  onSelectCreator
}: LayoutProps & {
  activeSortTab: SortTab;
  onSortTabChange: (tab: SortTab) => void;
}) {
  return (
    <div className="hidden h-screen flex-col lg:flex">
      <header className="flex h-[68px] items-center border-b border-slate-200 bg-white px-6">
        <strong className="text-[32px] font-bold text-slate-900">UGC Local</strong>
        <div className="mx-6 flex h-11 w-[420px] items-center rounded-full bg-[#f3efff] px-4 text-sm text-[#94a3b8]">
          <Search size={16} className="mr-2 text-[#8b5cf6]" />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Buscar criadores ou nichos em BH"
            className="w-full bg-transparent text-[#7c3aed] outline-none placeholder:text-[#c4b5fd]"
          />
        </div>
        <nav className="ml-auto flex items-center gap-6 text-sm text-slate-700">
          <span>Explorar</span>
          <span>Criadores</span>
          <span className="border-b-2 border-[#7c3aed] pb-1 font-semibold text-[#7c3aed]">Mapa</span>
          <span>Sobre</span>
          <Button className="h-10 rounded-full bg-[#7c56f3] px-6 text-sm">Anunciar</Button>
          <Bell size={18} />
        </nav>
      </header>

      <main className="flex min-h-0 flex-1">
        <aside className="flex w-[400px] flex-col border-r border-slate-200 bg-[#f6f5f8]">
          <div className="border-b border-slate-200 p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              <button className="flex h-9 items-center rounded-full bg-[#7c56f3] px-4 text-sm font-medium text-white">
                Belo Horizonte <span className="ml-2 text-base">x</span>
              </button>
              {CATEGORIES.slice(0, 3).map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  className="flex h-9 items-center rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-700"
                >
                  {category.label} <ChevronDown size={14} className="ml-1" />
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-4 text-sm">
                <button
                  type="button"
                  onClick={() => onSortTabChange("relevantes")}
                  className={`pb-1 ${activeSortTab === "relevantes" ? "border-b-2 border-[#7c56f3] font-semibold text-[#7c56f3]" : "text-slate-500"}`}
                >
                  Mais Relevantes
                </button>
                <button
                  type="button"
                  onClick={() => onSortTabChange("novidades")}
                  className={`pb-1 ${activeSortTab === "novidades" ? "border-b-2 border-[#7c56f3] font-semibold text-[#7c56f3]" : "text-slate-500"}`}
                >
                  Novidades
                </button>
              </div>
              <span className="text-xs font-medium tracking-[0.08em] text-slate-400">{creators.length} RESULTADOS</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {creators.map((creator) => (
              <CreatorDesktopCard key={creator.id} creator={creator} onSelect={onSelectCreator} selected={selectedCreatorId === creator.id} />
            ))}
          </div>
        </aside>

        <section className="relative flex-1">
          <GoogleCreatorsMap className="h-full w-full" creators={creators} selectedCreatorId={selectedCreatorId} onSelectCreator={onSelectCreator} />
          {selectedCreator ? (
            <div className="absolute left-6 top-6 w-[320px] rounded-[32px] bg-white/95 p-6 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#94a3b8]">Regiao em destaque</p>
              <h3 className="mt-1 text-[32px] font-bold text-slate-900">{selectedCreator.region}</h3>
              <p className="mt-1 text-sm text-slate-500">Criadores ativos de alta performance nesta area.</p>
            </div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

function MobileLayout({ creators, search, onSearch, activeCategory, onCategoryChange, selectedCreator, selectedCreatorId, onSelectCreator }: LayoutProps) {
  return (
    <div className="relative h-screen overflow-hidden lg:hidden">
      <GoogleCreatorsMap className="absolute inset-0" creators={creators} selectedCreatorId={selectedCreatorId} onSelectCreator={onSelectCreator} />

      <div className="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[rgba(246,245,248,0.9)] to-transparent p-4">
        <div className="flex items-center gap-3">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
            <Menu size={20} />
          </button>
          <div className="flex h-11 flex-1 items-center rounded-full border border-[rgba(137,90,246,0.1)] bg-white px-4 text-sm text-slate-400 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
            <Search size={16} className="mr-2 text-[#8b5cf6]" />
            <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Pesquisar em Belo Horizonte" className="w-full bg-transparent text-slate-600 outline-none placeholder:text-slate-400" />
          </div>
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
            <Bell size={18} />
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((category) => (
            <button key={category.id} type="button" onClick={() => onCategoryChange(category.id)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${activeCategory === category.id ? "bg-[#895af6] text-white" : "border border-slate-100 bg-white text-slate-600"}`}>
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-20 z-20 px-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Criadores Proximos</h3>
          <span className="rounded-full bg-[rgba(137,90,246,0.1)] px-2 py-1 text-xs font-semibold text-[#895af6]">{creators.length} Disponiveis</span>
        </div>
        <div className="flex gap-3 overflow-x-auto">
          {creators.map((creator) => (
            <Link
              key={creator.id}
              to={`/criador/${creator.id}`}
              className={`flex w-[288px] shrink-0 gap-3 rounded-2xl border border-slate-100 bg-white p-3 text-left shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] transition ${selectedCreator?.id === creator.id ? "ring-2 ring-[#895af6]" : ""}`}
            >
              <img src={creator.avatarUrl} alt={creator.name} className="h-20 w-20 rounded-full object-cover" />
              <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                  <div className="flex items-center gap-2"><Sparkles size={12} className="text-amber-500" /><span className="text-xs font-semibold">{creator.rating.toFixed(1)}</span></div>
                  <p className="text-sm font-bold text-slate-900">{creator.name}</p>
                  <p className="text-xs text-slate-500">UGC de {creator.specialty}</p>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-slate-600"><MapPin size={12} />{creator.distanceKm.toFixed(1)} km</span>
                  <strong className="text-xl text-[#7c56f3]">R$ {creator.priceFrom}</strong>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreatorDesktopCard({ creator, selected, onSelect }: { creator: CreatorMapModel; selected: boolean; onSelect: (creatorId: string) => void }) {
  return (
    <article className={`rounded-[28px] border p-4 transition ${selected ? "border-[#d7ccff] bg-white" : "border-slate-200 bg-[#f8f8fa]"}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">⭐ {creator.rating.toFixed(1)} ({creator.jobs} jobs)</p>
          <h4 className="mt-1 text-[32px] font-bold leading-8 text-slate-900">{creator.name}</h4>
          <p className="mt-1 text-xs uppercase text-slate-500">{creator.specialty} • {creator.region}</p>
          <div className="mt-4 flex items-center gap-2">
            <Link to={`/criador/${creator.id}`}>
              <Button className="h-8 rounded-full bg-[#7c56f3] px-6 text-sm">Contratar</Button>
            </Link>
            <Link
              to={`/criador/${creator.id}`}
              className="h-8 rounded-full px-4 text-sm font-semibold text-[#7c56f3] hover:underline"
            >
              Ver Perfil
            </Link>
          </div>
        </div>
        <img src={creator.avatarUrl} alt={creator.name} className="h-24 w-24 rounded-full object-cover" />
      </div>
    </article>
  );
}
