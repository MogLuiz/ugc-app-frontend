import { useEffect, useRef } from "react";
import { ReviewForm } from "~/modules/contract-requests/components/ReviewForm";
import { getInitials } from "~/modules/contract-requests/utils";
import type { PendingActionVm } from "../../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: PendingActionVm | null;
};

export function ReviewDialog({ open, onOpenChange, item }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleId = "review-dialog-title";

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [open, onOpenChange]);

  if (!open || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4"
      onClick={() => onOpenChange(false)}
      aria-hidden="false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          {item.companyLogoUrl ? (
            <img
              src={item.companyLogoUrl}
              alt=""
              className="size-12 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#6a36d5]/10 text-sm font-bold text-[#6a36d5]">
              {getInitials(item.companyName)}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[#2c2f30]">{item.companyName}</p>
            <p className="truncate text-sm text-[#595c5d]">{item.title}</p>
            {item.dateLabel ? (
              <p className="mt-0.5 text-xs text-[#595c5d]/70">{item.dateLabel}</p>
            ) : null}
          </div>
        </div>

        <h2
          id={titleId}
          ref={titleRef}
          tabIndex={-1}
          className="mb-4 text-base font-bold text-[#2c2f30] outline-none"
        >
          Avaliar empresa
        </h2>

        {/* key={item.id} garante remount ao trocar de item, limpando o estado interno do form */}
        <ReviewForm
          key={item.id}
          contractRequestId={item.id}
          onSuccess={() => onOpenChange(false)}
        />
      </div>
    </div>
  );
}
