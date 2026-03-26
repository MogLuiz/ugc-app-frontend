import { Clock, MapPin, Video } from "lucide-react";
import { cn } from "~/lib/utils";
import { bookingStatusBorderClass } from "../../lib/calendar-display";
import { VISUAL_STATUS_BADGE_LABEL } from "../../lib/calendar-view-model";
import type { UiCalendarEvent } from "../../types";

const ROW_PX = 104;

export type CalendarGridEventCardProps = {
  event: UiCalendarEvent;
  minHour: number;
  onSelect: () => void;
  selectedEventId: string | null;
};

export function CalendarGridEventCard({
  event,
  minHour,
  onSelect,
  selectedEventId,
}: CalendarGridEventCardProps) {
  const top =
    (event.startHour - minHour) * ROW_PX + (event.startMinute / 60) * ROW_PX;
  const height = Math.max((event.durationMinutes / 60) * ROW_PX - 8, 48);
  const widthPct = 100 / event.overlapCount;
  const leftPct = widthPct * event.overlapIndex;
  const isSelected = selectedEventId === event.id;

  const locationOrDistance =
    event.distanceLabel ??
    (event.locationLine?.trim() ? event.locationLine : event.modeLine);

  const tooltip = [
    event.company,
    event.title,
    event.jobKindLabel,
    `${event.startLabel} — ${event.endLabel} · ${event.durationLabel}`,
    locationOrDistance,
  ]
    .filter(Boolean)
    .join(" · ");

  const ModeIcon = event.mode === "REMOTE" ? Video : MapPin;

  return (
    <button
      type="button"
      title={tooltip}
      onClick={onSelect}
      className={cn(
        "absolute z-[1] min-w-0 cursor-pointer overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-br from-white via-white to-slate-50/90 px-2 py-1.5 text-left text-[10px] text-slate-800 shadow-sm transition duration-200 ease-out hover:scale-[1.02] hover:shadow-md active:scale-[0.99]",
        bookingStatusBorderClass(event.bookingStatus),
        isSelected &&
          "z-[2] scale-[1.02] shadow-lg ring-2 ring-violet-500/70 ring-offset-1 ring-offset-white",
      )}
      style={{
        top,
        height,
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        paddingLeft: 8,
        paddingRight: 6,
      }}
    >
      <div className="flex items-start gap-1.5">
        <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-[9px] font-bold text-slate-500">
          {event.companyPhotoUrl ? (
            <img
              src={event.companyPhotoUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            event.company.charAt(0).toUpperCase()
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="block truncate font-bold leading-tight text-slate-900">
            {event.company}
          </span>
          <span className="mt-0.5 inline-flex max-w-full items-center gap-0.5 truncate rounded-md bg-slate-100/90 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-slate-600">
            {VISUAL_STATUS_BADGE_LABEL[event.visualStatus]}
          </span>
        </div>
      </div>
      <div className="mt-1 flex items-center gap-0.5 truncate font-semibold text-slate-700">
        <ModeIcon className="size-2.5 shrink-0 text-slate-500" aria-hidden />
        <span className="truncate">{event.jobKindLabel}</span>
      </div>
      <div className="mt-0.5 flex items-center gap-0.5 truncate text-slate-600">
        <Clock className="size-2.5 shrink-0" aria-hidden />
        <span className="truncate">
          {event.startLabel} — {event.endLabel} · {event.durationLabel}
        </span>
      </div>
      <div className="mt-0.5 flex items-center gap-0.5 truncate text-slate-600">
        <MapPin className="size-2.5 shrink-0" aria-hidden />
        <span className="truncate">{locationOrDistance}</span>
      </div>
    </button>
  );
}

export { ROW_PX as CALENDAR_GRID_ROW_PX };
