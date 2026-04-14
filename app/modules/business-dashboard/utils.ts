import type { ContractRequestItem } from "~/modules/contract-requests/types";
import type { ConversationListItem } from "~/modules/chat/types";

const ACTIVITY_DEDUPE_WINDOW_MS = 90_000;

export type ActivityKind = "chat_message" | "campaign_accepted" | "campaign_completed" | "campaign_created";

export type ActivityRaw = {
  id: string;
  kind: ActivityKind;
  at: number;
  contractRequestId?: string;
  title: string;
  description: string;
  href?: string;
};

function activitySignature(event: ActivityRaw) {
  return `${event.contractRequestId ?? "none"}:${event.kind}`;
}

/** Resolve instante de gravação para ordenação e badges (timezone local). */
export function resolveRecordingInstant(item: ContractRequestItem): Date | null {
  const iso = item.schedule?.startTime ?? item.startsAt;
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

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

function truncate(text: string, max: number) {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

export function buildActivityFeed(
  campaigns: ContractRequestItem[],
  conversations: ConversationListItem[]
): ActivityRaw[] {
  const raw: ActivityRaw[] = [];

  for (const item of campaigns) {
    const title = item.job?.title ?? item.jobTypeName ?? "Campanha";
    const creator = item.creator?.name ?? item.creatorNameSnapshot ?? "Creator";

    const createdAt = item.metadata?.createdAt ?? item.createdAt;
    if (createdAt) {
      raw.push({
        id: `created-${item.id}`,
        kind: "campaign_created",
        at: new Date(createdAt).getTime(),
        contractRequestId: item.id,
        title: "Nova solicitação",
        description: `${creator} — ${title}`,
        href: `/ofertas`,
      });
    }

    const acceptedAt = item.metadata?.acceptedAt;
    if (acceptedAt) {
      raw.push({
        id: `accepted-${item.id}`,
        kind: "campaign_accepted",
        at: new Date(acceptedAt).getTime(),
        contractRequestId: item.id,
        title: "Creator aceitou campanha",
        description: `${creator} aceitou o convite para “${truncate(title, 48)}”.`,
        href: `/ofertas`,
      });
    }

    if (item.status === "COMPLETED" && item.updatedAt) {
      raw.push({
        id: `completed-${item.id}`,
        kind: "campaign_completed",
        at: new Date(item.updatedAt).getTime(),
        contractRequestId: item.id,
        title: "Campanha finalizada",
        description: `“${truncate(title, 48)}” foi concluída.`,
        href: `/ofertas`,
      });
    }
  }

  for (const conv of conversations) {
    const lastAt = conv.lastMessageAt ?? conv.lastMessage?.createdAt ?? conv.createdAt;
    if (!lastAt || !conv.lastMessage) continue;
    const who = conv.participant?.name ?? "Creator";
    raw.push({
      id: `msg-${conv.lastMessage.id}`,
      kind: "chat_message",
      at: new Date(lastAt).getTime(),
      contractRequestId: conv.contractRequestId,
      title: "Nova mensagem",
      description: truncate(`${who}: ${conv.lastMessage.content}`, 120),
      href: `/chat?contractRequestId=${conv.contractRequestId}`,
    });
  }

  raw.sort((a, b) => b.at - a.at);

  const deduped: ActivityRaw[] = [];
  for (const event of raw) {
    const duplicate = deduped.some(
      (k) =>
        activitySignature(k) === activitySignature(event) &&
        Math.abs(k.at - event.at) < ACTIVITY_DEDUPE_WINDOW_MS
    );
    if (duplicate) continue;
    deduped.push(event);
  }

  return deduped.slice(0, 5);
}
