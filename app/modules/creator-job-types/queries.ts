import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { creatorJobTypesKeys } from "~/lib/query/query-keys";
import { getCreatorJobTypes, replaceCreatorJobTypes } from "./service";

export function useCreatorJobTypesQuery() {
  return useQuery({
    queryKey: creatorJobTypesKeys.list(),
    queryFn: () => getCreatorJobTypes(),
  });
}

export function useReplaceCreatorJobTypesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobTypeIds: string[]) => replaceCreatorJobTypes(jobTypeIds),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: creatorJobTypesKeys.all,
      });
    },
  });
}
