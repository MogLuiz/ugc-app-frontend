import { Clock3 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { formatIsoDateInTimeZone } from "../../lib/calendar-tz";
import { toRelativeDayLabel } from "../../lib/calendar-date";
import type { CalendarViewModel, UiCalendarEvent } from "../../types";

type CalendarRightPanelProps = {
  viewModel: CalendarViewModel;
  onOpenEvent: (eventId: string) => void;
};

function formatCurrencyBrl(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function CalendarRightPanel({
  viewModel,
  onOpenEvent,
}: CalendarRightPanelProps) {
  const { nextConfirmedJob, todayJobs, weeklyStats, timeZone } = viewModel;

  return (
    <aside className="flex w-full flex-col gap-4 lg:w-[300px] lg:shrink-0">
      <div className="rounded-[28px] border border-[rgba(137,90,246,0.08)] bg-white p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Insights
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Resumo operacional da sua semana.
        </p>
      </div>

      <NextJobCard event={nextConfirmedJob} onOpen={onOpenEvent} timeZone={timeZone} />

      <div className="rounded-[28px] border border-[rgba(137,90,246,0.08)] bg-white p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Hoje
        </p>
        {todayJobs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Nenhum job agendado para hoje.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {todayJobs.map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => onOpenEvent(job.id)}
                  className="w-full rounded-2xl border border-[rgba(137,90,246,0.06)] bg-[#fcfbfe] px-3 py-3 text-left transition hover:bg-[#f4efff]"
                >
                  <p className="text-xs font-semibold text-[#895af6]">
                    {job.startLabel} — {job.endLabel}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{job.title}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-[28px] border border-[rgba(137,90,246,0.08)] bg-white p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Estatísticas da semana
        </p>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li className="flex justify-between gap-2">
            <span>Jobs</span>
            <span className="font-bold text-slate-900">{weeklyStats.jobCount}</span>
          </li>
          <li className="flex justify-between gap-2">
            <span>Horas</span>
            <span className="font-bold text-slate-900">
              {weeklyStats.totalHours.toLocaleString("pt-BR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </li>
          {weeklyStats.weeklyEarnings !== undefined ? (
            <li className="flex justify-between gap-2">
              <span>Ganhos</span>
              <span className="font-bold text-emerald-700">
                {formatCurrencyBrl(weeklyStats.weeklyEarnings)}
              </span>
            </li>
          ) : null}
        </ul>
      </div>
    </aside>
  );
}

function NextJobCard({
  event,
  onOpen,
  timeZone,
}: {
  event: UiCalendarEvent | null;
  onOpen: (id: string) => void;
  timeZone: string;
}) {
  if (!event) {
    return (
      <div className="rounded-[28px] border border-[rgba(137,90,246,0.08)] bg-white p-5 shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Próximo job
        </p>
        <p className="mt-3 text-sm text-slate-500">
          Nenhum job confirmado futuro neste período.
        </p>
      </div>
    );
  }

  const dayKey = formatIsoDateInTimeZone(event.startAt, timeZone);
  const now = new Date();
  const relative = toRelativeDayLabel(
    new Date(`${dayKey}T12:00:00.000Z`),
    now,
  );

  return (
    <div className="rounded-[28px] border border-[rgba(137,90,246,0.08)] bg-white p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
        Próximo job
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#895af6]">
        {event.company}
      </p>
      <h3 className="mt-1 text-lg font-black tracking-[-0.03em] text-slate-900">
        {event.title}
      </h3>
      <div className="mt-3 space-y-1 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <span aria-hidden>📅</span>
          <span>{relative}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="size-4 shrink-0 text-slate-400" />
          <span>
            {event.startLabel} — {event.endLabel}
          </span>
        </div>
      </div>
      <Button
        variant="secondary"
        className="mt-5 w-full rounded-full bg-[#f6f5f8] text-slate-900"
        onClick={() => onOpen(event.id)}
      >
        Ver detalhes
      </Button>
    </div>
  );
}
