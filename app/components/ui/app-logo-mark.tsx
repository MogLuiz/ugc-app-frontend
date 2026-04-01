import { Rocket } from "lucide-react";
import { cn } from "~/lib/utils";

/**
 * Marca visual UGC Local — mesmo padrão do splash de carregamento:
 * fundo #895af6, cantos bem arredondados, ícone Rocket branco.
 */
const PRESETS = {
  splash: {
    box: "size-14 rounded-[48px] shadow-[0_8px_24px_-4px_rgba(137,90,246,0.35)]",
    icon: "size-7",
  },
  lg: {
    box: "size-10 rounded-[48px]",
    icon: "size-5",
  },
  md: {
    box: "size-12 rounded-[48px]",
    icon: "size-6",
  },
  sm: {
    box: "size-7 rounded-[24px]",
    icon: "size-4",
  },
  visualPanel: {
    box: "size-9 rounded-[48px]",
    icon: "size-5",
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
        "flex shrink-0 items-center justify-center bg-[#895af6]",
        p.box,
        hideShadow && "shadow-none",
        className,
      )}
      aria-hidden
    >
      <Rocket className={cn(p.icon, "text-white")} strokeWidth={2} />
    </div>
  );
}
