import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

const CARD_SHADOW_BRAND =
  "0px 4px 6px -1px rgba(106,54,213,0.04), 0px 20px 40px -1px rgba(44,47,48,0.08)";

/** Sombra neutra (sem tint roxo) — alinhada a empty states / listas na dashboard creator. */
const CARD_SHADOW_NEUTRAL =
  "0px 4px 6px -1px rgba(15,23,42,0.05), 0px 16px 32px -4px rgba(15,23,42,0.08)";

export type DashboardCardShadowTone = "brand" | "neutral";

/**
 * Superfície de card para dashboards (creator e business): borda, radius e sombra
 * alinhados ao DS — sem lógica de domínio.
 */
export function DashboardCard({
  children,
  className,
  shadowTone = "brand",
}: {
  children: ReactNode;
  className?: string;
  /** `neutral` remove o halo roxo da sombra (seções tipo convites / empty compact). */
  shadowTone?: DashboardCardShadowTone;
}) {
  const boxShadow = shadowTone === "neutral" ? CARD_SHADOW_NEUTRAL : CARD_SHADOW_BRAND;

  return (
    <section
      className={cn(
        "rounded-[28px] border border-[rgba(106,54,213,0.08)] bg-white p-5 lg:rounded-[32px] lg:p-6",
        shadowTone === "neutral" && "border-slate-100",
        className
      )}
      style={{ boxShadow }}
    >
      {children}
    </section>
  );
}
