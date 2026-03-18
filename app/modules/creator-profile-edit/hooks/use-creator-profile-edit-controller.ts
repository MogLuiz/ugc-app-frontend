import { useState } from "react";
import type { AuthUser } from "~/modules/auth/types";
import type { CreatorService, DayOfWeek } from "../types";

const DEFAULT_SERVICES: CreatorService[] = [
  {
    id: "1",
    title: "Vídeo 30s",
    description: "Edição inclusa, formato Reels/TikTok",
    price: 150,
  },
  {
    id: "2",
    title: "Vídeo 60s",
    description: "Ideal para review completo de produto",
    price: 250,
  },
  {
    id: "3",
    title: "Unboxing & Estético",
    description: "Clipe cinematográfico sem fala",
    price: 180,
  },
  {
    id: "4",
    title: "Diária Presencial",
    description: "Evento ou gravação em loja física",
    price: 600,
  },
];

const DEFAULT_DAYS: DayOfWeek[] = ["mon", "tue", "wed", "thu", "fri"];

export function useCreatorProfileEditController(user: AuthUser) {
  const [displayName, setDisplayName] = useState(
    user.profile?.name ?? user.name ?? ""
  );
  const [niches, setNiches] = useState<string[]>(["Beleza", "Food", "Lifestyle"]);
  const [availableDays, setAvailableDays] =
    useState<Set<DayOfWeek>>(new Set(DEFAULT_DAYS));
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [services, setServices] = useState<CreatorService[]>(DEFAULT_SERVICES);

  const displayNameFromUser = user.profile?.name ?? user.name ?? "";
  const username =
    (user.creatorProfile as { instagramUsername?: string } | undefined)
      ?.instagramUsername ??
    user.email?.split("@")[0] ??
    "usuario";
  const location =
    user.profile?.addressCity && user.profile?.addressState
      ? `${user.profile.addressCity}, ${user.profile.addressState}`
      : "São Paulo, SP";
  const portfolioMedia = user.portfolio?.media ?? [];

  function toggleDay(day: DayOfWeek) {
    setAvailableDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  function addNiche(niche: string) {
    if (niche.trim() && !niches.includes(niche.trim())) {
      setNiches((prev) => [...prev, niche.trim()]);
    }
  }

  function removeNiche(niche: string) {
    setNiches((prev) => prev.filter((n) => n !== niche));
  }

  function removeService(id: string) {
    setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return {
    displayName,
    setDisplayName,
    niches,
    addNiche,
    removeNiche,
    availableDays,
    toggleDay,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    services,
    removeService,
    displayNameFromUser,
    username,
    location,
    portfolioMedia,
  };
}
