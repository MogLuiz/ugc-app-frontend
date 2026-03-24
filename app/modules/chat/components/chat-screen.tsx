import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { useAuth } from "~/hooks/use-auth";
import type { ConversationListItem } from "../types";
import { useConversationsQuery } from "../queries";
import { ChatList } from "./chat-list";
import { ChatThread } from "./chat-thread";

type ConversationFilter = "all" | "unread" | "active";

const FILTERS: Array<{ id: ConversationFilter; label: string }> = [
  { id: "all", label: "Todas" },
  { id: "unread", label: "Não lidas" },
  { id: "active", label: "Em andamento" },
];

function sortConversations(conversations: ConversationListItem[]) {
  return [...conversations].sort((left, right) => {
    const leftLast = new Date(left.lastMessageAt ?? left.createdAt).getTime();
    const rightLast = new Date(right.lastMessageAt ?? right.createdAt).getTime();
    if (rightLast !== leftLast) {
      return rightLast - leftLast;
    }

    if (right.unreadCount !== left.unreadCount) {
      return right.unreadCount - left.unreadCount;
    }

    return right.id.localeCompare(left.id);
  });
}

export function ChatScreen() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<ConversationFilter>("all");
  const contractRequestId = searchParams.get("contractRequestId") ?? undefined;
  const selectedConversationId = searchParams.get("conversationId");
  const conversationsQuery = useConversationsQuery(contractRequestId);
  const orderedConversations = useMemo(
    () => sortConversations(conversationsQuery.data ?? []),
    [conversationsQuery.data],
  );
  const filteredConversations = useMemo(() => {
    if (activeFilter === "unread") {
      return orderedConversations.filter((item) => item.unreadCount > 0);
    }

    if (activeFilter === "active") {
      return orderedConversations.filter((item) => !item.closedAt);
    }

    return orderedConversations;
  }, [activeFilter, orderedConversations]);
  const firstConversation = filteredConversations[0] ?? orderedConversations[0];

  useEffect(() => {
    if (
      contractRequestId &&
      !selectedConversationId &&
      firstConversation
    ) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("conversationId", firstConversation.id);
        return next;
      });
    }
  }, [contractRequestId, firstConversation, selectedConversationId, setSearchParams]);

  const selectedConversation =
    orderedConversations.find((item) => item.id === selectedConversationId) ?? null;
  const isMobileConversationDetail = Boolean(selectedConversation);

  const handleSelectConversation = (conversationId: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("conversationId", conversationId);
      next.delete("contractRequestId");
      return next;
    });
  };
  const handleBackToConversationList = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("conversationId");
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant={user?.role === "creator" ? "creator" : "business"} />
      </div>

      <main
        className={`flex min-w-0 flex-1 flex-col lg:h-screen lg:p-8 ${
          isMobileConversationDetail
            ? "gap-0 p-0 pb-0 pt-0"
            : "gap-5 px-4 pb-24 pt-6"
        }`}
      >
        <header className={`${isMobileConversationDetail ? "hidden" : "block"} lg:hidden`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#895af6]">
            Conversas
          </p>
          <h1 className="text-2xl font-black text-slate-900 lg:text-4xl">Chat</h1>
        </header>

        <div
          className={`${isMobileConversationDetail ? "hidden" : "-mx-1 flex"} gap-2 overflow-x-auto px-1 pb-1 lg:hidden`}
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeFilter === filter.id
                  ? "bg-[#895af6] text-white shadow-[0_10px_20px_-10px_rgba(137,90,246,0.65)]"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {conversationsQuery.isLoading ? (
          <p className="text-sm text-slate-600">Carregando conversas...</p>
        ) : conversationsQuery.error ? (
          <div className="rounded-3xl bg-white p-4 text-sm text-slate-600 shadow-sm">
            {conversationsQuery.error instanceof Error
              ? conversationsQuery.error.message
              : "Não foi possível carregar as conversas."}
          </div>
        ) : (
          <>
            <section className="lg:hidden">
              {selectedConversation ? (
                <ChatThread
                  conversation={selectedConversation}
                  onBackToList={handleBackToConversationList}
                />
              ) : (
                <ChatList
                  conversations={filteredConversations}
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={handleSelectConversation}
                  activeFilter={activeFilter}
                  hasAnyConversations={orderedConversations.length > 0}
                />
              )}
            </section>

            <section className="hidden gap-6 lg:grid lg:h-[calc(100vh-4rem)] lg:grid-cols-[320px,1fr]">
              <aside className="flex min-h-0 flex-col rounded-3xl bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between px-2 py-1">
                  <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-500">
                    Mensagens
                  </h2>
                  <span className="rounded-full bg-[#f0ebff] px-2 py-0.5 text-[10px] font-bold text-[#7c3aed]">
                    {filteredConversations.length}
                  </span>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <ChatList
                    conversations={filteredConversations}
                    selectedConversationId={selectedConversationId}
                    onSelectConversation={handleSelectConversation}
                    activeFilter={activeFilter}
                    hasAnyConversations={orderedConversations.length > 0}
                  />
                </div>
              </aside>

              <div className="min-h-0">
                <ChatThread conversation={selectedConversation} />
              </div>
            </section>
          </>
        )}
      </main>

      {!isMobileConversationDetail &&
        (user?.role === "creator" ? <CreatorBottomNav /> : <BusinessBottomNav />)}
    </div>
  );
}
