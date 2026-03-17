import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  FileText,
  MapPin,
  Pencil,
  User,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import {
  useUpdateProfileMutation,
  useUpdateCompanyProfileMutation,
} from "~/modules/auth/mutations";
import type { AuthUser } from "~/modules/auth/types";
import {
  companyProfileSchema,
  type CompanyProfileForm,
} from "../schemas/company-profile";
import { toast } from "~/components/ui/toast";

type CompanyProfileMobileProps = {
  user: AuthUser;
};

export function CompanyProfileMobile({ user }: CompanyProfileMobileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateProfileMutation = useUpdateProfileMutation();
  const updateCompanyProfileMutation = useUpdateCompanyProfileMutation();

  const profile = user.profile;
  const company = user.companyProfile;

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

  async function onSubmit(data: CompanyProfileForm) {
    try {
      await Promise.all([
        updateProfileMutation.mutateAsync({
          data: {
            name: data.name,
            bio: data.bio || undefined,
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
      toast.success("Perfil atualizado com sucesso");
    } catch {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  }

  const displayName = profile?.name ?? user.name ?? "Empresa";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <div className="min-h-screen bg-[#f6f5f8] pb-8">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-[#f6f5f8] px-4 py-4">
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

      <main className="px-4 py-6">
        <section className="rounded-[32px] border border-[#f1f5f9] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0f172a]">
              Perfil da Empresa
            </h2>
            {!isEditing ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1 rounded-full"
                onClick={handleEdit}
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
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(137,90,246,0.2)] bg-[rgba(137,90,246,0.1)]">
                  {profile?.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={displayName}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-[#895af6]">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Nome
                    </label>
                    <Input
                      {...register("name")}
                      placeholder="Seu nome"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="mt-0.5 text-xs text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Sobre a empresa
                    </label>
                    <textarea
                      {...register("bio")}
                      placeholder="Breve descrição"
                      rows={2}
                      className="h-auto w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                  <Building2 className="size-4 text-[#895af6]" />
                  Dados da Empresa
                </h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Nome da empresa
                    </label>
                    <Input
                      {...register("companyName")}
                      placeholder="Razão social ou nome fantasia"
                      className={errors.companyName ? "border-red-500" : ""}
                    />
                    {errors.companyName && (
                      <p className="mt-0.5 text-xs text-red-500">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Cargo
                    </label>
                    <Input
                      {...register("jobTitle")}
                      placeholder="Ex: CEO"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Nicho
                    </label>
                    <Input
                      {...register("businessNiche")}
                      placeholder="Ex: Moda, Tecnologia"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Tipo de documento
                    </label>
                    <Select {...register("documentType")}>
                      <option value="">Selecione</option>
                      <option value="CPF">CPF</option>
                      <option value="CNPJ">CNPJ</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Número do documento
                    </label>
                    <Input
                      {...register("documentNumber")}
                      placeholder="Somente números"
                      className={errors.documentNumber ? "border-red-500" : ""}
                    />
                    {errors.documentNumber && (
                      <p className="mt-0.5 text-xs text-red-500">
                        {errors.documentNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                  <MapPin className="size-4 text-[#895af6]" />
                  Endereço
                </h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Rua
                    </label>
                    <Input
                      {...register("addressStreet")}
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Número
                    </label>
                    <Input
                      {...register("addressNumber")}
                      placeholder="Número"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      CEP
                    </label>
                    <Input
                      {...register("addressZipCode")}
                      placeholder="00000-000"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Cidade
                    </label>
                    <Input
                      {...register("addressCity")}
                      placeholder="Cidade"
                    />
                  </div>
                  <div>
                    <label className="mb-0.5 block text-xs font-medium text-slate-600">
                      Estado
                    </label>
                    <Input
                      {...register("addressState")}
                      placeholder="UF"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="purple"
                  className="flex-1"
                  disabled={
                    updateProfileMutation.isPending ||
                    updateCompanyProfileMutation.isPending
                  }
                >
                  Salvar
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[rgba(137,90,246,0.2)] bg-[rgba(137,90,246,0.1)]">
                  {profile?.photoUrl ? (
                    <img
                      src={profile.photoUrl}
                      alt={displayName}
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-[#895af6]">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <h2 className="text-lg font-bold text-[#0f172a]">
                    {displayName}
                  </h2>
                  {profile?.bio && (
                    <p className="text-sm text-slate-600">{profile.bio}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                  <Building2 className="size-4 text-[#895af6]" />
                  Dados da Empresa
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[rgba(137,90,246,0.1)]">
                      <Building2 className="size-4 text-[#895af6]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Empresa</p>
                      <p className="text-sm font-medium text-slate-900">
                        {company?.companyName || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[rgba(137,90,246,0.1)]">
                      <Briefcase className="size-4 text-[#895af6]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Cargo</p>
                      <p className="text-sm font-medium text-slate-900">
                        {company?.jobTitle || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[rgba(137,90,246,0.1)]">
                      <FileText className="size-4 text-[#895af6]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Nicho</p>
                      <p className="text-sm font-medium text-slate-900">
                        {company?.businessNiche || "—"}
                      </p>
                    </div>
                  </div>
                  {(company?.documentType || company?.documentNumber) && (
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-[rgba(137,90,246,0.1)]">
                        <User className="size-4 text-[#895af6]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500">Documento</p>
                        <p className="text-sm font-medium text-slate-900">
                          {company?.documentType
                            ? `${company.documentType}: `
                            : ""}
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
                <div className="border-t border-slate-100 pt-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                    <MapPin className="size-4 text-[#895af6]" />
                    Endereço
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[rgba(137,90,246,0.1)]">
                      <MapPin className="size-4 text-[#895af6]" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Endereço</p>
                      <p className="text-sm font-medium text-slate-900">
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
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
