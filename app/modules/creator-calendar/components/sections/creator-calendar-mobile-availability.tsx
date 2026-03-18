import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { useCreatorCalendarController } from "../../hooks/use-creator-calendar-controller";
import { AvailabilitySwitch, TimeSelectField } from "./creator-calendar-controls";

type CreatorCalendarMobileAvailabilitySectionProps = {
  controller: ReturnType<typeof useCreatorCalendarController>;
};

export function MobileAvailabilitySection({
  controller,
}: CreatorCalendarMobileAvailabilitySectionProps) {
  return (
    <section className="space-y-6 pb-20">
      <div className="sticky top-0 z-20 border-b border-[rgba(137,90,246,0.08)] bg-[#f6f5f8]/95 px-4 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => controller.actions.setIsMobileAvailabilityOpen(false)}
            className="rounded-full p-2 text-slate-700"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h2 className="text-lg font-bold text-slate-900">Agenda</h2>
          <Button
            variant="purple"
            className="rounded-full px-5"
            onClick={controller.actions.saveMobileAvailability}
          >
            Salvar
          </Button>
        </div>
      </div>

      <div className="space-y-5 px-4">
        <p className="text-sm leading-6 text-slate-500">
          Defina os horarios em que voce esta disponivel para novos jobs. Voce pode
          replicar as configuracoes rapidamente.
        </p>

        <button
          type="button"
          onClick={controller.actions.syncWeekdays}
          className="flex w-full items-center justify-between rounded-[24px] bg-[#efe6ff] px-5 py-5 text-left"
        >
          <div>
            <p className="text-lg font-bold text-[#6d3ad8]">Sincronizar Semana</p>
            <p className="text-sm text-[#6d3ad8]/70">
              Replicar horarios para todos os dias ativos
            </p>
          </div>
          <ArrowLeft className="size-4 rotate-180 text-[#895af6]" />
        </button>

        <div className="space-y-4">
          {controller.viewModel.availabilityDays.map((day) => (
            <article
              key={day.id}
              className={cn(
                "rounded-[24px] p-5",
                day.enabled ? "bg-white shadow-sm" : "bg-transparent opacity-80"
              )}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    "text-2xl font-black tracking-[-0.03em]",
                    day.enabled ? "text-slate-900" : "text-slate-400"
                  )}
                >
                  {day.label}
                </h3>
                <AvailabilitySwitch
                  checked={day.enabled}
                  onChange={(checked) =>
                    controller.actions.updateAvailabilityDay(day.id, "enabled", checked)
                  }
                />
              </div>
              {day.enabled ? (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <TimeSelectField
                    label="Inicio"
                    value={day.start}
                    options={controller.viewModel.timeOptions}
                    onChange={(value) =>
                      controller.actions.updateAvailabilityDay(day.id, "start", value)
                    }
                  />
                  <TimeSelectField
                    label="Fim"
                    value={day.end}
                    options={controller.viewModel.timeOptions}
                    onChange={(value) =>
                      controller.actions.updateAvailabilityDay(day.id, "end", value)
                    }
                  />
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">Indisponivel para este dia</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
