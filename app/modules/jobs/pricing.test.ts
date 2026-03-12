import { calculateJobPrice } from "~/modules/jobs/pricing";

describe("calculateJobPrice", () => {
  it("deve somar preco base com transporte", () => {
    const result = calculateJobPrice({
      basePrice: 200,
      distanceKm: 5,
      transportRatePerKm: 8
    });

    expect(result.basePrice).toBe(200);
    expect(result.transportFee).toBe(40);
    expect(result.totalPrice).toBe(240);
  });
});
