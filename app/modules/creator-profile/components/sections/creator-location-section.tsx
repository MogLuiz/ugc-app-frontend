import { MapPin } from "lucide-react";
import type { CreatorProfile } from "../../types";

type CreatorLocationSectionProps = {
  profile: CreatorProfile;
};

export function CreatorLocationSection({ profile }: CreatorLocationSectionProps) {
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
