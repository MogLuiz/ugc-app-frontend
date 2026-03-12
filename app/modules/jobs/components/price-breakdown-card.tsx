import { Card } from "~/components/ui/card";
import { calculateJobPrice } from "~/modules/jobs/pricing";

type PriceBreakdownCardProps = {
  basePrice: number;
  distanceKm: number;
  transportRatePerKm: number;
};

export function PriceBreakdownCard({ basePrice, distanceKm, transportRatePerKm }: PriceBreakdownCardProps) {
  const breakdown = calculateJobPrice({ basePrice, distanceKm, transportRatePerKm });

  return (
    <Card>
      <h3 className="text-sm font-semibold">Resumo do orcamento</h3>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span>Valor do video</span>
          <strong>R$ {breakdown.basePrice.toFixed(2)}</strong>
        </div>
        <div className="flex items-center justify-between">
          <span>Taxa de transporte</span>
          <strong>R$ {breakdown.transportFee.toFixed(2)}</strong>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-base">
          <span>Valor total</span>
          <strong>R$ {breakdown.totalPrice.toFixed(2)}</strong>
        </div>
      </div>
    </Card>
  );
}
