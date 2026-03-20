import { ArrowRight, CalendarDays } from "lucide-react";
import type { CreatorProfile } from "../../types";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type CreatorServicesSectionProps = {
  availabilityDays: string[];
  availabilityTimeSlots: string[];
  selectedAvailableDay: string | null;
  onSelectAvailableDay: (day: string | null) => void;
  workingHours: {
    start: string;
    end: string;
    slotDurationMinutes: number;
  };
  profile: CreatorProfile;
  selectedServiceId: string;
  onSelectService: (id: string) => void;
};

type CalendarDay = {
  dayNumber: number;
  isCurrentMonth: boolean;
  isAvailable: boolean;
};

const WEEK_DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

function buildCalendarDays(availabilityDays: string[]) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstWeekDay = firstDay.getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const availableSet = new Set(
    availabilityDays
      .map((day) => Number.parseInt(day, 10))
      .filter((day) => Number.isInteger(day) && day > 0 && day <= 31)
  );

  const items: CalendarDay[] = [];
  for (let i = 0; i < firstWeekDay; i += 1) {
    items.push({ dayNumber: 0, isCurrentMonth: false, isAvailable: false });
  }

  for (let day = 1; day <= totalDaysInMonth; day += 1) {
    items.push({
      dayNumber: day,
      isCurrentMonth: true,
      isAvailable: availableSet.has(day),
    });
  }

  while (items.length % 7 !== 0) {
    items.push({ dayNumber: 0, isCurrentMonth: false, isAvailable: false });
  }

  return items;
}

function getMonthLabel() {
  return new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

export function CreatorServicesSection({
  availabilityDays,
  availabilityTimeSlots,
  selectedAvailableDay,
  onSelectAvailableDay,
  workingHours,
  profile,
  selectedServiceId,
  onSelectService,
}: CreatorServicesSectionProps) {
  const calendarDays = buildCalendarDays(availabilityDays);

  return (
    <section className="rounded-[32px] border border-[rgba(137,90,246,0.1)] bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:rounded-[48px] lg:border-2 lg:p-6 lg:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
      <h3 className="mb-4 text-lg font-bold text-[#0f172a] lg:text-xl">
        Reservar Criador
      </h3>

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-[#334155]">Agenda livre para gravação</p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-[#64748b]">
            <CalendarDays className="h-3.5 w-3.5" />
            {getMonthLabel()}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {WEEK_DAYS.map((weekDay) => (
            <span
              key={weekDay}
              className="text-center text-[10px] font-bold text-[#94a3b8]"
            >
              {weekDay}
            </span>
          ))}
          {calendarDays.map((day, index) => {
            const dayText = String(day.dayNumber);
            const isSelected = selectedAvailableDay === dayText;

            return (
              <button
                key={`${day.dayNumber}-${index}`}
                type="button"
                disabled={!day.isCurrentMonth || !day.isAvailable}
                onClick={() => onSelectAvailableDay(dayText)}
                className={cn(
                  "flex h-8 items-center justify-center rounded-md text-xs font-bold transition",
                  !day.isCurrentMonth && "pointer-events-none opacity-0",
                  day.isCurrentMonth &&
                    (day.isAvailable
                      ? "bg-[#895af6] text-white"
                      : "bg-[#f1f5f9] text-[#94a3b8]"),
                  day.isAvailable && "cursor-pointer",
                  isSelected && "ring-2 ring-[#0f172a] ring-offset-1"
                )}
              >
                {day.dayNumber > 0 ? day.dayNumber : ""}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-3 text-[11px] text-[#64748b]">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#895af6]" />
            Livre
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#cbd5e1]" />
            Indisponível
          </span>
        </div>

        <div className="mt-4 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-3">
          <p className="mb-2 text-xs font-semibold text-[#334155]">
            Horários livres{" "}
            {selectedAvailableDay ? `dia ${selectedAvailableDay}` : ""}
          </p>
          <p className="mb-3 text-[11px] text-[#64748b]">
            Expediente: {workingHours.start} - {workingHours.end}
          </p>
          {selectedAvailableDay && availabilityTimeSlots.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availabilityTimeSlots.map((slot) => (
                <span
                  key={slot}
                  className="rounded-full border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs font-semibold text-[#334155]"
                >
                  {slot}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#64748b]">
              Selecione um dia livre para ver os horários.
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-[#334155]">Serviços</p>
          <span className="rounded-full bg-[rgba(137,90,246,0.1)] px-2 py-1 text-xs font-bold text-[#895af6] lg:hidden">
            {profile.services.length} opções
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {profile.services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-[48px] border p-3 text-left transition",
                selectedServiceId === service.id
                  ? "border-[#895af6] bg-[rgba(137,90,246,0.05)]"
                  : "border-[#e2e8f0]"
              )}
            >
              <span className="text-sm font-medium text-[#0f172a]">
                {service.name}
              </span>
              <span className="text-sm font-bold text-[#895af6]">
                R$ {service.price}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="purple"
        className="hidden h-14 w-full gap-2 rounded-full text-lg font-bold lg:flex"
      >
        Solicitar Job
        <ArrowRight className="h-5 w-5" />
      </Button>
      <p className="mt-4 text-center text-[11px] leading-[18px] text-[#94a3b8]">
        Ao solicitar o job, você inicia uma conversa segura com a criadora. O
        pagamento só é liberado após a aprovação final do vídeo.
      </p>
    </section>
  );
}
