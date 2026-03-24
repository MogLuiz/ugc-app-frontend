import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { CalendarJobDetailsBody } from "./calendar-job-details-body";

type MobileJobSheetProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

export function MobileJobSheet({ controller }: MobileJobSheetProps) {
  const { state, selectedEvent, actions } = controller;

  if (!state.isMobileSheetOpen || !selectedEvent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/50">
      <button
        type="button"
        className="flex-1 border-0 bg-transparent"
        aria-label="Fechar"
        onClick={() => actions.closeEventDetails()}
      />
      <div className="max-h-[85vh] overflow-y-auto rounded-t-[28px] bg-white px-5 pb-8 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Job</h3>
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
        />
      </div>
    </div>
  );
}
