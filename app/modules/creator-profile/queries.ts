import { useQuery } from "@tanstack/react-query";
import { creatorProfileKeys } from "~/lib/query/query-keys";
import { getCreatorProfileDetail } from "./service";

export function useCreatorProfileQuery(creatorId: string | undefined) {
  return useQuery({
    queryKey: creatorProfileKeys.detail(creatorId ?? ""),
    queryFn: () => getCreatorProfileDetail(creatorId ?? ""),
    enabled: Boolean(creatorId),
  });
}
