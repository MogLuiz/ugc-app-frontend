import { useQuery } from "@tanstack/react-query";
import { HttpError } from "~/lib/http/errors";
import { referralsKeys } from "~/lib/query/query-keys";
import {
  fetchCommissionsList,
  fetchPartnerProfile,
  fetchReferralsDashboard,
  fetchReferralsList,
  LIST_LIMIT,
} from "../service";
import type { PartnerProfileResponse } from "../types";

export type PartnerProfileState =
  | { kind: "active"; profile: PartnerProfileResponse }
  | { kind: "not_activated" };

/**
 * GET /partners/me — apenas **403** indica parceiro ainda não ativado.
 * Outros erros propagam (estado de erro da tela).
 */
export function usePartnerProfileQuery() {
  return useQuery({
    queryKey: referralsKeys.profile(),
    queryFn: async (): Promise<PartnerProfileState> => {
      try {
        const profile = await fetchPartnerProfile();
        return { kind: "active", profile };
      } catch (e) {
        if (e instanceof HttpError && e.status === 403) {
          return { kind: "not_activated" };
        }
        throw e;
      }
    },
  });
}

export function useReferralsDashboardQuery(isPartnerReady: boolean) {
  return useQuery({
    queryKey: referralsKeys.dashboard(),
    queryFn: () => fetchReferralsDashboard(),
    enabled: isPartnerReady,
  });
}

export function useReferralsListQuery(isPartnerReady: boolean) {
  return useQuery({
    queryKey: referralsKeys.referrals(1, LIST_LIMIT),
    queryFn: () => fetchReferralsList(undefined, 1),
    enabled: isPartnerReady,
  });
}

export function useReferralsPagedQuery(
  page: number,
  status: string | undefined,
  isPartnerReady: boolean
) {
  return useQuery({
    queryKey: referralsKeys.referrals(page, LIST_LIMIT, status),
    queryFn: () => fetchReferralsList(undefined, page, status),
    enabled: isPartnerReady,
  });
}

export function useCommissionsListQuery(enabled: boolean) {
  return useQuery({
    queryKey: referralsKeys.commissions(1, LIST_LIMIT),
    queryFn: () => fetchCommissionsList(undefined, 1),
    enabled,
  });
}
