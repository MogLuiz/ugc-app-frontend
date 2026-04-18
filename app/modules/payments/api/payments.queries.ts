import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentKeys } from "~/lib/query/query-keys";
import {
  getCompanyPayments,
  getMyPayouts,
  getPayment,
  initiatePayment,
} from "./payments.api";

export function useInitiatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractRequestId: string) =>
      initiatePayment(contractRequestId),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: paymentKeys.detail(data.paymentId),
      });
    },
  });
}

export function usePaymentQuery(paymentId: string, enabled = true) {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => getPayment(paymentId),
    enabled: enabled && !!paymentId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Faz polling enquanto o pagamento está em andamento
      if (status === "pending" || status === "processing" || status === "authorized") {
        return 5000;
      }
      return false;
    },
  });
}

export function useMyPayoutsQuery(enabled = true) {
  return useQuery({
    queryKey: paymentKeys.myPayouts(),
    queryFn: () => getMyPayouts(),
    enabled,
  });
}

export function useCompanyPaymentsQuery(enabled = true) {
  return useQuery({
    queryKey: paymentKeys.companyList(),
    queryFn: () => getCompanyPayments(),
    enabled,
  });
}
