import type { ReactNode } from "react";
import { ExternalLink, MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "~/components/ui/button";
import { CompanyPreview } from "~/components/company/company-preview";
import { cn } from "~/lib/utils";
import {
  formatDayMonthCompactInTimeZone,
  formatWeekdayLongInTimeZone,
  formatWeekdayShortInTimeZone,
} from "../../lib/calendar-tz";
import { VISUAL_STATUS_BADGE_LABEL } from "../../lib/calendar-view-model";
import type { UiCalendarEvent } from "../../types";
import {
  getMobileCardDescriptionTitle,
  getMobilePinLineText,
} from "../../lib/calendar-display";

type CalendarJobDetailsBodyProps = {
  event: UiCalendarEvent;
  timeZone?: string;
  onAccept?: () => void;
  onChat?: () => void;
  onOpenFullCampaign?: () => void;
  onOpenMaps?: () => void;
  isAccepting?: boolean;
  layout?: "panel" | "sheet";
};

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </h4>
  );
}

export function CalendarJobDetailsBody({
  event,
  timeZone = "America/Sao_Paulo",
  onAccept,
  onChat,
  onOpenFullCampaign,
  onOpenMaps,
  isAccepting,
  layout = "panel",
}: CalendarJobDetailsBodyProps) {
  const isSheet = layout === "sheet";
  const showAccept =
    event.origin === "BOOKING" && event.bookingStatus === "PENDING" && onAccept;
  const showChat =
    event.origin === "CONTRACT_REQUEST" &&
    Boolean(event.contractRequestId) &&
    onChat;
  const showFullCampaign =
    Boolean(event.contractRequestId) && onOpenFullCampaign;
  const showMaps =
    Boolean(onOpenMaps) && event.mode !== "REMOTE";
  const endedInPast = event.endAt.getTime() < Date.now();

  const weekday = formatWeekdayLongInTimeZone(event.startAt, timeZone);

  const addressLine =
    event.locationLine?.trim() || event.modeLine;

  const headerTitle = isSheet
    ? getMobileCardDescriptionTitle(event)
    : event.title;

  const pinSheet = getMobilePinLineText(event);
  const showPinSheetRow =
    isSheet && pinSheet.trim() !== addressLine.trim();

  return (
    <div className="space-y-6">
      {endedInPast ? (
        <p
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-snug text-slate-700"
          role="status"
        >
          Este compromisso já ocorreu — o horário exibido está no passado.
        </p>
      ) : null}

      <header className="space-y-3">
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
            event.visualStatus === "confirmed" &&
              "bg-emerald-100 text-emerald-800",
            event.visualStatus === "pending" && "bg-amber-100 text-amber-900",
            event.visualStatus === "completed" &&
              "bg-slate-100 text-slate-700",
            event.visualStatus === "cancelled" && "bg-red-100 text-red-900",
          )}
        >
          {VISUAL_STATUS_BADGE_LABEL[event.visualStatus]}
        </span>
        <div>
          <h2
            className={cn(
              "font-bold tracking-tight text-slate-900",
              isSheet ? "text-xl" : "text-2xl",
            )}
          >
            {event.company}
          </h2>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {event.jobKindLabel}
          </p>
          <p className="mt-2 text-base font-semibold text-slate-800">
            {headerTitle}
          </p>
        </div>
      </header>

      {isSheet ? (
        <section className="space-y-2.5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <SectionTitle>Horário</SectionTitle>
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <span aria-hidden>📅</span>
            <span>
              {formatWeekdayShortInTimeZone(event.startAt, timeZone)} •{" "}
              {formatDayMonthCompactInTimeZone(event.startAt, timeZone)}
            </span>
          </p>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <span aria-hidden>🕒</span>
            <span>
              {event.startLabel} — {event.endLabel}
            </span>
          </p>
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <span aria-hidden>⏱</span>
            <span>{event.durationLabel}</span>
          </p>
        </section>
      ) : (
        <section className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <SectionTitle>Horário</SectionTitle>
          <p className="text-sm font-semibold capitalize text-slate-800">
            {weekday}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock className="size-4 shrink-0 text-slate-400" aria-hidden />
            <span>
              {event.startLabel} — {event.endLabel}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Duração: {event.durationLabel}
          </p>
        </section>
      )}

      {isSheet ? (
        <section className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <SectionTitle>Local</SectionTitle>
          <div className="flex items-start gap-2 text-sm text-slate-700">
            <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
            <span>{addressLine}</span>
          </div>
          {showPinSheetRow ? (
            <p className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <MapPin className="size-4 shrink-0 text-slate-400" aria-hidden />
              <span>{pinSheet}</span>
            </p>
          ) : null}
        </section>
      ) : (
        <section className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <SectionTitle>Local</SectionTitle>
          <div className="flex items-start gap-2 text-sm text-slate-700">
            <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden />
            <span>{addressLine}</span>
          </div>
          {event.distanceLabel ? (
            <p className="text-sm font-medium text-slate-600">
              Distância: {event.distanceLabel}
            </p>
          ) : null}
        </section>
      )}

      <section className="space-y-3">
        <SectionTitle>Empresa</SectionTitle>
        <CompanyPreview
          name={event.company}
          photoUrl={event.companyPhotoUrl}
          rating={event.companyRating}
          profileHref={`/empresa/${event.companyUserId}`}
          profileButtonLabel={
            isSheet ? "Ver empresa →" : "Ver perfil da empresa"
          }
          profileLinkClassName={
            isSheet
              ? "mt-2 inline-flex w-full items-center justify-end text-sm font-semibold text-violet-600 transition hover:text-violet-800"
              : undefined
          }
          profileLinkState={{
            companyName: event.company,
            companyPhotoUrl: event.companyPhotoUrl,
            companyRating: event.companyRating,
          }}
        />
      </section>

      {event.description ? (
        <section className="space-y-2">
          <SectionTitle>Descrição</SectionTitle>
          <p className="text-sm leading-relaxed text-slate-700">
            {event.description}
          </p>
        </section>
      ) : null}

      {event.notes ? (
        <section className="space-y-2">
          <SectionTitle>Notas</SectionTitle>
          <p className="text-sm leading-relaxed text-slate-700">{event.notes}</p>
        </section>
      ) : null}

      <section className="space-y-2 pt-1">
        <SectionTitle>Ações</SectionTitle>
        <div className="flex flex-col gap-2">
          {showAccept ? (
            <Button
              variant="purple"
              className="w-full rounded-full"
              disabled={isAccepting}
              onClick={() => onAccept?.()}
            >
              {isAccepting ? "Confirmando..." : "Confirmar presença"}
            </Button>
          ) : null}
          {showChat ? (
            <Button
              variant="primary"
              className="w-full rounded-full gap-2"
              onClick={() => onChat?.()}
            >
              <MessageCircle className="size-4" />
              Abrir conversa
            </Button>
          ) : null}
          {showFullCampaign ? (
            <Button
              variant="outline"
              className="w-full rounded-full gap-2"
              onClick={() => onOpenFullCampaign?.()}
            >
              <ExternalLink className="size-4" />
              Ver campanha completa
            </Button>
          ) : null}
          {showMaps ? (
            <Button
              variant="outline"
              className="w-full rounded-full gap-2"
              onClick={() => onOpenMaps?.()}
            >
              <MapPin className="size-4" />
              Abrir no Maps
            </Button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
