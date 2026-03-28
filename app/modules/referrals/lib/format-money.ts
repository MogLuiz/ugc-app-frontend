/** Formata centavos para moeda (ex.: BRL). */
export function formatMoneyFromCents(
  cents: number,
  currency: string
): string {
  const value = cents / 100;
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.length === 3 ? currency : "BRL",
    }).format(value);
  } catch {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }
}
