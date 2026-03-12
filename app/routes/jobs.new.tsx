import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { PriceBreakdownCard } from "~/modules/jobs/components/price-breakdown-card";

export default function NewJobRoute() {
  return (
    <section className="space-y-4">
      <h1 className="text-lg font-semibold">Criar novo job</h1>
      <Card className="space-y-3">
        <Input placeholder="Titulo da campanha" />
        <Input placeholder="Descricao da entrega" />
        <Button className="w-full">Continuar para revisao</Button>
      </Card>
      <PriceBreakdownCard basePrice={320} distanceKm={6} transportRatePerKm={8} />
    </section>
  );
}
