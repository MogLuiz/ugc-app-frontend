import type { BookingStatus, JobMode, UiCalendarEvent } from "../types";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Evita "Oferta aceita - Empresa" quando o nome já está no header (mobile). */
export function getMobileCardDescriptionTitle(event: UiCalendarEvent): string {
  const t = event.title.trim();
  const company = event.company.trim();
  if (!company) return t;
  const reDash = new RegExp(
    `^Oferta aceita\\s*-\\s*${escapeRegExp(company)}$`,
    "i",
  );
  const reMdash = new RegExp(
    `^Oferta aceita\\s*—\\s*${escapeRegExp(company)}$`,
    "i",
  );
  if (reDash.test(t) || reMdash.test(t)) {
    return "Oferta aceita";
  }
  return t;
}

/** Linha de local / distância no mobile ("No local" quando muito perto). */
export function getMobilePinLineText(event: UiCalendarEvent): string {
  if (
    event.distanceKm != null &&
    Number.isFinite(event.distanceKm) &&
    event.distanceKm <= 0.3
  ) {
    return "No local";
  }
  if (event.distanceLabel) {
    return event.distanceLabel;
  }
  if (event.locationLine?.trim()) {
    return event.locationLine.trim();
  }
  return event.modeLine;
}


/** Rótulo de duração para UI (ex.: 5h ou 1,5h). */
export function formatCalendarDurationLabel(durationMinutes: number): string {
  const hours = durationMinutes / 60;
  if (durationMinutes % 60 === 0) {
    return `${hours}h`;
  }

  return `${hours.toFixed(1).replace(".", ",")}h`;
}

const MODE_LABEL: Record<JobMode, string> = {
  PRESENTIAL: "Presencial",
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
};

/** Ex.: "Vídeo · Presencial" */
export function formatJobKindLabel(jobTypeName: string, mode: JobMode): string {
  return `${jobTypeName} · ${MODE_LABEL[mode]}`;
}

/** Ex.: "3,2 km" ou null. */
export function formatDistanceLabel(
  distanceKm: number | null | undefined,
): string | null {
  if (distanceKm == null || Number.isNaN(distanceKm)) {
    return null;
  }
  return `${distanceKm.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })} km`;
}

/** Borda lateral do card por status de booking (API). */
export function bookingStatusBorderClass(status: BookingStatus): string {
  switch (status) {
    case "CONFIRMED":
      return "border-l-4 border-emerald-500";
    case "PENDING":
      return "border-l-4 border-amber-500";
    case "CANCELLED":
    case "REJECTED":
      return "border-l-4 border-red-500";
    case "COMPLETED":
      return "border-l-4 border-slate-400";
    default:
      return "border-l-4 border-slate-300";
  }
}
