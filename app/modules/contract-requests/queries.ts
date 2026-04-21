// Fluxo oficial da empresa evolui em `open-offers`.
// Este módulo permanece ativo porque ainda sustenta creator e handoffs compatíveis.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contractRequestKeys, creatorDashboardKeys } from "~/lib/query/query-keys";
import {
  acceptContractRequest,
  cancelContractRequest,
  confirmCompletion,
  createContractRequest,
  disputeCompletion,
  getContractReviews,
  getMyCompanyContractRequests,
  getMyCreatorContractRequests,
  getMyCreatorPendingContractRequests,
  previewContractRequest,
  rejectContractRequest,
  submitReview,
} from "./service";
import type {
  CompanyCampaignStatus,
  ContractRequestPayload,
  ContractRequestStatus,
  CreateReviewPayload,
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

export function useMyCreatorPendingContractRequestsQuery(enabled = true) {
  return useQuery({
    queryKey: contractRequestKeys.creatorPending(),
    queryFn: () => getMyCreatorPendingContractRequests(),
    enabled,
  });
}

export function useMyCreatorContractRequestsQuery(
  status: "ACCEPTED" | "COMPLETED" | "REJECTED" | "CANCELLED",
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
      void queryClient.invalidateQueries({ queryKey: creatorDashboardKeys.all });
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
    },
  });
}

export function useConfirmCompletionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractRequestId: string) => confirmCompletion(contractRequestId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
    },
  });
}

export function useDisputeCompletionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { contractRequestId: string; reason: string }) =>
      disputeCompletion(params.contractRequestId, params.reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
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
