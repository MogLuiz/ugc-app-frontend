import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { openMapsQuery } from "~/lib/maps";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { CalendarJobDetailsBody } from "./calendar-job-details-body";

type CalendarJobDetailsPanelProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

export function CalendarJobDetailsPanel({
  controller,
}: CalendarJobDetailsPanelProps) {
  const { state, selectedEvent, actions } = controller;
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!state.isDesktopPanelOpen || !selectedEvent) {
      setEntered(false);
      return;
    }
    setEntered(false);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, [state.isDesktopPanelOpen, selectedEvent?.id]);

  if (!state.isDesktopPanelOpen || !selectedEvent) {
    return null;
  }

  const mapsQuery =
    selectedEvent.locationLine?.trim() && selectedEvent.mode !== "REMOTE"
      ? selectedEvent.locationLine.trim()
      : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/25 backdrop-blur-[2px]">
      <button
        type="button"
        className="h-full flex-1 cursor-default border-0 bg-transparent"
        aria-label="Fechar painel"
        onClick={() => actions.closeEventDetails()}
      />
      <aside
        className={cn(
          "flex h-full w-full max-w-md flex-col border-l border-slate-200/80 bg-[#fafafa] shadow-2xl transition-transform duration-200 ease-out",
          entered ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-5 py-4">
          <h3 className="text-sm font-semibold tracking-tight text-slate-500">
            Detalhes
          </h3>
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
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <CalendarJobDetailsBody
            event={selectedEvent}
            timeZone={controller.viewModel?.timeZone ?? "America/Sao_Paulo"}
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
      </aside>
    </div>
  );
}
