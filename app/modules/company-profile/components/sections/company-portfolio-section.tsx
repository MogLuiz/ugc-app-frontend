import { useRef } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import type { PortfolioMediaPayload } from "~/modules/auth/types";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

type CompanyPortfolioSectionProps = {
  media: PortfolioMediaPayload[];
  onUpload: (file: File) => void | Promise<void>;
  onRemove: (mediaId: string) => void | Promise<void>;
  isUploading?: boolean;
  isRemoving?: boolean;
};

export function CompanyPortfolioSection({
  media,
  onUpload,
  onRemove,
  isUploading = false,
  isRemoving = false,
}: CompanyPortfolioSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    void onUpload(file);
    event.target.value = "";
  }

  return (
    <section className="flex flex-col gap-6 rounded-[48px] border border-[#e2e8f0] bg-white p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]">
            <ImagePlus className="size-5 text-[#895af6]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0f172a]">
              Portfólio & Mídia
              {media.length > 0 && (
                <span className="ml-2 rounded-full bg-[rgba(137,90,246,0.1)] px-2 py-0.5 text-xs font-bold text-[#895af6]">
                  {media.length}
                </span>
              )}
            </h3>
            <p className="text-xs text-[#64748b]">
              Essas mídias ajudam creators a entender sua marca antes de aceitar trabalhos.
            </p>
          </div>
        </div>
        {media.length > 0 && (
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full bg-[rgba(137,90,246,0.1)] px-3 py-1.5 text-xs font-bold text-[#895af6] transition-colors hover:bg-[rgba(137,90,246,0.18)]"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <UploadCloud className="size-3.5" />
            {isUploading ? "Enviando…" : "Adicionar"}
          </button>
        )}
      </div>

      {/* Empty state */}
      {media.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[32px] border-2 border-dashed border-[rgba(137,90,246,0.2)] bg-[rgba(137,90,246,0.02)] px-6 py-10">
          <div className="flex size-14 items-center justify-center rounded-full bg-[rgba(137,90,246,0.1)]">
            <UploadCloud className="size-7 text-[#895af6]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#0f172a]">
              Nenhuma mídia adicionada
            </p>
            <p className="mt-1 text-xs text-[#64748b]">
              Adicione imagens e vídeos para dar contexto e confiança aos creators que recebem seus convites.
            </p>
          </div>
          <Button
            type="button"
            className="rounded-full bg-[#895af6] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#7c4aeb]"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Enviando…" : "Adicionar mídia"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {media.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              isRemoving={isRemoving}
              onRemove={onRemove}
            />
          ))}
          <UploadCard
            isUploading={isUploading}
            onClick={() => fileInputRef.current?.click()}
          />
        </div>
      )}
    </section>
  );
}

function MediaCard({
  item,
  onRemove,
  isRemoving,
}: {
  item: PortfolioMediaPayload;
  onRemove: (mediaId: string) => void | Promise<void>;
  isRemoving: boolean;
}) {
  const source = item.thumbnailUrl || item.url;

  return (
    <div className="group relative aspect-square overflow-hidden rounded-[24px] bg-[#f1f5f9] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.08)]">
      {item.type === "VIDEO" ? (
        <video
          src={source}
          className="size-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      ) : (
        <img src={source} alt="" className="size-full object-cover" />
      )}
      <button
        type="button"
        className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
        onClick={() => void onRemove(item.id)}
        disabled={isRemoving}
        aria-label="Remover mídia"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}

function UploadCard({
  onClick,
  isUploading,
}: {
  onClick: () => void;
  isUploading: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "aspect-square flex items-center justify-center rounded-[24px] border-2 border-dashed border-[rgba(137,90,246,0.25)] bg-[rgba(137,90,246,0.04)] text-center transition-colors hover:bg-[rgba(137,90,246,0.08)]",
      )}
      onClick={onClick}
      disabled={isUploading}
    >
      <div className="flex flex-col items-center gap-2 text-[rgba(137,90,246,0.7)]">
        <UploadCloud className="size-6" />
        <span className="text-[10px] font-bold uppercase tracking-[1px]">
          {isUploading ? "Enviando..." : "Adicionar"}
        </span>
      </div>
    </button>
  );
}
