import { ArrowRight, Eye, MapPin, Star } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { CreatorProfile } from "../types";

type CreatorProfileMobileProps = {
  profile: CreatorProfile;
};

export function CreatorProfileMobile({ profile }: CreatorProfileMobileProps) {
  return (
    <div className="relative min-h-screen bg-[#f6f5f8] pb-24">
      {/* Top app bar */}
      <header className="sticky top-0 z-30 flex items-center gap-4 bg-[rgba(246,245,248,0.8)] px-4 py-4 backdrop-blur-md">
        <Link
          to="/mapa"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(137,90,246,0.1)] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]"
        >
          <ArrowRight className="h-4 w-4 rotate-180 text-[#895af6]" />
        </Link>
        <h1 className="text-lg font-bold text-[#0f172a]">Perfil do Criador</h1>
      </header>

      {/* Profile header */}
      <div className="relative px-4 pt-4">
        <div className="flex flex-col items-center pt-16">
          <div className="relative">
            <div className="overflow-hidden rounded-full border-4 border-white p-1 shadow-lg ring-4 ring-[rgba(137,90,246,0.1)]">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-32 w-32 object-cover"
              />
            </div>
            {profile.isOnline && (
              <div
                className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-[#f6f5f8] bg-[#22c55e]"
                aria-hidden
              />
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#0f172a]">{profile.name}</h2>
          <p className="text-base font-medium text-[#895af6]">Criadora de Conteúdo UGC</p>
          <div className="mt-1 flex items-center gap-1 text-sm text-[#64748b]">
            <MapPin className="h-3.5 w-3.5" />
            {profile.location.city}, {profile.location.state}
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <span className="text-xl font-bold text-[#0f172a]">{profile.jobsCount}</span>
            <span className="text-[10px] font-normal uppercase tracking-wider text-[#64748b]">
              Jobs
            </span>
          </div>
          <div className="flex flex-col items-center rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <span className="text-xl font-bold text-[#0f172a]">15k</span>
            <span className="text-[10px] font-normal uppercase tracking-wider text-[#64748b]">
              Seguidores
            </span>
          </div>
          <div className="flex flex-col items-center rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-3 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-[#895af6]">{profile.rating}</span>
              <Star className="h-4 w-4 fill-[#895af6] text-[#895af6]" />
            </div>
            <span className="text-[10px] font-normal uppercase tracking-wider text-[#64748b]">
              Rating
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex justify-center gap-3 px-4">
        <Button
          variant="purple"
          className="h-12 flex-1 max-w-[172px] rounded-full font-bold"
        >
          Seguir
        </Button>
        <button
          type="button"
          className="flex h-12 flex-1 max-w-[174px] items-center justify-center rounded-full border border-[rgba(137,90,246,0.2)] bg-[rgba(137,90,246,0.1)] font-bold text-[#895af6]"
        >
          Mensagem
        </button>
      </div>

      {/* Portfolio horizontal scroll */}
      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between px-4">
          <h3 className="text-lg font-bold text-[#0f172a]">Portfolio Recente</h3>
          <button type="button" className="text-sm font-semibold text-[#895af6]">
            Ver todos
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-4">
          {profile.portfolio.map((item) => (
            <div
              key={item.id}
              className="relative h-[300px] min-w-[160px] shrink-0 overflow-hidden rounded-[48px] bg-[#e2e8f0] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]"
            >
              <img
                src={item.imageUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              {item.views && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
                  <Eye className="h-2.5 w-2.5 text-white" />
                  <span className="text-[10px] text-white">{item.views}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Location card */}
      <section className="mt-8 px-4">
        <h3 className="mb-3 text-lg font-bold text-[#0f172a]">Onde estou</h3>
        <div className="rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[32px] bg-[rgba(137,90,246,0.1)]">
              <MapPin className="h-5 w-5 text-[#895af6]" />
            </div>
            <div>
              <p className="font-semibold text-[#0f172a]">
                {profile.location.city}, {profile.location.state}
              </p>
              <p className="text-sm text-[#64748b]">
                {profile.location.distanceKm} km de distância de você
              </p>
            </div>
          </div>
          <div className="mt-4 h-32 rounded-[32px] border border-[#e2e8f0] bg-[#f1f5f9]">
            <div className="flex h-full w-full items-center justify-center">
              <MapPin className="h-9 w-9 text-[#94a3b8]" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mt-8 px-4">
        <h3 className="mb-3 text-lg font-bold text-[#0f172a]">Serviços e Disponibilidade</h3>
        <div className="flex flex-col gap-3">
          {profile.services.map((svc) => (
            <div
              key={svc.id}
              className="flex items-center justify-between rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-4"
            >
              <span className="text-sm font-medium text-[#0f172a]">{svc.name}</span>
              <span className="text-sm font-bold text-[#895af6]">R$ {svc.price}</span>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-[48px] border border-[rgba(137,90,246,0.05)] bg-white p-4">
            <span className="text-sm font-medium text-[#0f172a]">Próxima data livre</span>
            <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-[10px] font-bold uppercase text-[#16a34a]">
              {profile.availability[0] ?? "—"} Out
            </span>
          </div>
        </div>
      </section>

      {/* Sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e2e8f0] bg-white/80 px-4 py-4 backdrop-blur-xl">
        <Button
          variant="purple"
          className="flex h-14 w-full items-center justify-center gap-2 rounded-full text-lg font-bold shadow-[0px_20px_25px_-5px_rgba(137,90,246,0.3)]"
        >
          <ArrowRight className="h-5 w-5" />
          Solicitar Job
        </Button>
      </div>
    </div>
  );
}
