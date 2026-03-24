import { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCheck } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "~/hooks/use-auth";
import {
  useConversationMessagesInfiniteQuery,
  useSendConversationMessageMutation,
} from "../queries";
import type { ConversationListItem, ConversationMessageItem } from "../types";
import { MessageInput } from "./message-input";

type ChatThreadProps = {
  conversation: ConversationListItem | null;
};

function mergeUniqueMessages(items: ConversationMessageItem[]): ConversationMessageItem[] {
  const map = new Map<string, ConversationMessageItem>();
  items.forEach((item) => {
    map.set(item.id, item);
  });
  return Array.from(map.values());
}

type LocalMessage = ConversationMessageItem & {
  deliveryStatus: "sending" | "failed" | "sent";
  localError?: string;
};

export function ChatThread({ conversation }: ChatThreadProps) {
  const { user } = useAuth();
  const messagesQuery = useConversationMessagesInfiniteQuery(conversation?.id);
  const sendMessageMutation = useSendConversationMessageMutation(conversation?.id);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const [lastInputError, setLastInputError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    setLocalMessages([]);
    setLastInputError(null);
  }, [conversation?.id]);

  const serverMessages = useMemo(() => {
    const descItems =
      messagesQuery.data?.pages.flatMap((page) => page.items) ?? [];
    const uniqueDescItems = mergeUniqueMessages(descItems);
    return [...uniqueDescItems].reverse();
  }, [messagesQuery.data]);

  useEffect(() => {
    if (!serverMessages.length) {
      return;
    }

    const serverIds = new Set(serverMessages.map((message) => message.id));
    setLocalMessages((current) =>
      current.filter(
        (message) => !(message.deliveryStatus === "sent" && serverIds.has(message.id)),
      ),
    );
  }, [serverMessages]);

  const orderedMessages = useMemo(() => {
    const all = [...serverMessages, ...localMessages];
    const unique = mergeUniqueMessages(all).sort((left, right) => {
      const leftDate = new Date(left.createdAt).getTime();
      const rightDate = new Date(right.createdAt).getTime();
      if (leftDate !== rightDate) {
        return leftDate - rightDate;
      }
      return left.id.localeCompare(right.id);
    });
    return unique;
  }, [localMessages, serverMessages]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) {
      return;
    }

    if (!isAtBottom) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [isAtBottom, orderedMessages]);

  const handleScroll = () => {
    const container = listRef.current;
    if (!container) {
      return;
    }

    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsAtBottom(distanceToBottom < 80);
  };

  if (!conversation) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-white p-6 text-sm text-slate-500 shadow-sm">
        Selecione uma conversa para começar.
      </div>
    );
  }

  const campaignHref = `${
    user?.role === "creator" ? "/ofertas" : "/campanhas"
  }?contractRequestId=${conversation.contractRequestId}`;
  const systemMessageDate = new Date(
    conversation.lastMessageAt ?? conversation.createdAt,
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  const appendLocalMessage = (content: string): LocalMessage => ({
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    conversationId: conversation.id,
    senderUserId: user?.id ?? "",
    content,
    contentType: "TEXT",
    createdAt: new Date().toISOString(),
    deliveryStatus: "sending",
  });

  const handleSendMessage = async (content: string) => {
    const localMessage = appendLocalMessage(content);
    setLocalMessages((current) => [...current, localMessage]);
    setLastInputError(null);

    try {
      const sentMessage = await sendMessageMutation.mutateAsync(content);
      setLocalMessages((current) =>
        current.map((message) =>
          message.id === localMessage.id
            ? { ...sentMessage, deliveryStatus: "sent" as const }
            : message,
        ),
      );
    } catch {
      setLocalMessages((current) =>
        current.map((message) =>
          message.id === localMessage.id
            ? {
                ...message,
                deliveryStatus: "failed",
                localError: "Falha ao enviar",
              }
            : message,
        ),
      );
      setLastInputError("Falha ao enviar mensagem. Tente novamente.");
    }
  };

  const retryLocalMessage = async (messageId: string) => {
    const target = localMessages.find((message) => message.id === messageId);
    if (!target || target.deliveryStatus !== "failed") {
      return;
    }

    setLocalMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? { ...message, deliveryStatus: "sending", localError: undefined }
          : message,
      ),
    );
    setLastInputError(null);

    try {
      const sentMessage = await sendMessageMutation.mutateAsync(target.content);
      setLocalMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? { ...sentMessage, deliveryStatus: "sent" as const }
            : message,
        ),
      );
    } catch {
      setLocalMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                deliveryStatus: "failed",
                localError: "Falha ao reenviar",
              }
            : message,
        ),
      );
      setLastInputError("Não foi possível reenviar. Tente novamente.");
    }
  };

  const isClosed = Boolean(conversation.closedAt);
  const lastFailedMessageId = [...localMessages]
    .reverse()
    .find((message) => message.deliveryStatus === "failed")?.id;
  const showThreadLoading = messagesQuery.isLoading && !messagesQuery.data;

  return (
    <section className="flex min-h-[420px] flex-col rounded-3xl bg-white shadow-sm transition-opacity duration-200">
      <header className="border-b border-slate-200 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {conversation.participant?.name ?? "Conversa"}
            </p>
            <p className="text-xs text-slate-500">
              {isClosed ? "Conversa encerrada" : "Conversa ativa"}
            </p>
          </div>
          <Link
            to={campaignHref}
            className="rounded-full bg-[#895af6]/10 px-3 py-1.5 text-xs font-bold text-[#7b4bf0] hover:bg-[#895af6]/20"
          >
            Ver campanha
          </Link>
        </div>
      </header>

      <div
        ref={listRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 transition-all duration-200"
      >
        <div className="mb-4 flex justify-center lg:hidden">
          <span className="rounded-full bg-[#f1f0f3] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b]">
            Campanha vinculada • {systemMessageDate}
          </span>
        </div>

        {messagesQuery.hasNextPage ? (
          <div className="mb-3 text-center">
            <button
              type="button"
              onClick={() => messagesQuery.fetchNextPage()}
              disabled={messagesQuery.isFetchingNextPage}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
            >
              {messagesQuery.isFetchingNextPage
                ? "Carregando..."
                : "Carregar mensagens antigas"}
            </button>
          </div>
        ) : null}

        {showThreadLoading ? (
          <div className="space-y-3">
            <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-slate-100" />
            <div className="ml-auto h-20 w-3/4 animate-pulse rounded-2xl bg-[#895af6]/20" />
            <div className="h-14 w-1/2 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        ) : orderedMessages.length === 0 ? (
          <p className="text-sm text-slate-500">Ainda não há mensagens.</p>
        ) : (
          <div className="space-y-3">
            {orderedMessages.map((message) => {
              const isMine = user?.id === message.senderUserId;
              const localMessage = localMessages.find((item) => item.id === message.id);
              const isSending = localMessage?.deliveryStatus === "sending";
              const isFailed = localMessage?.deliveryStatus === "failed";

              return (
                <div
                  key={message.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"} transition-all duration-200`}
                >
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm ${
                      isMine
                        ? "bg-[#895af6] text-white shadow-[0_10px_16px_-12px_rgba(137,90,246,0.8)]"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className="mt-2 flex items-center justify-end gap-1.5">
                      <p
                        className={`text-[11px] font-medium ${
                          isMine ? "text-white/80" : "text-slate-500"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {isSending ? (
                        <span
                          className={`size-3 animate-spin rounded-full border border-current border-t-transparent ${
                            isMine ? "text-white/70" : "text-slate-400"
                          }`}
                        />
                      ) : null}
                      {isMine && !isSending && !isFailed ? (
                        <CheckCheck className="size-3 text-white/70" />
                      ) : null}
                      {isFailed ? (
                        <AlertCircle
                          className={`size-3 ${isMine ? "text-rose-100" : "text-rose-500"}`}
                        />
                      ) : null}
                    </div>

                    {isFailed ? (
                      <button
                        type="button"
                        onClick={() => void retryLocalMessage(message.id)}
                        className={`mt-1 text-xs font-semibold underline underline-offset-2 ${
                          isMine ? "text-rose-100" : "text-rose-600"
                        }`}
                      >
                        Tentar novamente
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSendMessage}
        onRetryLastFailed={
          lastFailedMessageId
            ? () => retryLocalMessage(lastFailedMessageId)
            : undefined
        }
        isSending={sendMessageMutation.isPending}
        errorMessage={lastInputError}
        disabled={isClosed || sendMessageMutation.isPending}
      />
    </section>
  );
}
