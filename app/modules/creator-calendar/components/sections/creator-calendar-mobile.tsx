import { useMemo } from "react";
import { useAuth } from "~/hooks/use-auth";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { MobileJobSheet } from "../calendar/mobile-job-sheet";
import { PastRangeNotice } from "../calendar/past-range-notice";
import {
  MobileAgendaTopBar,
  MobileSectionHeading,
  MobileStandardJobCard,
  MobileWeekStrip,
  sectionHeadingAccent,
} from "../calendar/mobile-agenda-ui";

import type { CalendarViewModel, UiCalendarEvent } from "../../types";

type CreatorCalendarMobileProps = {
  viewModel: CalendarViewModel;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onOpenEvent: (eventId: string) => void;
};

function CreatorCalendarMobile({
  viewModel,
  onPrevWeek,
  onNextWeek,
  onOpenEvent,
}: CreatorCalendarMobileProps) {
  const { user } = useAuth();

  const sectionsWithEvents = useMemo(
    () => viewModel.timelineByDay.filter((s) => s.events.length > 0),
    [viewModel.timelineByDay],
  );

  const openDetails = (event: UiCalendarEvent) => {
    onOpenEvent(event.id);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f6f5f8]">
      <MobileAgendaTopBar user={user} />

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-28 pt-6">
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Meus Compromissos
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie sua agenda e nunca perca um trabalho.
          </p>

          <div className="mt-6">
            <MobileWeekStrip
              weekRangeLabel={viewModel.weekRangeLabel}
              onPrev={onPrevWeek}
              onNext={onNextWeek}
            />
          </div>

          {viewModel.rangePastNotice !== "none" ? (
            <PastRangeNotice
              notice={viewModel.rangePastNotice}
              className="mt-4"
            />
          ) : null}

          {sectionsWithEvents.length === 0 ? (
            <p className="mt-10 text-center text-sm text-slate-500">
              Nenhum compromisso neste período.
            </p>
          ) : (
            <div className="mt-10 flex flex-col gap-10">
              {sectionsWithEvents.map((section) => (
                <section key={section.dateKey} className="flex flex-col gap-4">
                  <MobileSectionHeading
                    label={section.sectionLabel}
                    accent={sectionHeadingAccent(section, viewModel)}
                  />
                  <div className="flex flex-col gap-4">
                    {section.events.map((event) => (
                      <MobileStandardJobCard
                        key={event.id}
                        event={event}
                        onOpen={() => openDetails(event)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type CreatorCalendarMobileSectionProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

export function CreatorCalendarMobileSection({
  controller,
}: CreatorCalendarMobileSectionProps) {
  const { viewModel, actions } = controller;

  if (!viewModel) {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <CreatorCalendarMobile
        viewModel={viewModel}
        onPrevWeek={actions.goToPreviousWeek}
        onNextWeek={actions.goToNextWeek}
        onOpenEvent={(id) => actions.openEventDetails(id, "mobile")}
      />
      <MobileJobSheet controller={controller} />
    </div>
  );
}
