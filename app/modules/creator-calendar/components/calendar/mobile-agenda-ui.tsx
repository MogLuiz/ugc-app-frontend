import type { KeyboardEvent } from "react";
import { ArrowLeft, Clock, MapPin, Video } from "lucide-react";
import { cn } from "~/lib/utils";
import { openMapsQuery } from "~/lib/maps";
import type { AuthUser } from "~/modules/auth/types";
import { bookingStatusBorderClass } from "../../lib/calendar-display";
import { VISUAL_STATUS_BADGE_LABEL } from "../../lib/calendar-view-model";
import type {
  CalendarTimelineSection,
  CalendarViewModel,
  UiCalendarEvent,
  VisualCalendarStatus,
} from "../../types";

const STATUS_BADGE_ROW: Record<
  VisualCalendarStatus,
  { dot: string; bg: string; text: string }
> = {
  confirmed: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  pending: {
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-800",
  },
  completed: {
    dot: "bg-slate-400",
    bg: "bg-slate-100",
    text: "text-slate-700",
  },
  cancelled: {
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-800",
  },
};

export function MobileAgendaTopBar({ user }: { user: AuthUser | null }) {
  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";
  const photo = user?.profile?.photoUrl;

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200/50 bg-[#f6f5f8]/90 backdrop-blur-[12px]">
      <div className="flex items-center gap-3 px-6 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f0ebff]">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-[#895af6]">{initial}</span>
          )}
        </div>
        <span className="text-[20px] font-light tracking-[-0.02em] text-[#895af6]">
          UGC Local
        </span>
      </div>
    </header>
  );
}

export function MobileWeekStrip(props: {
  weekRangeLabel: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="rounded-[32px] border border-slate-200/60 bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="rounded-full p-2 text-[#895af6]"
          onClick={props.onPrev}
          aria-label="Período anterior"
        >
          <ArrowLeft className="size-4" />
        </button>
        <p className="min-w-0 flex-1 text-center text-sm font-bold capitalize leading-tight text-slate-900">
          {props.weekRangeLabel}
        </p>
        <button
          type="button"
          className="rounded-full p-2 text-[#895af6]"
          onClick={props.onNext}
          aria-label="Próximo período"
        >
          <ArrowLeft className="size-4 rotate-180" />
        </button>
      </div>
    </div>
  );
}

export function MobileSectionHeading(props: {
  label: string;
  accent: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "max-w-[72%] text-xs font-bold leading-snug tracking-tight",
          props.accent ? "text-[#895af6]" : "text-slate-500",
        )}
      >
        {props.label}
      </span>
      <div className="h-px min-w-0 flex-1 bg-slate-200" aria-hidden />
    </div>
  );
}

function cardKeyOpen(e: KeyboardEvent<HTMLDivElement>, onOpen: () => void) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    onOpen();
  }
}

export function MobileStandardJobCard(props: {
  event: UiCalendarEvent;
  onOpen: () => void;
}) {
  const { event } = props;
  const tone = STATUS_BADGE_ROW[event.visualStatus];
  const locationOrDistance =
    event.distanceLabel ??
    (event.locationLine?.trim() ? event.locationLine : event.modeLine);
  const showMapCta =
    Boolean(event.locationLine?.trim()) && event.mode !== "REMOTE";
  const ModeIcon = event.mode === "REMOTE" ? Video : MapPin;

  const tooltip = [
    event.company,
    event.title,
    event.jobKindLabel,
    `${event.startLabel} — ${event.endLabel} · ${event.durationLabel}`,
    locationOrDistance,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      role="button"
      tabIndex={0}
      title={tooltip}
      onClick={props.onOpen}
      onKeyDown={(e) => cardKeyOpen(e, props.onOpen)}
      className={cn(
        "w-full cursor-pointer rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/90 p-4 text-left shadow-sm transition hover:scale-[1.01] hover:shadow-md",
        bookingStatusBorderClass(event.bookingStatus),
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-sm font-bold text-slate-500">
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
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                tone.bg,
                tone.text,
              )}
            >
              <span className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} />
              {VISUAL_STATUS_BADGE_LABEL[event.visualStatus]}
            </span>
          </div>
          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {event.company}
          </p>
          <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
            {event.jobKindLabel}
          </p>
        </div>
      </div>

      <h3 className="mt-3 text-base font-bold leading-snug text-slate-900">
        {event.title}
      </h3>

      <div className="mt-3 space-y-1.5 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Clock className="size-4 shrink-0 text-slate-400" aria-hidden />
          <span className="truncate">
            {event.startLabel} — {event.endLabel} · {event.durationLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ModeIcon className="size-4 shrink-0 text-slate-400" aria-hidden />
          <span className="truncate">{locationOrDistance}</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
        <div className="min-w-0 text-xs text-slate-500">
          {showMapCta ? (
            <button
              type="button"
              className="font-semibold text-violet-600"
              onClick={(e) => {
                e.stopPropagation();
                openMapsQuery(event.locationLine!.trim());
              }}
            >
              Ver no mapa
            </button>
          ) : null}
        </div>
        <span className="shrink-0 text-xs font-semibold text-violet-600">
          Ver detalhes
        </span>
      </div>
    </div>
  );
}

export function sectionHeadingAccent(
  section: CalendarTimelineSection,
  viewModel: CalendarViewModel,
): boolean {
  return section.dateKey === viewModel.todayDateKey;
}
