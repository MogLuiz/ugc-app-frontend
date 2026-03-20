import { Check, Clock, MapPin, Star } from "lucide-react";
import type { CreatorProfile } from "../../types";

type CreatorProfileHeaderSectionProps = {
  profile: CreatorProfile;
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
