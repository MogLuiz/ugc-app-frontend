import {
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  UserCircle,
  Video,
  X,
} from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Link } from "react-router";
import type {
  MarketplaceCreator,
  MarketplaceServiceTypeOption,
} from "../../types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { cn, getFirstName } from "~/lib/utils";

const FIELD_SHADOW = "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]";

const SERVICE_LABEL_MAP: Record<string, string> = {
  "Gravação Presencial 2 Horas": "Presencial 2h",
  "Gravação Presencial 4 Horas": "Presencial 4h",
  "Gravação Presencial 2 horas": "Presencial 2h",
  "Gravação Presencial 4 horas": "Presencial 4h",
  Unboxing: "Unboxing",
};

function shortenServiceLabel(label: string): string {
  return SERVICE_LABEL_MAP[label] ?? label;
}

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

function CreatorImageFallback({ className }: { className: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 bg-slate-100",
        className,
      )}
    >
      <UserCircle className="size-12 text-slate-300" aria-hidden />
      <span className="text-xs text-slate-400">Foto não enviada</span>
    </div>
  );
}

function MarketplaceCreatorMetricsRow({
  creator,
  compact,
}: {
  creator: MarketplaceCreator;
  compact?: boolean;
}) {
  const hasReviews = creator.totalReviews != null && creator.totalReviews > 0;
  const hasVideoCount = creator.videoCount != null && creator.videoCount > 0;
  const hasDistance =
    creator.distanceKm != null && Number.isFinite(creator.distanceKm);

  const iconSize = compact ? "size-3" : "size-3.5";
  const rowClass = compact
    ? "text-[10px] font-medium text-slate-500"
    : "text-xs text-slate-500";

  return (
    <div className={cn("flex flex-col gap-0.5", compact ? "mt-1" : "mt-1.5")}>
      {/* Line 1: Rating */}
      <div className={cn("flex items-center gap-1", rowClass)}>
        <Star
          className={cn(iconSize, "shrink-0 fill-amber-400 text-amber-400")}
          aria-hidden
        />
        <span className="font-semibold text-slate-700">{creator.rating}</span>
        {hasReviews ? (
          <span className="text-slate-400">({creator.totalReviews})</span>
        ) : null}
      </div>

      {/* Line 2: Video count */}
      {hasVideoCount ? (
        <div className={cn("flex items-center gap-1", rowClass)}>
          <Video
            className={cn(iconSize, "shrink-0 text-slate-400")}
            aria-hidden
          />
          <span>{creator.videoCount} vídeos criados</span>
        </div>
      ) : null}

      {/* Line 3: Location (with optional distance) */}
      <div className={cn("flex min-w-0 items-center gap-1", rowClass)}>
        <MapPin
          className={cn(iconSize, "shrink-0 text-slate-400")}
          aria-hidden
        />
        <span className="min-w-0 break-words">
          {hasDistance
            ? `${Math.round(creator.distanceKm!)} km de você • ${creator.location}`
            : creator.location}
        </span>
      </div>
    </div>
  );
}

function MarketplaceFiltersSheet({
  open,
  onClose,
  serviceTypes,
  serviceTypeId,
  onServiceTypeChange,
  minAge,
  maxAge,
  onMinAgeChange,
  onMaxAgeChange,
}: {
  open: boolean;
  onClose: () => void;
  serviceTypes: MarketplaceServiceTypeOption[];
  serviceTypeId: string;
  onServiceTypeChange: (v: string) => void;
  minAge: number | undefined;
  maxAge: number | undefined;
  onMinAgeChange: (v: number | undefined) => void;
  onMaxAgeChange: (v: number | undefined) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40" onClick={onClose}>
      <aside
        className="absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Filtros</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100"
            aria-label="Fechar filtros"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">
          {/* Tipo de serviço */}
          <section>
            <h4 className="mb-3 text-sm font-semibold text-slate-700">
              Tipo de serviço
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onServiceTypeChange("")}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  !serviceTypeId
                    ? "border-[#895af6] bg-[#895af6] text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                )}
              >
                Todos
              </button>
              {serviceTypes.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onServiceTypeChange(s.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    serviceTypeId === s.id
                      ? "border-[#895af6] bg-[#895af6] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                  )}
                >
                  {shortenServiceLabel(s.label)}
                </button>
              ))}
            </div>
          </section>

          {/* Idade */}
          <section>
            <h4 className="mb-3 text-sm font-semibold text-slate-700">Idade</h4>
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs text-slate-500">Mínima</label>
                <Input
                  type="number"
                  min={18}
                  max={80}
                  placeholder="18"
                  value={minAge ?? ""}
                  onChange={(e) =>
                    onMinAgeChange(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="h-10 rounded-xl border-slate-200 text-sm"
                />
              </div>
              <span className="mt-5 text-slate-400">–</span>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs text-slate-500">Máxima</label>
                <Input
                  type="number"
                  min={18}
                  max={80}
                  placeholder="80"
                  value={maxAge ?? ""}
                  onChange={(e) =>
                    onMaxAgeChange(
                      e.target.value ? Number(e.target.value) : undefined,
                    )
                  }
                  className="h-10 rounded-xl border-slate-200 text-sm"
                />
              </div>
            </div>
          </section>
        </div>

        <footer className="flex gap-3 border-t border-slate-100 px-5 py-4">
          <Button
            variant="secondary"
            className="flex-1 rounded-full"
            onClick={() => {
              onServiceTypeChange("");
              onMinAgeChange(undefined);
              onMaxAgeChange(undefined);
              onClose();
            }}
          >
            Limpar
          </Button>
          <Button
            variant="purple"
            className="flex-1 rounded-full"
            onClick={onClose}
          >
            Aplicar
          </Button>
        </footer>
      </aside>
    </div>
  );
}

export function MarketplaceHeader() {
  return (
    <header className="hidden flex-col gap-2 lg:flex">
      <h1 className="text-[36px] font-black leading-10 tracking-[-0.9px] text-slate-900">
        Marketplace de Criadores
      </h1>
      <p className="text-lg text-slate-500">
        Encontre os melhores criadores de conteúdo para impulsionar sua marca.
      </p>
    </header>
  );
}

export function MarketplaceSearchAndFilters({
  search,
  onSearchChange,
  serviceTypeId,
  onServiceTypeChange,
  serviceTypes,
  sortBy,
  onSortChange,
  minAge,
  maxAge,
  onMinAgeChange,
  onMaxAgeChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  serviceTypeId: string;
  onServiceTypeChange: (value: string) => void;
  serviceTypes: MarketplaceServiceTypeOption[];
  isServiceTypesLoading?: boolean;
  sortBy: string;
  onSortChange: (value: "relevancia" | "preco" | "avaliacao") => void;
  minAge: number | undefined;
  maxAge: number | undefined;
  onMinAgeChange: (v: number | undefined) => void;
  onMaxAgeChange: (v: number | undefined) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searchTrimmed = search.trim();
  const selectedServiceLabel = serviceTypes.find(
    (s) => s.id === serviceTypeId,
  )?.label;

  const activeFilterCount = [
    Boolean(serviceTypeId),
    minAge != null,
    maxAge != null,
  ].filter(Boolean).length;

  const showSearchTag = searchTrimmed.length > 0;
  const showServiceTag = Boolean(serviceTypeId && selectedServiceLabel);
  const showAgeTag = minAge != null || maxAge != null;
  const showActiveTags = showSearchTag || showServiceTag || showAgeTag;

  const ageTagLabel =
    minAge != null && maxAge != null
      ? `Idade: ${minAge}–${maxAge} anos`
      : minAge != null
        ? `Idade: a partir de ${minAge} anos`
        : `Idade: até ${maxAge} anos`;

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Desktop */}
        <div className="hidden w-full items-center gap-3 lg:flex">
          <div className="relative min-h-12 w-full max-w-xl shrink-0">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por nome"
              className={cn(
                "h-12 rounded-full border-0 bg-white pl-12 pr-4 text-slate-900 placeholder:text-slate-500",
                FIELD_SHADOW,
              )}
            />
          </div>
          <SelectPill
            value={sortBy}
            onChange={(e) =>
              onSortChange(
                e.target.value as "relevancia" | "preco" | "avaliacao",
              )
            }
            aria-label="Ordenar por"
            className="w-44 shrink-0"
          >
            <option value="relevancia">Mais relevantes</option>
            <option value="avaliacao">Melhor avaliados</option>
          </SelectPill>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className={cn(
              "relative flex h-12 shrink-0 items-center gap-2 rounded-full border bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50",
              FIELD_SHADOW,
              activeFilterCount > 0
                ? "border-[#895af6] text-[#895af6]"
                : "border-0",
            )}
          >
            <SlidersHorizontal className="size-4" />
            Filtros
            {activeFilterCount > 0 ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-[#895af6] text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-3 lg:hidden">
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
          <div className="flex gap-3">
            <SelectPill
              value={sortBy}
              onChange={(e) =>
                onSortChange(
                  e.target.value as "relevancia" | "preco" | "avaliacao",
                )
              }
              aria-label="Ordenar por"
              className="flex-1"
            >
              <option value="relevancia">Mais relevantes</option>
              <option value="avaliacao">Melhor avaliados</option>
            </SelectPill>
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className={cn(
                "relative flex h-12 shrink-0 items-center gap-2 rounded-full border bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50",
                FIELD_SHADOW,
                activeFilterCount > 0
                  ? "border-[#895af6] text-[#895af6]"
                  : "border-0",
              )}
            >
              <SlidersHorizontal className="size-4" />
              {activeFilterCount > 0 ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-[#895af6] text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>
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
                  label={shortenServiceLabel(selectedServiceLabel)}
                  onRemove={() => onServiceTypeChange("")}
                  removeAriaLabel="Remover filtro de serviço"
                />
              </span>
            ) : null}
            {showAgeTag ? (
              <span key="age" role="listitem">
                <FilterRemovableTag
                  label={ageTagLabel}
                  onRemove={() => {
                    onMinAgeChange(undefined);
                    onMaxAgeChange(undefined);
                  }}
                  removeAriaLabel="Remover filtro de idade"
                />
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <MarketplaceFiltersSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        serviceTypes={serviceTypes}
        serviceTypeId={serviceTypeId}
        onServiceTypeChange={onServiceTypeChange}
        minAge={minAge}
        maxAge={maxAge}
        onMinAgeChange={onMinAgeChange}
        onMaxAgeChange={onMaxAgeChange}
      />
    </>
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
  const displayName = getFirstName(creator.name);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[rgba(137,90,246,0.05)] bg-white shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] transition-shadow hover:shadow-lg">
      <div className="relative h-52 w-full shrink-0 overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={displayName}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <CreatorImageFallback className="h-full w-full" />
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1 px-6 pb-6 pt-5">
        <h3 className="text-xl font-bold leading-7 text-slate-900">
          {displayName}
        </h3>
        <MarketplaceCreatorMetricsRow creator={creator} />
        <div className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
          {creator.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex shrink-0 items-center rounded-full bg-[#f6f5f8] px-2 py-0.5 text-[11px] font-medium text-slate-600"
            >
              {shortenServiceLabel(tag)}
            </span>
          ))}
          {creator.tags.length > 3 && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-[#f6f5f8] px-2 py-0.5 text-[11px] font-medium text-slate-600">
              +{creator.tags.length - 3}
            </span>
          )}
        </div>
        <div className="mt-auto flex h-10 min-w-0 shrink-0 gap-2 pt-4">
          <Link
            to={`/criador/${creator.id}`}
            state={{ marketplaceCreator: creator }}
            className="inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Ver Perfil
          </Link>
          <Button
            variant="purple"
            size="sm"
            className="h-10 min-h-10 min-w-0 flex-1 rounded-full"
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
  const displayName = getFirstName(creator.name);

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl">
          {creator.avatarUrl ? (
            <>
              <img
                src={creator.avatarUrl}
                alt={displayName}
                loading="lazy"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0px_2px_4px_0px_rgba(0,0,0,0.05)]" />
            </>
          ) : (
            <CreatorImageFallback className="size-full rounded-2xl" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-[18px] text-slate-900">
            {displayName}
          </h3>
          <MarketplaceCreatorMetricsRow creator={creator} compact />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {creator.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-600"
              >
                {shortenServiceLabel(tag)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex h-11 min-w-0 shrink-0 gap-3">
        <Link
          to={`/criador/${creator.id}`}
          state={{ marketplaceCreator: creator }}
          className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
        >
          Ver Perfil
        </Link>
        <Button
          variant="purple"
          size="md"
          className="h-11 min-h-11 min-w-0 flex-1 rounded-full"
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
