/** Utilitários de data para dashboards; pode ser reutilizado pelo business-dashboard no futuro. */

function startOfLocalDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export type DayUrgency = "HOJE" | "AMANHÃ";

export function getDayUrgencyBanner(recording: Date | null): DayUrgency | null {
  if (!recording) return null;
  const now = new Date();
  const diffDays = Math.round(
    (startOfLocalDay(recording) - startOfLocalDay(now)) / 86_400_000
  );
  if (diffDays === 0) return "HOJE";
  if (diffDays === 1) return "AMANHÃ";
  return null;
}

export function formatRecordingDateLabel(d: Date): string {
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

/** Ex.: "MAR 31" para badge de calendário. */
export function formatRecordingMonthDayUpper(d: Date): string {
  const month = d
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "")
    .toUpperCase();
  return `${month} ${d.getDate()}`;
}

export function formatRecordingTimeLabel(d: Date): string {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function formatDurationLabel(minutes: number): string {
  if (!Number.isFinite(minutes) || minutes <= 0) return "Duração a combinar";
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (m === 0) return `${h}h gravação`;
    return `${h}h${m}min gravação`;
  }
  return `${minutes} min gravação`;
}

export function getRelativeActivityLabel(iso: string | null | undefined): string {
  if (!iso) return "Agora há pouco";
  const now = Date.now();
  const target = new Date(iso).getTime();
  if (Number.isNaN(target)) return "Agora há pouco";
  const diffMs = now - target;
  const diffMinutes = Math.max(1, Math.round(diffMs / 60_000));
  if (diffMinutes < 60) return `Há ${diffMinutes} min`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `Há ${diffHours}h`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return `Há ${diffDays} dias`;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
