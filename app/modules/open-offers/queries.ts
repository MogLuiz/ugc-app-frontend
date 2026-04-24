import { useQuery } from "@tanstack/react-query";
import { openOfferKeys } from "~/lib/query/query-keys";
import {
  getCompanyOffersHub,
  getJobTypesForOpenOffers,
  getMyCompanyOpenOfferDetail,
} from "./service";

export function useMyCompanyOpenOfferDetailQuery(offerId?: string) {
  return useQuery({
    queryKey: openOfferKeys.companyDetail(offerId ?? "none"),
    queryFn: () => getMyCompanyOpenOfferDetail(offerId!),
    enabled: Boolean(offerId),
  });
}

export function useCompanyOffersHubQuery() {
  return useQuery({
    queryKey: openOfferKeys.companyHub(),
    queryFn: () => getCompanyOffersHub(),
  });
}

export function useOpenOfferJobTypesQuery() {
  return useQuery({
    queryKey: [...openOfferKeys.all, "job-types"] as const,
    queryFn: () => getJobTypesForOpenOffers(),
  });
}
