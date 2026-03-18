import { Link } from "react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { AppSidebar } from "~/components/app-sidebar";
import { Button } from "~/components/ui/button";
import { CreatorBottomNav } from "~/components/layout/creator-bottom-nav";
import { useAuth } from "~/hooks/use-auth";
import { useCreatorProfileEditController } from "../hooks/use-creator-profile-edit-controller";
import {
  CreatorProfileInfoSection,
  CreatorAvailabilitySection,
  CreatorServicesSection,
  CreatorPortfolioSection,
} from "./sections/creator-profile-edit-sections";

export function CreatorProfileEditScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const controller = useCreatorProfileEditController(user);
  const displayName = controller.displayNameFromUser || controller.displayName;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[rgba(137,90,246,0.1)] bg-[rgba(246,245,248,0.8)] px-4 py-4 backdrop-blur-md lg:hidden">
          <Link
            to="/dashboard"
            className="flex size-10 items-center justify-center rounded-full"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5 text-slate-600" />
          </Link>
          <h1 className="text-lg font-bold tracking-[-0.45px] text-[#0f172a]">
            Editar Perfil
          </h1>
          <Button
            variant="ghost"
            className="rounded-[32px] px-2 py-1 text-base font-bold text-[#895af6]"
          >
            Salvar
          </Button>
        </header>

        <main className="flex-1 px-4 py-6 pb-32 lg:overflow-auto lg:px-10 lg:py-10 lg:pb-10">
          {/* Mobile: profile header section */}
        <div className="mb-8 flex flex-col items-center py-8 lg:hidden">
          <div className="relative">
            <div className="size-32 overflow-hidden rounded-full border-4 border-white bg-slate-200 shadow-lg">
              {user.profile?.photoUrl ? (
                <img
                  src={user.profile.photoUrl}
                  alt={displayName}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <span className="text-3xl font-bold text-slate-600">
                    {initials}
                  </span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#895af6] shadow-md">
              <Camera className="size-5 text-white" />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-[#0f172a]">
            {displayName}
          </h2>
          <p className="text-sm font-medium text-[#895af6]">
            @{controller.username}
          </p>
          <button
            type="button"
            className="mt-2 text-sm font-semibold text-[#895af6] hover:underline"
          >
            Alterar foto de perfil
          </button>
        </div>

          {/* Desktop header */}
          <div className="mb-8 hidden flex-col gap-2 lg:flex">
            <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-[#0f172a]">
              Editar Perfil
            </h1>
            <p className="text-base text-[#64748b]">
              Gerencie sua disponibilidade, serviços e portfólio para atrair
              marcas.
            </p>
          </div>

          {/* Desktop: 2-column grid - Left: Info + Availability, Right: Services + Portfolio */}
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-3">
            {/* Left column - 1/3 on desktop, full width on mobile */}
            <div className="flex flex-col gap-8 lg:col-span-1">
              <div className="hidden lg:block">
                <CreatorProfileInfoSection
                  displayName={controller.displayName}
                  onDisplayNameChange={controller.setDisplayName}
                  username={controller.username}
                  location={controller.location}
                  niches={controller.niches}
                  onAddNiche={controller.addNiche}
                  onRemoveNiche={controller.removeNiche}
                  photoUrl={user.profile?.photoUrl}
                  initials={initials}
                />
              </div>
              <CreatorAvailabilitySection
                availableDays={controller.availableDays}
                onToggleDay={controller.toggleDay}
                startTime={controller.startTime}
                onStartTimeChange={controller.setStartTime}
                endTime={controller.endTime}
                onEndTimeChange={controller.setEndTime}
              />
            </div>

            {/* Right column - 2/3 */}
            <div className="flex flex-col gap-8 lg:col-span-2">
              <CreatorServicesSection
                services={controller.services}
                onRemoveService={controller.removeService}
              />
              <CreatorPortfolioSection media={controller.portfolioMedia} />

              {/* Desktop footer actions */}
              <div className="hidden items-center justify-end gap-4 lg:flex">
                <Button
                  variant="ghost"
                  className="rounded-[48px] px-6 py-3 text-base font-bold text-[#64748b]"
                >
                  Descartar
                </Button>
                <Button
                  className="rounded-[48px] bg-[#895af6] px-10 py-3 text-base font-bold text-white shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.3)] hover:bg-[#7c4aeb]"
                >
                  Salvar Alterações
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreatorBottomNav />
    </div>
  );
}
