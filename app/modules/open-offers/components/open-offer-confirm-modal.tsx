import { AlertTriangle, X } from "lucide-react";
import { Button } from "~/components/ui/button";

type OpenOfferConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: "danger" | "primary";
  isSubmitting?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function OpenOfferConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  tone = "primary",
  isSubmitting = false,
  onConfirm,
  onClose,
}: OpenOfferConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <AlertTriangle className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">{title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Fechar"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Voltar
          </Button>
          <Button
            variant={tone === "danger" ? "primary" : "purple"}
            className={tone === "danger" ? "bg-rose-600 hover:bg-rose-700" : undefined}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
