import { useMutation, useQueryClient } from "@tanstack/react-query";
import { contractRequestKeys, openOfferKeys } from "~/lib/query/query-keys";
import { cancelOpenOffer, createOpenOffer, selectOpenOfferCreator } from "./service";
import type { CreateOpenOfferPayload, SelectOpenOfferCreatorPayload } from "./types";

export function useCreateOpenOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOpenOfferPayload) => createOpenOffer(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: openOfferKeys.all });
    },
  });
}

export function useCancelOpenOfferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerId: string) => cancelOpenOffer(offerId),
    onSuccess: (_result, offerId) => {
      void queryClient.invalidateQueries({ queryKey: openOfferKeys.companyDetail(offerId) });
      void queryClient.invalidateQueries({ queryKey: openOfferKeys.all });
    },
  });
}

export function useSelectOpenOfferCreatorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SelectOpenOfferCreatorPayload) => selectOpenOfferCreator(payload),
    onSuccess: (result, payload) => {
      void queryClient.invalidateQueries({ queryKey: openOfferKeys.companyDetail(payload.offerId) });
      void queryClient.invalidateQueries({ queryKey: openOfferKeys.all });
      void queryClient.invalidateQueries({ queryKey: contractRequestKeys.all });
      if (result.contractRequestId) {
        void queryClient.invalidateQueries({ queryKey: contractRequestKeys.companyList() });
      }
    },
  });
}
