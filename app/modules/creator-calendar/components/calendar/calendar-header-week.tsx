import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";

type CalendarHeaderWeekProps = {
  weekRangeLabel: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
};

export function CalendarHeaderWeek({
  weekRangeLabel,
  onPrevWeek,
  onNextWeek,
  onToday,
}: CalendarHeaderWeekProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-[rgba(137,90,246,0.06)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-900 lg:text-[28px]">
          Calendário Semanal
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Visualize seus jobs confirmados e pendentes no período de 7 dias.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-[#f6f5f8] text-slate-700"
          onClick={onPrevWeek}
          aria-label="Período anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="min-w-[160px] text-center text-sm font-bold text-slate-800 capitalize sm:min-w-[220px] sm:text-base">
          {weekRangeLabel}
        </span>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-[#f6f5f8] text-slate-700"
          onClick={onNextWeek}
          aria-label="Próximo período"
        >
          <ChevronRight className="size-4" />
        </button>
        <Button
          variant="outline"
          className="rounded-full px-4"
          onClick={onToday}
        >
          Hoje
        </Button>
      </div>
    </div>
  );
}
