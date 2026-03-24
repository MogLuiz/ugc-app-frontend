import type { ConversationListItem } from "../types";

type ChatListProps = {
  conversations: ConversationListItem[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  activeFilter?: "all" | "unread" | "active";
  hasAnyConversations?: boolean;
};

function getConversationName(conversation: ConversationListItem): string {
  return conversation.participant?.name ?? "Participante";
}

function getConversationLastMessage(conversation: ConversationListItem): string {
  if (!conversation.lastMessage?.content) {
    return "Sem mensagens ainda";
  }
  return conversation.lastMessage.content;
}

function getConversationTime(conversation: ConversationListItem): string {
  const base = conversation.lastMessageAt ?? conversation.createdAt;
  const date = new Date(base);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function ChatList({
  conversations,
  selectedConversationId,
  onSelectConversation,
  activeFilter = "all",
  hasAnyConversations = conversations.length > 0,
}: ChatListProps) {
  if (!conversations.length) {
    const message = hasAnyConversations
      ? activeFilter === "unread"
        ? "Você está em 'Não lidas'. Quando houver novas mensagens, elas aparecem aqui."
        : "Você está em 'Em andamento'. Troque para 'Todas' para ver conversas encerradas."
      : "Ainda não há conversas por aqui. Assim que uma solicitação for aceita, elas aparecerão nesta tela.";

    return (
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 text-sm text-slate-600 shadow-sm">
        <p className="font-semibold text-slate-800">Nenhuma conversa neste momento</p>
        <p className="mt-1 leading-relaxed">{message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isSelected = selectedConversationId === conversation.id;
        const unreadCount = conversation.unreadCount;
        const hasUnread = unreadCount > 0;
        const participantName = getConversationName(conversation);
        const avatarUrl = conversation.participant?.avatarUrl;
        const statusLabel = conversation.closedAt ? "Finalizada" : "Em andamento";

        return (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelectConversation(conversation.id)}
            className={`relative w-full rounded-2xl border px-3 py-3 text-left transition-all duration-200 ${
              isSelected
                ? "border-[#895af6]/30 bg-[#895af6]/10 shadow-sm"
                : hasUnread
                  ? "border-[#895af6]/15 bg-[#895af6]/[0.04] hover:bg-[#895af6]/[0.07]"
                  : "border-transparent hover:bg-slate-50"
            }`}
          >
            {isSelected ? (
              <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#895af6]" />
            ) : null}

            <div className="flex items-start gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={participantName}
                  className="mt-0.5 size-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                  {participantName
                    .split(" ")
                    .slice(0, 2)
                    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
                    .join("")}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`truncate text-sm ${
                      hasUnread ? "font-bold text-slate-900" : "font-semibold text-slate-900"
                    }`}
                  >
                    {participantName}
                  </p>
                  <span
                    className={`text-[11px] ${
                      hasUnread ? "font-bold text-[#7c3aed]" : "font-medium text-slate-400"
                    }`}
                  >
                    {getConversationTime(conversation)}
                  </span>
                </div>

                <p
                  className={`mt-1 truncate text-xs ${
                    hasUnread ? "font-medium text-slate-700" : "text-slate-500"
                  }`}
                >
                  {getConversationLastMessage(conversation)}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      conversation.closedAt
                        ? "bg-slate-100 text-slate-500"
                        : "bg-[#f0ebff] text-[#7c3aed]"
                    }`}
                  >
                    {statusLabel}
                  </span>

                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-[#895af6] px-2 py-0.5 text-[10px] font-bold text-white shadow-[0_6px_12px_-8px_rgba(137,90,246,0.9)]">
                      {unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
