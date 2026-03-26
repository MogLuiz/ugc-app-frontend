import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { openMapsQuery } from "~/lib/maps";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { CalendarJobDetailsBody } from "./calendar-job-details-body";

type MobileJobSheetProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

/** Detalhes do compromisso (mobile). Timeline com Livre/Agora: `mobile-agenda-ui` + `creator-calendar-mobile`. */
export function MobileJobSheet({ controller }: MobileJobSheetProps) {
  const { state, selectedEvent, viewModel, actions } = controller;
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!state.isMobileSheetOpen || !selectedEvent) {
      setEntered(false);
      return;
    }
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [state.isMobileSheetOpen, selectedEvent?.id]);

  if (!state.isMobileSheetOpen || !selectedEvent) {
    return null;
  }

  const mapsQuery =
    selectedEvent.locationLine?.trim() && selectedEvent.mode !== "REMOTE"
      ? selectedEvent.locationLine.trim()
      : null;

  const timeZone = viewModel?.timeZone ?? "America/Sao_Paulo";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/40 backdrop-blur-[2px]">
      <button
        type="button"
        className="flex-1 border-0 bg-transparent"
        aria-label="Fechar"
        onClick={() => actions.closeEventDetails()}
      />
      <div
        className={cn(
          "max-h-[88vh] overflow-y-auto rounded-t-[28px] border border-slate-200/80 bg-[#fafafa] px-5 pb-8 pt-3 shadow-[0_-12px_40px_rgba(15,23,42,0.12)] transition-transform duration-150 ease-out",
          entered ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Compromisso</h3>
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-9 shrink-0 rounded-full p-0"
            onClick={() => actions.closeEventDetails()}
            aria-label="Fechar"
          >
            <X className="size-5" />
          </Button>
        </div>
        <CalendarJobDetailsBody
          event={selectedEvent}
          layout="sheet"
          timeZone={timeZone}
          isAccepting={state.isAccepting}
          onAccept={
            selectedEvent.origin === "BOOKING" &&
            selectedEvent.bookingStatus === "PENDING"
              ? () => void actions.acceptPendingBooking(selectedEvent.id)
              : undefined
          }
          onChat={
            selectedEvent.origin === "CONTRACT_REQUEST" &&
            selectedEvent.contractRequestId
              ? () =>
                  actions.openChatForContract(selectedEvent.contractRequestId!)
              : undefined
          }
          onOpenFullCampaign={
            selectedEvent.contractRequestId
              ? () =>
                  actions.openFullCampaign(
                    selectedEvent.contractRequestId!,
                    selectedEvent,
                  )
              : undefined
          }
          onOpenMaps={
            mapsQuery ? () => openMapsQuery(mapsQuery) : undefined
          }
        />
      </div>
    </div>
  );
}
