// Fluxo oficial da empresa evolui em `open-offers`.
// Este módulo permanece ativo porque ainda sustenta creator e handoffs compatíveis.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contractRequestKeys, creatorDashboardKeys, creatorHubKeys } from "~/lib/query/query-keys";
import {
  acceptContractRequest,
  cancelContractRequest,
  confirmCompletion,
  createContractRequest,
  disputeCompletion,
  getContractRequestById,
  getContractReviews,
  getCreatorOffersHub,
  getMyCompanyContractRequests,
  getMyCreatorContractRequests,
  getMyCreatorPendingContractRequests,
  previewContractRequest,
  rejectContractRequest,
  submitReview,
} from "./service";
import type {
  CompanyCampaignStatus,
  CreateContractRequestPayload,
  ContractRequestStatus,
  CreateReviewPayload,
  PreviewContractRequestPayload,
} from "./types";

export function useMyCompanyContractRequestsQuery(
  status?: CompanyCampaignStatus | ContractRequestStatus,
  enabled = true
) {
  return useQuery({
    queryKey: contractRequestKeys.companyList(status),
    queryFn: () => getMyCompanyContractRequests(status),
    enabled,
  });
}

export function useContractRequestDetailQuery(contractRequestId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: contractRequestKeys.detail(contractRequestId ?? ""),
    queryFn: () => getContractRequestById(contractRequestId!),
    enabled: enabled && Boolean(contractRequestId),
  });
}

export function useCreatorOffersHubQuery(enabled = true) {
  return useQuery({
    queryKey: creatorHubKeys.hub(),
    queryFn: () => getCreatorOffersHub(),
    enabled,
  });
}

export function useMyCreatorPendingContractRequestsQuery(enabled = true) {
  return useQuery({
    queryKey: contractRequestKeys.creatorPending(),
    queryFn: () => getMyCreatorPendingContractRequests(),
    enabled,
  });
}

export function useMyCreatorContractRequestsQuery(
  status: "ACCEPTED" | "COMPLETED" | "REJECTED" | "CANCELLED" | "EXPIRED",
  enabled = true
) {
  return useQuery({
    queryKey: contractRequestKeys.creatorList(status),
    queryFn: () => getMyCreatorContractRequests(status),
    enabled,
  });
}

export function useCreateContractRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContractRequestPayload) => createContractRequest(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
    },
  });
}

export function usePreviewContractRequestMutation() {
  return useMutation({
    mutationFn: (payload: PreviewContractRequestPayload) => previewContractRequest(payload),
  });
}

export function useAcceptContractRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractRequestId: string) => acceptContractRequest(contractRequestId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
      void queryClient.invalidateQueries({ queryKey: creatorDashboardKeys.all });
      void queryClient.invalidateQueries({ queryKey: creatorHubKeys.all });
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
      void queryClient.invalidateQueries({ queryKey: creatorDashboardKeys.all });
      void queryClient.invalidateQueries({ queryKey: creatorHubKeys.all });
    },
  });
}

export function useCancelContractRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractRequestId: string) => cancelContractRequest(contractRequestId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
      void queryClient.invalidateQueries({ queryKey: creatorDashboardKeys.all });
      void queryClient.invalidateQueries({ queryKey: creatorHubKeys.all });
    },
  });
}

export function useConfirmCompletionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractRequestId: string) => confirmCompletion(contractRequestId),
    onSuccess: (_data, contractRequestId) => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.detail(contractRequestId) });
      void queryClient.invalidateQueries({ queryKey: creatorHubKeys.all });
    },
  });
}

export function useDisputeCompletionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { contractRequestId: string; reason: string }) =>
      disputeCompletion(params.contractRequestId, params.reason),
    onSuccess: (_data, { contractRequestId }) => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.detail(contractRequestId) });
      void queryClient.invalidateQueries({ queryKey: creatorHubKeys.all });
    },
  });
}

export function useContractReviewsQuery(contractRequestId: string, enabled = true) {
  return useQuery({
    queryKey: contractRequestKeys.reviews(contractRequestId),
    queryFn: () => getContractReviews(contractRequestId),
    enabled,
  });
}

export function useSubmitReviewMutation(contractRequestId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => submitReview(contractRequestId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: contractRequestKeys.reviews(contractRequestId),
      });
    },
  });
}
