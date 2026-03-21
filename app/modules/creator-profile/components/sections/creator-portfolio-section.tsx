import { Eye, Play } from "lucide-react";
import type { CreatorProfile } from "../../types";

type CreatorPortfolioSectionProps = {
  profile: CreatorProfile;
};

export function CreatorPortfolioSection({
  profile,
}: CreatorPortfolioSectionProps) {
  if (profile.portfolio.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {profile.portfolio.map((item) => {
          const isVideo = item.mediaType === "video" && Boolean(item.videoUrl);

          return (
            <div
              key={item.id}
              className="relative h-[300px] min-w-[160px] shrink-0 overflow-hidden rounded-[48px] bg-[#e2e8f0] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)] lg:h-auto lg:min-w-0"
            >
              <div className="absolute inset-0 hidden lg:block" />
              <div className="h-full w-full lg:aspect-[3/4]">
                {isVideo ? (
                  <video
                    controls
                    preload="metadata"
                    poster={item.thumbnailUrl ?? item.imageUrl}
                    className="h-full w-full object-cover"
                  >
                    <source src={item.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              {isVideo ? (
                <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                  <Play className="h-2.5 w-2.5 fill-white text-white" />
                  Vídeo
                </div>
              ) : (
                <div className="absolute left-2 top-2 inline-flex items-center rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                  Foto
                </div>
              )}
              {item.views ? (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 backdrop-blur-sm">
                  <Eye className="h-2.5 w-2.5 text-white" />
                  <span className="text-[10px] text-white">{item.views}</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
