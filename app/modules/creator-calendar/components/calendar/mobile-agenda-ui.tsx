import type { KeyboardEvent } from "react";
import { ArrowLeft, Clock, Search, Video } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import type { AuthUser } from "~/modules/auth/types";
import { formatDayNumberInTimeZone } from "../../lib/calendar-tz";
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
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
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
        <Link
          to="/marketplace"
          className="flex size-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100"
          aria-label="Buscar creators e campanhas"
        >
          <Search className="size-[18px]" strokeWidth={2} />
        </Link>
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
          "shrink-0 text-[10px] font-bold uppercase tracking-[0.1em]",
          props.accent ? "text-[#895af6]" : "text-slate-500",
        )}
      >
        {props.label}
      </span>
      <div className="h-px min-w-0 flex-1 bg-slate-200" />
    </div>
  );
}

function openMapsQuery(query: string) {
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  window.open(url, "_blank", "noopener,noreferrer");
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
  const subline = event.locationLine ?? event.modeLine;
  const showMapCta =
    Boolean(event.locationLine?.trim()) && event.mode !== "REMOTE";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={props.onOpen}
      onKeyDown={(e) => cardKeyOpen(e, props.onOpen)}
      className="w-full cursor-pointer rounded-[32px] border border-transparent bg-white p-5 text-left shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
            tone.bg,
            tone.text,
          )}
        >
          <span className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} />
          {VISUAL_STATUS_BADGE_LABEL[event.visualStatus]}
        </span>
        <span className="shrink-0 text-xs text-slate-500">
          {event.startLabel} - {event.endLabel}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-slate-900">
        {event.title}
      </h3>
      <p className="mt-1 text-sm text-slate-500">{subline}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-2 text-xs text-slate-600">
          {event.mode === "REMOTE" ? (
            <>
              <span className="flex size-8 items-center justify-center rounded-full bg-slate-100">
                <Video className="size-3.5 text-slate-500" />
              </span>
              <span className="truncate">Reunião remota</span>
            </>
          ) : showMapCta ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 text-[#895af6]"
              onClick={(e) => {
                e.stopPropagation();
                openMapsQuery(event.locationLine!);
              }}
            >
              <span className="text-xs font-semibold">Ver no mapa</span>
            </button>
          ) : (
            <span className="truncate text-slate-500">{event.modeLine}</span>
          )}
        </div>
        <span className="shrink-0 text-xs font-semibold text-[#895af6]">
          Ver detalhes
        </span>
      </div>
    </div>
  );
}

export function MobileFeaturedJobCard(props: {
  event: UiCalendarEvent;
  timeZone: string;
  onOpen: () => void;
}) {
  const { event, timeZone } = props;
  const dayNum = formatDayNumberInTimeZone(event.startAt, timeZone);
  const monthRaw = new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    month: "long",
  }).format(event.startAt);
  const monthUpper = monthRaw.toUpperCase();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={props.onOpen}
      onKeyDown={(e) => cardKeyOpen(e, props.onOpen)}
      className="relative w-full cursor-pointer overflow-hidden rounded-[32px] bg-[#895af6] p-6 text-left shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.2),0px_4px_6px_-4px_rgba(137,90,246,0.2)] transition hover:opacity-[0.98]"
    >
      <div
        className="pointer-events-none absolute -right-4 -top-4 size-24 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div className="relative flex items-start justify-between gap-3">
        <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          {VISUAL_STATUS_BADGE_LABEL[event.visualStatus]}
        </span>
        <div className="text-right text-white">
          <p className="text-2xl font-bold leading-none">{dayNum}</p>
          <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider opacity-90">
            {monthUpper}
          </p>
        </div>
      </div>
      <h3 className="relative mt-8 text-xl font-bold leading-tight text-white">
        {event.title}
      </h3>
      <p className="relative mt-2 max-w-[240px] text-sm leading-snug text-white/90">
        {event.locationLine ?? event.modeLine}
      </p>
      <div className="relative mt-6 flex items-center gap-3 text-sm text-white">
        <Clock className="size-5 shrink-0 opacity-95" />
        <span className="font-medium">
          {event.startLabel} - {event.endLabel}
        </span>
      </div>
    </div>
  );
}

export function pickFeaturedEventId(events: UiCalendarEvent[]): string | null {
  const candidates = events.filter((e) => e.bookingStatus === "CONFIRMED");
  if (candidates.length === 0) return null;
  const sorted = [...candidates].sort(
    (a, b) =>
      b.durationMinutes - a.durationMinutes ||
      a.startAt.getTime() - b.startAt.getTime(),
  );
  return sorted[0]?.id ?? null;
}

export function sectionHeadingAccent(
  section: CalendarTimelineSection,
  viewModel: CalendarViewModel,
): boolean {
  return section.dateKey === viewModel.todayDateKey;
}
