import { useAuth } from "~/hooks/use-auth";
import { Link } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { AppSidebar } from "~/components/app-sidebar";
import { useCompanyProfileController } from "../hooks/use-company-profile-controller";
import {
  CompanyProfileCardHeader,
  CompanyProfileFormSection,
  CompanyProfileSummarySection,
} from "./sections/company-profile-sections";

export function CompanyProfileScreen() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const controller = useCompanyProfileController(user);

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant="business" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-[#f6f5f8] px-4 py-4 lg:hidden">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="size-5" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Perfil</h1>
          <div className="w-20" />
        </header>

        <main className="flex-1 px-4 py-6 lg:overflow-auto lg:p-8">
          <div className="mx-auto w-full max-w-2xl">
            <section className="rounded-[32px] border border-[#f1f5f9] bg-white p-5 shadow-sm lg:rounded-[48px] lg:p-6 lg:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
              <div className="hidden lg:block">
                <CompanyProfileCardHeader
                  isEditing={controller.isEditing}
                  onCancel={controller.handleCancelEdit}
                  onEdit={controller.handleEdit}
                />
              </div>

              <div className="lg:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#0f172a]">
                    Perfil da Empresa
                  </h2>
                  {!controller.isEditing ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1 rounded-full"
                      onClick={controller.handleEdit}
                    >
                      <Pencil className="size-3.5" />
                      Editar
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                      onClick={controller.handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>

              {controller.isEditing ? (
                <CompanyProfileFormSection
                  density="compact"
                  displayName={controller.displayName}
                  errors={controller.form.formState.errors}
                  initials={controller.initials}
                  isRemovingPortfolio={controller.mutations.deletePortfolioMedia.isPending}
                  isSaving={
                    controller.mutations.updateProfile.isPending ||
                    controller.mutations.updateCompanyProfile.isPending
                  }
                  isUploadingAvatar={controller.mutations.uploadAvatar.isPending}
                  isUploadingPortfolio={controller.mutations.uploadPortfolioMedia.isPending}
                  onAvatarChange={controller.handleAvatarChange}
                  onCancel={controller.handleCancelEdit}
                  onPortfolioRemove={controller.handlePortfolioRemove}
                  onPortfolioUpload={controller.handlePortfolioUpload}
                  onSubmit={controller.submit}
                  portfolioMedia={controller.portfolioMedia}
                  profile={controller.profile}
                  register={controller.form.register}
                  user={controller.user}
                />
              ) : (
                <CompanyProfileSummarySection
                  density="compact"
                  displayName={controller.displayName}
                  initials={controller.initials}
                  portfolioMedia={controller.portfolioMedia}
                  profile={controller.profile}
                  user={controller.user}
                />
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
