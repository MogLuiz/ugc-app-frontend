import { MapPin } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

/**
 * Assets do Figma «Section - Map Preview» (node 216:273).
 * URLs via Figma MCP — podem expirar; substituir por arquivos em /public se necessário.
 */
const FIGMA_MAP_IMAGE =
  "https://www.figma.com/api/mcp/asset/659816aa-8338-4d0d-bd84-d671ee34daf6";
const FIGMA_MARKER_ICON =
  "https://www.figma.com/api/mcp/asset/ed35f57a-ef45-4fa5-83a5-c45fc58e9b1a";
const FIGMA_MARKER_ICON_ALT =
  "https://www.figma.com/api/mcp/asset/9b55e3d9-5a30-4ddd-87a6-180e8d9cca07";

export function BusinessDashboardMapNearby({ highlights }: { highlights: string[] }) {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden rounded-[48px] border border-[rgba(230,232,234,0.5)] bg-white p-px",
        "shadow-[0px_4px_6px_-1px_rgba(106,54,213,0.04),0px_20px_40px_-1px_rgba(44,47,48,0.08)]"
      )}
    >
      <div className="border-b border-[#e6e8ea] px-5 pb-5 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#6a36d5]/10">
              <MapPin className="size-5 text-[#6a36d5]" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-black tracking-[-0.3px] text-[#2c2f30]">
                Criadores por perto
              </h2>
              <p className="mt-1 text-sm text-[#595c5d]">
                Visualize creators no mapa e refine por região.
              </p>
            </div>
          </div>
          <Link
            to="/mapa"
            className="shrink-0 rounded-full bg-[#6a36d5] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.5px] text-white hover:bg-[#5b2fc4]"
          >
            Ver mapa
          </Link>
        </div>

        {highlights.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {highlights.map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full border border-[#e6e8ea] bg-white px-3 py-1.5 text-xs font-medium text-[#595c5d] shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="relative w-full bg-[#eff1f2]">
        <div className="relative h-[167px] w-full shrink-0 opacity-90">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute inset-0 overflow-hidden">
              <img
                alt=""
                src={FIGMA_MAP_IMAGE}
                className="absolute left-0 top-[-39%] h-[178%] w-full max-w-none object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-white/20 mix-blend-saturation" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-[rgba(106,54,213,0.05)]"
            aria-hidden
          />

          <div
            className="absolute left-[28%] top-1/2 z-[1] flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white p-0.5 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgb(106, 54, 213) 0%, rgb(174, 141, 255) 100%)",
            }}
            aria-hidden
          >
            <img alt="" src={FIGMA_MARKER_ICON} className="size-2.5 object-contain" />
          </div>

          <div
            className="absolute left-[61%] top-[24%] z-[1] flex size-8 items-center justify-center rounded-full border-2 border-[#6a36d5] bg-white p-0.5 shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
            aria-hidden
          >
            <img alt="" src={FIGMA_MARKER_ICON_ALT} className="size-2.5 object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
