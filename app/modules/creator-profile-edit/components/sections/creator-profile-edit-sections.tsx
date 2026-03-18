import { useRef } from "react";
import {
  Calendar,
  Camera,
  ChevronDown,
  Image,
  Plus,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { CreatorService, DayOfWeek } from "../../types";
import { DAY_LABELS } from "../../types";
import type { PortfolioMediaPayload } from "~/modules/auth/types";

const DAY_ORDER: DayOfWeek[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

type ProfileInfoSectionProps = {
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  username: string;
  location: string;
  niches: string[];
  onAddNiche: (niche: string) => void;
  onRemoveNiche: (niche: string) => void;
  photoUrl?: string;
  initials: string;
  onAvatarChange?: (file: File) => void;
};

export function CreatorProfileInfoSection({
  displayName,
  onDisplayNameChange,
  username,
  location,
  niches,
  onAddNiche,
  onRemoveNiche,
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
        <p className="mt-4 text-lg font-bold text-[#0f172a]">@{username}</p>
        <p className="text-sm text-[#64748b]">{location}</p>
      </div>

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

type AvailabilitySectionProps = {
  availableDays: Set<DayOfWeek>;
  onToggleDay: (day: DayOfWeek) => void;
  startTime: string;
  onStartTimeChange: (value: string) => void;
  endTime: string;
  onEndTimeChange: (value: string) => void;
};

export function CreatorAvailabilitySection({
  availableDays,
  onToggleDay,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
}: AvailabilitySectionProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-2">
        <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]">
          <Calendar className="size-5 text-[#895af6]" />
        </div>
        <h3 className="text-base font-bold text-[#0f172a]">Disponibilidade</h3>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_ORDER.map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => onToggleDay(day)}
            className={cn(
              "rounded-[32px] px-3 py-2 text-[10px] font-bold transition-colors",
              availableDays.has(day)
                ? "bg-[#895af6] text-white"
                : "bg-[#f1f5f9] text-[#94a3b8]"
            )}
          >
            {DAY_LABELS[day]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#64748b]">Horário Inicial</span>
          <div className="flex items-center gap-2 rounded-[32px] bg-[#f8fafc] px-3 py-2">
            <input
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="w-20 border-0 bg-transparent text-sm text-[#0f172a] outline-none"
            />
            <ChevronDown className="size-4 text-slate-400" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#64748b]">Horário Final</span>
          <div className="flex items-center gap-2 rounded-[32px] bg-[#f8fafc] px-3 py-2">
            <input
              type="time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="w-20 border-0 bg-transparent text-sm text-[#0f172a] outline-none"
            />
            <ChevronDown className="size-4 text-slate-400" />
          </div>
        </div>
      </div>
    </section>
  );
}

type ServicesSectionProps = {
  services: CreatorService[];
  onRemoveService: (id: string) => void;
  onAddService?: () => void;
};

export function CreatorServicesSection({
  services,
  onRemoveService,
  onAddService,
}: ServicesSectionProps) {
  return (
    <section className="flex flex-col gap-6 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="size-5 text-[#895af6]" />
          <h3 className="text-base font-bold text-[#0f172a]">
            Serviços e Preços
          </h3>
        </div>
        <button
          type="button"
          onClick={onAddService}
          className="text-sm font-bold text-[#895af6] hover:underline"
        >
          Novo Serviço
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center gap-4 rounded-[48px] border border-[#f1f5f9] p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[#0f172a]">{service.title}</p>
              <p className="text-xs text-[#94a3b8]">{service.description}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-[32px] bg-[#f1f5f9] px-3 py-2">
              <span className="text-sm font-bold text-[#94a3b8]">R$</span>
              <span className="text-base font-black text-[#895af6]">
                {service.price}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemoveService(service.id)}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddService}
          className="flex items-center justify-center gap-2 rounded-[48px] border-2 border-dashed border-[rgba(137,90,246,0.3)] py-4 text-sm font-bold text-[#895af6] hover:border-[#895af6]"
        >
          <Plus className="size-4" />
          Novo Serviço
        </button>
      </div>
    </section>
  );
}

type PortfolioSectionProps = {
  media: PortfolioMediaPayload[];
  onUpload?: (file: File) => void;
  onRemove?: (mediaId: string) => void;
};

export function CreatorPortfolioSection({
  media,
  onUpload,
  onRemove,
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
            className="gap-2 rounded-full bg-[#895af6] px-4 py-2 text-xs font-bold text-white hover:bg-[#7c4aeb]"
          >
            <Upload className="size-3.5" />
            Upload
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
                className="absolute right-2 top-2 rounded-full bg-red-500/80 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-3" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-[32px] border-2 border-dashed border-[rgba(137,90,246,0.2)] bg-[rgba(137,90,246,0.05)] text-[#895af6] hover:border-[#895af6]"
        >
          <Plus className="size-6" />
          <span className="text-[10px] font-bold uppercase">Adicionar</span>
        </button>
      </div>
    </section>
  );
}
