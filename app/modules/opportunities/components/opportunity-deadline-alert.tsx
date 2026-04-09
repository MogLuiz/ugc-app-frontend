import { AlertCircle, CalendarClock } from "lucide-react";

interface OpportunityDeadlineAlertProps {
  deadlineDate: string;
  daysRemaining: number;
  className?: string;
}

export function OpportunityDeadlineAlert({
  deadlineDate,
  daysRemaining,
  className = "",
}: OpportunityDeadlineAlertProps) {
  const isCritical = daysRemaining <= 1;
  const isUrgent = daysRemaining <= 3;

  if (isCritical) {
    return (
      <div
        className={`rounded-2xl border-2 border-red-200 bg-red-50 p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
            <AlertCircle className="size-5 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="mb-1 font-semibold text-red-900">Prazo crítico!</p>
            <p className="text-sm text-red-700">
              Candidaturas encerram{" "}
              {daysRemaining === 0 ? "hoje" : "amanhã"}.{" "}
              {daysRemaining > 0 && "Última chance de se candidatar."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isUrgent) {
    return (
      <div
        className={`rounded-2xl border border-amber-200 bg-amber-50 p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <CalendarClock className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="mb-1 text-sm font-medium text-amber-900">
              Prazo encerrando em breve
            </p>
            <p className="text-sm text-amber-700">
              Candidaturas até{" "}
              {new Date(deadlineDate).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
              })}{" "}
              &bull; {daysRemaining}{" "}
              {daysRemaining === 1 ? "dia restante" : "dias restantes"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
