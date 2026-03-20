import { Button } from "~/components/ui/button";

export function CreatorQuickActions() {
  return (
    <section className="flex justify-center gap-3 lg:hidden">
      <Button
        variant="purple"
        className="h-12 flex-1 max-w-[172px] rounded-full font-bold"
      >
        Seguir
      </Button>
      <button
        type="button"
        className="flex h-12 flex-1 max-w-[174px] items-center justify-center rounded-full border border-[rgba(137,90,246,0.2)] bg-[rgba(137,90,246,0.1)] font-bold text-[#895af6]"
      >
        Mensagem
      </button>
    </section>
  );
}
