import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "~/lib/utils";

export type ProfileProgressItem = { label: string; done: boolean };
export type ProfileProgress = {
  percent: number;
  completedCount: number;
  items: ProfileProgressItem[];
};

export function ProfileProgressBlock({
  percent,
  completedCount,
  items,
}: ProfileProgress) {
  const allDone = completedCount === items.length;

  return (
    <section className="flex flex-col gap-4 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">
          Conclusão do Perfil
        </h3>
        <span className="rounded-full bg-[rgba(137,90,246,0.1)] px-2.5 py-0.5 text-xs font-bold text-[#895af6]">
          {completedCount}/{items.length} itens
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
        <div
          className="h-full rounded-full bg-[#895af6] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="text-xs text-[#64748b]">
        {allDone
          ? "Perfil completo! Você está pronto para receber e aplicar para ofertas."
          : "Complete seu perfil para aparecer para empresas e liberar candidaturas."}
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            {item.done ? (
              <CheckCircle2 className="size-4 shrink-0 text-[#895af6]" />
            ) : (
              <Circle className="size-4 shrink-0 text-slate-300" />
            )}
            <span
              className={cn(
                "text-xs leading-tight",
                item.done ? "font-medium text-[#0f172a]" : "text-slate-400",
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
