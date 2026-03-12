import { MapPin, Star } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export type CreatorCardModel = {
  id: string;
  name: string;
  niche: string;
  neighborhood: string;
  rating: number;
  deliveryPrice: number;
  distanceKm: number;
  transportFee: number;
};

export function CreatorCard({ creator }: { creator: CreatorCardModel }) {
  const total = creator.deliveryPrice + creator.transportFee;

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">{creator.name}</h3>
          <p className="text-xs text-slate-600">{creator.niche}</p>
        </div>
        <Badge>
          <Star size={12} className="mr-1" />
          {creator.rating.toFixed(1)}
        </Badge>
      </div>

      <p className="flex items-center gap-1 text-xs text-slate-600">
        <MapPin size={12} />
        {creator.neighborhood} - {creator.distanceKm} km
      </p>

      <div className="rounded-xl bg-slate-50 p-3 text-xs">
        <div className="flex items-center justify-between">
          <span>Video</span>
          <strong>R$ {creator.deliveryPrice.toFixed(2)}</strong>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>Transporte</span>
          <strong>R$ {creator.transportFee.toFixed(2)}</strong>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-sm">
          <span>Total</span>
          <strong>R$ {total.toFixed(2)}</strong>
        </div>
      </div>

      <Button className="w-full">Ver perfil</Button>
    </Card>
  );
}
