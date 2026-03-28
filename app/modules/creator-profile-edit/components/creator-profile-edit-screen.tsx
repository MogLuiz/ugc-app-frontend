import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { AppSidebar } from "~/components/app-sidebar";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/use-auth";
import { useCreatorProfileEditController } from "../hooks/use-creator-profile-edit-controller";
import type { ProfileProgress } from "../hooks/use-creator-profile-edit-controller";
import {
  ProfileProgressBlock,
  CreatorProfileInfoSection,
  CreatorPrimaryInfoSection,
  CreatorSupplementarySection,
  CreatorAddressSection,
  CreatorAvailabilitySection,
  CreatorServicesSection,
  CreatorPortfolioSection,
} from "./sections/creator-profile-edit-sections";

// ─────────────────────────────────────────────────────────────────────────────
// MobileStickyFooter — fixed bottom bar with progress + save CTA
// ─────────────────────────────────────────────────────────────────────────────

function MobileStickyFooter({
  profileProgress,
  isSaving,
  isDirty,
  onSave,
}: {
  profileProgress: ProfileProgress;
  isSaving: boolean;
  isDirty: boolean;
  onSave: () => void;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Thin progress bar flush at the top */}
      <div className="h-1 w-full bg-[#f1f5f9]">
        <div
          className="h-full bg-[#895af6] transition-all duration-500"
          style={{ width: `${profileProgress.percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[rgba(137,90,246,0.1)] bg-white px-4 py-3">
        <span className="text-xs text-[#64748b]">
          {profileProgress.completedCount}/{profileProgress.items.length} itens preenchidos
        </span>
        <Button
          disabled={!isDirty || isSaving}
          onClick={onSave}
          className="rounded-full bg-[#895af6] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#7c4aeb] disabled:opacity-50"
        >
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CreatorProfileEditScreen
// ─────────────────────────────────────────────────────────────────────────────

export function CreatorProfileEditScreen() {
  const { user } = useAuth();

  if (!user) return null;

  const controller = useCreatorProfileEditController(user);
  const displayName = controller.displayNameFromUser || controller.displayName;
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar variant="creator" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile sticky header — back + title only (save is in sticky footer) */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[rgba(137,90,246,0.1)] bg-[rgba(246,245,248,0.9)] px-4 py-4 backdrop-blur-md lg:hidden">
          <Link
            to="/dashboard"
            className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-[rgba(137,90,246,0.06)]"
            aria-label="Voltar"
          >
            <ArrowLeft className="size-5 text-slate-600" />
          </Link>
          <h1 className="text-lg font-bold tracking-[-0.45px] text-[#0f172a]">
            Editar Perfil
          </h1>
          {/* Spacer to keep title centered */}
          <div className="size-10" />
        </header>

        <main className="flex-1 pb-28 lg:overflow-auto lg:px-10 lg:py-10 lg:pb-10">

          {/* ── MOBILE LAYOUT (hidden on lg+) ── */}
          <div className="flex flex-col gap-5 px-4 pt-4 lg:hidden">
            {/* 1. Progress — hidden when profile is 100% complete */}
            {controller.profileProgress.percent < 100 && (
              <ProfileProgressBlock {...controller.profileProgress} />
            )}

            {/* 2 + 3. Avatar (circle + camera) merged with name + bio */}
            <CreatorPrimaryInfoSection
              displayName={controller.displayName}
              onDisplayNameChange={controller.setDisplayName}
              bio={controller.bio}
              onBioChange={controller.setBio}
              photoUrl={user.profile?.photoUrl}
              initials={initials}
              onAvatarChange={controller.handleAvatarChange}
              isUploadingAvatar={controller.isUploadingAvatar}
            />

            {/* 4. Portfolio */}
            <CreatorPortfolioSection
              media={controller.portfolioMedia}
              onUpload={controller.handlePortfolioUpload}
              onRemove={controller.handlePortfolioRemove}
              isUploading={controller.isUploadingPortfolio}
              isRemoving={controller.isRemovingPortfolio}
            />

            {/* 5. Availability (compact) */}
            <CreatorAvailabilitySection
              availabilityDays={controller.availabilityDays}
              timeOptions={controller.timeOptions}
              onUpdateDay={controller.updateAvailabilityDay}
              onSyncWeekdays={controller.syncWeekdays}
              compact
            />

            {/* 6. Job types */}
            <CreatorServicesSection
              jobTypes={controller.jobTypes}
              onToggleJobType={controller.toggleJobType}
              isLoading={controller.isLoadingJobTypes}
            />

            {/* 7. Address (collapsible) */}
            <CreatorAddressSection
              street={controller.addressStreet}
              onStreetChange={controller.setAddressStreet}
              number={controller.addressNumber}
              onNumberChange={controller.setAddressNumber}
              city={controller.addressCity}
              onCityChange={controller.setAddressCity}
              state={controller.addressState}
              onStateChange={controller.setAddressState}
              zipCode={controller.addressZipCode}
              onZipCodeChange={controller.setAddressZipCode}
              collapsible
            />

            {/* 8. Supplementary info (collapsible accordion) */}
            <CreatorSupplementarySection
              phone={controller.phone}
              onPhoneChange={controller.setPhone}
              instagramUsername={controller.instagramUsername}
              onInstagramUsernameChange={controller.setInstagramUsername}
              tiktokUsername={controller.tiktokUsername}
              onTiktokUsernameChange={controller.setTiktokUsername}
              birthDate={controller.birthDate}
              onBirthDateChange={controller.setBirthDate}
            />
          </div>

          {/* ── DESKTOP LAYOUT (hidden below lg) ── */}
          <div className="hidden lg:block">
            {/* Desktop header text */}
            <div className="mb-6 flex flex-col gap-2">
              <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-[#0f172a]">
                Editar Perfil
              </h1>
              <p className="text-base text-[#64748b]">
                Gerencie sua disponibilidade, serviços e portfólio para atrair marcas.
              </p>
            </div>

            {/* Desktop progress block */}
            <div className="mb-8">
              <ProfileProgressBlock {...controller.profileProgress} />
            </div>

            {/* Desktop grid — 3 cols */}
            <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-3 lg:items-start">
              {/* Left col — 1/3: Profile info + Address */}
              <div className="flex flex-col gap-8 lg:col-span-1">
                <CreatorProfileInfoSection
                  displayName={controller.displayName}
                  onDisplayNameChange={controller.setDisplayName}
                  birthDate={controller.birthDate}
                  onBirthDateChange={controller.setBirthDate}
                  bio={controller.bio}
                  onBioChange={controller.setBio}
                  phone={controller.phone}
                  onPhoneChange={controller.setPhone}
                  instagramUsername={controller.instagramUsername}
                  onInstagramUsernameChange={controller.setInstagramUsername}
                  tiktokUsername={controller.tiktokUsername}
                  onTiktokUsernameChange={controller.setTiktokUsername}
                  username={controller.username}
                  location={controller.location}
                  photoUrl={user.profile?.photoUrl}
                  initials={initials}
                  onAvatarChange={controller.handleAvatarChange}
                />
                <CreatorAddressSection
                  street={controller.addressStreet}
                  onStreetChange={controller.setAddressStreet}
                  number={controller.addressNumber}
                  onNumberChange={controller.setAddressNumber}
                  city={controller.addressCity}
                  onCityChange={controller.setAddressCity}
                  state={controller.addressState}
                  onStateChange={controller.setAddressState}
                  zipCode={controller.addressZipCode}
                  onZipCodeChange={controller.setAddressZipCode}
                />
              </div>

              {/* Right col — 2/3: Portfolio + Availability + Services + actions */}
              <div className="flex flex-col gap-8 lg:col-span-2">
                <CreatorPortfolioSection
                  media={controller.portfolioMedia}
                  onUpload={controller.handlePortfolioUpload}
                  onRemove={controller.handlePortfolioRemove}
                  isUploading={controller.isUploadingPortfolio}
                  isRemoving={controller.isRemovingPortfolio}
                />
                <CreatorAvailabilitySection
                  availabilityDays={controller.availabilityDays}
                  timeOptions={controller.timeOptions}
                  onUpdateDay={controller.updateAvailabilityDay}
                  onSyncWeekdays={controller.syncWeekdays}
                />
                <CreatorServicesSection
                  jobTypes={controller.jobTypes}
                  onToggleJobType={controller.toggleJobType}
                  isLoading={controller.isLoadingJobTypes}
                />

                {/* Desktop footer actions */}
                <div className="flex items-center justify-end gap-4">
                  <Button
                    variant="ghost"
                    className="rounded-[48px] px-6 py-3 text-base font-bold text-[#64748b]"
                    disabled={controller.isSaving}
                    onClick={() => controller.resetToUser()}
                  >
                    Descartar
                  </Button>
                  <Button
                    className="rounded-[48px] bg-[#895af6] px-10 py-3 text-base font-bold text-white shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.3)] hover:bg-[#7c4aeb]"
                    disabled={controller.isSaving}
                    onClick={() => controller.handleSubmit()}
                  >
                    {controller.isSaving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sticky footer — save CTA + progress */}
      <MobileStickyFooter
        profileProgress={controller.profileProgress}
        isSaving={controller.isSaving}
        isDirty={controller.isDirty}
        onSave={() => controller.handleSubmit()}
      />
    </div>
  );
}
