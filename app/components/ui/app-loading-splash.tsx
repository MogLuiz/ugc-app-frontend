import { Rocket } from "lucide-react";

export function AppLoadingSplash() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f6f5f8]">
      <div className="flex size-14 items-center justify-center rounded-[48px] bg-[#895af6] shadow-[0_8px_24px_-4px_rgba(137,90,246,0.35)]">
        <Rocket className="size-7 text-white" />
      </div>
    </div>
  );
}
