import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Settings2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { AvailabilitySwitch, SegmentedControl, TimeSelectField } from "./creator-calendar-controls";

type CreatorCalendarDesktopSectionProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

const DESKTOP_VIEW_ITEMS = [
  { id: "day", label: "Dia" },
  { id: "week", label: "Semana" },
  { id: "month", label: "Mes" },
];

export function CreatorCalendarDesktopSection({
  controller,
}: CreatorCalendarDesktopSectionProps) {
  const { actions, state, viewModel } = controller;

  if (state.isDesktopSettingsExpanded) {
    return (
      <section className="rounded-[36px] border border-[rgba(137,90,246,0.08)] bg-white p-6 shadow-sm lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[30px] font-black tracking-[-0.04em] text-slate-900">
              Configuracoes de Agenda
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Defina sua disponibilidade semanal para novos jobs e reunioes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full px-5"
              onClick={() => actions.setIsDesktopSettingsExpanded(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="purple"
              className="rounded-full px-5"
              onClick={actions.saveDesktopSettings}
            >
              Salvar Alteracoes
            </Button>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          {viewModel.availabilityDays.map((day) => (
            <div
              key={day.id}
              className={cn(
                "grid grid-cols-[1.4fr_1fr_1fr_0.9fr] items-center gap-4 rounded-[28px] border px-5 py-4",
                day.enabled
                  ? "border-[rgba(137,90,246,0.08)] bg-[#faf9fd]"
                  : "border-dashed border-slate-200 bg-[#fcfcfd] opacity-80"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{day.label}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {day.enabled ? "Disponivel" : "Indisponivel"}
                  </p>
                </div>
                <AvailabilitySwitch
                  checked={day.enabled}
                  onChange={(checked) =>
                    actions.updateAvailabilityDay(day.id, "enabled", checked)
                  }
                />
              </div>
              <TimeSelectField
                label="Inicio"
                value={day.start}
                options={viewModel.timeOptions}
                disabled={!day.enabled}
                onChange={(value) =>
                  actions.updateAvailabilityDay(day.id, "start", value)
                }
              />
              <TimeSelectField
                label="Fim"
                value={day.end}
                options={viewModel.timeOptions}
                disabled={!day.enabled}
                onChange={(value) =>
                  actions.updateAvailabilityDay(day.id, "end", value)
                }
              />
              <div className="rounded-[24px] bg-[#f6f5f8] px-4 py-3 text-sm font-semibold text-slate-600">
                {day.enabled ? `${day.start} - ${day.end}` : "Folga"}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="flex items-center justify-between rounded-[32px] border border-[rgba(137,90,246,0.08)] bg-white px-6 py-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f0ebff]">
            <Settings2 className="size-5 text-[#895af6]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-[-0.03em] text-slate-900">
              Configuracoes de Agenda
            </h1>
            <p className="text-sm text-slate-500">
              Gerencie fusos horarios, buffers e sincronizacao.
            </p>
          </div>
        </div>
        <Button
          variant="secondary"
          className="rounded-full bg-[#f6f5f8] px-5 text-slate-900"
          onClick={() => actions.setIsDesktopSettingsExpanded(true)}
        >
          Ver Configuracoes
        </Button>
      </section>

      <section className="rounded-[36px] border border-[rgba(137,90,246,0.06)] bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-[rgba(137,90,246,0.06)] px-6 py-5">
          <div className="flex items-center gap-3">
            <h2 className="text-[32px] font-black tracking-[-0.04em] text-slate-900">
              Janeiro 2024
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full bg-[#f6f5f8] text-slate-700"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full bg-[#f6f5f8] text-slate-700"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <Button variant="outline" className="rounded-full px-4">
              Hoje
            </Button>
          </div>

          <SegmentedControl
            items={DESKTOP_VIEW_ITEMS}
            value={state.desktopView}
            onChange={(value) => actions.setDesktopView(value as typeof state.desktopView)}
          />
        </div>

        <div className="overflow-hidden px-6 pb-6 pt-5">
          <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))] rounded-[32px] bg-[#fcfbfe]">
            <div className="border-r border-[rgba(137,90,246,0.04)]" />
            {viewModel.desktopWeekDays.map((day) => (
              <div
                key={day.id}
                className={cn(
                  "border-l border-[rgba(137,90,246,0.04)] px-4 py-4 text-center",
                  day.highlighted && "bg-[#f4efff]"
                )}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {day.label}
                </p>
                <p className="mt-1 text-[30px] font-black tracking-[-0.04em] text-slate-900">
                  {day.date}
                </p>
              </div>
            ))}

            {viewModel.desktopTimeSlots.map((slot, rowIndex) => (
              <DesktopGridRow
                key={slot}
                rowIndex={rowIndex}
                slot={slot}
                controller={controller}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)_280px] gap-5">
        <div className="rounded-[32px] bg-[linear-gradient(135deg,#7c4aed_0%,#895af6_45%,#9f67ff_100%)] p-7 text-white shadow-sm">
          <p className="text-[34px] font-black tracking-[-0.04em]">Produtividade em Alta!</p>
          <p className="mt-3 max-w-[520px] text-base text-white/85">
            Voce tem {viewModel.totalWeeklyHours} horas de sessoes criativas agendadas
            para esta semana. Continue assim!
          </p>
          <Button className="mt-6 rounded-full bg-white px-6 text-[#895af6] hover:bg-white/95">
            Ver Relatorio Completo
          </Button>
        </div>

        <div className="rounded-[32px] border border-[rgba(137,90,246,0.06)] bg-white p-6 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Proxima Sessao
          </p>
          <h3 className="mt-3 text-[28px] font-black tracking-[-0.04em] text-slate-900">
            Workshop de Cores
          </h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <Clock3 className="size-4 text-slate-400" />
            Hoje, as 16:00
          </div>
          <Button variant="secondary" className="mt-8 w-full rounded-full bg-[#f6f5f8]">
            Preparar Sala
          </Button>
        </div>
      </section>
    </div>
  );
}

function DesktopGridRow({
  controller,
  rowIndex,
  slot,
}: {
  controller: ReturnType<typeof useCreatorCalendarController>;
  rowIndex: number;
  slot: string;
}) {
  return (
    <>
      <div className="border-t border-r border-[rgba(137,90,246,0.04)] px-4 py-8 text-xs font-medium text-slate-400">
        {slot}
      </div>
      {controller.viewModel.desktopWeekDays.map((day, dayIndex) => (
        <div
          key={`${day.id}-${slot}`}
          className="relative min-h-[124px] border-l border-t border-[rgba(137,90,246,0.04)]"
        >
          {controller.viewModel.desktopEvents
            .filter(
              (event) => event.dayIndex === dayIndex && event.startHour === rowIndex + 8
            )
            .map((event) => (
              <div
                key={event.id}
                className={cn(
                  "absolute left-2 right-2 top-2 rounded-[24px] p-4 text-white shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.25),0px_4px_6px_-4px_rgba(137,90,246,0.25)]",
                  event.tone === "indigo"
                    ? "bg-[#6366f1]"
                    : "bg-[linear-gradient(180deg,#8b5cf6_0%,#7c4aed_100%)]"
                )}
                style={{ height: `${event.durationHours * 88}px` }}
              >
                <p className="text-xs font-bold">{`${event.startLabel} - ${event.endLabel}`}</p>
                <p className="mt-2 max-w-[140px] text-sm font-bold leading-5">
                  {event.title}
                </p>
              </div>
            ))}
        </div>
      ))}
    </>
  );
}
