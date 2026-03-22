import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contractRequestKeys } from "~/lib/query/query-keys";
import {
  acceptContractRequest,
  createContractRequest,
  getMyCompanyContractRequests,
  getMyCreatorPendingContractRequests,
  previewContractRequest,
  rejectContractRequest,
} from "./service";
import type { ContractRequestPayload, ContractRequestStatus } from "./types";

export function useMyCompanyContractRequestsQuery(status?: ContractRequestStatus) {
  return useQuery({
    queryKey: contractRequestKeys.companyList(status),
    queryFn: () => getMyCompanyContractRequests(status),
  });
}

export function useMyCreatorPendingContractRequestsQuery() {
  return useQuery({
    queryKey: contractRequestKeys.creatorPending(),
    queryFn: () => getMyCreatorPendingContractRequests(),
  });
}

export function useCreateContractRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContractRequestPayload) => createContractRequest(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
    },
  });
}

export function usePreviewContractRequestMutation() {
  return useMutation({
    mutationFn: (payload: ContractRequestPayload) => previewContractRequest(payload),
  });
}

export function useAcceptContractRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractRequestId: string) => acceptContractRequest(contractRequestId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
    },
  });
}

export function useRejectContractRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { contractRequestId: string; rejectionReason?: string }) =>
      rejectContractRequest(params.contractRequestId, params.rejectionReason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
    },
  });
}
