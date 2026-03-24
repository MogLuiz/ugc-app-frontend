import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { chatKeys } from "~/lib/query/query-keys";
import {
  getConversationMessages,
  getConversations,
  sendConversationMessage,
} from "./service";

export function useConversationsQuery(contractRequestId?: string) {
  return useQuery({
    queryKey: chatKeys.conversations(contractRequestId),
    queryFn: () => getConversations({ contractRequestId }),
    refetchInterval: 10000,
  });
}

export function useConversationMessagesInfiniteQuery(conversationId?: string) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: ({ pageParam }) =>
      getConversationMessages(conversationId!, {
        cursor: pageParam ?? undefined,
        limit: 30,
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: Boolean(conversationId),
    refetchInterval: 7000,
  });
}

export function useSendConversationMessageMutation(conversationId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendConversationMessage(conversationId!, content),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
      void queryClient.invalidateQueries({ queryKey: chatKeys.all });
    },
  });
}
