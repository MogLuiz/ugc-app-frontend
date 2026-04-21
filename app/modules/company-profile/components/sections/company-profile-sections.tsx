import { useCallback, useRef, useState } from "react";
import type { UseFormRegister, UseFormSetValue, UseFormGetValues, FieldErrors } from "react-hook-form";
import {
  Camera,
  CheckCircle2,
  Loader2,
  MapPin,
  User,
  XCircle,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import type { CompanyProfileForm } from "../../schemas/company-profile";
import {
  lookupCep,
  formatCep,
} from "~/modules/creator-profile-edit/lib/cep-lookup";

// ─────────────────────────────────────────────────────────────────────────────
// Shared card style
// ─────────────────────────────────────────────────────────────────────────────

const CARD = "flex flex-col gap-6 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]";

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function CardSectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]">
        <Icon className="size-5 text-[#895af6]" />
      </div>
      <div>
        <h3 className="text-base font-bold text-[#0f172a]">{title}</h3>
        {description && (
          <p className="text-xs text-[#64748b]">{description}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CompanyIdentityCard — brand identity (logo, company name, bio, niche)
// ─────────────────────────────────────────────────────────────────────────────

type CompanyIdentityCardProps = {
  displayName: string;
  initials: string;
  photoUrl?: string | null;
  isUploadingAvatar: boolean;
  onAvatarChange: (file: File) => void;
  register: UseFormRegister<CompanyProfileForm>;
  errors: FieldErrors<CompanyProfileForm>;
};

export function CompanyIdentityCard({
  displayName,
  initials,
  photoUrl,
  isUploadingAvatar,
  onAvatarChange,
  register,
  errors,
}: CompanyIdentityCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onAvatarChange(file);
    e.target.value = "";
  }

  return (
    <section className={CARD}>
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="size-24 overflow-hidden rounded-full border-4 border-[rgba(137,90,246,0.2)]">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={displayName}
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-[rgba(137,90,246,0.08)]">
                <span className="text-2xl font-bold text-[#895af6]">
                  {initials}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute bottom-0 right-0 flex size-9 items-center justify-center rounded-full bg-[#895af6] shadow-[0px_4px_10px_rgba(137,90,246,0.4)] transition hover:bg-[#7c4aeb] disabled:opacity-60"
          >
            {isUploadingAvatar ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : (
              <Camera className="size-4 text-white" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-xs text-[#94a3b8]">Logo da empresa</p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Nome da empresa</FieldLabel>
          <Input
            {...register("companyName")}
            placeholder="Razão social ou nome fantasia"
            className={cn(
              "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3",
              errors.companyName && "ring-1 ring-red-400",
            )}
          />
          <FieldError message={errors.companyName?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Sobre a empresa</FieldLabel>
          <textarea
            {...register("bio")}
            placeholder="Descreva sua empresa, o que faz, para quem"
            rows={3}
            maxLength={500}
            className="w-full resize-y overflow-y-auto rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3 text-base text-[#0f172a] outline-none ring-0 placeholder:text-[#94a3b8]"
          />
          <FieldError message={errors.bio?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Nicho de atuação</FieldLabel>
          <Input
            {...register("businessNiche")}
            placeholder="Ex: Moda, Tecnologia, Gastronomia"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CompanyResponsibleCard — responsible person + document validation
// ─────────────────────────────────────────────────────────────────────────────

type CompanyResponsibleCardProps = {
  register: UseFormRegister<CompanyProfileForm>;
  errors: FieldErrors<CompanyProfileForm>;
};

export function CompanyResponsibleCard({
  register,
  errors,
}: CompanyResponsibleCardProps) {
  return (
    <section className={CARD}>
      <CardSectionHeader
        icon={User}
        title="Responsável"
        description="Dados de quem gerencia esta conta."
      />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Nome do responsável</FieldLabel>
          <Input
            {...register("name")}
            placeholder="Nome completo do responsável"
            className={cn(
              "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3",
              errors.name && "ring-1 ring-red-400",
            )}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Cargo</FieldLabel>
          <Input
            {...register("jobTitle")}
            placeholder="Ex: CEO, Gerente de Marketing"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Site</FieldLabel>
            <Input
              {...register("websiteUrl")}
              placeholder="https://suaempresa.com.br"
              className={cn(
                "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3",
                errors.websiteUrl && "ring-1 ring-red-400",
              )}
            />
            <FieldError message={errors.websiteUrl?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>Instagram</FieldLabel>
            <Input
              {...register("instagramUsername")}
              placeholder="@suaempresa ou URL"
              className={cn(
                "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3",
                errors.instagramUsername && "ring-1 ring-red-400",
              )}
            />
            <FieldError message={errors.instagramUsername?.message} />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>TikTok</FieldLabel>
            <Input
              {...register("tiktokUsername")}
              placeholder="@suaempresa ou URL"
              className={cn(
                "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3",
                errors.tiktokUsername && "ring-1 ring-red-400",
              )}
            />
            <FieldError message={errors.tiktokUsername?.message} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Telefone</FieldLabel>
          <Input
            {...register("phone")}
            placeholder="(00) 00000-0000"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
      </div>

      {/* Document validation section */}
      <div className="flex flex-col gap-4 border-t border-[#f1f5f9] pt-2">
        <div>
          <p className="text-sm font-bold text-[#0f172a]">Validação</p>
          <p className="text-xs text-[#64748b]">
            Usado para validação e segurança da plataforma.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Tipo de documento</FieldLabel>
          <Select
            {...register("documentType")}
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          >
            <option value="">Selecione</option>
            <option value="CNPJ">CNPJ</option>
            <option value="CPF">CPF</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <FieldLabel>Número do documento</FieldLabel>
          <Input
            {...register("documentNumber")}
            placeholder="Somente números"
            className={cn(
              "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3",
              errors.documentNumber && "ring-1 ring-red-400",
            )}
          />
          <FieldError message={errors.documentNumber?.message} />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CompanyAddressCard — operational address with CEP auto-fill
// Always fully expanded (not collapsible) — critical for distance calculations
// ─────────────────────────────────────────────────────────────────────────────

type CepStatus = "idle" | "loading" | "found" | "not_found" | "error";

type CompanyAddressCardProps = {
  register: UseFormRegister<CompanyProfileForm>;
  setValue: UseFormSetValue<CompanyProfileForm>;
  getValues: UseFormGetValues<CompanyProfileForm>;
  errors: FieldErrors<CompanyProfileForm>;
};

export function CompanyAddressCard({
  register,
  setValue,
  getValues,
  errors,
}: CompanyAddressCardProps) {
  const [cepStatus, setCepStatus] = useState<CepStatus>("idle");
  const [lockedByZip, setLockedByZip] = useState(() => {
    const city = getValues("addressCity");
    const state = getValues("addressState");
    const zip = getValues("addressZipCode");
    return !!(city && state && zip);
  });
  const abortRef = useRef<AbortController | null>(null);

  const handleCepChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCep(e.target.value);
      setValue("addressZipCode", formatted, { shouldDirty: true });

      const digits = formatted.replace(/\D/g, "");
      if (digits.length < 8) {
        setCepStatus("idle");
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setCepStatus("loading");

      try {
        const result = await lookupCep(formatted, controller.signal);
        if (result.found) {
          setValue("addressStreet", result.street, { shouldDirty: true });
          setValue("addressCity", result.city, { shouldDirty: true });
          setValue("addressState", result.state, { shouldDirty: true });
          setLockedByZip(true);
          setCepStatus("found");
        } else {
          setLockedByZip(false);
          setCepStatus("not_found");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setLockedByZip(false);
        setCepStatus("error");
      }
    },
    [setValue],
  );

  const cepIcon =
    cepStatus === "loading" ? (
      <Loader2 className="size-4 animate-spin text-[#895af6]" />
    ) : cepStatus === "found" ? (
      <CheckCircle2 className="size-4 text-emerald-500" />
    ) : cepStatus === "not_found" || cepStatus === "error" ? (
      <XCircle className="size-4 text-red-400" />
    ) : null;

  const cepHint =
    cepStatus === "not_found"
      ? "CEP não encontrado. Preencha os campos manualmente."
      : cepStatus === "error"
        ? "Erro ao buscar CEP. Preencha manualmente."
        : cepStatus === "idle"
          ? "Preencha o CEP para auto-completar os campos abaixo."
          : null;

  const { onChange: _cepOnChange, ...cepRegisterRest } =
    register("addressZipCode");

  return (
    <section className={CARD}>
      <CardSectionHeader
        icon={MapPin}
        title="Endereço"
        description="Usamos esse endereço para calcular distância em trabalhos presenciais."
      />

      <div className="flex flex-col gap-4">
        {/* CEP */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>CEP</FieldLabel>
          <div className="relative">
            <Input
              {...cepRegisterRest}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength={9}
              className={cn(
                "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3",
                cepIcon && "pr-10",
              )}
            />
            {cepIcon && (
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                {cepIcon}
              </span>
            )}
          </div>
          {cepHint && (
            <p className="text-[11px] text-[#94a3b8]">{cepHint}</p>
          )}
        </div>

        {/* Street */}
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Rua</FieldLabel>
          <Input
            {...register("addressStreet")}
            placeholder="Logradouro"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>

        {/* Number */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Número</FieldLabel>
            <Input
              {...register("addressNumber")}
              placeholder="Nº"
              className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
            />
          </div>
          <div />
        </div>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Cidade</FieldLabel>
            <Input
              {...register("addressCity")}
              placeholder="Cidade"
              disabled={lockedByZip}
              title={lockedByZip ? "Definida pelo CEP" : undefined}
              className={cn(
                "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3",
                lockedByZip &&
                  "cursor-not-allowed bg-[#f1f5f9] text-[#94a3b8]",
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Estado</FieldLabel>
            <Input
              {...register("addressState")}
              placeholder="UF"
              maxLength={2}
              disabled={lockedByZip}
              title={lockedByZip ? "Definido pelo CEP" : undefined}
              className={cn(
                "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3 uppercase",
                lockedByZip &&
                  "cursor-not-allowed bg-[#f1f5f9] text-[#94a3b8]",
              )}
            />
          </div>
        </div>

        {lockedByZip && (
          <p className="text-[11px] text-[#94a3b8]">
            Cidade e estado são definidos pelo CEP. Para alterá-los, mude o
            CEP.
          </p>
        )}
      </div>
    </section>
  );
}
