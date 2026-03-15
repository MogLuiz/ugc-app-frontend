import { useState } from "react";
import { Link, useParams } from "react-router";
import { CreatorProfileDesktop } from "./creator-profile-desktop";
import { CreatorProfileMobile } from "./creator-profile-mobile";
import { MOCK_CREATOR_PROFILES } from "../data/mock-creator-profile";

export function CreatorProfileScreen() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");

  const profile = creatorId ? MOCK_CREATOR_PROFILES[creatorId] : null;

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f8]">
        <div className="text-center">
          <p className="text-lg text-[#64748b]">Criador não encontrado.</p>
          <Link to="/mapa" className="mt-4 inline-block text-[#895af6] hover:underline">
            Voltar para o mapa
          </Link>
        </div>
      </div>
    );
  }

  const defaultService = profile.services[0]?.id ?? "";
  const effectiveService = selectedServiceId || defaultService;

  return (
    <>
      <div className="hidden lg:block">
        <CreatorProfileDesktop
          profile={profile}
          selectedServiceId={effectiveService}
          onSelectService={setSelectedServiceId}
        />
      </div>
      <div className="lg:hidden">
        <CreatorProfileMobile profile={profile} />
      </div>
    </>
  );
}
