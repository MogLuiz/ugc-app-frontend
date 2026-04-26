import { formatCurrency } from "~/modules/contract-requests/utils";

export function isOpenOfferExpired(expiresAt?: string | null, now = Date.now()) {
  if (!expiresAt) return false;
  const target = new Date(expiresAt).getTime();
  if (Number.isNaN(target)) return false;
  return target <= now;
}

export function getRemainingMs(expiresAt?: string | null, now = Date.now()) {
  if (!expiresAt) return null;
  const target = new Date(expiresAt).getTime();
  if (Number.isNaN(target)) return null;
  return target - now;
}

export function formatOfferExpiry(expiresInMs: number | null) {
  if (expiresInMs == null) return "Prazo indisponível";
  if (expiresInMs <= 0) return "Expirada";

  const totalMinutes = Math.ceil(expiresInMs / 60_000);
  const totalHours = Math.ceil(expiresInMs / 3_600_000);
  const totalDays = Math.ceil(expiresInMs / 86_400_000);

  if (totalMinutes < 60) {
    return `Expira em ${totalMinutes} min`;
  }
  if (totalHours < 24) {
    return `Expira em ${totalHours}h`;
  }
  return `Expira em ${totalDays} dia${totalDays > 1 ? "s" : ""}`;
}

/** `valueCents`: centavos de BRL (ex.: `companyTotalAmountCents` / `amount` do hub). */
export function formatOfferMoney(valueCents: number) {
  return formatCurrency(valueCents / 100, "BRL");
}

// ─── Address helpers ──────────────────────────────────────────────────────────

type AddressProfile = {
  addressStreet?: string | null;
  addressNumber?: string | null;
  addressCity?: string | null;
  addressState?: string | null;
  addressZipCode?: string | null;
} | null | undefined;

/**
 * Formats a profile's address fields into a single string for geocoding.
 * Returns "" when the profile has no usable address.
 * Format: "Street, Number - City/State - CEP 00000-000"
 */
export function formatProfileAddress(profile: AddressProfile): string {
  return (
    [
      [profile?.addressStreet, profile?.addressNumber].filter(Boolean).join(", "),
      profile?.addressCity
        ? profile?.addressState
          ? `${profile.addressCity}/${profile.addressState}`
          : profile.addressCity
        : null,
      profile?.addressZipCode ? `CEP ${profile.addressZipCode}` : null,
    ]
      .filter(Boolean)
      .join(" - ") || ""
  );
}

/**
 * Returns true only when all 5 address fields are present and non-empty.
 * A partial address is not considered usable because it may not geocode reliably.
 */
export function hasUsableCompanyAddress(profile: AddressProfile): boolean {
  return !!(
    profile?.addressStreet?.trim() &&
    profile?.addressNumber?.trim() &&
    profile?.addressCity?.trim() &&
    profile?.addressState?.trim() &&
    profile?.addressZipCode?.trim()
  );
}
