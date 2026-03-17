import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  Pencil,
  Building2,
  Briefcase,
  FileText,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { BusinessDashboardSidebar } from "~/modules/business-dashboard/components/business-dashboard-sidebar";
import {
  useUpdateProfileMutation,
  useUpdateCompanyProfileMutation,
  useUploadAvatarMutation,
  useUploadPortfolioMediaMutation,
  useDeletePortfolioMediaMutation,
} from "~/modules/auth/mutations";
import type { AuthUser } from "~/modules/auth/types";
import { companyProfileSchema, type CompanyProfileForm } from "../schemas/company-profile";
import { toast } from "~/components/ui/toast";
import { CompanyPortfolioSection } from "./company-portfolio-section";
import {
  getCompanyProfileErrorMessage,
  getCompanyProfileSuccessMessage,
  validatePortfolioFile,
} from "../lib/feedback";

type CompanyProfileDesktopProps = {
  user: AuthUser;
};

export function CompanyProfileDesktop({ user }: CompanyProfileDesktopProps) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateProfileMutation = useUpdateProfileMutation();
  const updateCompanyProfileMutation = useUpdateCompanyProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const uploadPortfolioMediaMutation = useUploadPortfolioMediaMutation();
  const deletePortfolioMediaMutation = useDeletePortfolioMediaMutation();

  const profile = user.profile;
  const company = user.companyProfile;
  const portfolioMedia = user.portfolio?.media ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyProfileForm>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      name: profile?.name ?? user.name ?? "",
      bio: profile?.bio ?? "",
      companyName: company?.companyName ?? "",
      jobTitle: company?.jobTitle ?? "",
      businessNiche: company?.businessNiche ?? "",
      phone: user.phone ?? "",
      documentType: (company?.documentType as "CPF" | "CNPJ") ?? "",
      documentNumber: company?.documentNumber ?? "",
      addressStreet: profile?.addressStreet ?? "",
      addressNumber: profile?.addressNumber ?? "",
      addressCity: profile?.addressCity ?? "",
      addressState: profile?.addressState ?? "",
      addressZipCode: profile?.addressZipCode ?? "",
    },
  });

  function handleEdit() {
    reset({
      name: profile?.name ?? user.name ?? "",
      bio: profile?.bio ?? "",
      companyName: company?.companyName ?? "",
      jobTitle: company?.jobTitle ?? "",
      businessNiche: company?.businessNiche ?? "",
      phone: user.phone ?? "",
      documentType: (company?.documentType as "CPF" | "CNPJ") ?? "",
      documentNumber: company?.documentNumber ?? "",
      addressStreet: profile?.addressStreet ?? "",
      addressNumber: profile?.addressNumber ?? "",
      addressCity: profile?.addressCity ?? "",
      addressState: profile?.addressState ?? "",
      addressZipCode: profile?.addressZipCode ?? "",
    });
    setIsEditing(true);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadAvatarMutation.mutateAsync({ file });
      toast.success(getCompanyProfileSuccessMessage("avatar_upload"));
    } catch (error) {
      toast.error(getCompanyProfileErrorMessage(error, "avatar_upload"));
    }
    e.target.value = "";
  }

  async function onSubmit(data: CompanyProfileForm) {
    try {
      await Promise.all([
        updateProfileMutation.mutateAsync({
          data: {
            name: data.name,
            bio: data.bio || undefined,
            phone: data.phone || undefined,
            addressStreet: data.addressStreet || undefined,
            addressNumber: data.addressNumber || undefined,
            addressCity: data.addressCity || undefined,
            addressState: data.addressState || undefined,
            addressZipCode: data.addressZipCode || undefined,
          },
        }),
        updateCompanyProfileMutation.mutateAsync({
          data: {
            companyName: data.companyName,
            ...(data.jobTitle && { jobTitle: data.jobTitle }),
            ...(data.businessNiche && { businessNiche: data.businessNiche }),
            ...(data.documentType && {
              documentType: data.documentType as "CPF" | "CNPJ",
            }),
            ...(data.documentNumber && {
              documentNumber: data.documentNumber,
            }),
          },
        }),
      ]);
      setIsEditing(false);
      toast.success(getCompanyProfileSuccessMessage("profile_update"));
    } catch (error) {
      toast.error(getCompanyProfileErrorMessage(error, "profile_update"));
    }
  }

  async function handlePortfolioUpload(file: File) {
    const validationError = validatePortfolioFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      await uploadPortfolioMediaMutation.mutateAsync({ file });
      toast.success(getCompanyProfileSuccessMessage("portfolio_upload"));
    } catch (error) {
      toast.error(getCompanyProfileErrorMessage(error, "portfolio_upload"));
    }
  }

  async function handlePortfolioRemove(mediaId: string) {
    try {
      await deletePortfolioMediaMutation.mutateAsync({ mediaId });
      toast.success(getCompanyProfileSuccessMessage("portfolio_remove"));
    } catch (error) {
      toast.error(getCompanyProfileErrorMessage(error, "portfolio_remove"));
    }
  }

  const displayName = profile?.name ?? user.name ?? "Empresa";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="flex min-h-screen bg-[#f6f5f8]">
      <BusinessDashboardSidebar />

      <main className="flex flex-1 flex-col gap-8 overflow-auto p-8">
        <div className="mx-auto w-full max-w-2xl">
          <section className="rounded-[48px] border border-[#f1f5f9] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[#0f172a]">
                Perfil da Empresa
              </h1>
              {!isEditing ? (
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 rounded-full"
                  onClick={handleEdit}
                >
                  <Pencil className="size-4" />
                  Editar
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="flex gap-6">
                  <div className="relative flex shrink-0 flex-col items-center gap-2">
                    <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-[rgba(137,90,246,0.1)] bg-[rgba(137,90,246,0.1)]">
                      {profile?.photoUrl ? (
                        <img
                          src={profile.photoUrl}
                          alt={displayName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-[#895af6]">
                          {initials}
                        </span>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-xs"
                      disabled={uploadAvatarMutation.isPending}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="size-3.5" />
                      {uploadAvatarMutation.isPending ? "Enviando…" : "Alterar foto"}
                    </Button>
                  </div>
                  <div className="flex flex-1 flex-col gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Nome
                      </label>
                      <Input
                        {...register("name")}
                        placeholder="Seu nome"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Sobre a empresa
                      </label>
                      <textarea
                        {...register("bio")}
                        placeholder="Breve descrição da sua empresa"
                        rows={3}
                        className="h-auto w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0f172a]">
                    <Building2 className="size-5 text-[#895af6]" />
                    Dados da Empresa
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Nome da empresa
                      </label>
                      <Input
                        {...register("companyName")}
                        placeholder="Razão social ou nome fantasia"
                        className={errors.companyName ? "border-red-500" : ""}
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Cargo
                      </label>
                      <Input
                        {...register("jobTitle")}
                        placeholder="Ex: CEO, Gerente de Marketing"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Nicho de atuação
                      </label>
                      <Input
                        {...register("businessNiche")}
                        placeholder="Ex: Moda, Tecnologia"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Telefone
                      </label>
                      <Input
                        {...register("phone")}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Tipo de documento
                      </label>
                      <Select {...register("documentType")}>
                        <option value="">Selecione</option>
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Número do documento
                      </label>
                      <Input
                        {...register("documentNumber")}
                        placeholder="Somente números"
                        className={errors.documentNumber ? "border-red-500" : ""}
                      />
                      {errors.documentNumber && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.documentNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0f172a]">
                    <MapPin className="size-5 text-[#895af6]" />
                    Endereço
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Rua
                      </label>
                      <Input
                        {...register("addressStreet")}
                        placeholder="Nome da rua"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Número
                      </label>
                      <Input
                        {...register("addressNumber")}
                        placeholder="Número"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        CEP
                      </label>
                      <Input
                        {...register("addressZipCode")}
                        placeholder="00000-000"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Cidade
                      </label>
                      <Input
                        {...register("addressCity")}
                        placeholder="Cidade"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-600">
                        Estado
                      </label>
                      <Input
                        {...register("addressState")}
                        placeholder="UF"
                      />
                    </div>
                  </div>
                </div>

                <CompanyPortfolioSection
                  media={portfolioMedia}
                  onUpload={handlePortfolioUpload}
                  onRemove={handlePortfolioRemove}
                  isUploading={uploadPortfolioMediaMutation.isPending}
                  isRemoving={deletePortfolioMediaMutation.isPending}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="purple"
                    disabled={
                      updateProfileMutation.isPending ||
                      updateCompanyProfileMutation.isPending
                    }
                  >
                    Salvar alterações
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex gap-6">
                  <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[rgba(137,90,246,0.1)] bg-[rgba(137,90,246,0.1)]">
                    {profile?.photoUrl ? (
                      <img
                        src={profile.photoUrl}
                        alt={displayName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-[#895af6]">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <h2 className="text-xl font-bold text-[#0f172a]">
                      {displayName}
                    </h2>
                    {profile?.bio && (
                      <p className="text-sm text-slate-600">{profile.bio}</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0f172a]">
                    <Building2 className="size-5 text-[#895af6]" />
                    Dados da Empresa
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[rgba(137,90,246,0.1)]">
                        <Building2 className="size-5 text-[#895af6]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Empresa</p>
                        <p className="font-medium text-slate-900">
                          {company?.companyName || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[rgba(137,90,246,0.1)]">
                        <Briefcase className="size-5 text-[#895af6]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Cargo</p>
                        <p className="font-medium text-slate-900">
                          {company?.jobTitle || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-2">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[rgba(137,90,246,0.1)]">
                        <FileText className="size-5 text-[#895af6]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Nicho</p>
                        <p className="font-medium text-slate-900">
                          {company?.businessNiche || "—"}
                        </p>
                      </div>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-[rgba(137,90,246,0.1)]">
                          <Phone className="size-5 text-[#895af6]" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Telefone</p>
                          <p className="font-medium text-slate-900">
                            {user.phone}
                          </p>
                        </div>
                      </div>
                    )}
                    {(company?.documentType || company?.documentNumber) && (
                      <div className="flex items-center gap-3 sm:col-span-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-[rgba(137,90,246,0.1)]">
                          <User className="size-5 text-[#895af6]" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Documento</p>
                          <p className="font-medium text-slate-900">
                            {company?.documentType ? `${company.documentType}: ` : ""}
                            {company?.documentNumber || "—"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {(profile?.addressStreet ||
                  profile?.addressCity ||
                  profile?.addressZipCode) && (
                  <div className="border-t border-slate-100 pt-6">
                    <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#0f172a]">
                      <MapPin className="size-5 text-[#895af6]" />
                      Endereço
                    </h2>
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-[rgba(137,90,246,0.1)]">
                        <MapPin className="size-5 text-[#895af6]" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Endereço</p>
                        <p className="font-medium text-slate-900">
                          {[
                            [profile?.addressStreet, profile?.addressNumber]
                              .filter(Boolean)
                              .join(", "),
                            profile?.addressCity
                              ? profile?.addressState
                                ? `${profile.addressCity}/${profile.addressState}`
                                : profile.addressCity
                              : null,
                            profile?.addressZipCode
                              ? `CEP ${profile.addressZipCode}`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" — ") || "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <CompanyPortfolioSection
                  media={portfolioMedia}
                  readOnly
                />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
