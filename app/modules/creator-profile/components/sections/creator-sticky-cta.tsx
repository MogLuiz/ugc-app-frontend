import { ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";

export function CreatorStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e2e8f0] bg-white/80 px-4 py-4 backdrop-blur-xl lg:hidden">
      <Button
        variant="purple"
        className="flex h-14 w-full items-center justify-center gap-2 rounded-full text-lg font-bold shadow-[0px_20px_25px_-5px_rgba(137,90,246,0.3)]"
      >
        <ArrowRight className="h-5 w-5" />
        Solicitar Job
      </Button>
    </div>
  );
}
