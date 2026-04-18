import { httpClient } from "~/lib/http/client";
import { getAccessToken } from "~/modules/auth/service";
import type {
  CreatorPayout,
  InitiatePaymentResponse,
  Payment,
} from "../types/payment.types";

export async function initiatePayment(
  contractRequestId: string,
  token?: string
): Promise<InitiatePaymentResponse> {
  const accessToken = await getAccessToken(token);
  return httpClient<InitiatePaymentResponse>("/payments/initiate", {
    method: "POST",
    body: { contractRequestId },
    token: accessToken,
  });
}

export async function getPayment(
  paymentId: string,
  token?: string
): Promise<Payment> {
  const accessToken = await getAccessToken(token);
  return httpClient<Payment>(`/payments/${paymentId}`, {
    token: accessToken,
  });
}

export type ProcessPaymentInput = {
  token: string;
  paymentMethodId: string;
  issuerId: string | null;
  installments: number;
  transactionAmount: number;
  payerEmail: string;
  payerDocument: { type: string; number: string } | null;
};

export async function processPayment(
  paymentId: string,
  data: ProcessPaymentInput,
  token?: string
): Promise<Payment> {
  const accessToken = await getAccessToken(token);
  return httpClient<Payment>(`/payments/${paymentId}/process`, {
    method: "POST",
    body: data,
    token: accessToken,
  });
}

export async function getMyPayouts(token?: string): Promise<CreatorPayout[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<CreatorPayout[]>("/payouts/my", {
    token: accessToken,
  });
}

export async function getCompanyPayments(token?: string): Promise<Payment[]> {
  const accessToken = await getAccessToken(token);
  return httpClient<Payment[]>("/payments", {
    token: accessToken,
  });
}
