import { getApiBaseUrl } from "~/lib/config/env";
import { HttpError, normalizeHttpError } from "~/lib/http/errors";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HttpRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
  /** Bearer token para requisições autenticadas (Supabase access_token) */
  token?: string;
};

type ErrorPayload = {
  message?: string;
};

export async function httpClient<TResponse>(path: string, options: HttpRequestOptions = {}): Promise<TResponse> {
  const url = new URL(path, getApiBaseUrl());
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers
  };
  if (options.token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${options.token}`;
  }
  const response = await fetch(url, {
    method: options.method ?? "GET",
    credentials: "include",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const normalizedError = normalizeHttpError(response.status, payload);
    const messageFromPayload = typeof payload === "object" && payload !== null ? (payload as ErrorPayload).message : undefined;

    throw new HttpError(normalizedError.status, messageFromPayload ?? normalizedError.message, payload);
  }

  return payload as TResponse;
}

async function parseResponse(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  if (contentType.includes("text/")) {
    return response.text();
  }

  return null;
}
