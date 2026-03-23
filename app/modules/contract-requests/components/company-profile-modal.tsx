import { Star } from "lucide-react";
import { cn } from "~/lib/utils";
import type { ContractRequestItem } from "../types";

type CompanyProfileModalProps = {
  item: ContractRequestItem | null;
  onClose: () => void;
};

export function CompanyProfileModal({ item, onClose }: CompanyProfileModalProps) {
  if (!item) return null;

  const name = item.companyName ?? "Empresa";
  const logoUrl = item.companyLogoUrl;
  const hasRating = item.companyRating != null && item.companyRating > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={cn(
          "w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="company-profile-title"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f1f0f3]">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-slate-400">
                {name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <h2 id="company-profile-title" className="text-lg font-bold text-slate-900">
            {name}
          </h2>
          {hasRating && (
            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">
                {item.companyRating!.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
