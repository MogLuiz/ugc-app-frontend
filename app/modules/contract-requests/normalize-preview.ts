import type { ContractRequestItem } from "./types";
import { formatCurrency } from "./utils";

/**
 * Garante `transport.formatted` quando a API manda `transportFeeAmountCents` mas
 * o objeto `transport` vem ausente ou nulo.
 */
export function normalizeContractRequestPreview(
  result: unknown
): ContractRequestItem {
  if (result == null || typeof result !== "object") {
    return result as ContractRequestItem;
  }

  const r = result as Record<string, unknown>;
  const rawTransport = r.transport;
  const feeCents = r.transportFeeAmountCents;
  const currency = (r.currency as string) ?? "BRL";

  const needsSynthesis =
    (rawTransport == null || rawTransport === undefined) &&
    feeCents != null &&
    typeof feeCents === "number" &&
    Number.isFinite(feeCents);

  if (needsSynthesis) {
    return {
      ...r,
      transport: {
        price: (feeCents as number) / 100,
        formatted: formatCurrency((feeCents as number) / 100, currency),
        isMinimumApplied: Boolean(r.transportIsMinimumApplied),
      },
    } as ContractRequestItem;
  }

  return result as ContractRequestItem;
}
