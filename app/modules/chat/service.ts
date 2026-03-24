import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  ConversationListItem,
  ConversationMessageItem,
  ConversationMessagesPage,
} from "./types";

export async function getConversations(
  params?: { contractRequestId?: string },
  token?: string,
): Promise<ConversationListItem[]> {
  const accessToken = await getAccessToken(token);
  const searchParams = new URLSearchParams();

  if (params?.contractRequestId) {
    searchParams.set("contractRequestId", params.contractRequestId);
  }

  const suffix = searchParams.size ? `?${searchParams.toString()}` : "";
  return httpClient<ConversationListItem[]>(`/conversations${suffix}`, {
    token: accessToken,
  });
}

export async function getConversationMessages(
  conversationId: string,
  params?: {
    cursor?: string;
    afterCursor?: string;
    limit?: number;
  },
  token?: string,
): Promise<ConversationMessagesPage> {
  const accessToken = await getAccessToken(token);
  const searchParams = new URLSearchParams();

  if (params?.cursor) {
    searchParams.set("cursor", params.cursor);
  }
  if (params?.afterCursor) {
    searchParams.set("afterCursor", params.afterCursor);
  }
  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const suffix = searchParams.size ? `?${searchParams.toString()}` : "";
  return httpClient<ConversationMessagesPage>(
    `/conversations/${conversationId}/messages${suffix}`,
    { token: accessToken },
  );
}

export async function sendConversationMessage(
  conversationId: string,
  content: string,
  token?: string,
): Promise<ConversationMessageItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ConversationMessageItem>(`/conversations/${conversationId}/messages`, {
    method: "POST",
    body: { content },
    token: accessToken,
  });
}
