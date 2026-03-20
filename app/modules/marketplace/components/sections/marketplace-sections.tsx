import { ChevronDown, MapPin, Menu, Search, Star, X } from "lucide-react";
import type { ComponentProps } from "react";
import { Link } from "react-router";
import type {
  MarketplaceCreator,
  MarketplaceServiceTypeOption,
} from "../../types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { cn } from "~/lib/utils";

const FIELD_SHADOW = "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]";

function FilterRemovableTag({
  label,
  onRemove,
  removeAriaLabel,
}: {
  label: string;
  onRemove: () => void;
  removeAriaLabel: string;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <span className="min-w-0 truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="flex size-7 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        aria-label={removeAriaLabel}
      >
        <X className="size-3.5" strokeWidth={2.25} />
      </button>
    </span>
  );
}

function SelectPill({
  className,
  children,
  ...props
}: ComponentProps<typeof Select>) {
  return (
    <div className="relative min-w-0">
      <Select
        className={cn(
          "h-12 min-h-12 w-full cursor-pointer appearance-none rounded-full border-0 bg-white py-0 pl-4 pr-11 text-sm text-slate-900",
          FIELD_SHADOW,
          className,
        )}
        {...props}
      >
        {children}
      </Select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"
        aria-hidden
      />
    </div>
  );
}

function getCreatorInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function CreatorImageFallback({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-[rgba(137,90,246,0.12)] font-bold text-[#895af6]",
        className,
      )}
    >
      {getCreatorInitials(name)}
    </div>
  );
}

export function MarketplaceHeader() {
  return (
    <>
      {/* Desktop header */}
      <header className="hidden flex-col gap-2 lg:flex">
        <h1 className="text-[36px] font-black leading-10 tracking-[-0.9px] text-slate-900">
          Marketplace de Criadores
        </h1>
        <p className="text-lg text-slate-500">
          Encontre os melhores criadores de conteúdo UGC para impulsionar sua
          marca.
        </p>
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
  serviceTypeId,
  onServiceTypeChange,
  serviceTypes,
  isServiceTypesLoading = false,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  serviceTypeId: string;
  onServiceTypeChange: (value: string) => void;
  serviceTypes: MarketplaceServiceTypeOption[];
  isServiceTypesLoading?: boolean;
}) {
  const searchTrimmed = search.trim();
  const selectedServiceLabel = serviceTypes.find(
    (s) => s.id === serviceTypeId,
  )?.label;

  const showSearchTag = searchTrimmed.length > 0;
  const showServiceTag = Boolean(serviceTypeId && selectedServiceLabel);
  const showActiveTags = showSearchTag || showServiceTag;

  return (
    <div className="flex flex-col gap-4">
      {/* Desktop: fundo da página (#f6f5f8); campos brancos com sombra (Figma Search and Filter) */}
      <div className="hidden w-full flex-col gap-3 lg:flex xl:flex-row xl:items-center xl:gap-3">
        <div className="relative min-h-12 w-full max-w-xl shrink-0">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, nicho ou palavra-chave..."
            className={cn(
              "h-12 rounded-full border-0 bg-white pl-12 pr-4 text-slate-900 placeholder:text-slate-500",
              FIELD_SHADOW,
            )}
          />
        </div>
        <div className="flex w-full min-w-0 xl:w-auto xl:shrink-0">
          <SelectPill
            value={serviceTypeId}
            onChange={(e) => onServiceTypeChange(e.target.value)}
            aria-label="Tipo de serviço"
            className="w-full xl:w-52"
          >
            <option value="">
              {isServiceTypesLoading
                ? "Carregando servicos..."
                : "Todos os servicos"}
            </option>
            {serviceTypes.map((serviceType) => (
              <option key={serviceType.id} value={serviceType.id}>
                {serviceType.label}
              </option>
            ))}
          </SelectPill>
        </div>
      </div>

      {/* Mobile: busca branca + sombra; mesmo placeholder do Figma */}
      <div className="flex flex-col gap-6 lg:hidden">
        <h2 className="text-2xl font-bold leading-8 tracking-[-0.6px] text-slate-900">
          Marketplace de Criadores
        </h2>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome, nicho ou palavra-chave..."
              className={cn(
                "h-12 rounded-full border-0 bg-white pl-12 pr-4 text-slate-900 placeholder:text-slate-500",
                FIELD_SHADOW,
              )}
            />
          </div>
          <SelectPill
            value={serviceTypeId}
            onChange={(e) => onServiceTypeChange(e.target.value)}
            aria-label="Tipo de serviço"
            className="w-full"
          >
            <option value="">
              {isServiceTypesLoading
                ? "Carregando servicos..."
                : "Todos os servicos"}
            </option>
            {serviceTypes.map((serviceType) => (
              <option key={serviceType.id} value={serviceType.id}>
                {serviceType.label}
              </option>
            ))}
          </SelectPill>
        </div>
      </div>

      {showActiveTags ? (
        <div
          className="flex flex-wrap gap-2"
          role="list"
          aria-label="Filtros ativos"
        >
          {showSearchTag ? (
            <span key="search" role="listitem">
              <FilterRemovableTag
                label={`Busca: "${searchTrimmed}"`}
                onRemove={() => onSearchChange("")}
                removeAriaLabel="Remover busca"
              />
            </span>
          ) : null}
          {showServiceTag && selectedServiceLabel ? (
            <span key="service" role="listitem">
              <FilterRemovableTag
                label={`Serviço: ${selectedServiceLabel}`}
                onRemove={() => onServiceTypeChange("")}
                removeAriaLabel="Remover filtro de serviço"
              />
            </span>
          ) : null}
        </div>
      ) : null}
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
        {img ? (
          <img
            src={img}
            alt={creator.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <CreatorImageFallback
            name={creator.name}
            className="h-full w-full text-4xl"
          />
        )}
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 shadow-sm backdrop-blur-sm">
          <Star className="size-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-900">
            {creator.rating}
          </span>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1 px-6 pb-8 pt-6">
        <h3 className="text-xl font-bold leading-7 text-slate-900">
          {creator.name}
        </h3>
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
            state={{ marketplaceCreator: creator }}
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
          {creator.avatarUrl ? (
            <>
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
            </>
          ) : (
            <CreatorImageFallback
              name={creator.name}
              className="size-full rounded-2xl text-xl"
            />
          )}
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
          state={{ marketplaceCreator: creator }}
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
            <span
              key={`ellipsis-${i}`}
              className="px-1 text-base text-slate-400"
            >
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
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {p}
            </button>
          ),
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
