import type { CreatorProfile } from "../../types";
import {
  ArrowRight,
  Check,
  Clock,
  Eye,
  MapPin,
  Star,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type CreatorProfileHeaderSectionProps = {
  profile: CreatorProfile;
};

type CreatorPortfolioSectionProps = {
  profile: CreatorProfile;
};

type CreatorLocationSectionProps = {
  profile: CreatorProfile;
};

type CreatorServicesSectionProps = {
  availability: Array<{ day: string; date: string; available: boolean }>;
  profile: CreatorProfile;
  selectedServiceId: string;
  onSelectService: (id: string) => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function CreatorProfileHeroSection({
  profile,
}: CreatorProfileHeaderSectionProps) {
  return (
    <section className="rounded-[32px] border border-[#f1f5f9] bg-white p-5 shadow-sm lg:rounded-[48px] lg:p-6 lg:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left lg:gap-6">
        <div className="relative shrink-0">
          <div className="overflow-hidden rounded-full border-4 border-[rgba(137,90,246,0.1)] shadow-lg ring-4 ring-[rgba(137,90,246,0.08)] lg:h-32 lg:w-32">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-28 w-28 object-cover lg:h-32 lg:w-32"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center bg-[rgba(137,90,246,0.12)] text-2xl font-bold text-[#895af6] lg:h-32 lg:w-32">
                {getInitials(profile.name)}
              </div>
            )}
          </div>
          {profile.isOnline ? (
            <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-white bg-[#22c55e]" />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-3">
            <h2 className="text-2xl font-bold text-[#0f172a] lg:text-[30px] lg:leading-9">
              {profile.name}
            </h2>
            {profile.isVerified ? (
              <Check className="h-5 w-5 shrink-0 text-[#895af6]" strokeWidth={2.5} />
            ) : null}
          </div>
          <p className="text-base font-medium text-[#895af6] lg:text-[#64748b]">
            {profile.specialty}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#475569] sm:justify-start lg:gap-4">
            <div className="flex items-center gap-1 rounded-full bg-[rgba(137,90,246,0.1)] px-3 py-1">
              <Star className="h-3.5 w-3.5 fill-[#895af6] text-[#895af6]" />
              <span className="font-bold text-[#895af6]">{profile.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {profile.jobsCount} jobs realizados
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {profile.responseTime}
            </div>
            <div className="flex items-center gap-1 sm:hidden">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location.city}, {profile.location.state}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CreatorQuickActions() {
  return (
    <section className="flex justify-center gap-3 lg:hidden">
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
    </section>
  );
}

export function CreatorPortfolioSection({
  profile,
}: CreatorPortfolioSectionProps) {
  if (profile.portfolio.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0f172a] lg:text-xl">
          Portfólio em Destaque
        </h3>
        <button type="button" className="text-sm font-semibold text-[#895af6]">
          Ver tudo
        </button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {profile.portfolio.map((item) => (
          <div
            key={item.id}
            className="relative h-[300px] min-w-[160px] shrink-0 overflow-hidden rounded-[48px] bg-[#e2e8f0] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] lg:h-auto lg:min-w-0"
          >
            <div className="absolute inset-0 hidden lg:block" />
            <div className="h-full w-full lg:aspect-[3/4]">
              <img
                src={item.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            {item.views ? (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm lg:hidden">
                <Eye className="h-2.5 w-2.5 text-white" />
                <span className="text-[10px] text-white">{item.views}</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export function CreatorLocationSection({
  profile,
}: CreatorLocationSectionProps) {
  return (
    <section className="rounded-[32px] border border-[rgba(137,90,246,0.05)] bg-white p-4 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:rounded-[48px] lg:p-6">
      <div className="mb-3 flex items-center gap-2 lg:mb-4">
        <MapPin className="h-5 w-5 text-[#895af6]" />
        <h3 className="text-lg font-bold text-[#0f172a] lg:text-xl">Localização</h3>
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
        <div className="flex flex-1 flex-col gap-2">
          <p className="font-semibold text-[#0f172a] lg:text-lg">
            {profile.location.city}, {profile.location.state}
          </p>
          <p className="text-sm leading-6 text-[#64748b] lg:text-base">
            {profile.location.description}
          </p>
          <div className="inline-flex items-center gap-2 self-start rounded-[32px] bg-[#f1f5f9] px-3 py-1.5">
            <MapPin className="h-4 w-4 text-[#0f172a]" />
            <span className="text-sm font-semibold text-[#0f172a]">
              {profile.location.distanceKm} km de distância do seu negócio
            </span>
          </div>
        </div>
        <div className="h-32 overflow-hidden rounded-[32px] border border-[#e2e8f0] bg-[#f1f5f9] lg:w-64 lg:shrink-0">
          <div className="flex h-full w-full items-center justify-center">
            <MapPin className="h-9 w-9 text-[#94a3b8]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function CreatorTestimonialsSection({
  profile,
}: CreatorProfileHeaderSectionProps) {
  if (profile.testimonials.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-[#0f172a] lg:text-xl">
        Depoimentos de Clientes
      </h3>
      <div className="flex flex-col gap-4">
        {profile.testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="rounded-[32px] border border-[#f1f5f9] bg-white p-5 lg:rounded-[48px]"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.2)] text-base font-bold text-[#895af6]">
                  {testimonial.authorInitials}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f172a]">
                    {testimonial.authorName}
                  </p>
                  <p className="text-xs text-[#64748b]">
                    {testimonial.authorRole}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
            <p className="text-sm leading-5 text-[#475569]">{testimonial.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CreatorServicesSection({
  availability,
  profile,
  selectedServiceId,
  onSelectService,
}: CreatorServicesSectionProps) {
  return (
    <section className="rounded-[32px] border border-[rgba(137,90,246,0.1)] bg-white p-5 shadow-sm lg:sticky lg:top-6 lg:rounded-[48px] lg:border-2 lg:p-6 lg:shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]">
      <h3 className="mb-4 text-lg font-bold text-[#0f172a] lg:text-xl">
        Reservar Criador
      </h3>

      <div className="mb-6">
        <p className="mb-3 text-sm font-bold text-[#334155]">
          Disponibilidade próxima semana
        </p>
        <div className="grid grid-cols-7 gap-1">
          {availability.map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-[#94a3b8]">
                {item.day}
              </span>
              <div
                className={cn(
                  "flex h-8 w-full items-center justify-center rounded-md text-xs font-bold",
                  item.available
                    ? "bg-[#895af6] text-white"
                    : "bg-[#f1f5f9] text-[#94a3b8]"
                )}
              >
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-[#334155]">Serviços</p>
          <span className="rounded-full bg-[rgba(137,90,246,0.1)] px-2 py-1 text-xs font-bold text-[#895af6] lg:hidden">
            {profile.services.length} opções
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {profile.services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelectService(service.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-[48px] border p-3 text-left transition",
                selectedServiceId === service.id
                  ? "border-[#895af6] bg-[rgba(137,90,246,0.05)]"
                  : "border-[#e2e8f0]"
              )}
            >
              <span className="text-sm font-medium text-[#0f172a]">
                {service.name}
              </span>
              <span className="text-sm font-bold text-[#895af6]">
                R$ {service.price}
              </span>
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="purple"
        className="hidden h-14 w-full gap-2 rounded-full text-lg font-bold lg:flex"
      >
        Solicitar Job
        <ArrowRight className="h-5 w-5" />
      </Button>
      <p className="mt-4 text-center text-[11px] leading-[18px] text-[#94a3b8]">
        Ao solicitar o job, você inicia uma conversa segura com a criadora. O
        pagamento só é liberado após a aprovação final do vídeo.
      </p>
    </section>
  );
}

export function CreatorStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e2e8f0] bg-white/80 px-4 py-4 backdrop-blur-xl lg:hidden">
      <Button
        variant="purple"
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full text-lg font-bold shadow-[0px_20px_25px_-5px_rgba(137,90,246,0.3)]"
      >
        <ArrowRight className="h-5 w-5" />
        Solicitar Job
      </Button>
    </div>
  );
}
