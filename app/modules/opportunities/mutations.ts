import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { opportunityKeys } from "~/lib/query/query-keys";
import { applyToOpportunity } from "./service";

export function useApplyToOpportunityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opportunityId: string) => applyToOpportunity(opportunityId),
    onSuccess: (_, opportunityId) => {
      void queryClient.invalidateQueries({
        queryKey: opportunityKeys.detail(opportunityId),
      });
      void queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
      toast.success("Candidatura enviada!", {
        description:
          "A empresa analisará seu perfil e entrará em contato em breve.",
      });
    },
  });
}
