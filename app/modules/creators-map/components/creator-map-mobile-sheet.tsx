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
const SHEET_TOP_CLEARANCE = 8;
const SHEET_CHROME_HEIGHT = 96;
const SHEET_CONTENT_BOTTOM_PADDING = 12;

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

  function openSheet() {
    setState("medium");
  }

  function collapseSheet() {
    setState("collapsed");
  }

  function handleArrowAction(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    if (state === "collapsed") {
      openSheet();
      return;
    }

    collapseSheet();
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

  const visibleHeight = `calc(${PEEK_HEIGHTS[state]} + ${bottomOffset})`;
  const translateY = `calc(100% - ${visibleHeight})`;
  const maxHeight = `calc(100dvh - ${SHEET_TOP_CLEARANCE}px)`;
  const listMaxHeight =
    state === "expanded"
      ? `calc(${maxHeight} - ${SHEET_CHROME_HEIGHT}px - ${bottomOffset})`
      : "calc(44dvh - 96px)";
  const containerPaddingBottom = bottomOffset;
  const listPaddingBottom = `${SHEET_CONTENT_BOTTOM_PADDING}px`;

  return (
    <div
      className="fixed left-0 right-0 z-30 overflow-hidden rounded-t-[28px] border border-slate-200/80 bg-white/98 shadow-[0_-18px_48px_rgba(15,23,42,0.14)] backdrop-blur-xl"
      style={{
        bottom: 0,
        transform: `translateY(${translateY})`,
        transition: "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)",
        maxHeight,
        paddingBottom: containerPaddingBottom,
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Handle + header */}
      <div
        className={cn(
          "block w-full bg-white/90 text-left",
          state === "collapsed" && "cursor-pointer",
        )}
      >
        <div className="flex items-center justify-center pb-2 pt-3">
          <div className="h-1.5 w-11 rounded-full bg-slate-200" />
        </div>

        <div
          className={cn(
            "flex items-center justify-between px-4 pb-3",
            state === "collapsed" ? "pt-0" : "border-b border-slate-100/80 pt-0",
          )}
        >
          <button
            type="button"
            onClick={state === "collapsed" ? openSheet : undefined}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2 text-left",
              state === "collapsed" && "cursor-pointer",
            )}
            aria-label={state === "collapsed" ? "Abrir lista de creators próximos" : undefined}
          >
            <div className="h-2 w-2 animate-pulse rounded-full bg-purple-500" />
            <span className="truncate text-[15px] font-semibold text-slate-900">
              {creators.length} creators próximos
            </span>
          </button>

          <button
            type="button"
            onClick={handleArrowAction}
            className="ml-3 shrink-0 rounded-full border border-slate-200/80 bg-white p-2 text-slate-500 transition hover:bg-slate-50"
            aria-label={state === "collapsed" ? "Expandir lista" : "Recolher lista"}
          >
            {state === "collapsed" ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
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
          maxHeight: listMaxHeight,
          paddingBottom: listPaddingBottom,
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
              if (state === "collapsed") openSheet();
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
