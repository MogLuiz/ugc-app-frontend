// Fluxo oficial da empresa evolui em `open-offers`.
// Este módulo permanece ativo porque ainda sustenta creator e handoffs compatíveis.
import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  CompanyCampaignStatus,
  CreateContractRequestPayload,
  ContractRequestItem,
  ContractRequestStatus,
  ContractReviewsResponse,
  CreateReviewPayload,
  PreviewContractRequestPayload,
} from "./types";

export async function createContractRequest(
  data: CreateContractRequestPayload,
  token?: string
): Promise<ContractRequestItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem>("/contract-requests", {
    method: "POST",
    body: data,
    token: accessToken,
  });
}

export async function previewContractRequest(
  data: PreviewContractRequestPayload,
  token?: string
): Promise<ContractRequestItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem>("/contract-requests/preview", {
    method: "POST",
    body: data,
    token: accessToken,
  });
}

export async function getMyCompanyContractRequests(
  status?: CompanyCampaignStatus | ContractRequestStatus,
  token?: string
): Promise<ContractRequestItem[]> {
  const accessToken = await getAccessToken(token);
  const searchParams = new URLSearchParams();

  if (status) {
    searchParams.set("status", status);
  }

  const suffix = searchParams.size > 0 ? `?${searchParams.toString()}` : "";
  return httpClient<ContractRequestItem[]>(`/contract-requests/my-company${suffix}`, {
    token: accessToken,
  });
}

export async function getMyCreatorPendingContractRequests(
  token?: string
): Promise<ContractRequestItem[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem[]>("/contract-requests/my-creator/pending", {
    token: accessToken,
  });
}

export async function getMyCreatorContractRequests(
  status: "ACCEPTED" | "COMPLETED" | "REJECTED" | "CANCELLED" | "EXPIRED",
  token?: string
): Promise<ContractRequestItem[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem[]>(
    `/contract-requests/my-creator?status=${status}`,
    { token: accessToken }
  );
}

export async function getCreatorOffersHub(
  token?: string
): Promise<import("./creator-hub.types").CreatorOffersHubResponse> {
  const accessToken = await getAccessToken(token);
  return httpClient("/creator/offers/hub", { token: accessToken });
}

/** Detalhe do contrato para creator ou empresa (participante). */
export async function getContractRequestById(
  contractRequestId: string,
  token?: string
): Promise<ContractRequestItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem>(`/contract-requests/${contractRequestId}`, {
    token: accessToken,
  });
}

export async function acceptContractRequest(
  contractRequestId: string,
  token?: string
): Promise<ContractRequestItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem>(`/contract-requests/${contractRequestId}/accept`, {
    method: "PATCH",
    token: accessToken,
  });
}

export async function rejectContractRequest(
  contractRequestId: string,
  rejectionReason?: string,
  token?: string
): Promise<ContractRequestItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem>(`/contract-requests/${contractRequestId}/reject`, {
    method: "PATCH",
    body: rejectionReason ? { rejectionReason } : {},
    token: accessToken,
  });
}

export async function cancelContractRequest(
  contractRequestId: string,
  token?: string
): Promise<ContractRequestItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem>(`/contract-requests/${contractRequestId}/cancel`, {
    method: "PATCH",
    token: accessToken,
  });
}

export async function confirmCompletion(
  contractRequestId: string,
  token?: string
): Promise<ContractRequestItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem>(
    `/contract-requests/${contractRequestId}/confirm-completion`,
    { method: "PATCH", token: accessToken }
  );
}

export async function disputeCompletion(
  contractRequestId: string,
  reason: string,
  token?: string
): Promise<ContractRequestItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem>(
    `/contract-requests/${contractRequestId}/dispute-completion`,
    { method: "PATCH", body: { reason }, token: accessToken }
  );
}

export async function submitReview(
  contractRequestId: string,
  payload: CreateReviewPayload,
  token?: string
): Promise<import("./types").ReviewItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<import("./types").ReviewItem>(
    `/contract-requests/${contractRequestId}/reviews`,
    { method: "POST", body: payload, token: accessToken }
  );
}

export async function getContractReviews(
  contractRequestId: string,
  token?: string
): Promise<ContractReviewsResponse> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractReviewsResponse>(
    `/contract-requests/${contractRequestId}/reviews`,
    { token: accessToken }
  );
}
