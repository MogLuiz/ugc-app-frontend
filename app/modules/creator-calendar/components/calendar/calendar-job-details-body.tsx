import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { VISUAL_STATUS_BADGE_LABEL } from "../../lib/calendar-view-model";
import type { UiCalendarEvent } from "../../types";

type CalendarJobDetailsBodyProps = {
  event: UiCalendarEvent;
  onAccept?: () => void;
  onChat?: () => void;
  isAccepting?: boolean;
  layout?: "panel" | "sheet";
};

export function CalendarJobDetailsBody({
  event,
  onAccept,
  onChat,
  isAccepting,
  layout = "panel",
}: CalendarJobDetailsBodyProps) {
  const showAccept =
    event.origin === "BOOKING" && event.bookingStatus === "PENDING" && onAccept;
  const showChat =
    event.origin === "CONTRACT_REQUEST" &&
    Boolean(event.contractRequestId) &&
    onChat;
  const endedInPast = event.endAt.getTime() < Date.now();

  return (
    <div className="space-y-5">
      {endedInPast ? (
        <p
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-snug text-slate-700"
          role="status"
        >
          Este compromisso já ocorreu — o horário exibido está no passado.
        </p>
      ) : null}
      <div>
        <span
          className={cn(
            "inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
            event.visualStatus === "confirmed" &&
              "bg-violet-100 text-violet-800",
            event.visualStatus === "pending" && "bg-amber-100 text-amber-900",
            event.visualStatus === "completed" &&
              "bg-emerald-100 text-emerald-900",
            event.visualStatus === "cancelled" && "bg-red-100 text-red-900",
          )}
        >
          {VISUAL_STATUS_BADGE_LABEL[event.visualStatus]}
        </span>
        <h2
          className={cn(
            "mt-3 font-black tracking-[-0.03em] text-slate-900",
            layout === "sheet" ? "text-xl" : "text-2xl",
          )}
        >
          {event.company} — {event.jobTypeName}
        </h2>
        <p className="mt-1 text-lg font-bold text-slate-800">{event.title}</p>
      </div>

      <dl className="space-y-3 text-sm text-slate-600">
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Horário
          </dt>
          <dd className="mt-1 font-semibold text-slate-800">
            {event.startLabel} — {event.endLabel}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Local / modo
          </dt>
          <dd className="mt-1 font-semibold text-slate-800">
            {event.locationLine ?? event.modeLine}
          </dd>
        </div>
        {event.description ? (
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Descrição
            </dt>
            <dd className="mt-1 text-slate-700">{event.description}</dd>
          </div>
        ) : null}
        {event.notes ? (
          <div>
            <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Notas
            </dt>
            <dd className="mt-1 text-slate-700">{event.notes}</dd>
          </div>
        ) : null}
      </dl>

      <div className="flex flex-col gap-2 pt-2">
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
            variant="outline"
            className="w-full rounded-full"
            onClick={() => onChat?.()}
          >
            Ver conversa
          </Button>
        ) : null}
      </div>
    </div>
  );
}
