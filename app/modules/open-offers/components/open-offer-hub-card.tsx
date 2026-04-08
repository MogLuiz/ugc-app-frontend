import { CalendarDays, ChevronRight, Clock3, MapPin } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { formatDateShort, formatDuration } from "~/modules/contract-requests/utils";
import { formatOfferMoney } from "../helpers";
import type { OpenOfferListItemViewModel } from "../types";

function labelClass(label: OpenOfferListItemViewModel["visualLabel"]) {
  return label === "Oferta aberta"
    ? "bg-[#895af6]/10 text-[#6a36d5]"
    : "bg-amber-100 text-amber-800";
}

export function OpenOfferHubCard({
  item,
  onClick,
}: {
  item: OpenOfferListItemViewModel;
  onClick?: () => void;
}) {
  const dateLabel = item.startsAt ? formatDateShort(item.startsAt) : "Data a combinar";
  const timeLabel = item.startsAt
    ? new Date(item.startsAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Horário a combinar";
  const durationLabel = item.durationMinutes ? formatDuration(item.durationMinutes) : null;

  return (
    <article
      className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:p-6"
      onClick={onClick}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={cn(
              "inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em]",
              labelClass(item.visualLabel)
            )}
          >
            {item.visualLabel}
          </span>
          <h3 className="mt-3 text-lg font-black tracking-[-0.02em] text-slate-900">
            {item.title}
          </h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">{item.subtitle}</p>
        </div>

        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Valor bruto
          </p>
          <p className="mt-2 text-2xl font-black text-[#6a36d5]">
            {formatOfferMoney(item.amount)}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-[22px] bg-[#f6f5f8] p-4">
        <p className="text-sm leading-6 text-slate-700">{item.description}</p>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-[#895af6]" />
          <span>
            {dateLabel} · {timeLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="size-4 text-[#895af6]" />
          <span>{durationLabel ?? "Duração a combinar"}</span>
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <MapPin className="size-4 text-[#895af6]" />
          <span className="truncate">{item.address}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          {item.statusLabel}
        </div>
        {item.href ? (
          <Link
            to={item.href}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Ver detalhes
            <ChevronRight className="size-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
}
