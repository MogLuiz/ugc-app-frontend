import type { BookingStatus, JobMode } from "../types";

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
