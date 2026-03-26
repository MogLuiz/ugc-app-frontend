import { Link } from "react-router";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";

export type CompanyPreviewProps = {
  name: string;
  photoUrl?: string | null;
  rating?: number | null;
  profileHref?: string;
  profileLinkState?: unknown;
  profileButtonLabel?: string;
  className?: string;
  compact?: boolean;
};

export function CompanyPreview({
  name,
  photoUrl,
  rating,
  profileHref,
  profileLinkState,
  profileButtonLabel = "Ver perfil da empresa",
  className,
  compact,
}: CompanyPreviewProps) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const ratingText =
    rating != null && Number.isFinite(rating)
      ? rating.toLocaleString("pt-BR", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : null;

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm",
        compact && "p-3",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            initial
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900">{name}</p>
          {ratingText ? (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-600">
              <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
              <span>{ratingText}</span>
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-slate-400">Sem avaliações</p>
          )}
        </div>
      </div>
      {profileHref ? (
        <Link
          to={profileHref}
          state={profileLinkState}
          className="mt-3 flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
        >
          {profileButtonLabel}
        </Link>
      ) : null}
    </div>
  );
}
