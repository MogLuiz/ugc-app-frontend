import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  ContractRequestItem,
  ContractRequestPayload,
  ContractRequestStatus,
} from "./types";

export async function createContractRequest(
  data: ContractRequestPayload,
  token?: string
): Promise<ContractRequestItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<ContractRequestItem>("/contract-requests", {
    method: "POST",
    body: data,
    token: accessToken,
  });
}

export async function getMyCompanyContractRequests(
  status?: ContractRequestStatus,
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
