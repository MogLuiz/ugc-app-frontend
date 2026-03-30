import { useMemo } from "react";
import { Link } from "react-router";
import { ArrowRight, CalendarX2, RefreshCw } from "lucide-react";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { MobileJobSheet } from "../calendar/mobile-job-sheet";
import { PastRangeNotice } from "../calendar/past-range-notice";
import {
  MobileAgendaTimelineSections,
  MobileWeekStrip,
} from "../calendar/mobile-agenda-ui";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";

import type { CalendarViewModel, UiCalendarEvent } from "../../types";

type CreatorCalendarMobileProps = {
  viewModel: CalendarViewModel;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onOpenEvent: (eventId: string) => void;
};

function CalendarIllustration() {
  return (
    <div className="relative flex size-[110px] items-center justify-center">
      {/* Glow ambiente */}
      <div className="absolute inset-0 rounded-full bg-[#895af6]/10 blur-[16px]" />
      {/* Container principal */}
      <div className="relative flex size-[90px] items-center justify-center overflow-hidden rounded-[22px] bg-white shadow-[0_12px_24px_-6px_rgba(137,90,246,0.15)] ring-1 ring-[#f8fafc]">
        {/* Formas decorativas de fundo */}
        <div className="absolute -right-6 -top-6 size-14 rounded-full bg-[rgba(240,235,255,0.4)]" />
        <div className="absolute -bottom-8 -left-8 size-16 rounded-full bg-[rgba(224,231,255,0.3)]" />
        {/* Ícone central */}
        <CalendarX2 className="relative size-10 text-[#895af6]" />
        {/* Ponto decorativo âmbar */}
        <div className="absolute right-3 top-2 size-2 rounded-full bg-amber-400 shadow-sm" />
        {/* Ponto decorativo índigo */}
        <div className="absolute bottom-5 left-3 size-1.5 rounded-full bg-[#6366f1] opacity-60" />
      </div>
    </div>
  );
}

function AgendaEmptyState() {
  return (
    <MobileEmptyState
      variant="initial"
      className="mt-4"
      illustration={<CalendarIllustration />}
      title="Nenhum trabalho agendado"
      description="Sua agenda está livre por enquanto. Assim que você aceitar uma campanha e a data for confirmada, ela aparecerá aqui."
      actions={
        <div className="flex flex-col gap-3">
          <Link
            to="/ofertas"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#895af6] px-6 py-3.5 text-base font-bold text-white shadow-[0_8px_12px_-3px_rgba(137,90,246,0.25)] transition-colors hover:bg-[#7c4aed]"
          >
            <ArrowRight className="size-5" aria-hidden="true" />
            Ver novas ofertas
          </Link>
          {/* Sincronizar calendário: placeholder para futura integração em /configuracoes */}
          <Link
            to="/configuracoes"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-[17px] text-sm font-semibold text-slate-500 shadow-sm transition-colors hover:bg-slate-50"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Sincronizar calendário
          </Link>
        </div>
      }
    />
  );
}

function commitmentSubtitle(count: number): string {
  if (count === 0) {
    return "Nenhum compromisso neste período";
  }
  if (count === 1) {
    return "1 compromisso neste período";
  }
  return `${count} compromissos neste período`;
}

function CreatorCalendarMobile({
  viewModel,
  onPrevWeek,
  onNextWeek,
  onOpenEvent,
}: CreatorCalendarMobileProps) {
  const sectionsWithEvents = useMemo(
    () => viewModel.timelineByDay.filter((s) => s.events.length > 0),
    [viewModel.timelineByDay],
  );

  const openDetails = (event: UiCalendarEvent) => {
    onOpenEvent(event.id);
  };

  const commitmentCount = viewModel.weeklyStats.jobCount;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f6f5f8]">
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-28 pt-6">
        <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Agenda
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {commitmentSubtitle(commitmentCount)}
          </p>

          <div className="mt-5">
            <MobileWeekStrip
              weekRangeLabelCompact={viewModel.weekRangeLabelCompact}
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
            <AgendaEmptyState />
          ) : (
            <div className="mt-10 flex flex-col gap-10">
              <MobileAgendaTimelineSections
                sections={sectionsWithEvents}
                viewModel={viewModel}
                onOpenEvent={openDetails}
              />
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
