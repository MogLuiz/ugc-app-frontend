import { cn } from "~/lib/utils";

/** Caminho público do ícone da marca (favicon, splash, sidebar, auth). */
export const UGC_APP_ICON_PATH = "/ugc-app-icon.svg" as const;

/**
 * Marca visual UGC Local — mesmo asset do favicon (`ugc-app-icon.svg`):
 * gradiente roxo, cantos arredondados, pin de localização.
 */
const PRESETS = {
  splash: {
    box: "size-14 rounded-[25%] shadow-[0_8px_24px_-4px_rgba(137,90,246,0.35)]",
  },
  lg: {
    box: "size-10 rounded-[25%]",
  },
  md: {
    box: "size-12 rounded-[25%]",
  },
  sm: {
    box: "size-7 rounded-[25%]",
  },
  visualPanel: {
    box: "size-9 rounded-[25%]",
  },
} as const;

export type AppLogoMarkPreset = keyof typeof PRESETS;

type AppLogoMarkProps = {
  preset?: AppLogoMarkPreset;
  className?: string;
  /** Remove a sombra (útil se o preset for splash mas o contexto já tiver elevação). */
  hideShadow?: boolean;
};

export function AppLogoMark({
  preset = "md",
  className,
  hideShadow,
}: AppLogoMarkProps) {
  const p = PRESETS[preset];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden",
        p.box,
        hideShadow && "shadow-none",
        className,
      )}
      aria-hidden
    >
      <img
        src={UGC_APP_ICON_PATH}
        alt=""
        className="size-full object-cover"
        draggable={false}
      />
    </div>
  );
}
