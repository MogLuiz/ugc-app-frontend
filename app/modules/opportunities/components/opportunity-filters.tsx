import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Select } from "~/components/ui/select";
import type { OpportunityFilters } from "../types";

interface OpportunityFiltersProps {
  onFilterChange: (filters: OpportunityFilters) => void;
  workTypeOptions: string[];
}

const DEFAULT_FILTERS: OpportunityFilters = {
  workType: "all",
  distance: "all",
};

export function OpportunityFiltersPanel({
  onFilterChange,
  workTypeOptions,
}: OpportunityFiltersProps) {
  const [filters, setFilters] = useState<OpportunityFilters>(DEFAULT_FILTERS);

  const handleChange = <K extends keyof OpportunityFilters>(
    key: K,
    value: OpportunityFilters[K]
  ) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const hasActiveFilters =
    filters.workType !== "all" || filters.distance !== "all";

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onFilterChange(DEFAULT_FILTERS);
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-4 lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-slate-600" />
          <span className="font-semibold text-slate-900">Filtros</span>
        </div>

        {hasActiveFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-7 px-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <X className="mr-1 size-3.5" />
            Limpar
          </Button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {/* Tipo de trabalho */}
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-600">
            Tipo de trabalho
          </label>
          <Select
            value={filters.workType}
            onChange={(e) => handleChange("workType", e.target.value)}
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
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-600">
            Distância máxima
          </label>
          <Select
            value={filters.distance}
            onChange={(e) =>
              handleChange(
                "distance",
                e.target.value as OpportunityFilters["distance"]
              )
            }
          >
            <option value="all">Qualquer distância</option>
            <option value="5">Até 5 km</option>
            <option value="10">Até 10 km</option>
            <option value="20">Até 20 km</option>
            <option value="50">Até 50 km</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
