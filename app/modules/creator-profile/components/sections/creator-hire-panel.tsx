import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "~/lib/utils";
import { useCreatorHireFlow } from "../../hooks/use-creator-hire-flow";
import type { CreatorProfile } from "../../types";
import { CreatorHireForm } from "./creator-hire-form";

type CreatorHirePanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: CreatorProfile;
};

export function CreatorHirePanel({
  open,
  onOpenChange,
  profile,
}: CreatorHirePanelProps) {
  const flow = useCreatorHireFlow(profile);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition-opacity duration-300 ease-out",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <button
        type="button"
        aria-label="Fechar contratação"
        className={cn(
          "absolute inset-0 transition-colors duration-300 ease-out",
          open ? "bg-[#0f172a]/45" : "bg-[#0f172a]/0",
        )}
        onClick={() => onOpenChange(false)}
      />

      <div className="absolute inset-y-0 hidden w-full max-w-[520px] lg:block lg:right-[max(24px,calc((100vw-1740px)/2))]">
        <PanelContainer onClose={() => onOpenChange(false)} desktop open={open}>
          <CreatorHireForm profile={profile} flow={flow} />
        </PanelContainer>
      </div>

      <div className="absolute inset-x-0 bottom-0 lg:hidden">
        <PanelContainer onClose={() => onOpenChange(false)} open={open}>
          <CreatorHireForm profile={profile} flow={flow} />
        </PanelContainer>
      </div>
    </div>
  );
}

function PanelContainer({
  children,
  desktop = false,
  open,
  onClose,
}: {
  children: ReactNode;
  desktop?: boolean;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <section
      aria-modal="true"
      role="dialog"
      className={cn(
        "relative flex bg-white shadow-[0px_24px_80px_rgba(15,23,42,0.28)] transition-transform duration-300 ease-out",
        desktop
          ? cn(
              "h-full border-l border-[#e2e8f0]",
              open ? "translate-x-0" : "translate-x-full",
            )
          : cn(
              "max-h-[85vh] flex-col rounded-t-[32px] border-t border-white/60",
              open ? "translate-y-0" : "translate-y-full",
            ),
      )}
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] shadow-sm"
        aria-label="Fechar painel de contratação"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </section>
  );
}
