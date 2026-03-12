export type PriceBreakdownInput = {
  basePrice: number;
  distanceKm: number;
  transportRatePerKm: number;
};

export type PriceBreakdown = {
  basePrice: number;
  transportFee: number;
  totalPrice: number;
};

export function calculateJobPrice(input: PriceBreakdownInput): PriceBreakdown {
  const transportFee = input.distanceKm * input.transportRatePerKm;
  const totalPrice = input.basePrice + transportFee;

  return {
    basePrice: input.basePrice,
    transportFee,
    totalPrice
  };
}
