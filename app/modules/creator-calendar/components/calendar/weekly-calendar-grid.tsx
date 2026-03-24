import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import { formatIsoDateInTimeZone } from "../../lib/calendar-tz";
import { VISUAL_STATUS_BADGE_LABEL, VISUAL_STATUS_CARD_CLASS } from "../../lib/calendar-view-model";
import type { CalendarViewModel, UiCalendarEvent } from "../../types";

const ROW_PX = 104;

type WeeklyCalendarGridProps = {
  viewModel: CalendarViewModel;
  onEventClick: (eventId: string) => void;
  onSelectWeekDay?: (isoDate: string) => void;
};

export function WeeklyCalendarGrid({
  viewModel,
  onEventClick,
  onSelectWeekDay,
}: WeeklyCalendarGridProps) {
  const minHour = Number(viewModel.hourSlots[0]?.split(":")[0] ?? 8);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollVerticalRef = useRef<HTMLDivElement>(null);
  const scrollHorizontalRef = useRef<HTMLDivElement>(null);

  const { timeZone, todayDateKey, weekDays, hourSlots, events } = viewModel;
  const bodyHeight = hourSlots.length * ROW_PX;

  useEffect(() => {
    const todayIndex = weekDays.findIndex((d) => d.isoDate === todayDateKey);
    const el = todayIndex >= 0 ? columnRefs.current[todayIndex] : null;
    if (!el || !scrollHorizontalRef.current) return;
    const parent = scrollHorizontalRef.current;
    const offset =
      el.offsetLeft - parent.clientWidth / 2 + el.clientWidth / 2;
    parent.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
  }, [weekDays, todayDateKey]);

  useEffect(() => {
    const focusDayKey = weekDays.some((d) => d.isoDate === todayDateKey)
      ? todayDateKey
      : weekDays[0]?.isoDate;
    if (!focusDayKey || !scrollVerticalRef.current) return;

    const dayEvents = events.filter(
      (e) => formatIsoDateInTimeZone(e.startAt, timeZone) === focusDayKey,
    );
    const first = dayEvents[0];
    if (!first) {
      scrollVerticalRef.current.scrollTop = 0;
      return;
    }

    const topPx =
      (first.startHour - minHour) * ROW_PX +
      (first.startMinute / 60) * ROW_PX;
    scrollVerticalRef.current.scrollTop = Math.max(0, topPx - ROW_PX);
  }, [events, minHour, timeZone, todayDateKey, weekDays]);

  return (
    <div className="rounded-[32px] border border-[rgba(137,90,246,0.06)] bg-white shadow-sm">
      <div ref={scrollHorizontalRef} className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))] border-b border-[rgba(137,90,246,0.06)]">
            <div className="border-r border-[rgba(137,90,246,0.04)]" />
            {weekDays.map((day, index) => (
              <div
                key={day.id}
                ref={(node) => {
                  columnRefs.current[index] = node;
                }}
                className={cn(
                  "border-l border-[rgba(137,90,246,0.04)] px-2 py-3 text-center sm:px-4 sm:py-4",
                  day.highlighted && "bg-[#f4efff]",
                )}
              >
                <button
                  type="button"
                  className="w-full rounded-2xl px-1 py-1 text-center transition hover:bg-violet-50/80"
                  onClick={() => onSelectWeekDay?.(day.isoDate)}
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    {day.label}
                  </p>
                  <p className="mt-1 text-[30px] font-black tracking-[-0.04em] text-slate-900">
                    {day.date}
                  </p>
                </button>
              </div>
            ))}
          </div>

          <div
            ref={scrollVerticalRef}
            className="max-h-[min(560px,70vh)] overflow-y-auto"
          >
            <div
              className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))]"
              style={{ height: bodyHeight }}
            >
              <div className="border-r border-[rgba(137,90,246,0.04)]">
                {hourSlots.map((slot) => (
                  <div
                    key={slot}
                    className="border-t border-[rgba(137,90,246,0.04)] px-4 py-8 text-xs font-medium text-slate-400"
                    style={{ height: ROW_PX }}
                  >
                    {slot}
                  </div>
                ))}
              </div>

              {weekDays.map((day, dayIndex) => (
                <div
                  key={day.isoDate}
                  className="relative border-l border-[rgba(137,90,246,0.04)]"
                  style={{ height: bodyHeight }}
                >
                  {hourSlots.map((slot, rowIndex) => (
                    <div
                      key={slot}
                      className="absolute left-0 right-0 border-t border-[rgba(137,90,246,0.04)]"
                      style={{ top: rowIndex * ROW_PX, height: ROW_PX }}
                    />
                  ))}

                  {events
                    .filter((e) => e.dayIndex === dayIndex)
                    .map((event) => (
                      <CalendarGridEventCard
                        key={event.id}
                        event={event}
                        minHour={minHour}
                        onSelect={() => onEventClick(event.id)}
                      />
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarGridEventCard({
  event,
  minHour,
  onSelect,
}: {
  event: UiCalendarEvent;
  minHour: number;
  onSelect: () => void;
}) {
  const top =
    (event.startHour - minHour) * ROW_PX + (event.startMinute / 60) * ROW_PX;
  const height = Math.max((event.durationMinutes / 60) * ROW_PX - 8, 48);
  const widthPct = 100 / event.overlapCount;
  const leftPct = widthPct * event.overlapIndex;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "absolute z-[1] min-w-0 overflow-hidden rounded-2xl px-2 py-2 text-left text-xs shadow-sm transition hover:opacity-95",
        VISUAL_STATUS_CARD_CLASS[event.visualStatus],
      )}
      style={{
        top,
        height,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        paddingLeft: 6,
        paddingRight: 6,
      }}
    >
      <span className="block text-[10px] font-bold uppercase tracking-wide opacity-90">
        {VISUAL_STATUS_BADGE_LABEL[event.visualStatus]}
      </span>
      <span className="mt-0.5 block truncate text-[11px] font-bold opacity-95">
        {event.company}
      </span>
      <span className="mt-0.5 block truncate text-sm font-bold leading-tight">
        {event.title}
      </span>
      <span className="mt-0.5 block truncate text-[11px] opacity-90">
        {event.jobTypeName}
      </span>
      <span className="mt-1 block text-[11px] font-semibold">
        {event.startLabel} — {event.endLabel}
      </span>
      {event.locationLine ? (
        <span className="mt-0.5 block truncate text-[11px] opacity-90">
          {event.locationLine}
        </span>
      ) : (
        <span className="mt-0.5 block truncate text-[11px] opacity-90">
          {event.modeLine}
        </span>
      )}
    </button>
  );
}
