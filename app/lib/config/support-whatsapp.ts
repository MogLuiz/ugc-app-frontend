/** Apenas dígitos, com DDI (ex.: 5511999999999). Atualizar com o número oficial de suporte. */
export const SUPPORT_WHATSAPP_PHONE_E164 = "+5531982928837";
const SUPPORT_MESSAGES = {
  creator: "Olá, sou creator e preciso de suporte no UGC Local.",
  business: "Olá, sou uma empresa e preciso de suporte no UGC Local.",
} as const;

export type SupportWhatsAppContext = keyof typeof SUPPORT_MESSAGES;

export function getSupportWhatsAppUrl(context: SupportWhatsAppContext): string {
  const text = SUPPORT_MESSAGES[context];
  const params = new URLSearchParams({ text });
  return `https://wa.me/${SUPPORT_WHATSAPP_PHONE_E164}?${params.toString()}`;
}
