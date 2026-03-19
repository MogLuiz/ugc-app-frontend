import { useRef } from "react";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Image,
  MapPin,
  Plus,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { CreatorJobTypeItem } from "~/modules/creator-job-types/types";
import { AvailabilitySwitch, TimeSelectField } from "~/modules/creator-calendar/components/sections/creator-calendar-controls";
import type { AvailabilityDay } from "~/modules/creator-calendar/types";
import type { PortfolioMediaPayload } from "~/modules/auth/types";

type ProfileInfoSectionProps = {
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  birthDate: string;
  onBirthDateChange: (value: string) => void;
  phone: string;
  onPhoneChange: (value: string) => void;
  instagramUsername: string;
  onInstagramUsernameChange: (value: string) => void;
  tiktokUsername: string;
  onTiktokUsernameChange: (value: string) => void;
  username: string;
  location: string;
  niches: string[];
  onAddNiche: (niche: string) => void;
  onRemoveNiche: (niche: string) => void;
  photoUrl?: string;
  initials: string;
  onAvatarChange?: (file: File) => void;
  /** Oculta avatar e username no topo (para layout mobile com header separado) */
  compact?: boolean;
};

export function CreatorProfileInfoSection({
  displayName,
  onDisplayNameChange,
  birthDate,
  onBirthDateChange,
  phone,
  onPhoneChange,
  instagramUsername,
  onInstagramUsernameChange,
  tiktokUsername,
  onTiktokUsernameChange,
  username,
  location,
  niches,
  onAddNiche,
  onRemoveNiche,
  photoUrl,
  initials,
  onAvatarChange,
  compact = false,
}: ProfileInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) onAvatarChange(file);
    e.target.value = "";
  }

  return (
    <section className="flex flex-col gap-6 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      {!compact && (
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="size-24 overflow-hidden rounded-full border-4 border-[rgba(137,90,246,0.2)]">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={displayName}
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center bg-slate-200">
                  <span className="text-2xl font-bold text-slate-600">
                    {initials}
                  </span>
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
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-[#94a3b8]">
            Nome de Exibição
          </label>
          <Input
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-[#94a3b8]">
            Data de Nascimento
          </label>
          <Input
            type="date"
            value={birthDate}
            onChange={(e) => onBirthDateChange(e.target.value)}
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-[#94a3b8]">
            Telefone
          </label>
          <Input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(00) 00000-0000"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-[#94a3b8]">
            Instagram
          </label>
          <Input
            value={instagramUsername}
            onChange={(e) => onInstagramUsernameChange(e.target.value)}
            placeholder="@usuario"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-[#94a3b8]">
            TikTok
          </label>
          <Input
            value={tiktokUsername}
            onChange={(e) => onTiktokUsernameChange(e.target.value)}
            placeholder="@usuario"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-[#94a3b8]">
            Nichos
          </label>
          <div className="flex flex-wrap gap-2">
            {niches.map((niche) => (
              <span
                key={niche}
                className="flex items-center gap-1 rounded-full bg-[rgba(137,90,246,0.1)] px-3 py-1.5 text-xs font-semibold text-[#895af6]"
              >
                {niche}
                <button
                  type="button"
                  onClick={() => onRemoveNiche(niche)}
                  className="rounded-full p-0.5 hover:bg-[rgba(137,90,246,0.2)]"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              className="flex items-center gap-1 rounded-full border-2 border-dashed border-[#e2e8f0] px-3 py-1.5 text-xs font-semibold text-[#94a3b8] hover:border-[#895af6] hover:text-[#895af6]"
              onClick={() => {
                const value = prompt("Adicionar nicho:");
                if (value) onAddNiche(value);
              }}
            >
              <Plus className="size-3" />
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

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
}: AddressSectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]">
          <MapPin className="size-5 text-[#895af6]" />
        </div>
        <h3 className="text-base font-bold text-[#0f172a]">Endereço</h3>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold uppercase text-[#94a3b8]">
            Rua
          </label>
          <Input
            value={street}
            onChange={(e) => onStreetChange(e.target.value)}
            placeholder="Nome da rua"
            className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-[#94a3b8]">
              Número
            </label>
            <Input
              value={number}
              onChange={(e) => onNumberChange(e.target.value)}
              placeholder="Nº"
              className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-[#94a3b8]">
              CEP
            </label>
            <Input
              value={zipCode}
              onChange={(e) => onZipCodeChange(e.target.value)}
              placeholder="00000-000"
              className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-[#94a3b8]">
              Cidade
            </label>
            <Input
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Cidade"
              className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-[#94a3b8]">
              Estado
            </label>
            <Input
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
              placeholder="UF"
              maxLength={2}
              className="rounded-[32px] border-0 bg-[#f8fafc] px-4 py-3 uppercase"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type AvailabilitySectionProps = {
  availabilityDays: AvailabilityDay[];
  timeOptions: string[];
  onUpdateDay: (
    dayId: string,
    field: "enabled" | "start" | "end",
    value: boolean | string
  ) => void;
  onSyncWeekdays: () => void;
};

export function CreatorAvailabilitySection({
  availabilityDays,
  timeOptions,
  onUpdateDay,
  onSyncWeekdays,
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
        className="flex w-full items-center justify-between rounded-[24px] bg-[#efe6ff] px-5 py-4 text-left transition-colors hover:bg-[#e6dcff]"
      >
        <div>
          <p className="text-sm font-bold text-[#6d3ad8]">Sincronizar Semana</p>
          <p className="text-xs text-[#6d3ad8]/70">
            Replicar horários para todos os dias ativos
          </p>
        </div>
        <ArrowLeft className="size-4 rotate-180 text-[#895af6]" />
      </button>

      {/* Cards empilhados - funciona em mobile e desktop (coluna estreita) */}
      <div className="space-y-4">
        {availabilityDays.map((day) => (
          <article
            key={day.id}
            className={cn(
              "rounded-[24px] p-5",
              day.enabled ? "bg-[#faf9fd] shadow-sm" : "bg-transparent opacity-80"
            )}
          >
            <div className="flex items-center justify-between">
              <h3
                className={cn(
                  "text-lg font-bold tracking-[-0.03em]",
                  day.enabled ? "text-slate-900" : "text-slate-400"
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
              <p className="mt-4 text-sm text-slate-400">
                Indisponível para este dia
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

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
    <section className="flex flex-col gap-6 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2">
        <Tag className="size-5 text-[#895af6]" />
        <h3 className="text-base font-bold text-[#0f172a]">
          Tipos de Trabalho
        </h3>
      </div>

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
                "flex items-center gap-4 rounded-[24px] p-4 transition-colors",
                jt.selected ? "bg-[#faf9fd] shadow-sm" : "bg-transparent opacity-80",
              )}
            >
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "font-bold",
                    jt.selected ? "text-[#0f172a]" : "text-slate-400",
                  )}
                >
                  {jt.name}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      jt.selected
                        ? "bg-[rgba(137,90,246,0.1)] text-[#895af6]"
                        : "bg-slate-100 text-slate-400",
                    )}
                  >
                    {JOB_MODE_LABELS[jt.mode]}
                  </span>
                  <span className="text-xs text-[#94a3b8]">
                    {jt.durationMinutes} min
                  </span>
                </div>
              </div>
              <div
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-[32px] px-3 py-1.5",
                  jt.selected ? "bg-[#f1f5f9]" : "bg-slate-50",
                )}
              >
                <span className="text-xs font-bold text-[#94a3b8]">R$</span>
                <span
                  className={cn(
                    "text-sm font-black",
                    jt.selected ? "text-[#895af6]" : "text-slate-400",
                  )}
                >
                  {jt.price.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <AvailabilitySwitch
                checked={jt.selected}
                onChange={() => onToggleJobType(jt.id)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

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
    <section className="flex flex-col gap-6 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="size-5 text-[#895af6]" />
          <h3 className="text-base font-bold text-[#0f172a]">Meu Portfólio</h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-xs font-bold text-[#895af6] hover:underline lg:hidden"
          >
            Ver todos
          </button>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="gap-2 rounded-full bg-[#895af6] px-4 py-2 text-xs font-bold text-white hover:bg-[#7c4aeb] disabled:opacity-50"
          >
            <Upload className="size-3.5" />
            {isUploading ? "Enviando..." : "Upload"}
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-[48px] bg-slate-200"
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
            <div className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-1 text-[10px] text-white backdrop-blur-sm">
              {item.type === "VIDEO" ? "Vídeo" : "Foto"}
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                disabled={isRemoving}
                className="absolute right-2 top-2 rounded-full bg-red-500/80 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
              >
                <Trash2 className="size-3" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[32px] border-2 border-dashed border-[rgba(137,90,246,0.2)] bg-[rgba(137,90,246,0.05)] text-[#895af6] hover:border-[#895af6] disabled:opacity-50"
        >
          <Plus className="size-6" />
          <span className="text-[10px] font-bold uppercase">Adicionar</span>
        </button>
      </div>
    </section>
  );
}
