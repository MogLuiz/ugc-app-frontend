import { CreatorCard, type CreatorCardModel } from "~/modules/creators/components/creator-card";

const nearbyCreators: CreatorCardModel[] = [
  {
    id: "1",
    name: "Ana Souza",
    niche: "Moda e beleza",
    neighborhood: "Savassi",
    rating: 4.9,
    deliveryPrice: 280,
    distanceKm: 3,
    transportFee: 24
  },
  {
    id: "2",
    name: "Bruna Lima",
    niche: "Gastronomia",
    neighborhood: "Funcionarios",
    rating: 4.7,
    deliveryPrice: 250,
    distanceKm: 5,
    transportFee: 40
  }
];

export default function HomeRoute() {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold">Criadoras proximas de voce</h1>
        <p className="text-sm text-slate-600">Descubra perfis locais para campanhas UGC em Belo Horizonte.</p>
      </header>

      <div className="space-y-3">
        {nearbyCreators.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </section>
  );
}
