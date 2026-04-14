import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  CreateOpenOfferPayload,
  OpenOfferDetail,
  OpenOfferItem,
  OpenOfferJobTypeOption,
  OpenOfferListResponse,
  SelectOpenOfferCreatorPayload,
  SelectOpenOfferCreatorResult,
} from "./types";

export async function getMyCompanyOpenOffers(params?: {
  page?: number;
  limit?: number;
  status?: string;
  token?: string;
}): Promise<OpenOfferListResponse> {
  const accessToken = await getAccessToken(params?.token);
  const searchParams = new URLSearchParams();

  searchParams.set("page", String(params?.page ?? 1));
  searchParams.set("limit", String(params?.limit ?? 20));

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  return httpClient<OpenOfferListResponse>(`/open-offers/my?${searchParams.toString()}`, {
    token: accessToken,
  });
}

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
      token: accessToken,
    }
  );
}

export async function getJobTypesForOpenOffers(token?: string): Promise<OpenOfferJobTypeOption[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<OpenOfferJobTypeOption[]>("/job-types", {
    token: accessToken,
  });
}
