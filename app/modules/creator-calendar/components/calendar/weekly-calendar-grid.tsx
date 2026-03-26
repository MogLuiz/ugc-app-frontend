import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import { formatIsoDateInTimeZone, getHourMinuteInTimeZone } from "../../lib/calendar-tz";
import { CalendarGridEventCard, CALENDAR_GRID_ROW_PX } from "./calendar-grid-event-card";
import type { CalendarViewModel } from "../../types";

type WeeklyCalendarGridProps = {
  viewModel: CalendarViewModel;
  selectedEventId: string | null;
  onEventClick: (eventId: string) => void;
  onSelectWeekDay?: (isoDate: string) => void;
};

function CalendarNowIndicator({
  minHour,
  rowPx,
  bodyHeight,
  timeZone,
}: {
  minHour: number;
  rowPx: number;
  bodyHeight: number;
  timeZone: string;
}) {
  const now = new Date();
  const { hour, minute } = getHourMinuteInTimeZone(now, timeZone);
  const top = (hour - minHour + minute / 60) * rowPx;
  if (top < 0 || top > bodyHeight - 2) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-[3]"
      style={{ top }}
    >
      <div className="relative flex h-0 items-center">
        <span
          className="absolute -left-0.5 size-2 rounded-full bg-rose-500 shadow-sm ring-2 ring-white"
          aria-hidden
        />
        <div className="h-[2px] w-full bg-rose-500/85" />
      </div>
    </div>
  );
}

export function WeeklyCalendarGrid({
  viewModel,
  selectedEventId,
  onEventClick,
  onSelectWeekDay,
}: WeeklyCalendarGridProps) {
  const minHour = Number(viewModel.hourSlots[0]?.split(":")[0] ?? 8);
  const columnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollVerticalRef = useRef<HTMLDivElement>(null);
  const scrollHorizontalRef = useRef<HTMLDivElement>(null);

  const { timeZone, todayDateKey, weekDays, hourSlots, events } = viewModel;
  const rowPx = CALENDAR_GRID_ROW_PX;
  const bodyHeight = hourSlots.length * rowPx;

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
      (first.startHour - minHour) * rowPx +
      (first.startMinute / 60) * rowPx;
    scrollVerticalRef.current.scrollTop = Math.max(0, topPx - rowPx);
  }, [events, minHour, timeZone, todayDateKey, weekDays, rowPx]);

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div ref={scrollHorizontalRef} className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))] border-b border-slate-200/60">
            <div className="border-r border-slate-100" />
            {weekDays.map((day, index) => (
              <div
                key={day.id}
                ref={(node) => {
                  columnRefs.current[index] = node;
                }}
                className={cn(
                  "border-l border-slate-100 px-2 py-3 text-center sm:px-4 sm:py-4",
                  day.isToday &&
                    "rounded-t-xl border-x border-t border-violet-200/70 bg-violet-50/40",
                  day.highlighted && !day.isToday && "bg-slate-50/80",
                )}
              >
                <button
                  type="button"
                  className={cn(
                    "w-full rounded-xl px-1 py-1 text-center transition hover:bg-slate-100/80",
                    day.isToday && "hover:bg-violet-100/60",
                  )}
                  onClick={() => onSelectWeekDay?.(day.isoDate)}
                >
                  <p
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-[0.12em]",
                      day.isToday ? "text-violet-600" : "text-slate-400",
                    )}
                  >
                    {day.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-[30px] font-black tracking-[-0.04em]",
                      day.isToday ? "text-violet-700" : "text-slate-900",
                    )}
                  >
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
              <div className="border-r border-slate-100">
                {hourSlots.map((slot) => (
                  <div
                    key={slot}
                    className="border-t border-slate-100 px-4 py-8 text-xs font-medium text-slate-400"
                    style={{ height: rowPx }}
                  >
                    {slot}
                  </div>
                ))}
              </div>

              {weekDays.map((day, dayIndex) => (
                <div
                  key={day.isoDate}
                  className={cn(
                    "relative border-l border-slate-100",
                    day.isToday && "bg-violet-50/15",
                  )}
                  style={{ height: bodyHeight }}
                >
                  {hourSlots.map((slot, rowIndex) => (
                    <div
                      key={slot}
                      className="absolute left-0 right-0 border-t border-slate-100"
                      style={{ top: rowIndex * rowPx, height: rowPx }}
                    />
                  ))}

                  {day.isoDate === todayDateKey ? (
                    <CalendarNowIndicator
                      minHour={minHour}
                      rowPx={rowPx}
                      bodyHeight={bodyHeight}
                      timeZone={timeZone}
                    />
                  ) : null}

                  {events
                    .filter((e) => e.dayIndex === dayIndex)
                    .map((event) => (
                      <CalendarGridEventCard
                        key={event.id}
                        event={event}
                        minHour={minHour}
                        selectedEventId={selectedEventId}
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
