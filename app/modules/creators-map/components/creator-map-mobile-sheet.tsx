import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CreatorMapModel } from "../types";
import { CreatorMapCard } from "./creator-map-card";

type SheetState = "collapsed" | "medium" | "expanded";

type CreatorMapMobileSheetProps = {
  creators: CreatorMapModel[];
  selectedCreatorId: string;
  onSelectCreator: (id: string) => void;
  /** Height of the bottom nav bar including safe area (CSS value, e.g. "calc(56px + env(safe-area-inset-bottom))") */
  bottomOffset?: string;
};

// How much of the sheet is visible in each state
const PEEK_HEIGHTS: Record<SheetState, string> = {
  collapsed: "72px",
  medium: "45vh",
  expanded: "88vh",
};

const STATE_ORDER: SheetState[] = ["collapsed", "medium", "expanded"];

export function CreatorMapMobileSheet({
  creators,
  selectedCreatorId,
  onSelectCreator,
  bottomOffset = "calc(56px + env(safe-area-inset-bottom))",
}: CreatorMapMobileSheetProps) {
  const [state, setState] = useState<SheetState>("collapsed");
  const dragStartY = useRef<number | null>(null);
  const dragStartState = useRef<SheetState>("collapsed");
  const listRef = useRef<HTMLDivElement>(null);
  // Track whether the internal list was scrolled when drag started
  const listScrolledAtDragStart = useRef(false);

  function advance() {
    setState((s) => {
      const idx = STATE_ORDER.indexOf(s);
      return STATE_ORDER[Math.min(idx + 1, STATE_ORDER.length - 1)] ?? s;
    });
  }

  function retreat() {
    setState((s) => {
      const idx = STATE_ORDER.indexOf(s);
      return STATE_ORDER[Math.max(idx - 1, 0)] ?? s;
    });
  }

  function handleHandleTap() {
    setState((s) => {
      const idx = STATE_ORDER.indexOf(s);
      // Cycle: collapsed → medium → expanded → collapsed
      return STATE_ORDER[(idx + 1) % STATE_ORDER.length] ?? "collapsed";
    });
  }

  function onTouchStart(e: React.TouchEvent) {
    const touch = e.touches[0];
    if (!touch) return;
    dragStartY.current = touch.clientY;
    dragStartState.current = state;
    listScrolledAtDragStart.current = (listRef.current?.scrollTop ?? 0) > 4;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (dragStartY.current == null) return;
    const touch = e.touches[0];
    if (!touch) return;
    const delta = touch.clientY - dragStartY.current;

    if (listScrolledAtDragStart.current && delta > 0) return;

    if (Math.abs(delta) > 8) {
      e.preventDefault();
    }
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (dragStartY.current == null) return;
    const touch = e.changedTouches[0];
    if (!touch) return;

    const delta = touch.clientY - dragStartY.current;

    // If list was scrolled at drag start and we're dragging down, only allow sheet drag
    // if the list has been scrolled back to top
    if (listScrolledAtDragStart.current && delta > 0) {
      dragStartY.current = null;
      return;
    }

    const UP_THRESHOLD = 60;
    const DOWN_THRESHOLD = 60;

    if (delta < -UP_THRESHOLD) {
      advance();
    } else if (delta > DOWN_THRESHOLD) {
      retreat();
    }

    dragStartY.current = null;
  }

  const translateY = `calc(100% - ${PEEK_HEIGHTS[state]})`;

  return (
    <div
      className="fixed left-0 right-0 z-30 rounded-t-3xl bg-white shadow-[0_-8px_32px_rgba(15,23,42,0.1)]"
      style={{
        bottom: bottomOffset,
        transform: `translateY(${translateY})`,
        transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        // Max height so it doesn't overflow above the header
        maxHeight: "88vh",
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Handle + tap zone */}
      <button
        type="button"
        onClick={handleHandleTap}
        className="flex w-full flex-col items-center pb-2 pt-3"
        aria-label={state === "expanded" ? "Recolher lista" : "Expandir lista"}
      >
        <div className="h-1 w-10 rounded-full bg-slate-200" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
          <span className="text-sm font-semibold text-slate-900">
            {creators.length} creators próximos
          </span>
        </div>

        <div className="flex items-center gap-1">
          {state === "collapsed" && (
            <span className="text-xs text-slate-400">Deslize para ver</span>
          )}
          {state === "medium" && (
            <button
              type="button"
              onClick={advance}
              className="rounded-lg p-1 hover:bg-slate-100"
              aria-label="Expandir"
            >
              <ChevronUp size={16} className="text-slate-500" />
            </button>
          )}
          {state === "expanded" && (
            <button
              type="button"
              onClick={retreat}
              className="rounded-lg p-1 hover:bg-slate-100"
              aria-label="Recolher"
            >
              <ChevronDown size={16} className="text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {/* List — only shown when not collapsed */}
      <div
        ref={listRef}
        className={cn(
          "space-y-3 px-4 py-3",
          state === "collapsed"
            ? "hidden"
            : "overflow-y-auto",
        )}
        style={{
          // Ensure internal list has a bounded height so it scrolls
          maxHeight: state === "expanded"
            ? "calc(88vh - 100px)"
            : "calc(45vh - 100px)",
        }}
      >
        {creators.map((creator) => (
          <CreatorMapCard
            key={creator.id}
            creator={creator}
            isActive={creator.id === selectedCreatorId}
            onSelect={() => {
              onSelectCreator(creator.id);
              // Bring sheet to at least medium when selecting a creator
              if (state === "collapsed") setState("medium");
            }}
          />
        ))}
        {creators.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-400">
            Nenhum creator encontrado nesta área.
          </p>
        )}
      </div>
    </div>
  );
}
