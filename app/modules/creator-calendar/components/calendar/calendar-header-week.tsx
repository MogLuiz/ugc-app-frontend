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
    <div className="flex flex-col gap-4 border-b border-[rgba(137,90,246,0.06)] px-6 py-5">
      <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-900 lg:text-[28px]">
        Calendário Semanal
      </h1>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-[#f6f5f8] text-slate-700"
          onClick={onPrevWeek}
          aria-label="Período anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="min-w-0 flex-1 text-center text-sm font-bold capitalize text-slate-800 sm:text-base">
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
