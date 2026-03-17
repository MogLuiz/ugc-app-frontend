import { useRef } from "react";
import type { FormEventHandler, ReactElement, ReactNode } from "react";
import { cloneElement } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Camera,
  FileText,
  MapPin,
  Pencil,
  Phone,
  User,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import type { AuthUser } from "~/modules/auth/types";
import type { CompanyProfileForm } from "../../schemas/company-profile";
import { CompanyPortfolioSection } from "./company-portfolio-section";

type Density = "compact" | "comfortable";

type CompanyProfileSectionProps = {
  density?: Density;
  displayName: string;
  initials: string;
  portfolioMedia: NonNullable<AuthUser["portfolio"]>["media"] | [];
  profile: AuthUser["profile"];
  user: AuthUser;
};

type CompanyProfileFormSectionProps = CompanyProfileSectionProps & {
  errors: FieldErrors<CompanyProfileForm>;
  isRemovingPortfolio: boolean;
  isSaving: boolean;
  isUploadingAvatar: boolean;
  isUploadingPortfolio: boolean;
  onAvatarChange: (file: File) => Promise<void>;
  onCancel: () => void;
  onPortfolioRemove: (mediaId: string) => Promise<void>;
  onPortfolioUpload: (file: File) => Promise<void>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<CompanyProfileForm>;
};

type ViewItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  fullWidth?: boolean;
};

function getCompanyItems(user: AuthUser): ViewItem[] {
  const company = user.companyProfile;

  return [
    {
      icon: Building2,
      label: "Empresa",
      value: company?.companyName || "—",
    },
    {
      icon: Briefcase,
      label: "Cargo",
      value: company?.jobTitle || "—",
    },
    {
      icon: FileText,
      label: "Nicho",
      value: company?.businessNiche || "—",
      fullWidth: !user.phone,
    },
    ...(user.phone
      ? [
          {
            icon: Phone,
            label: "Telefone",
            value: user.phone,
            fullWidth: true,
          },
        ]
      : []),
    ...(company?.documentType || company?.documentNumber
      ? [
          {
            icon: User,
            label: "Documento",
            value: `${company?.documentType ? `${company.documentType}: ` : ""}${company?.documentNumber || "—"}`,
            fullWidth: true,
          },
        ]
      : []),
  ];
}

function getAddress(profile: AuthUser["profile"]) {
  return (
    [
      [profile?.addressStreet, profile?.addressNumber]
        .filter(Boolean)
        .join(", "),
      profile?.addressCity
        ? profile?.addressState
          ? `${profile.addressCity}/${profile.addressState}`
          : profile.addressCity
        : null,
      profile?.addressZipCode ? `CEP ${profile.addressZipCode}` : null,
    ]
      .filter(Boolean)
      .join(" — ") || "—"
  );
}

export function CompanyProfileFormSection({
  density = "comfortable",
  displayName,
  errors,
  initials,
  isRemovingPortfolio,
  isSaving,
  isUploadingAvatar,
  isUploadingPortfolio,
  onAvatarChange,
  onCancel,
  onPortfolioRemove,
  onPortfolioUpload,
  onSubmit,
  portfolioMedia,
  profile,
  register,
}: CompanyProfileFormSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compact = density === "compact";

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    void onAvatarChange(file);
    event.target.value = "";
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col", compact ? "gap-4" : "gap-6")}
    >
      <div className={cn("flex", compact ? "gap-4" : "gap-6")}>
        <div
          className={cn(
            "flex shrink-0 flex-col items-center",
            compact ? "gap-1.5" : "gap-2",
          )}
        >
          <ProfileAvatar
            density={density}
            displayName={displayName}
            initials={initials}
            photoUrl={profile?.photoUrl}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(compact ? "gap-1 text-[10px]" : "gap-1.5 text-xs")}
            disabled={isUploadingAvatar}
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className={compact ? "size-3" : "size-3.5"} />
            {isUploadingAvatar
              ? compact
                ? "…"
                : "Enviando…"
              : compact
                ? "Alterar"
                : "Alterar foto"}
          </Button>
        </div>

        <div
          className={cn("flex flex-1 flex-col", compact ? "gap-3" : "gap-4")}
        >
          <FormField
            error={errors.name?.message}
            errorClassName={
              compact
                ? "mt-0.5 text-xs text-red-500"
                : "mt-1 text-xs text-red-500"
            }
            inputClassName={errors.name ? "border-red-500" : undefined}
            label="Nome"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Input {...register("name")} placeholder="Seu nome" />
          </FormField>

          <div>
            <label
              className={cn(
                compact
                  ? "mb-0.5 block text-xs font-medium text-slate-600"
                  : "mb-1 block text-sm font-medium text-slate-600",
              )}
            >
              Sobre a empresa
            </label>
            <textarea
              {...register("bio")}
              placeholder={
                compact ? "Breve descrição" : "Breve descrição da sua empresa"
              }
              rows={compact ? 2 : 3}
              className="h-auto w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            />
          </div>
        </div>
      </div>

      <CompanyProfileSection
        density={density}
        icon={Building2}
        title="Dados da Empresa"
      >
        <div
          className={cn(
            compact ? "flex flex-col gap-3" : "grid gap-4 sm:grid-cols-2",
          )}
        >
          <FormField
            error={errors.companyName?.message}
            errorClassName={
              compact
                ? "mt-0.5 text-xs text-red-500"
                : "mt-1 text-xs text-red-500"
            }
            inputClassName={errors.companyName ? "border-red-500" : undefined}
            label="Nome da empresa"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
            wrapperClassName={compact ? undefined : "sm:col-span-2"}
          >
            <Input
              {...register("companyName")}
              placeholder="Razão social ou nome fantasia"
            />
          </FormField>

          <FormField
            label="Cargo"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Input
              {...register("jobTitle")}
              placeholder={
                compact ? "Ex: CEO" : "Ex: CEO, Gerente de Marketing"
              }
            />
          </FormField>

          <FormField
            label={compact ? "Nicho" : "Nicho de atuação"}
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Input
              {...register("businessNiche")}
              placeholder="Ex: Moda, Tecnologia"
            />
          </FormField>

          <FormField
            label="Telefone"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Input {...register("phone")} placeholder="(00) 00000-0000" />
          </FormField>

          <FormField
            label="Tipo de documento"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Select {...register("documentType")}>
              <option value="">Selecione</option>
              <option value="CPF">CPF</option>
              <option value="CNPJ">CNPJ</option>
            </Select>
          </FormField>

          <FormField
            error={errors.documentNumber?.message}
            errorClassName={
              compact
                ? "mt-0.5 text-xs text-red-500"
                : "mt-1 text-xs text-red-500"
            }
            inputClassName={
              errors.documentNumber ? "border-red-500" : undefined
            }
            label="Número do documento"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Input
              {...register("documentNumber")}
              placeholder="Somente números"
            />
          </FormField>
        </div>
      </CompanyProfileSection>

      <CompanyProfileSection density={density} icon={MapPin} title="Endereço">
        <div
          className={cn(
            compact ? "flex flex-col gap-3" : "grid gap-4 sm:grid-cols-2",
          )}
        >
          <FormField
            label="Rua"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
            wrapperClassName={compact ? undefined : "sm:col-span-2"}
          >
            <Input {...register("addressStreet")} placeholder="Nome da rua" />
          </FormField>

          <FormField
            label="Número"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Input {...register("addressNumber")} placeholder="Número" />
          </FormField>

          <FormField
            label="CEP"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Input {...register("addressZipCode")} placeholder="00000-000" />
          </FormField>

          <FormField
            label="Cidade"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Input {...register("addressCity")} placeholder="Cidade" />
          </FormField>

          <FormField
            label="Estado"
            labelClassName={
              compact
                ? "mb-0.5 block text-xs font-medium text-slate-600"
                : "mb-1 block text-sm font-medium text-slate-600"
            }
          >
            <Input {...register("addressState")} placeholder="UF" />
          </FormField>
        </div>
      </CompanyProfileSection>

      <CompanyPortfolioSection
        density={density}
        media={portfolioMedia}
        onUpload={onPortfolioUpload}
        onRemove={onPortfolioRemove}
        isUploading={isUploadingPortfolio}
        isRemoving={isRemovingPortfolio}
      />

      <div className={cn("flex", compact ? "gap-2 pt-2" : "justify-end gap-2")}>
        <Button
          type="button"
          variant="outline"
          className={compact ? "flex-1" : undefined}
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="purple"
          className={compact ? "flex-1" : undefined}
          disabled={isSaving}
        >
          {compact ? "Salvar" : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}

export function CompanyProfileSummarySection({
  density = "comfortable",
  displayName,
  initials,
  portfolioMedia,
  profile,
  user,
}: CompanyProfileSectionProps) {
  const compact = density === "compact";
  const companyItems = getCompanyItems(user);
  const showAddress =
    profile?.addressStreet || profile?.addressCity || profile?.addressZipCode;

  return (
    <div className={cn("flex flex-col", compact ? "gap-4" : "gap-6")}>
      <div className={cn("flex", compact ? "gap-4" : "gap-6")}>
        <ProfileAvatar
          density={density}
          displayName={displayName}
          initials={initials}
          photoUrl={profile?.photoUrl}
        />

        <div
          className={cn("flex flex-1 flex-col", compact ? "gap-0.5" : "gap-1")}
        >
          <h2
            className={cn(
              "font-bold text-[#0f172a]",
              compact ? "text-lg" : "text-xl",
            )}
          >
            {displayName}
          </h2>
          {profile?.bio ? (
            <p className="text-sm text-slate-600">{profile.bio}</p>
          ) : null}
        </div>
      </div>

      <CompanyProfileSection
        density={density}
        icon={Building2}
        title="Dados da Empresa"
      >
        <div
          className={cn(
            compact ? "flex flex-col gap-3" : "grid gap-4 sm:grid-cols-2",
          )}
        >
          {companyItems.map((item) => (
            <InfoItem
              key={item.label}
              density={density}
              icon={item.icon}
              label={item.label}
              value={item.value}
              fullWidth={item.fullWidth}
            />
          ))}
        </div>
      </CompanyProfileSection>

      {showAddress ? (
        <CompanyProfileSection density={density} icon={MapPin} title="Endereço">
          <InfoItem
            density={density}
            icon={MapPin}
            label="Endereço"
            value={getAddress(profile)}
          />
        </CompanyProfileSection>
      ) : null}

      <CompanyPortfolioSection
        density={density}
        media={portfolioMedia}
        readOnly
      />
    </div>
  );
}

export function CompanyProfileCardHeader({
  isEditing,
  onCancel,
  onEdit,
}: {
  isEditing: boolean;
  onCancel: () => void;
  onEdit: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between sm:mb-6">
      <h1 className="text-lg font-bold text-[#0f172a] sm:text-2xl">
        Perfil da Empresa
      </h1>
      {!isEditing ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1 rounded-full sm:gap-2"
          onClick={onEdit}
        >
          <Pencil className="size-3.5 sm:size-4" />
          Editar
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-full"
          onClick={onCancel}
        >
          Cancelar
        </Button>
      )}
    </div>
  );
}

function CompanyProfileSection({
  children,
  density,
  icon: Icon,
  title,
}: {
  children: ReactNode;
  density: Density;
  icon: LucideIcon;
  title: string;
}) {
  const compact = density === "compact";

  return (
    <div className={cn("border-t border-slate-100", compact ? "pt-4" : "pt-6")}>
      <h3
        className={cn(
          "flex items-center gap-2 font-bold text-[#0f172a]",
          compact ? "mb-3 text-sm" : "mb-4 text-lg",
        )}
      >
        <Icon
          className={
            compact ? "size-4 text-[#895af6]" : "size-5 text-[#895af6]"
          }
        />
        {title}
      </h3>
      {children}
    </div>
  );
}

function ProfileAvatar({
  density,
  displayName,
  initials,
  photoUrl,
}: {
  density: Density;
  displayName: string;
  initials: string;
  photoUrl?: string | null;
}) {
  const compact = density === "compact";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full border-[rgba(137,90,246,0.1)] bg-[rgba(137,90,246,0.1)]",
        compact ? "size-16 border-2" : "size-24 border-4",
      )}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={displayName}
          className="size-full object-cover"
        />
      ) : (
        <span
          className={cn(
            "font-bold text-[#895af6]",
            compact ? "text-xl" : "text-2xl",
          )}
        >
          {initials}
        </span>
      )}
    </div>
  );
}

function FormField({
  children,
  error,
  errorClassName,
  inputClassName,
  label,
  labelClassName,
  wrapperClassName,
}: {
  children: ReactElement<{ className?: string }>;
  error?: string;
  errorClassName?: string;
  inputClassName?: string;
  label: string;
  labelClassName: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={wrapperClassName}>
      <label className={labelClassName}>{label}</label>
      {inputClassName
        ? cloneElement(children, { className: inputClassName })
        : children}
      {error ? <p className={errorClassName}>{error}</p> : null}
    </div>
  );
}

function InfoItem({
  density,
  icon: Icon,
  label,
  value,
  fullWidth = false,
}: {
  density: Density;
  icon: LucideIcon;
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  const compact = density === "compact";

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        !compact && fullWidth && "sm:col-span-2",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center bg-[rgba(137,90,246,0.1)]",
          compact ? "size-9 rounded-lg" : "size-10 rounded-xl",
        )}
      >
        <Icon className={cn("text-[#895af6]", compact ? "size-4" : "size-5")} />
      </div>
      <div>
        <p
          className={cn("text-slate-500", compact ? "text-[10px]" : "text-xs")}
        >
          {label}
        </p>
        <p
          className={cn(
            "font-medium text-slate-900",
            compact ? "text-sm" : undefined,
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
