import { Lightbulb } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { DashboardCard } from "~/modules/business-dashboard/components/sections/section-primitives";

export function CreatorTipsCard() {
  return (
    <DashboardCard className="relative overflow-hidden bg-gradient-to-br from-[#6a36d5]/[0.07] to-white">
      <Lightbulb className="size-7 text-[#6a36d5]" aria-hidden />
      <h3 className="mt-4 text-lg font-black leading-snug text-[#2c2f30]">
        Dicas para se destacar
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#595c5d]">
        Mantenha seu portfólio atualizado, responda convites em até 24h e chegue no local com 15
        minutos de antecedência para causar uma boa impressão.
      </p>
      <Button
        asChild
        variant="outline"
        className="mt-5 w-full rounded-full border-[#6a36d5]/30 font-bold text-[#6a36d5] hover:bg-[#6a36d5]/10"
      >
        <Link to="/perfil">Editar perfil</Link>
      </Button>
    </DashboardCard>
  );
}
