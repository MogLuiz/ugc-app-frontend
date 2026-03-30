import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

const CARD_SHADOW =
  "0px 4px 6px -1px rgba(106,54,213,0.04), 0px 20px 40px -1px rgba(44,47,48,0.08)";

/**
 * Superfície de card para dashboards (creator e business): borda, radius e sombra
 * alinhados ao DS — sem lógica de domínio.
 */
export function DashboardCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-[rgba(106,54,213,0.08)] bg-white p-5 lg:rounded-[32px] lg:p-6",
        className
      )}
      style={{ boxShadow: CARD_SHADOW }}
    >
      {children}
    </section>
  );
}
