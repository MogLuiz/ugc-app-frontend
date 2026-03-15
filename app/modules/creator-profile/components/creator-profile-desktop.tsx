import { ArrowRight, Check, Clock, MapPin, Star } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import type { CreatorProfile } from "../types";

const WEEK_DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];
const WEEK_DATES = ["15", "16", "17", "18", "19", "20", "21"];

type CreatorProfileDesktopProps = {
  profile: CreatorProfile;
  selectedServiceId: string;
  onSelectService: (id: string) => void;
};

export function CreatorProfileDesktop({
  profile,
  selectedServiceId,
  onSelectService
}: CreatorProfileDesktopProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f6f5f8] px-6 pb-1 md:px-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-6">
        {/* Header */}
        <header className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center">
              <div className="h-8 w-8 rounded-lg bg-[#895af6]/20" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">UGC Local</h1>
          </div>
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] bg-white px-5 py-2.5 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-slate-50"
          >
            <ArrowRight className="h-3.5 w-3.5 rotate-180" />
            Voltar para busca
          </Link>
        </header>

        {/* Main grid */}
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            {/* Profile card */}
            <section className="rounded-[48px] border border-[#f1f5f9] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="flex gap-6">
                <div className="relative shrink-0">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[rgba(137,90,246,0.1)]">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {profile.isOnline && (
                    <div
                      className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-white bg-[#22c55e]"
                      aria-hidden
                    />
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-[30px] font-bold leading-9 text-[#0f172a]">{profile.name}</h2>
                    {profile.isVerified && (
                      <Check className="h-5 w-5 shrink-0 text-[#895af6]" strokeWidth={2.5} />
                    )}
                  </div>
                  <p className="text-base font-medium text-[#64748b]">{profile.specialty}</p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <div className="flex items-center gap-1 rounded-full bg-[rgba(137,90,246,0.1)] px-3 py-1">
                      <Star className="h-3.5 w-3.5 fill-[#895af6] text-[#895af6]" />
                      <span className="text-sm font-bold text-[#895af6]">{profile.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#475569]">
                      <Clock className="h-3.5 w-3.5" />
                      {profile.jobsCount} jobs realizados
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#475569]">
                      <Clock className="h-3.5 w-3.5" />
                      {profile.responseTime}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Portfolio */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#0f172a]">Portfólio em Destaque</h3>
                <button type="button" className="text-sm font-semibold text-[#895af6]">
                  Ver tudo
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {profile.portfolio.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-[48px] bg-[#e2e8f0]"
                  >
                    <div className="aspect-[3/4] w-full">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Location */}
            <section className="rounded-[48px] border border-[#f1f5f9] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#895af6]" />
                <h3 className="text-xl font-bold text-[#0f172a]">Localização</h3>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-lg font-medium text-[#0f172a]">
                    {profile.location.city}, {profile.location.state}
                  </p>
                  <p className="text-base leading-6 text-[#64748b]">
                    {profile.location.description}
                  </p>
                  <div className="inline-flex items-center gap-2 self-start rounded-[32px] bg-[#f1f5f9] px-3 py-1.5">
                    <MapPin className="h-4 w-4 text-[#0f172a]" />
                    <span className="text-sm font-semibold text-[#0f172a]">
                      {profile.location.distanceKm} km de distância do seu negócio
                    </span>
                  </div>
                </div>
                <div className="h-32 w-64 shrink-0 overflow-hidden rounded-[32px] bg-[#e2e8f0]">
                  <div className="flex h-full w-full items-center justify-center bg-[#e2e8f0]">
                    <MapPin className="h-9 w-9 text-[#94a3b8]" />
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials */}
            {profile.testimonials.length > 0 && (
              <section className="flex flex-col gap-4">
                <h3 className="text-xl font-bold text-[#0f172a]">Depoimentos de Clientes</h3>
                <div className="flex flex-col gap-4">
                  {profile.testimonials.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-[48px] border border-[#f1f5f9] bg-white p-5"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.2)] text-base font-bold text-[#895af6]">
                            {t.authorInitials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#0f172a]">{t.authorName}</p>
                            <p className="text-xs text-[#64748b]">{t.authorRole}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm leading-5 text-[#475569]">{t.text}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right column - Booking sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 rounded-[48px] border-2 border-[rgba(137,90,246,0.2)] bg-white p-6 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
              <h3 className="mb-4 text-xl font-bold text-[#0f172a]">Reservar Criador</h3>

              {/* Availability */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-bold text-[#334155]">
                  Disponibilidade próxima semana
                </p>
                <div className="grid grid-cols-7 gap-1">
                  {WEEK_DAYS.map((day, i) => {
                    const date = WEEK_DATES[i] ?? "";
                    return (
                      <div key={day} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-bold text-[#94a3b8]">{day}</span>
                        <div
                          className={`flex h-8 w-full items-center justify-center rounded-md text-xs font-bold ${
                            profile.availability.includes(date)
                              ? "bg-[#895af6] text-white"
                              : "bg-[#f1f5f9] text-[#94a3b8]"
                          }`}
                        >
                          {date}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-bold text-[#334155]">Serviços</p>
                <div className="flex flex-col gap-2">
                  {profile.services.map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => onSelectService(svc.id)}
                      className={`flex w-full items-center justify-between rounded-[48px] border p-3 text-left transition ${
                        selectedServiceId === svc.id
                          ? "border-[#895af6] bg-[rgba(137,90,246,0.05)]"
                          : "border-[#e2e8f0]"
                      }`}
                    >
                      <span className="text-sm font-medium text-[#0f172a]">{svc.name}</span>
                      <span className="text-sm font-bold text-[#895af6]">
                        R$ {svc.price}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant="purple"
                className="mb-4 h-14 w-full gap-2 rounded-full text-lg font-bold"
              >
                Solicitar Job
                <ArrowRight className="h-5 w-5" />
              </Button>
              <p className="text-center text-[11px] leading-[18px] text-[#94a3b8]">
                Ao solicitar o job, você inicia uma conversa segura com a criadora. O pagamento só
                é liberado após a aprovação final do vídeo.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
