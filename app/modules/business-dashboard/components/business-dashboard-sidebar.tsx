import {
  BarChart3,
  Briefcase,
  MapPin,
  MessageCircle,
  Rocket,
  Settings,
  Users
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, active: true },
  { id: "campanhas", label: "Campanhas", icon: Briefcase },
  { id: "criadores", label: "Criadores", icon: Users },
  { id: "mapa", label: "Mapa de Criadores", icon: MapPin },
  { id: "relatorios", label: "Relatórios", icon: BarChart3 },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "perfil", label: "Perfil da Empresa", icon: Users },
  { id: "configuracoes", label: "Configurações", icon: Settings }
];

export function BusinessDashboardSidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[288px] shrink-0 flex-col justify-between self-start border-r border-[rgba(137,90,246,0.1)] bg-white px-6 py-6">
      <div className="flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-[48px] bg-[#895af6]">
            <Rocket className="size-5 text-white" />
          </div>
          <div>
            <p className="text-xl font-bold tracking-[-0.5px] text-slate-900">UGC Local</p>
            <p className="text-xs font-medium text-[#895af6]">Painel de Negócios</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href="#"
                className={cn(
                  "flex items-center gap-3 rounded-[48px] px-4 py-3 text-sm font-medium transition-colors",
                  item.active
                    ? "bg-[#895af6] text-white shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.2),0px_4px_6px_-4px_rgba(137,90,246,0.2)]"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Icon className="size-[18px]" />
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[rgba(137,90,246,0.1)] bg-[rgba(137,90,246,0.05)] p-4">
          <p className="text-xs font-semibold uppercase text-[#895af6]">Suporte Premium</p>
          <p className="mt-2 text-xs leading-4 text-slate-500">
            Precisa de ajuda com sua estratégia de conteúdo?
          </p>
          <Button
            variant="secondary"
            className="mt-3 w-full rounded-[32px] border-[rgba(137,90,246,0.1)] bg-white text-slate-900 shadow-sm"
          >
            Falar com Consultor
          </Button>
        </div>
        <Button variant="purple" className="w-full rounded-[48px] py-3">
          Nova Campanha
        </Button>
      </div>
    </aside>
  );
}
