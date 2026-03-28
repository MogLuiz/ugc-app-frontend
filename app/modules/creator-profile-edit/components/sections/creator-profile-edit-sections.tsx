import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronDown,
  Circle,
  Image,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { CreatorJobTypeItem } from "~/modules/creator-job-types/types";
import {
  AvailabilitySwitch,
  TimeSelectField,
} from "~/modules/creator-calendar/components/sections/creator-calendar-controls";
import type { AvailabilityDay } from "~/modules/creator-calendar/types";
import type { PortfolioMediaPayload } from "~/modules/auth/types";
import type { ProfileProgress } from "../../hooks/use-creator-profile-edit-controller";
import { lookupCep, formatCep } from "../../lib/cep-lookup";

// ─────────────────────────────────────────────────────────────────────────────
// Internal helper
// ─────────────────────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-bold uppercase tracking-wide text-[#94a3b8]">
      {children}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProfileProgressBlock
// ─────────────────────────────────────────────────────────────────────────────

export function ProfileProgressBlock({ percent, completedCount, items }: ProfileProgress) {
  const allDone = completedCount === items.length;

  return (
    <section className="flex flex-col gap-4 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#0f172a]">Conclusão do Perfil</h3>
        <span className="rounded-full bg-[rgba(137,90,246,0.1)] px-2.5 py-0.5 text-xs font-bold text-[#895af6]">
          {completedCount}/{items.length} itens
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
        <div
          className="h-full rounded-full bg-[#895af6] transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Subtitle */}
      <p className="text-xs text-[#64748b]">
        {allDone
          ? "Perfil completo! Você está pronto para receber e aplicar para ofertas."
          : "Complete seu perfil para aparecer para empresas e liberar candidaturas."}
      </p>

      {/* Checklist 2-col */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            {item.done ? (
              <CheckCircle2 className="size-4 shrink-0 text-[#895af6]" />
            ) : (
              <Circle className="size-4 shrink-0 text-slate-300" />
            )}
            <span
              className={cn(
                "text-xs leading-tight",
                item.done ? "font-medium text-[#0f172a]" : "text-slate-400",
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CreatorProfileInfoSection (desktop only — full form)
// ─────────────────────────────────────────────────────────────────────────────

type ProfileInfoSectionProps = {
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  birthDate: string;
  onBirthDateChange: (value: string) => void;
  bio: string;
  onBioChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  instagramUsername: string;
  onInstagramUsernameChange: (value: string) => void;
  tiktokUsername: string;
  onTiktokUsernameChange: (value: string) => void;
  username: string;
  location: string;
  photoUrl?: string;
  initials: string;
  onAvatarChange?: (file: File) => void;
};

export function CreatorProfileInfoSection({
  displayName,
  onDisplayNameChange,
  birthDate,
  onBirthDateChange,
  bio,
  onBioChange,
  phone,
  onPhoneChange,
  instagramUsername,
  onInstagramUsernameChange,
  tiktokUsername,
  onTiktokUsernameChange,
  username,
  location,
  photoUrl,
  initials,
  onAvatarChange,
}: ProfileInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) onAvatarChange(file);
    e.target.value = "";
  }

  return (
    <section className="flex flex-col gap-6 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="size-24 overflow-hidden rounded-full border-4 border-[rgba(137,90,246,0.2)]">
            {photoUrl ? (
              <img src={photoUrl} alt={displayName} className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center bg-slate-200">
                <span className="text-2xl font-bold text-slate-600">{initials}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full bg-[#895af6] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)]"
          >
            <Camera className="size-5 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <p className="mt-4 text-lg font-bold text-[#0f172a]">{username}</p>
        <p className="text-sm text-[#64748b]">{location}</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Nome de Exibição</FieldLabel>
          <Input
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Bio</FieldLabel>
          <textarea
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
            placeholder="Conte um pouco sobre você e seu trabalho"
            rows={3}
            maxLength={500}
            className="min-h-0 w-full resize-y rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] outline-none ring-0 placeholder:text-[#94a3b8]"
          />
          <p className="text-right text-xs text-[#94a3b8]">{bio.length}/500</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Telefone</FieldLabel>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(00) 00000-0000"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Data de Nascimento</FieldLabel>
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => onBirthDateChange(e.target.value)}
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Instagram</FieldLabel>
          <Input
            value={instagramUsername}
            onChange={(e) => onInstagramUsernameChange(e.target.value)}
            placeholder="@usuario"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>TikTok</FieldLabel>
          <Input
            value={tiktokUsername}
            onChange={(e) => onTiktokUsernameChange(e.target.value)}
            placeholder="@usuario"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CreatorPrimaryInfoSection (mobile: name + bio only)
// ─────────────────────────────────────────────────────────────────────────────

type PrimaryInfoProps = {
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  bio: string;
  onBioChange: (value: string) => void;
  photoUrl?: string;
  initials: string;
  onAvatarChange?: (file: File) => void;
  isUploadingAvatar?: boolean;
};

export function CreatorPrimaryInfoSection({
  displayName,
  onDisplayNameChange,
  bio,
  onBioChange,
  photoUrl,
  initials,
  onAvatarChange,
  isUploadingAvatar = false,
}: PrimaryInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) onAvatarChange(file);
    e.target.value = "";
  }

  return (
    <section className="flex flex-col gap-4 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      {/* Avatar — circle + camera icon only, no text */}
      <div className="flex justify-center pb-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploadingAvatar}
          className="relative"
        >
          <div className="size-24 overflow-hidden rounded-full border-4 border-[rgba(137,90,246,0.2)] bg-slate-200 shadow-md">
            {photoUrl ? (
              <img src={photoUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center">
                <span className="text-2xl font-bold text-slate-500">{initials}</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border-2 border-white bg-[#895af6] shadow-sm">
            <Camera className="size-3.5 text-white" />
          </div>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <FieldLabel>Nome de Exibição</FieldLabel>
        <Input
          value={displayName}
          onChange={(e) => onDisplayNameChange(e.target.value)}
          className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Bio</FieldLabel>
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          placeholder="Conte um pouco sobre você e seu trabalho"
          rows={3}
          maxLength={500}
          className="min-h-0 w-full resize-none rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3 text-sm text-[#0f172a] outline-none ring-0 placeholder:text-[#94a3b8]"
        />
        <p className="text-right text-xs text-[#94a3b8]">{bio.length}/500</p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CreatorSupplementarySection (mobile: phone, instagram, tiktok, birthdate — collapsible)
// ─────────────────────────────────────────────────────────────────────────────

type SupplementaryProps = {
  phone: string;
  onPhoneChange: (value: string) => void;
  instagramUsername: string;
  onInstagramUsernameChange: (value: string) => void;
  tiktokUsername: string;
  onTiktokUsernameChange: (value: string) => void;
  birthDate: string;
  onBirthDateChange: (value: string) => void;
};

export function CreatorSupplementarySection({
  phone,
  onPhoneChange,
  instagramUsername,
  onInstagramUsernameChange,
  tiktokUsername,
  onTiktokUsernameChange,
  birthDate,
  onBirthDateChange,
}: SupplementaryProps) {
  const hasAnyValue = !!(phone || instagramUsername || tiktokUsername || birthDate);
  const [open, setOpen] = useState(hasAnyValue);

  return (
    <section className="flex flex-col rounded-[48px] border border-[#e2e8f0] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between px-6 py-5"
      >
        <span className="text-base font-bold text-[#0f172a]">
          Informações complementares
        </span>
        <ChevronDown
          className={cn(
            "size-5 text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="flex flex-col gap-4 px-6 pb-6">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Telefone</FieldLabel>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="(00) 00000-0000"
              className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Instagram</FieldLabel>
            <Input
              value={instagramUsername}
              onChange={(e) => onInstagramUsernameChange(e.target.value)}
              placeholder="@usuario"
              className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>TikTok</FieldLabel>
            <Input
              value={tiktokUsername}
              onChange={(e) => onTiktokUsernameChange(e.target.value)}
              placeholder="@usuario"
              className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Data de Nascimento</FieldLabel>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => onBirthDateChange(e.target.value)}
              className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
            />
          </div>
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CreatorAddressSection
// ─────────────────────────────────────────────────────────────────────────────

type CepStatus = "idle" | "loading" | "found" | "not_found" | "error";

type AddressSectionProps = {
  street: string;
  onStreetChange: (value: string) => void;
  number: string;
  onNumberChange: (value: string) => void;
  city: string;
  onCityChange: (value: string) => void;
  state: string;
  onStateChange: (value: string) => void;
  zipCode: string;
  onZipCodeChange: (value: string) => void;
  collapsible?: boolean;
};

export function CreatorAddressSection({
  street,
  onStreetChange,
  number,
  onNumberChange,
  city,
  onCityChange,
  state,
  onStateChange,
  zipCode,
  onZipCodeChange,
  collapsible = false,
}: AddressSectionProps) {
  // Lock city/state when they were already derived from a CEP at mount time.
  // Street is always editable — CEP auto-fills it as a convenience, not a lock.
  const [cepStatus, setCepStatus] = useState<CepStatus>("idle");
  const [lockedByZip, setLockedByZip] = useState(
    () => !!(city && state && zipCode),
  );

  // Abort controller ref — cancels in-flight ViaCEP requests when CEP changes
  // rapidly, preventing old responses from overwriting newer results.
  const abortRef = useRef<AbortController | null>(null);

  const hasAddress = !!(city && state);
  const [open, setOpen] = useState(hasAddress);

  useEffect(() => {
    if (hasAddress) setOpen(true);
  }, [hasAddress]);

  const handleCepChange = useCallback(
    async (raw: string) => {
      const masked = formatCep(raw);
      onZipCodeChange(masked);

      const digits = masked.replace(/\D/g, "");

      if (digits.length < 8) {
        // Incomplete — abort any in-flight request and unlock derived fields
        abortRef.current?.abort();
        abortRef.current = null;
        setLockedByZip(false);
        setCepStatus("idle");
        return;
      }

      // Cancel previous request before starting a new one (race condition guard)
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setCepStatus("loading");
      try {
        const result = await lookupCep(digits, controller.signal);

        if (result.found) {
          onCityChange(result.city);
          onStateChange(result.state);
          // Pre-fill street only when ViaCEP returns a logradouro — always editable
          if (result.street) onStreetChange(result.street);
          setLockedByZip(true);
          setCepStatus("found");
        } else {
          // CEP not found — keep fields editable with fallback manual entry
          setLockedByZip(false);
          setCepStatus("not_found");
        }
      } catch (err) {
        // Ignore AbortError (we cancelled it intentionally)
        if (err instanceof DOMException && err.name === "AbortError") return;
        setLockedByZip(false);
        setCepStatus("error");
      }
    },
    [onZipCodeChange, onCityChange, onStateChange, onStreetChange],
  );

  // CEP status icon
  const cepIcon =
    cepStatus === "loading" ? (
      <Loader2 className="size-4 animate-spin text-[#895af6]" />
    ) : cepStatus === "found" ? (
      <CheckCircle2 className="size-4 text-emerald-500" />
    ) : cepStatus === "not_found" || cepStatus === "error" ? (
      <XCircle className="size-4 text-red-400" />
    ) : null;

  // Hint below CEP field
  const cepHint =
    cepStatus === "idle" && !zipCode ? (
      <p className="mt-1 text-[11px] text-[#94a3b8]">
        Digite seu CEP para preencher o endereço automaticamente
      </p>
    ) : cepStatus === "not_found" ? (
      <p className="mt-1 text-[11px] text-red-500">
        CEP não encontrado. Preencha o endereço manualmente.
      </p>
    ) : cepStatus === "error" ? (
      <p className="mt-1 text-[11px] text-red-500">
        Não foi possível validar o CEP. Preencha manualmente se necessário.
      </p>
    ) : null;

  // Collapsed summary: show incomplete hint when city or state is missing
  const summaryLine =
    city && state
      ? street
        ? `${street}${number ? `, ${number}` : ""} – ${city}, ${state}`
        : `${city}, ${state}`
      : zipCode
        ? "Endereço incompleto — adicione cidade e estado"
        : "Endereço não cadastrado";

  const fields = (
    <div className="flex flex-col gap-4">
      {/* CEP — primary field */}
      <div className="flex flex-col gap-0">
        <FieldLabel>CEP</FieldLabel>
        <div className="relative mt-1.5">
          <Input
            value={zipCode}
            onChange={(e) => void handleCepChange(e.target.value)}
            placeholder="00000-000"
            inputMode="numeric"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3 pr-10"
          />
          {cepIcon && (
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              {cepIcon}
            </span>
          )}
        </div>
        {cepHint}
      </div>

      {/* Street — always editable; auto-filled as convenience */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Rua</FieldLabel>
        <Input
          value={street}
          onChange={(e) => onStreetChange(e.target.value)}
          placeholder="Logradouro"
          className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
        />
      </div>

      {/* Number */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Número</FieldLabel>
          <Input
            value={number}
            onChange={(e) => onNumberChange(e.target.value)}
            placeholder="Nº"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        {/* Second col empty — no complement field in backend */}
        <div />
      </div>

      {/* City + State — locked when derived from CEP */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Cidade</FieldLabel>
          <Input
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Cidade"
            disabled={lockedByZip}
            title={lockedByZip ? "Definida pelo CEP" : undefined}
            className={cn(
              "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3",
              lockedByZip && "cursor-not-allowed bg-[#f1f5f9] text-[#94a3b8]",
            )}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Estado</FieldLabel>
          <Input
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            placeholder="UF"
            maxLength={2}
            disabled={lockedByZip}
            title={lockedByZip ? "Definido pelo CEP" : undefined}
            className={cn(
              "rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3 uppercase",
              lockedByZip && "cursor-not-allowed bg-[#f1f5f9] text-[#94a3b8]",
            )}
          />
        </div>
      </div>

      {lockedByZip && (
        <p className="text-[11px] text-[#94a3b8]">
          Cidade e estado são definidos pelo CEP. Para alterá-los, mude o CEP.
        </p>
      )}
    </div>
  );

  if (!collapsible) {
    return (
      <section className="flex flex-col gap-4 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]">
            <MapPin className="size-5 text-[#895af6]" />
          </div>
          <h3 className="text-base font-bold text-[#0f172a]">Endereço</h3>
        </div>
        {fields}
      </section>
    );
  }

  return (
    <section className="flex flex-col rounded-[48px] border border-[#e2e8f0] bg-white shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 px-6 py-5"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]">
          <MapPin className="size-4 text-[#895af6]" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-bold text-[#0f172a]">Endereço</p>
          <p
            className={cn(
              "truncate text-xs",
              hasAddress ? "text-[#64748b]" : "text-slate-400",
            )}
          >
            {summaryLine}
          </p>
        </div>
        <ChevronDown
          className={cn(
            "size-5 shrink-0 text-slate-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && <div className="px-6 pb-6">{fields}</div>}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CreatorAvailabilitySection
// ─────────────────────────────────────────────────────────────────────────────

type AvailabilitySectionProps = {
  availabilityDays: AvailabilityDay[];
  timeOptions: string[];
  onUpdateDay: (
    dayId: string,
    field: "enabled" | "start" | "end",
    value: boolean | string,
  ) => void;
  onSyncWeekdays: () => void;
  compact?: boolean;
};

export function CreatorAvailabilitySection({
  availabilityDays,
  timeOptions,
  onUpdateDay,
  onSyncWeekdays,
  compact = false,
}: AvailabilitySectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]">
          <Calendar className="size-5 text-[#895af6]" />
        </div>
        <h3 className="text-base font-bold text-[#0f172a]">Disponibilidade</h3>
      </div>

      <button
        type="button"
        onClick={onSyncWeekdays}
        className="flex w-full items-center justify-between rounded-[24px] bg-[#efe6ff] px-5 py-3 text-left transition-colors hover:bg-[#e6dcff]"
      >
        <div>
          <p className="text-sm font-bold text-[#6d3ad8]">Sincronizar semana</p>
          <p className="text-xs text-[#6d3ad8]/70">
            Replicar horários para todos os dias ativos
          </p>
        </div>
        <ArrowLeft className="size-4 rotate-180 text-[#895af6]" />
      </button>

      {compact ? (
        /* Compact: two-level rows — summary on line 1, time selects on line 2 */
        <div className="flex flex-col divide-y divide-[#f1f5f9]">
          {availabilityDays.map((day) => (
            <div key={day.id} className="py-3">
              {/* Line 1: day abbreviation + status + switch */}
              <div className="flex items-center gap-3">
                <span className="w-10 shrink-0 text-sm font-bold text-[#0f172a]">
                  {day.label.slice(0, 3)}
                </span>
                <span
                  className={cn(
                    "flex-1 text-xs",
                    day.enabled
                      ? "font-semibold text-[#895af6]"
                      : "text-slate-400",
                  )}
                >
                  {day.enabled ? `${day.start} – ${day.end}` : "Indisponível"}
                </span>
                <AvailabilitySwitch
                  checked={day.enabled}
                  onChange={(checked) => onUpdateDay(day.id, "enabled", checked)}
                />
              </div>

              {/* Line 2: time selects (only when enabled) */}
              {day.enabled && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <TimeSelectField
                    label="Início"
                    value={day.start}
                    options={timeOptions}
                    onChange={(value) => onUpdateDay(day.id, "start", value)}
                  />
                  <TimeSelectField
                    label="Fim"
                    value={day.end}
                    options={timeOptions}
                    onChange={(value) => onUpdateDay(day.id, "end", value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Full: expanded cards (desktop) */
        <div className="space-y-4">
          {availabilityDays.map((day) => (
            <article
              key={day.id}
              className={cn(
                "rounded-[24px] p-5",
                day.enabled ? "bg-[#faf9fd] shadow-sm" : "bg-transparent opacity-80",
              )}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    "text-lg font-bold tracking-[-0.03em]",
                    day.enabled ? "text-slate-900" : "text-slate-400",
                  )}
                >
                  {day.label}
                </h3>
                <AvailabilitySwitch
                  checked={day.enabled}
                  onChange={(checked) => onUpdateDay(day.id, "enabled", checked)}
                />
              </div>
              {day.enabled ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <TimeSelectField
                    label="Início"
                    value={day.start}
                    options={timeOptions}
                    onChange={(value) => onUpdateDay(day.id, "start", value)}
                  />
                  <TimeSelectField
                    label="Fim"
                    value={day.end}
                    options={timeOptions}
                    onChange={(value) => onUpdateDay(day.id, "end", value)}
                  />
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-400">Indisponível para este dia</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CreatorServicesSection
// ─────────────────────────────────────────────────────────────────────────────

const JOB_MODE_LABELS: Record<CreatorJobTypeItem["mode"], string> = {
  REMOTE: "Remoto",
  PRESENTIAL: "Presencial",
  HYBRID: "Híbrido",
};

type ServicesSectionProps = {
  jobTypes: CreatorJobTypeItem[];
  onToggleJobType: (id: string) => void;
  isLoading?: boolean;
};

export function CreatorServicesSection({
  jobTypes,
  onToggleJobType,
  isLoading = false,
}: ServicesSectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <h3 className="text-base font-bold text-[#0f172a]">Tipos de Trabalho</h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="size-6 animate-spin rounded-full border-2 border-[#895af6] border-t-transparent" />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jobTypes.map((jt) => (
            <div
              key={jt.id}
              className={cn(
                "rounded-[24px] border p-4 transition-all",
                jt.selected
                  ? "border-[rgba(137,90,246,0.2)] bg-[#faf9fd]"
                  : "border-[#f1f5f9] bg-white opacity-70",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: name, mode, duration, price */}
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "font-bold leading-snug",
                      jt.selected ? "text-[#0f172a]" : "text-slate-400",
                    )}
                  >
                    {jt.name}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        jt.selected
                          ? "bg-[#ede8fd] text-[#895af6]"
                          : "bg-slate-100 text-slate-400",
                      )}
                    >
                      {JOB_MODE_LABELS[jt.mode]}
                    </span>
                    <span className="text-xs text-[#94a3b8]">
                      {jt.durationMinutes} min
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-base font-black",
                      jt.selected ? "text-[#895af6]" : "text-slate-400",
                    )}
                  >
                    R${" "}
                    {jt.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Right: toggle + active/inactive label */}
                <div className="flex shrink-0 flex-col items-center gap-1 pt-0.5">
                  <AvailabilitySwitch
                    checked={jt.selected}
                    onChange={() => onToggleJobType(jt.id)}
                  />
                  <span className="text-[10px] font-semibold text-slate-400">
                    {jt.selected ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CreatorPortfolioSection
// ─────────────────────────────────────────────────────────────────────────────

type PortfolioSectionProps = {
  media: PortfolioMediaPayload[];
  onUpload?: (file: File) => void;
  onRemove?: (mediaId: string) => void;
  isUploading?: boolean;
  isRemoving?: boolean;
};

export function CreatorPortfolioSection({
  media,
  onUpload,
  onRemove,
  isUploading = false,
  isRemoving = false,
}: PortfolioSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onUpload) onUpload(file);
    e.target.value = "";
  }

  return (
    <section className="flex flex-col gap-4 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="size-5 text-[#895af6]" />
          <h3 className="text-base font-bold text-[#0f172a]">Meu Portfólio</h3>
          {media.length > 0 && (
            <span className="text-xs font-bold text-[#895af6]">
              · {media.length} {media.length === 1 ? "item" : "itens"}
            </span>
          )}
        </div>
        {media.length > 0 && (
          <button
            type="button"
            className="text-xs font-bold text-[#895af6] hover:underline"
          >
            Ver todos
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Microcopy */}
      <p className="text-xs text-[#64748b]">
        Seu portfólio aumenta suas chances de aprovação por empresas.
      </p>

      {/* Empty state — prominent CTA */}
      {media.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[32px] border-2 border-dashed border-[rgba(137,90,246,0.25)] bg-[rgba(137,90,246,0.03)] py-10">
          <div className="flex size-14 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]">
            <Image className="size-7 text-[#895af6]" />
          </div>
          <div className="text-center px-4">
            <p className="font-bold text-[#0f172a]">Nenhuma mídia adicionada</p>
            <p className="mt-1 text-xs text-slate-500">
              Empresas avaliam creators pelo portfólio antes de enviar ofertas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-full bg-[#895af6] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#7c4aeb] disabled:opacity-50"
          >
            <Plus className="size-4" />
            {isUploading ? "Enviando..." : "Adicionar mídia"}
          </button>
        </div>
      ) : (
        /* Grid when has items */
        <div className="grid grid-cols-3 gap-3">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-[32px] bg-slate-200"
            >
              {item.type === "VIDEO" ? (
                <video
                  src={item.url}
                  className="size-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={item.thumbnailUrl ?? item.url}
                  alt=""
                  className="size-full object-cover"
                />
              )}
              <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
                {item.type === "VIDEO" ? "Vídeo" : "Foto"}
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  disabled={isRemoving}
                  className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                >
                  <Trash2 className="size-3" />
                </button>
              )}
            </div>
          ))}

          {/* Add more */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex aspect-square min-h-[80px] flex-col items-center justify-center gap-2 rounded-[32px] border-2 border-dashed border-[rgba(137,90,246,0.25)] bg-[rgba(137,90,246,0.04)] text-[#895af6] transition-colors hover:border-[#895af6] hover:bg-[rgba(137,90,246,0.08)] disabled:opacity-50"
          >
            <Plus className="size-5" />
            <span className="text-[10px] font-bold uppercase leading-tight">
              {isUploading ? "Enviando..." : "Adicionar"}
            </span>
          </button>
        </div>
      )}
    </section>
  );
}
