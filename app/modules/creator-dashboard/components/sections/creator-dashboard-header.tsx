import { MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router";

export function CreatorDashboardHeader({
  creatorName,
}: {
  creatorName: string;
}) {
  return (
    <>
      {/* Desktop header */}
      <div className="hidden lg:block">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.75px] text-[#2c2f30]">
              Bem-vindo, {creatorName}! 👋
            </h1>
            <p className="mt-2 max-w-xl text-base text-[#595c5d]">
              Veja suas campanhas, convites e oportunidades perto de você.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <Link
              to="/mapa"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#6a36d5] px-6 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#5b2fc4]"
            >
              <MapPin className="size-4" />
              Oportunidades no mapa
            </Link>
            <Link
              to="/chat"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[rgba(106,54,213,0.25)] px-6 text-sm font-semibold text-[#6a36d5] transition-colors hover:bg-[rgba(106,54,213,0.05)]"
            >
              <MessageCircle className="size-4" />
              Mensagens
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile greeting section (below AppHeader) */}
      <section className="mt-2 lg:hidden">
        <h2 className="text-2xl font-black tracking-[-0.5px] text-[#2c2f30]">
          Bem-vindo, {creatorName}! 👋
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#595c5d]">
          Veja suas campanhas, convites e oportunidades perto de você.
        </p>
        <Link
          to="/mapa"
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#6a36d5] text-base font-bold text-white shadow-md transition-colors hover:bg-[#5b2fc4]"
        >
          <MapPin className="size-5" />
          Ver oportunidades perto de você
        </Link>
      </section>
    </>
  );
}
