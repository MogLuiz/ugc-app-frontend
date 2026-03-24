import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { CalendarJobDetailsBody } from "./calendar-job-details-body";

type CalendarJobDetailsPanelProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

export function CalendarJobDetailsPanel({
  controller,
}: CalendarJobDetailsPanelProps) {
  const { state, selectedEvent, actions } = controller;

  if (!state.isDesktopPanelOpen || !selectedEvent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40">
      <button
        type="button"
        className="h-full flex-1 cursor-default border-0 bg-transparent"
        aria-label="Fechar painel"
        onClick={() => actions.closeEventDetails()}
      />
      <aside className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-900">Detalhes do job</h3>
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-9 shrink-0 rounded-full p-0"
            onClick={() => actions.closeEventDetails()}
            aria-label="Fechar"
          >
            <X className="size-5" />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <CalendarJobDetailsBody
            event={selectedEvent}
            layout="panel"
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
      </aside>
    </div>
  );
}
