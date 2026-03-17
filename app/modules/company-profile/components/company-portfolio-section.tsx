import { useRef } from "react";
import { ImagePlus, PlusCircle, UploadCloud, X } from "lucide-react";
import type { PortfolioMediaPayload } from "~/modules/auth/types";
import { cn } from "~/lib/utils";

type CompanyPortfolioSectionProps = {
  media: PortfolioMediaPayload[];
  onUpload?: (file: File) => void | Promise<void>;
  onRemove?: (mediaId: string) => void | Promise<void>;
  isUploading?: boolean;
  isRemoving?: boolean;
  density?: "compact" | "comfortable";
  readOnly?: boolean;
};

export function CompanyPortfolioSection({
  media,
  onUpload,
  onRemove,
  isUploading = false,
  isRemoving = false,
  density = "comfortable",
  readOnly = false,
}: CompanyPortfolioSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const compact = density === "compact";

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !onUpload) return;
    void onUpload(file);
    event.target.value = "";
  }

  const uploadLabel = compact ? "Adicionar" : "Adicionar Mídia";

  return (
    <section className={cn("border-t border-slate-100 pt-6", compact && "pt-5")}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImagePlus className="size-5 text-[#895af6]" />
          <h3 className={cn("font-bold text-[#0f172a]", compact ? "text-[20px]" : "text-xl")}>
            {compact ? "Portfólio & Mídia" : "Portfólio (Imagens e Vídeos)"}
          </h3>
        </div>
        {!readOnly ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#895af6]"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <PlusCircle className="size-4" />
            {isUploading ? "Enviando…" : uploadLabel}
          </button>
        ) : (
          <div />
        )}
      </div>

      {compact ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {media.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              compact
              readOnly={readOnly}
              isRemoving={isRemoving}
              onRemove={onRemove}
            />
          ))}
          {!readOnly ? (
            <UploadCard
              compact
              isUploading={isUploading}
              onClick={() => fileInputRef.current?.click()}
            />
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {media.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              readOnly={readOnly}
              isRemoving={isRemoving}
              onRemove={onRemove}
            />
          ))}
          {!readOnly ? (
            <UploadCard
              isUploading={isUploading}
              onClick={() => fileInputRef.current?.click()}
            />
          ) : null}
        </div>
      )}
    </section>
  );
}

function MediaCard({
  item,
  onRemove,
  isRemoving,
  compact = false,
  readOnly = false,
}: {
  item: PortfolioMediaPayload;
  onRemove?: (mediaId: string) => void | Promise<void>;
  isRemoving: boolean;
  compact?: boolean;
  readOnly?: boolean;
}) {
  const source = item.thumbnailUrl || item.url;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[48px] bg-[#f1f5f9] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]",
        compact ? "h-44 min-w-32" : "h-[195px]"
      )}
    >
      {item.type === "VIDEO" ? (
        <video
          src={source}
          className="size-full object-cover"
          controls={readOnly}
          muted={!readOnly}
          playsInline
          preload="metadata"
        />
      ) : (
        <img src={source} alt="" className="size-full object-cover" />
      )}

      {!readOnly ? (
        <button
          type="button"
          className={cn(
            "absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition",
            !compact && "opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
          )}
          onClick={() => onRemove && void onRemove(item.id)}
          disabled={isRemoving}
          aria-label="Remover mídia"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

function UploadCard({
  onClick,
  isUploading,
  compact = false,
}: {
  onClick: () => void;
  isUploading: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center rounded-[48px] border-2 border-dashed border-[rgba(137,90,246,0.25)] bg-[rgba(137,90,246,0.04)] text-center",
        compact ? "h-44 min-w-32" : "h-[195px]"
      )}
      onClick={onClick}
      disabled={isUploading}
    >
      <div className="flex flex-col items-center gap-2 text-[rgba(137,90,246,0.7)]">
        <UploadCloud className={compact ? "size-5" : "size-7"} />
        <span className={cn("font-bold uppercase tracking-[1px]", compact ? "text-xs" : "text-[10px]")}>
          {isUploading ? "Enviando..." : compact ? "Novo" : "Fazer Upload"}
        </span>
      </div>
    </button>
  );
}
