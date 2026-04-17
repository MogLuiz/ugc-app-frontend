import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingKeys } from "~/lib/query/query-keys";
import { getCompanyBalance, requestRefund, type RequestRefundInput } from "./billing.api";

export function useCompanyBalanceQuery(enabled = true) {
  return useQuery({
    queryKey: billingKeys.balance(),
    queryFn: () => getCompanyBalance(),
    enabled,
  });
}

export function useRequestRefundMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RequestRefundInput) => requestRefund(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: billingKeys.balance() });
    },
  });
}
