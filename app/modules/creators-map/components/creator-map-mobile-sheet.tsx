import { useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CreatorMapModel } from "../types";
import { CreatorMapCard } from "./creator-map-card";

export type SheetState = "collapsed" | "medium" | "expanded";

type CreatorMapMobileSheetProps = {
  creators: CreatorMapModel[];
  selectedCreatorId: string;
  onSelectCreator: (id: string) => void;
  state?: SheetState;
  onStateChange?: (state: SheetState) => void;
  bottomOffset?: string;
};

// How much of the sheet is visible in each state
const PEEK_HEIGHTS: Record<SheetState, string> = {
  collapsed: "76px",
  medium: "44dvh",
  expanded: "calc(100dvh - 96px)",
};

const STATE_ORDER: SheetState[] = ["collapsed", "medium", "expanded"];

export function CreatorMapMobileSheet({
  creators,
  selectedCreatorId,
  onSelectCreator,
  state: controlledState,
  onStateChange,
  bottomOffset = "72px",
}: CreatorMapMobileSheetProps) {
  const [uncontrolledState, setUncontrolledState] = useState<SheetState>("collapsed");
  const dragStartY = useRef<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Track whether the internal list was scrolled when drag started
  const listScrolledAtDragStart = useRef(false);
  const state = controlledState ?? uncontrolledState;

  function setState(nextState: SheetState | ((state: SheetState) => SheetState)) {
    const resolvedState =
      typeof nextState === "function" ? nextState(state) : nextState;

    if (controlledState === undefined) {
      setUncontrolledState(resolvedState);
    }

    onStateChange?.(resolvedState);
  }

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
  const maxHeight = `calc(100dvh - ${bottomOffset} - 20px)`;

  return (
    <div
      className="fixed left-0 right-0 z-30 overflow-hidden rounded-t-[28px] border border-slate-200/80 bg-white/98 shadow-[0_-18px_48px_rgba(15,23,42,0.14)] backdrop-blur-xl"
      style={{
        bottom: bottomOffset,
        transform: `translateY(${translateY})`,
        transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        maxHeight,
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Handle + tap zone */}
      <button
        type="button"
        onClick={handleHandleTap}
        className="flex w-full flex-col items-center bg-white/90 pb-2 pt-3"
        aria-label={state === "expanded" ? "Recolher lista" : "Expandir lista"}
      >
        <div className="h-1.5 w-11 rounded-full bg-slate-200" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100/80 px-4 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
          <span className="text-[15px] font-semibold text-slate-900">
            {creators.length} creators próximos
          </span>
        </div>

        <div className="flex items-center gap-1">
          {state === "collapsed" && (
            <span className="text-xs text-slate-400">Toque para abrir</span>
          )}
          {state === "medium" && (
            <button
              type="button"
              onClick={advance}
              className="rounded-full p-1.5 hover:bg-slate-100"
              aria-label="Expandir"
            >
              <ChevronUp size={16} className="text-slate-500" />
            </button>
          )}
          {state === "expanded" && (
            <button
              type="button"
              onClick={retreat}
              className="rounded-full p-1.5 hover:bg-slate-100"
              aria-label="Recolher"
            >
              <ChevronDown size={16} className="text-slate-500" />
            </button>
          )}
        </div>
      </div>

      {state === "collapsed" && (
        <div className="border-b border-slate-100/70 px-4 pb-3">
          <p className="text-xs text-slate-500">
            Deslize para ver todos os creators
          </p>
        </div>
      )}

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
          maxHeight:
            state === "expanded"
              ? `calc(${maxHeight} - 116px)`
              : "calc(44dvh - 108px)",
        }}
      >
        {creators.map((creator) => (
          <CreatorMapCard
            key={creator.id}
            creator={creator}
            isActive={creator.id === selectedCreatorId}
            variant="mobile"
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
