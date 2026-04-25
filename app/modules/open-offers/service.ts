import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  CompanyOffersHubResponse,
  CreateOpenOfferPayload,
  OpenOfferDetail,
  OpenOfferItem,
  OpenOfferJobTypeOption,
  SelectOpenOfferCreatorPayload,
  SelectOpenOfferCreatorResult,
} from "./types";

export async function getMyCompanyOpenOfferDetail(
  offerId: string,
  token?: string
): Promise<OpenOfferDetail> {
  const accessToken = await getAccessToken(token);
  return httpClient<OpenOfferDetail>(`/open-offers/my/${offerId}`, {
    token: accessToken,
  });
}

export async function createOpenOffer(
  payload: CreateOpenOfferPayload,
  token?: string
): Promise<OpenOfferItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<OpenOfferItem>("/open-offers", {
    method: "POST",
    body: payload,
    token: accessToken,
  });
}

export async function cancelOpenOffer(offerId: string, token?: string): Promise<OpenOfferItem> {
  const accessToken = await getAccessToken(token);
  return httpClient<OpenOfferItem>(`/open-offers/my/${offerId}/cancel`, {
    method: "PATCH",
    token: accessToken,
  });
}

export async function selectOpenOfferCreator(
  payload: SelectOpenOfferCreatorPayload,
  token?: string
): Promise<SelectOpenOfferCreatorResult> {
  const accessToken = await getAccessToken(token);
  return httpClient<SelectOpenOfferCreatorResult>(
    `/open-offers/my/${payload.offerId}/select/${payload.applicationId}`,
    {
      method: "POST",
      body: payload.legalAcceptance ? { legalAcceptance: payload.legalAcceptance } : {},
      token: accessToken,
    }
  );
}

export async function getCompanyOffersHub(token?: string): Promise<CompanyOffersHubResponse> {
  const accessToken = await getAccessToken(token);
  return httpClient<CompanyOffersHubResponse>("/company/offers/hub", {
    token: accessToken,
  });
}

export async function getJobTypesForOpenOffers(token?: string): Promise<OpenOfferJobTypeOption[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<OpenOfferJobTypeOption[]>("/job-types", {
    token: accessToken,
  });
}
