import { useAuth } from "~/hooks/use-auth";
import { AppSidebar } from "~/components/app-sidebar";
import { BusinessBottomNav } from "~/components/layout/business-bottom-nav";
import { Button } from "~/components/ui/button";
import {
  ProfileProgressBlock,
  type ProfileProgress,
} from "~/components/ui/profile-progress-block";
import { useCompanyProfileController } from "../hooks/use-company-profile-controller";
import {
  CompanyIdentityCard,
  CompanyResponsibleCard,
  CompanyAddressCard,
} from "./sections/company-profile-sections";
import { CompanyPortfolioSection } from "./sections/company-portfolio-section";

// ─────────────────────────────────────────────────────────────────────────────
// MobileStickyFooter — fixed above BusinessBottomNav
// ─────────────────────────────────────────────────────────────────────────────

// BusinessBottomNav is taller than CreatorBottomNav due to the size-12 Criar button
// (~88px vs ~58px), so the offset needs to be larger than the creator's 4rem.
const MOBILE_BOTTOM_NAV_OFFSET =
  "calc(5.5rem + env(safe-area-inset-bottom, 0px))" as const;

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
      className="fixed left-0 right-0 z-[25] lg:hidden"
      style={{ bottom: MOBILE_BOTTOM_NAV_OFFSET }}
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
          {profileProgress.completedCount}/{profileProgress.items.length} itens
          preenchidos
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
// CompanyProfileScreen
// ─────────────────────────────────────────────────────────────────────────────

export function CompanyProfileScreen() {
  const { user } = useAuth();

  if (!user) return null;

  const controller = useCompanyProfileController(user);

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 pb-40 lg:overflow-auto lg:px-10 lg:py-10 lg:pb-10">

          {/* ── MOBILE LAYOUT ── */}
          <div className="flex flex-col gap-5 px-4 pt-4 lg:hidden">
            {controller.profileProgress.percent < 100 && (
              <ProfileProgressBlock {...controller.profileProgress} />
            )}

            <CompanyIdentityCard
              displayName={controller.displayName}
              initials={controller.initials}
              photoUrl={controller.profile?.photoUrl}
              isUploadingAvatar={controller.isUploadingAvatar}
              onAvatarChange={controller.handleAvatarChange}
              register={controller.form.register}
              errors={controller.form.formState.errors}
            />

            <CompanyResponsibleCard
              register={controller.form.register}
              errors={controller.form.formState.errors}
            />

            <CompanyAddressCard
              register={controller.form.register}
              setValue={controller.form.setValue}
              getValues={controller.form.getValues}
              errors={controller.form.formState.errors}
            />

            <CompanyPortfolioSection
              media={controller.portfolioMedia}
              onUpload={controller.handlePortfolioUpload}
              onRemove={controller.handlePortfolioRemove}
              isUploading={controller.isUploadingPortfolio}
              isRemoving={controller.isRemovingPortfolio}
            />
          </div>

          {/* ── DESKTOP LAYOUT ── */}
          <div className="hidden lg:block">
            <div className="mx-auto w-full max-w-6xl">
              {/* Desktop header */}
              <div className="mb-6 flex flex-col gap-2">
                <h1 className="text-[30px] font-black leading-9 tracking-[-0.75px] text-[#0f172a]">
                  Perfil da Empresa
                </h1>
                <p className="text-base text-[#64748b]">
                  Gerencie as informações da sua empresa para atrair os melhores
                  creators.
                </p>
              </div>

              {/* Progress block */}
              <div className="mb-8">
                <ProfileProgressBlock {...controller.profileProgress} />
              </div>

              {/* 3-col grid */}
              <div className="grid w-full gap-8 lg:grid-cols-3 lg:items-start">
                {/* Left col — 1/3: Identity + Address */}
                <div className="flex flex-col gap-8 lg:col-span-1">
                  <CompanyIdentityCard
                    displayName={controller.displayName}
                    initials={controller.initials}
                    photoUrl={controller.profile?.photoUrl}
                    isUploadingAvatar={controller.isUploadingAvatar}
                    onAvatarChange={controller.handleAvatarChange}
                    register={controller.form.register}
                    errors={controller.form.formState.errors}
                  />
                  <CompanyAddressCard
                    register={controller.form.register}
                    setValue={controller.form.setValue}
                    getValues={controller.form.getValues}
                    errors={controller.form.formState.errors}
                  />
                </div>

                {/* Right col — 2/3: Responsible + Portfolio + actions */}
                <div className="flex flex-col gap-8 lg:col-span-2">
                  <CompanyResponsibleCard
                    register={controller.form.register}
                    errors={controller.form.formState.errors}
                  />
                  <CompanyPortfolioSection
                    media={controller.portfolioMedia}
                    onUpload={controller.handlePortfolioUpload}
                    onRemove={controller.handlePortfolioRemove}
                    isUploading={controller.isUploadingPortfolio}
                    isRemoving={controller.isRemovingPortfolio}
                  />

                  {/* Desktop footer actions */}
                  <div className="flex items-center justify-end gap-4">
                    <Button
                      variant="ghost"
                      className="rounded-[48px] px-6 py-3 text-base font-bold text-[#64748b]"
                      disabled={controller.isSaving}
                      onClick={controller.resetToUser}
                    >
                      Descartar
                    </Button>
                    <Button
                      className="rounded-[48px] bg-[#895af6] px-10 py-3 text-base font-bold text-white shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.3)] hover:bg-[#7c4aeb]"
                      disabled={controller.isSaving}
                      onClick={controller.handleSubmit}
                    >
                      {controller.isSaving
                        ? "Salvando..."
                        : "Salvar Alterações"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <MobileStickyFooter
        profileProgress={controller.profileProgress}
        isSaving={controller.isSaving}
        isDirty={controller.isDirty}
        onSave={controller.handleSubmit}
      />
      <BusinessBottomNav />
    </div>
  );
}
