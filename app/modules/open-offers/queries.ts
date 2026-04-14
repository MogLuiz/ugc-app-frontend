import { useQuery } from "@tanstack/react-query";
import { openOfferKeys } from "~/lib/query/query-keys";
import { getJobTypesForOpenOffers, getMyCompanyOpenOfferDetail, getMyCompanyOpenOffers } from "./service";

export function useMyCompanyOpenOffersQuery(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery({
    queryKey: openOfferKeys.companyList(params),
    queryFn: () => getMyCompanyOpenOffers(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useMyCompanyOpenOfferDetailQuery(offerId?: string) {
  return useQuery({
    queryKey: openOfferKeys.companyDetail(offerId ?? "none"),
    queryFn: () => getMyCompanyOpenOfferDetail(offerId!),
    enabled: Boolean(offerId),
  });
}

export function useOpenOfferJobTypesQuery() {
  return useQuery({
    queryKey: [...openOfferKeys.all, "job-types"] as const,
    queryFn: () => getJobTypesForOpenOffers(),
  });
}
