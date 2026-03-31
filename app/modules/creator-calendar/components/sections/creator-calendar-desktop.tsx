import { cn } from "~/lib/utils";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { CalendarHeaderWeek } from "../calendar/calendar-header-week";
import { CalendarJobDetailsPanel } from "../calendar/calendar-job-details-panel";
import { CalendarRightPanel } from "../calendar/calendar-right-panel";
import { PastRangeNotice } from "../calendar/past-range-notice";
import { WeeklyCalendarGrid } from "../calendar/weekly-calendar-grid";

type CreatorCalendarDesktopSectionProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

export function CreatorCalendarDesktopSection({
  controller,
}: CreatorCalendarDesktopSectionProps) {
  const { state, viewModel, actions } = controller;

  if (!viewModel) {
    return null;
  }

  const headerWeekDays = viewModel.weekDays.map((d) => ({
    isoDate: d.isoDate,
    label: d.label,
    date: d.date,
    isToday: Boolean(d.isToday),
    isSelected: Boolean(d.highlighted),
  }));

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            <CalendarHeaderWeek
              weekRangeLabel={viewModel.weekRangeLabel}
              weekDays={headerWeekDays}
              onSelectDay={actions.selectWeekDay}
              onPrevWeek={actions.goToPreviousWeek}
              onNextWeek={actions.goToNextWeek}
              onToday={actions.goToToday}
            />
            <div className="space-y-3 px-6 pb-6 pt-2">
              {viewModel.rangePastNotice !== "none" ? (
                <PastRangeNotice notice={viewModel.rangePastNotice} />
              ) : null}
              <WeeklyCalendarGrid
                viewModel={viewModel}
                selectedEventId={state.selectedEventId}
                onEventClick={(id) => actions.openEventDetails(id, "desktop")}
                onSelectWeekDay={actions.selectWeekDay}
              />
              {viewModel.events.length === 0 ? (
                <div
                  className={cn(
                    "mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-4 text-sm text-slate-500",
                  )}
                >
                  Nenhum compromisso neste período.
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <CalendarRightPanel
          viewModel={viewModel}
          onOpenEvent={(id) => actions.openEventDetails(id, "desktop")}
        />
      </div>

      <CalendarJobDetailsPanel controller={controller} />
    </>
  );
}
