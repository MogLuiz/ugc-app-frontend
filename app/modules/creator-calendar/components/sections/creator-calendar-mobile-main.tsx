import { ArrowLeft, Clock3, MapPin, Settings2, Video } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { SegmentedControl } from "./creator-calendar-controls";
import { MobileHeader } from "./creator-calendar-mobile-header";

type CreatorCalendarMobileSectionProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

const MOBILE_VIEW_ITEMS = [
  { id: "daily", label: "Diario" },
  { id: "weekly", label: "Semanal" },
];

export function MobileWeeklySection({
  controller,
}: CreatorCalendarMobileSectionProps) {
  return (
    <section className="space-y-4 pb-6">
      <MobileHeader title="Agenda" />

      <div className="px-4">
        <SegmentedControl
          items={MOBILE_VIEW_ITEMS}
          value={controller.state.mobileView}
          onChange={(value) => controller.actions.setMobileView(value as "weekly" | "daily")}
          className="w-full justify-between"
        />
      </div>

      <div className="px-4">
        <div className="rounded-[32px] border border-[rgba(137,90,246,0.05)] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="rounded-full p-2 text-[#895af6]"
              onClick={controller.actions.goToPreviousWeek}
            >
              <ArrowLeft className="size-4" />
            </button>
            <h2 className="text-lg font-bold text-slate-900">
              {controller.viewModel.monthTitle}
            </h2>
            <button
              type="button"
              className="rounded-full p-2 text-[#895af6]"
              onClick={controller.actions.goToNextWeek}
            >
              <ArrowLeft className="size-4 rotate-180" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-1.5">
            {controller.viewModel.mobileWeekDays.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => controller.actions.openMobileDailyView(day.isoDate)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-[20px] py-2 text-center",
                  day.highlighted ? "bg-[#895af6] text-white shadow-lg shadow-[#895af6]/25" : ""
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.12em]",
                    day.highlighted ? "text-white/80" : "text-slate-400"
                  )}
                >
                  {day.label}
                </span>
                <span className={cn("text-base font-semibold", day.highlighted ? "text-white" : "text-slate-900")}>
                  {day.date}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4">
        <button
          type="button"
          onClick={controller.actions.openMobileAvailability}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-[#d9c9ff] bg-[#f1ebff] px-5 py-4 text-sm font-bold text-[#895af6]"
        >
          <Settings2 className="size-4" />
          Ajustar Disponibilidade
        </button>
      </div>

      <div className="space-y-4 px-4 pb-20">
        <h3 className="text-[30px] font-black tracking-[-0.04em] text-slate-900">
          Proximos Trabalhos
        </h3>
        {controller.viewModel.upcomingJobs.length > 0 ? (
          controller.viewModel.upcomingJobs.map((job) => (
            <article
              key={job.id}
              className={cn(
                "rounded-[32px] border bg-white p-5 shadow-sm",
                job.tone === "primary" && "border-l-4 border-l-[#895af6]",
                job.tone === "muted" && "border-l-4 border-l-slate-300",
                job.tone === "danger" && "border-l-4 border-l-red-500"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-[0.16em]",
                      job.tone === "danger" ? "text-red-500" : "text-[#895af6]"
                    )}
                  >
                    {job.category}
                  </p>
                  <h4 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-900">
                    {job.title}
                  </h4>
                </div>
                {job.badge ? (
                  <span className="rounded-xl bg-[#f2ebff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#895af6]">
                    {job.badge}
                  </span>
                ) : null}
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock3 className="size-4" />
                  {job.schedule}
                </div>
                {job.location ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />
                    {job.location}
                  </div>
                ) : null}
              </div>
              {job.note ? (
                <div className="mt-4 rounded-[24px] border border-[#fce7b0] bg-[#fffbeb] px-4 py-3 text-sm font-semibold text-amber-800">
                  {job.note}
                </div>
              ) : null}
              {job.ctaLabel ? (
                <Button className="mt-4 w-full rounded-full bg-[#ef4444] hover:bg-[#dc2626]">
                  {job.ctaLabel}
                </Button>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
            Nenhum booking futuro encontrado nesta semana.
          </div>
        )}
      </div>
    </section>
  );
}

export function MobileDailySection({
  controller,
}: CreatorCalendarMobileSectionProps) {
  return (
    <section className="space-y-5 pb-20">
      <MobileHeader
        title="Visualizacao Diaria"
        leadingAction={() => controller.actions.setMobileView("weekly")}
      />

      <div className="flex items-center justify-between px-4">
        <h2 className="text-[32px] font-black tracking-[-0.04em] text-slate-900">
          {controller.viewModel.selectedDateLabel}
        </h2>
        <span className="rounded-full bg-[#efe6ff] px-3 py-1 text-xs font-bold text-[#895af6]">
          {controller.viewModel.dailyJobs.length} Jobs
        </span>
      </div>

      <div className="space-y-4 px-4">
        {controller.viewModel.dailyJobs.length > 0 ? (
          controller.viewModel.dailyJobs.map((job) => (
            <article
              key={job.id}
              className="overflow-hidden rounded-[32px] border border-white bg-white shadow-sm"
            >
              {job.imageUrl ? (
                <img src={job.imageUrl} alt={job.title} className="h-48 w-full object-cover" />
              ) : null}
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#895af6]">
                      {job.category}
                    </p>
                    <h3 className="mt-1 text-[30px] font-black tracking-[-0.04em] text-slate-900">
                      {job.title}
                    </h3>
                  </div>
                  {job.badge ? (
                    <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-[10px] font-bold uppercase text-amber-700">
                      {job.badge}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock3 className="size-4" />
                    {job.schedule}
                  </div>
                  <div className="flex items-center gap-2">
                    {job.location.includes("Remoto") ? <Video className="size-4" /> : <MapPin className="size-4" />}
                    {job.location}
                  </div>
                </div>
                {job.description ? (
                  <div className="rounded-[24px] bg-[#f6f3ff] px-4 py-3 text-sm font-semibold text-slate-700">
                    {job.description}
                  </div>
                ) : null}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">
                    {job.client ?? "Detalhes do job disponiveis"}
                  </p>
                  <Button
                    variant={job.tone === "muted" ? "secondary" : "purple"}
                    className="rounded-full px-5"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
            Nenhum booking para o dia selecionado.
          </div>
        )}
      </div>
    </section>
  );
}
