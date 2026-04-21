import { getSupportWhatsAppNumberEnv } from "~/lib/env";

const SUPPORT_MESSAGES = {
  creator: "Olá, sou creator e preciso de suporte no UGC Local.",
  business: "Olá, sou uma empresa e preciso de suporte no UGC Local.",
} as const;

export type SupportWhatsAppContext = keyof typeof SUPPORT_MESSAGES;

function sanitizeWhatsAppNumber(value: string): string {
  return value.replace(/\D/g, "");
}

function getSupportWhatsAppNumber(): string | null {
  const configured = getSupportWhatsAppNumberEnv();
  if (!configured) {
    return null;
  }

  const sanitized = sanitizeWhatsAppNumber(configured);
  return sanitized.length >= 10 ? sanitized : null;
}

export function getSupportWhatsAppUrl(context: SupportWhatsAppContext): string | null {
  const phone = getSupportWhatsAppNumber();
  if (!phone) {
    return null;
  }

  const text = SUPPORT_MESSAGES[context];
  const params = new URLSearchParams({ text });
  return `https://wa.me/${phone}?${params.toString()}`;
}
