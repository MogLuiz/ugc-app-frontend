import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type { CreatorJobTypeItem } from "./types";

export async function getCreatorJobTypes(
  token?: string,
): Promise<CreatorJobTypeItem[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<CreatorJobTypeItem[]>("/creator/job-types", {
    token: accessToken,
  });
}

export async function replaceCreatorJobTypes(
  jobTypeIds: string[],
  token?: string,
): Promise<CreatorJobTypeItem[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<CreatorJobTypeItem[]>("/creator/job-types", {
    method: "PUT",
    body: { jobTypeIds },
    token: accessToken,
  });
}
