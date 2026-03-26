import { useQuery } from "@tanstack/react-query";
import { creatorsMapKeys } from "~/lib/query/query-keys";
import { getMapCreators } from "./service";

export function useCreatorsMapQuery() {
  return useQuery({
    queryKey: creatorsMapKeys.list(),
    queryFn: () => getMapCreators(),
  });
}
