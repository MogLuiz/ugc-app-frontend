import type { KeyboardEvent } from "react";
import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { cn } from "~/lib/utils";
import { openMapsQuery } from "~/lib/maps";
import type { AuthUser } from "~/modules/auth/types";
import {
  bookingStatusBorderClass,
  getMobileCardDescriptionTitle,
  getMobilePinLineText,
} from "../../lib/calendar-display";
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
  weekRangeLabelCompact: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white px-3 py-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className="rounded-full p-2 text-violet-600"
          onClick={props.onPrev}
          aria-label="Período anterior"
        >
          <ArrowLeft className="size-4" />
        </button>
        <p className="min-w-0 flex-1 text-center text-[13px] font-semibold tabular-nums leading-tight text-slate-900">
          {props.weekRangeLabelCompact}
        </p>
        <button
          type="button"
          className="rounded-full p-2 text-violet-600"
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
          "max-w-[78%] text-[11px] font-bold uppercase tracking-[0.08em]",
          props.accent ? "text-violet-600" : "text-slate-500",
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

export type MobileJobCardVariant = "default" | "timeline";

export function MobileStandardJobCard(props: {
  event: UiCalendarEvent;
  onOpen: () => void;
  variant?: MobileJobCardVariant;
}) {
  const { event, variant = "default" } = props;
  const tone = STATUS_BADGE_ROW[event.visualStatus];
  const pinText = getMobilePinLineText(event);
  const showMapCta =
    Boolean(event.locationLine?.trim()) && event.mode !== "REMOTE";
  const descriptionTitle = getMobileCardDescriptionTitle(event);
  const subtitle = `${event.jobKindLabel} · ${event.durationLabel}`;

  const tooltip = [
    event.company,
    descriptionTitle,
    subtitle,
    `${event.startLabel} — ${event.endLabel}`,
    pinText,
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
        "w-full cursor-pointer rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/90 p-5 text-left shadow-sm transition active:scale-[0.99]",
        bookingStatusBorderClass(event.bookingStatus),
      )}
    >
      <div className="border-b border-slate-100 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-xs font-bold text-slate-500">
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
            <p className="truncate text-[15px] font-semibold leading-tight text-slate-900">
              {event.company}
            </p>
            <span
              className={cn(
                "mt-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                tone.bg,
                tone.text,
              )}
            >
              <span className={cn("size-1.5 shrink-0 rounded-full", tone.dot)} />
              {VISUAL_STATUS_BADGE_LABEL[event.visualStatus]}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1 border-b border-slate-100 py-4">
        <p className="text-[13px] font-medium text-slate-600">{subtitle}</p>
        <p className="text-[15px] font-semibold leading-snug text-slate-900">
          {descriptionTitle}
        </p>
      </div>

      <div className="space-y-2 pt-4 text-[13px] text-slate-600">
        {variant === "timeline" ? null : (
          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-slate-400" aria-hidden />
            <span className="truncate">
              {event.startLabel} — {event.endLabel} · {event.durationLabel}
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <MapPin className="size-4 shrink-0 text-slate-400" aria-hidden />
          <span className="truncate">{pinText}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="min-w-0">
          {showMapCta ? (
            <button
              type="button"
              className="text-[13px] font-semibold text-violet-600"
              onClick={(e) => {
                e.stopPropagation();
                openMapsQuery(event.locationLine!.trim());
              }}
            >
              Abrir no mapa
            </button>
          ) : null}
        </div>
        <span className="shrink-0 text-[13px] font-semibold text-violet-600">
          Ver detalhes
        </span>
      </div>
    </div>
  );
}

export function MobileTimelineEventRow(props: {
  event: UiCalendarEvent;
  onOpen: () => void;
  isLast: boolean;
}) {
  const { event, isLast } = props;
  return (
    <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-2">
      <div className="pt-1 text-left">
        <span className="text-xs tabular-nums leading-none text-slate-500">
          {event.startLabel}
        </span>
      </div>
      <div className="flex min-w-0 gap-2 pb-6">
        <div className="flex w-2 shrink-0 flex-col items-center pt-1.5">
          <span
            className="size-2 shrink-0 rounded-full bg-neutral-400"
            aria-hidden
          />
          {!isLast ? (
            <span
              className="mt-1.5 w-px flex-1 min-h-[20px] bg-neutral-200"
              aria-hidden
            />
          ) : (
            <span className="mt-1.5 h-1.5" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <MobileStandardJobCard
            event={event}
            onOpen={props.onOpen}
            variant="timeline"
          />
        </div>
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
