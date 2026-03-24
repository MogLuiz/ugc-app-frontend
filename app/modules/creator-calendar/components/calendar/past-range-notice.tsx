import { cn } from "~/lib/utils";
import type { CalendarRangePastNotice } from "../../types";

type Props = {
  notice: CalendarRangePastNotice;
  className?: string;
};

export function PastRangeNotice({ notice, className }: Props) {
  if (notice === "none") {
    return null;
  }

  const text =
    notice === "full"
      ? "Você está vendo um período que já encerrou."
      : "Parte deste intervalo já passou — os dias anteriores a hoje aparecem só como referência.";

  return (
    <div
      role="status"
      className={cn(
        "rounded-2xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm leading-snug text-amber-950",
        className,
      )}
    >
      {text}
    </div>
  );
}
