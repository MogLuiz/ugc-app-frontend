import { useEffect } from "react";
import { Link } from "react-router";
import { toast } from "~/components/ui/toast";
import { useConfirmCompletionMutation } from "~/modules/contract-requests/queries";
import { getInitials } from "~/modules/contract-requests/utils";
import type { PendingActionVm } from "../../types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: PendingActionVm | null;
};

export function ConfirmCompletionDialog({ open, onOpenChange, item }: Props) {
  const confirmMutation = useConfirmCompletionMutation();
  const titleId = "confirm-dialog-title";

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

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

  async function handleConfirm() {
    if (!item) return;
    try {
      await confirmMutation.mutateAsync(item.id);
      toast.success("Serviço confirmado com sucesso.");
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Não foi possível confirmar o serviço.",
      );
    }
  }

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
        <div className="mb-5 flex items-center gap-3">
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

        <h2 id={titleId} className="mb-5 text-base font-bold text-[#2c2f30]">
          Você realizou este serviço?
        </h2>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            className="inline-flex w-full items-center justify-center rounded-[32px] bg-[#6a36d5] py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#5a2bc5] disabled:opacity-60"
            onClick={handleConfirm}
            disabled={confirmMutation.isPending}
          >
            {confirmMutation.isPending ? "Confirmando..." : "Confirmar realização"}
          </button>

          <Link
            to={`/ofertas/${item.id}`}
            onClick={() => onOpenChange(false)}
            className="text-center text-sm text-[#595c5d] underline-offset-2 hover:underline"
          >
            Abrir detalhes para reportar problema
          </Link>
        </div>
      </div>
    </div>
  );
}
