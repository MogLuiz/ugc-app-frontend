import { useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import {
  CreatorPortfolioSection,
  CreatorHirePanel,
  CreatorProfileHeroSection,
  CreatorStickyCta,
  CreatorTestimonialsSection,
} from "./sections/creator-profile-sections";
import { useCreatorProfileQuery } from "../queries";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CreatorProfile } from "../types";
import type { MarketplaceCreator } from "~/modules/marketplace/types";

export function CreatorProfileScreen() {
  const { creatorId } = useParams<{ creatorId: string }>();
  const location = useLocation();
  const creatorProfileQuery = useCreatorProfileQuery(creatorId);
  const marketplaceCreator = (
    location.state as { marketplaceCreator?: MarketplaceCreator } | null
  )?.marketplaceCreator;

  const profile = creatorProfileQuery.data ?? null;
  const backHref = marketplaceCreator ? "/marketplace" : "/mapa";
  const backLabel = marketplaceCreator
    ? "Voltar para marketplace"
    : "Voltar para busca";

  if (creatorProfileQuery.isLoading && creatorId != null && !profile) {
    return (
      <div className="animate-pulse min-h-screen bg-[#f6f5f8] pb-24 lg:px-6 lg:pb-6 lg:pt-6">
        {/* Back button stub */}
        <div className="flex items-center gap-4 px-4 py-4">
          <div className="size-10 rounded-full bg-slate-200" />
          <div className="h-5 w-32 rounded-lg bg-slate-200 lg:hidden" />
        </div>
        {/* Hero section stub */}
        <div className="mx-4 mt-2 overflow-hidden rounded-[32px] bg-white shadow-sm">
          <div className="h-36 bg-slate-100" />
          <div className="flex items-end gap-4 px-5 pb-4 -mt-10">
            <div className="size-20 shrink-0 rounded-2xl bg-slate-200 ring-4 ring-white" />
            <div className="flex-1 space-y-2 pb-1">
              <div className="h-5 w-36 rounded-lg bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-100" />
            </div>
          </div>
          <div className="space-y-2 px-5 pb-5">
            <div className="h-3 w-full rounded bg-slate-100" />
            <div className="h-3 w-3/4 rounded bg-slate-100" />
          </div>
        </div>
        {/* Portfolio stub */}
        <div className="mx-4 mt-4 rounded-[28px] bg-white p-5 shadow-sm">
          <div className="h-4 w-28 rounded-lg bg-slate-200" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-28 rounded-2xl bg-slate-100" />
            <div className="h-28 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f5f8]">
        <div className="text-center">
          <p className="text-lg text-[#64748b]">
            {creatorProfileQuery.error instanceof Error
              ? creatorProfileQuery.error.message
              : "Criador não encontrado."}
          </p>
          <Link
            to={backHref}
            className="mt-4 inline-block text-[#895af6] hover:underline"
          >
            Voltar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <CreatorProfileContent
      profile={profile}
      backHref={backHref}
      backLabel={backLabel}
    />
  );
}

function CreatorProfileContent({
  profile,
  backHref,
  backLabel,
}: {
  profile: CreatorProfile;
  backHref: string;
  backLabel: string;
}) {
  const [hirePanelOpen, setHirePanelOpen] = useState(false);
  const hasServices = profile.services.length > 0;

  return (
    <div className="relative min-h-screen bg-[#f6f5f8] pb-24 lg:px-6 lg:pb-6 lg:pt-6">
      <div
        className={cn(
          "transition-[padding,transform,opacity,max-width] duration-300 ease-out lg:mx-auto lg:max-w-[1220px]",
          hirePanelOpen &&
            "lg:max-w-[1740px] lg:origin-top-left lg:pr-[544px] lg:scale-[0.975] lg:opacity-95",
        )}
      >
        <header className="flex items-center gap-4 px-4 py-4 lg:w-full lg:max-w-[1200px] lg:justify-between lg:px-4 lg:py-0">
          <Link
            to={backHref}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[rgba(137,90,246,0.1)] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] lg:h-auto lg:w-auto lg:gap-2 lg:rounded-full lg:border-[#e2e8f0] lg:px-5 lg:py-2.5 lg:text-sm lg:font-semibold lg:text-[#0f172a]"
          >
            <ArrowRight className="h-4 w-4 rotate-180 text-[#895af6] lg:h-3.5 lg:w-3.5 lg:text-current" />
            <span className="hidden lg:inline">{backLabel}</span>
          </Link>
          <h1 className="text-lg font-bold text-[#0f172a] lg:hidden">
            Perfil do Criador
          </h1>
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <div className="flex h-9 w-9 items-center justify-center">
              <div className="h-8 w-8 rounded-lg bg-[#895af6]/20" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#0f172a]">
              UGC Local
            </span>
          </div>
        </header>

        <main className="flex w-full flex-col gap-8 px-4 pt-4 lg:max-w-[1200px] lg:pt-6">
          <CreatorProfileHeroSection
            profile={profile}
            onHire={() => setHirePanelOpen(true)}
            canHire={hasServices}
          />
          <CreatorPortfolioSection profile={profile} />
          <CreatorTestimonialsSection profile={profile} />
        </main>
      </div>

      <CreatorStickyCta
        onHire={() => setHirePanelOpen(true)}
        disabled={!hasServices}
      />
      <CreatorHirePanel
        open={hirePanelOpen}
        onOpenChange={setHirePanelOpen}
        profile={profile}
      />
    </div>
  );
}
