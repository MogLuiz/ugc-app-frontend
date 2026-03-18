import {
  Bell,
  ChevronDown,
  LayoutGrid,
  MapPin,
  Menu,
  Search,
  SlidersHorizontal,
  Star,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router";
import type {
  MarketplaceCreator,
  MarketplaceFilterNiche,
  MarketplaceSortBy,
} from "../../types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

const MOBILE_FILTER_OPTIONS = [
  { id: "beleza", label: "Beleza" },
  { id: "tecnologia", label: "Tecnologia" },
  { id: "proximidade", label: "Mais Próximos" },
] as const;

const DESKTOP_FILTER_OPTIONS = [
  { id: "nicho", label: "Nicho", icon: LayoutGrid },
  { id: "preco", label: "Preço", icon: DollarSign },
  { id: "avaliacao", label: "Avaliação", icon: Star },
] as const;

export function MarketplaceHeader() {
  return (
    <>
      {/* Desktop header */}
      <header className="hidden items-end justify-between gap-8 lg:flex">
        <div className="flex flex-col gap-2">
          <h1 className="text-[36px] font-black leading-10 tracking-[-0.9px] text-slate-900">
            Marketplace de Criadores
          </h1>
          <p className="text-lg text-slate-500">
            Encontre os melhores criadores de conteúdo UGC para impulsionar sua
            marca.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white p-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full"
            aria-label="Notificações"
          >
            <Bell className="size-5 text-slate-600" />
          </button>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="size-8 overflow-hidden rounded-full bg-slate-200" />
            <ChevronDown className="size-4 text-slate-400" />
          </div>
        </div>
      </header>

      {/* Mobile header */}
      <header className="sticky top-0 z-20 -mx-4 flex items-center justify-between border-b border-[rgba(137,90,246,0.1)] bg-[rgba(246,245,248,0.8)] px-4 py-4 backdrop-blur-sm lg:hidden">
        <button
          type="button"
          className="flex size-12 items-center justify-center"
          aria-label="Menu"
        >
          <Menu className="size-5 text-slate-600" />
        </button>
        <h2 className="text-xl font-bold tracking-[-0.5px] text-slate-900">
          Criadores
        </h2>
        <Link
          to="/marketplace"
          className="flex size-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]"
          aria-label="Buscar"
        >
          <Search className="size-5 text-[#895af6]" />
        </Link>
      </header>
    </>
  );
}

export function MarketplaceSearchAndFilters({
  search,
  onSearchChange,
  nicheFilter,
  onNicheFilterChange,
  sortBy,
  onSortByChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  nicheFilter: MarketplaceFilterNiche;
  onNicheFilterChange: (value: MarketplaceFilterNiche) => void;
  sortBy: MarketplaceSortBy;
  onSortByChange: (value: MarketplaceSortBy) => void;
}) {
  const handleMobileFilterClick = (id: string) => {
    if (id === "proximidade") {
      onNicheFilterChange("todos");
      onSortByChange("proximidade" as MarketplaceSortBy);
    } else {
      onNicheFilterChange(id as MarketplaceFilterNiche);
      onSortByChange("relevancia");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop: barra única com search + filtros */}
      <div className="hidden rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:flex lg:items-center lg:gap-4">
        <div className="relative min-w-[300px] flex-1">
          <Search className="absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, nicho ou palavra-chave..."
            className="rounded-full border-0 bg-[#f6f5f8] pl-12"
          />
        </div>
        <div className="flex items-center gap-2">
          {DESKTOP_FILTER_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                className="flex items-center gap-2 rounded-full border-0 bg-[#f6f5f8] px-4 py-3 text-sm font-medium text-slate-900"
              >
                <Icon className="size-4 text-slate-500" />
                {opt.label}
                <ChevronDown className="size-3.5 text-slate-400" />
              </button>
            );
          })}
          <Button
            variant="purple"
            size="md"
            className="rounded-full border-0 p-3"
            aria-label="Mais filtros"
          >
            <SlidersHorizontal className="size-5" />
          </Button>
        </div>
      </div>

      {/* Mobile: título + chips de filtro */}
      <div className="flex flex-col gap-4 lg:hidden">
        <h2 className="text-2xl font-bold leading-8 tracking-[-0.6px] text-slate-900">
          Marketplace de Criadores
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MOBILE_FILTER_OPTIONS.map((opt) => {
            const isActive =
              opt.id === "proximidade"
                ? sortBy === "proximidade"
                : nicheFilter === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleMobileFilterClick(opt.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#895af6] text-white shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.2)]"
                    : "border border-slate-200 bg-white text-slate-900"
                )}
              >
                {opt.label}
                <ChevronDown className="size-3.5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MarketplaceCreatorCardDesktop({
  creator,
  onHire,
}: {
  creator: MarketplaceCreator;
  onHire: (c: MarketplaceCreator) => void;
}) {
  const img = creator.coverImageUrl ?? creator.avatarUrl;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-lg">
      <div className="relative h-64 shrink-0 w-full overflow-hidden">
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur-sm">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-900">{creator.rating}</span>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1 px-6 pb-8 pt-6">
        <h3 className="text-xl font-bold leading-7 text-slate-900">
          {creator.name}
        </h3>
        <p className="text-sm font-semibold text-[#895af6]">{creator.niche}</p>
        <div className="flex items-center gap-1.5 pt-1">
          <MapPin className="size-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">{creator.location}</span>
        </div>
        <div className="mt-4 flex flex-1 flex-wrap content-start gap-2">
          {creator.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex shrink-0 items-center rounded-full bg-[#f6f5f8] px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
          {creator.tags.length > 3 && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-[#f6f5f8] px-3 py-1 text-xs font-medium text-slate-600">
              +{creator.tags.length - 3}
            </span>
          )}
        </div>
        <div className="mt-auto flex h-10 shrink-0 gap-2 pt-4">
          <Link
            to={`/criador/${creator.id}`}
            className="flex min-h-10 flex-1 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Ver Perfil
          </Link>
          <Button
            variant="purple"
            size="sm"
            className="h-10 min-h-10 flex-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onHire(creator);
            }}
          >
            Contratar
          </Button>
        </div>
      </div>
    </article>
  );
}

export function MarketplaceCreatorCardMobile({
  creator,
  onHire,
}: {
  creator: MarketplaceCreator;
  onHire: (c: MarketplaceCreator) => void;
}) {
  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
          <img
            src={creator.avatarUrl}
            alt={creator.name}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold leading-[18px] text-slate-900">
                {creator.name}
              </h3>
              <div className="mt-1 flex items-center gap-1">
                <MapPin className="size-2 text-slate-400" />
                <span className="text-[11px] font-medium text-slate-400">
                  {creator.location}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-amber-700">
                {creator.rating}
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#895af6]">
            {creator.niche}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {creator.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex h-11 shrink-0 gap-3">
        <Link
          to={`/criador/${creator.id}`}
          className="flex min-h-11 flex-1 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
        >
          Ver Perfil
        </Link>
        <Button
          variant="purple"
          size="md"
          className="h-11 min-h-11 flex-1 rounded-full"
          onClick={() => onHire(creator)}
        >
          Contratar
        </Button>
      </div>
    </article>
  );
}

export function MarketplacePagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, "ellipsis", totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-4 pt-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="flex size-9 items-center justify-center rounded-full disabled:opacity-50"
        aria-label="Página anterior"
      >
        <span className="sr-only">Anterior</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-slate-600"
        >
          <path
            d="M7.5 9L4.5 6L7.5 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className="flex items-center gap-2">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-base text-slate-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={cn(
                "flex size-10 items-center justify-center rounded-full text-sm font-bold transition-colors",
                currentPage === p
                  ? "bg-[#895af6] text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {p}
            </button>
          )
        )}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="flex size-9 items-center justify-center rounded-full disabled:opacity-50"
        aria-label="Próxima página"
      >
        <span className="sr-only">Próxima</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-slate-600"
        >
          <path
            d="M4.5 3L7.5 6L4.5 9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
