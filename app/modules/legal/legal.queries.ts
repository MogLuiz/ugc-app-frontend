import { useQuery } from "@tanstack/react-query";
import { legalKeys } from "~/lib/query/query-keys";
import { getLegalAcceptanceStatus } from "./legal.api";
import type { LegalTermType } from "./legal.types";

export function useLegalAcceptanceStatusQuery(
  termType: LegalTermType,
  enabled = true
) {
  return useQuery({
    queryKey: legalKeys.acceptanceStatus(termType),
    queryFn: () => getLegalAcceptanceStatus(termType),
    enabled,
  });
}
