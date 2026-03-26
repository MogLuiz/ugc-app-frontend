import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export type CalendarHeaderWeekDayStrip = {
  isoDate: string;
  label: string;
  date: string;
  isToday: boolean;
  isSelected: boolean;
};

type CalendarHeaderWeekProps = {
  weekRangeLabel: string;
  weekDays?: CalendarHeaderWeekDayStrip[];
  onSelectDay?: (isoDate: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
};

export function CalendarHeaderWeek({
  weekRangeLabel,
  weekDays,
  onSelectDay,
  onPrevWeek,
  onNextWeek,
  onToday,
}: CalendarHeaderWeekProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/70 px-6 py-5">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 lg:text-[26px]">
        Calendário Semanal
      </h1>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          onClick={onPrevWeek}
          aria-label="Período anterior"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="min-w-0 flex-1 text-center text-sm font-semibold capitalize text-slate-800 sm:text-base">
          {weekRangeLabel}
        </span>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
          onClick={onNextWeek}
          aria-label="Próximo período"
        >
          <ChevronRight className="size-4" />
        </button>
        <Button
          variant="outline"
          className="rounded-full border-slate-200/80 px-4"
          onClick={onToday}
        >
          Hoje
        </Button>
      </div>

      {weekDays && weekDays.length > 0 ? (
        <div className="flex justify-between gap-1 overflow-x-auto pb-1">
          {weekDays.map((d) => (
            <button
              key={d.isoDate}
              type="button"
              onClick={() => onSelectDay?.(d.isoDate)}
              className={cn(
                "flex min-w-[44px] flex-1 flex-col items-center rounded-xl border px-1 py-2 text-center transition",
                d.isToday &&
                  "border-violet-300/90 bg-violet-50/80 shadow-[0_0_0_1px_rgba(139,92,246,0.12)]",
                d.isSelected && !d.isToday && "border-slate-200 bg-slate-50",
                !d.isToday && !d.isSelected && "border-transparent bg-slate-100/40 hover:bg-slate-100",
              )}
            >
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wide",
                  d.isToday ? "text-violet-600" : "text-slate-400",
                )}
              >
                {d.label}
              </span>
              <span
                className={cn(
                  "mt-0.5 text-lg font-bold tabular-nums",
                  d.isToday ? "text-violet-800" : "text-slate-900",
                )}
              >
                {d.date}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
