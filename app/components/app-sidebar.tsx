import { useState } from "react";
import {
  BarChart3,
  Briefcase,
  Calendar,
  ChevronRight,
  CreditCard,
  Home,
  MapPin,
  MessageCircle,
  Rocket,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { UserRole } from "~/modules/auth/types";

type AppSidebarProps = {
  variant: UserRole;
};

type NavItem = {
  id: string;
  label: string;
  icon: typeof Home;
  to: string;
};

const SIDEBAR_CONFIG: Record<
  UserRole,
  {
    homeTo: string;
    subtitle: string;
    navItems: NavItem[];
    footer: "business" | "creator";
  }
> = {
  business: {
    homeTo: "/dashboard",
    subtitle: "Painel de Negócios",
    footer: "business",
    navItems: [
      { id: "dashboard", label: "Dashboard", icon: BarChart3, to: "/dashboard" },
      { id: "campanhas", label: "Campanhas", icon: Briefcase, to: "#" },
      { id: "criadores", label: "Criadores", icon: Users, to: "#" },
      { id: "mapa", label: "Marketplace de Criadores", icon: MapPin, to: "/mapa" },
      { id: "relatorios", label: "Relatórios", icon: BarChart3, to: "#" },
      { id: "chat", label: "Chat", icon: MessageCircle, to: "#" },
      { id: "perfil", label: "Perfil da Empresa", icon: Users, to: "/perfil" },
      { id: "configuracoes", label: "Configurações", icon: Settings, to: "#" },
    ],
  },
  creator: {
    homeTo: "/dashboard",
    subtitle: "Portal do Criador",
    footer: "creator",
    navItems: [
      { id: "dashboard", label: "Dashboard", icon: Home, to: "/dashboard" },
      { id: "ofertas", label: "Ofertas", icon: Briefcase, to: "#" },
      { id: "calendario", label: "Calendário", icon: Calendar, to: "#" },
      { id: "perfil", label: "Meu Perfil", icon: User, to: "#" },
      { id: "pagamentos", label: "Pagamentos", icon: CreditCard, to: "#" },
      { id: "mensagens", label: "Mensagens", icon: MessageCircle, to: "#" },
      { id: "configuracoes", label: "Configurações", icon: Settings, to: "#" },
    ],
  },
};

export function AppSidebar({ variant }: AppSidebarProps) {
  const { pathname } = useLocation();
  const config = SIDEBAR_CONFIG[variant];

  return (
    <aside className="sticky top-0 flex h-screen w-[288px] shrink-0 flex-col justify-between self-start border-r border-[rgba(137,90,246,0.1)] bg-white px-6 py-6">
      <div className="flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <Link to={config.homeTo} className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[48px] bg-[#895af6]">
              <Rocket className="size-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold tracking-[-0.5px] text-slate-900">
                UGC Local
              </p>
              <p className="text-xs font-medium text-[#895af6]">
                {config.subtitle}
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {config.navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.to !== "#" && pathname === item.to;
            const className = cn(
              "flex items-center gap-3 rounded-[48px] px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#895af6] text-white shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.2),0px_4px_6px_-4px_rgba(137,90,246,0.2)]"
                : "text-slate-600 hover:bg-slate-50"
            );

            if (item.to === "#") {
              return (
                <a key={item.id} href="#" className={className}>
                  <Icon className="size-[18px]" />
                  {item.label}
                </a>
              );
            }

            return (
              <Link key={item.id} to={item.to} className={className}>
                <Icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {config.footer === "business" ? <BusinessFooter /> : <CreatorFooter />}
    </aside>
  );
}

function BusinessFooter() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-[rgba(137,90,246,0.1)] bg-[rgba(137,90,246,0.05)] p-4">
        <p className="text-xs font-semibold uppercase text-[#895af6]">
          Suporte Premium
        </p>
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
  );
}

function CreatorFooter() {
  return (
    <div className="border-t border-slate-200 pt-4">
      <div className="flex items-center gap-3 rounded-lg p-2">
        <CreatorAvatar />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-slate-900">
            Lucas Mendes
          </p>
          <p className="truncate text-[10px] text-slate-500">
            Premium Creator
          </p>
        </div>
        <ChevronRight className="size-[18px] shrink-0 text-slate-400" />
      </div>
    </div>
  );
}

function CreatorAvatar() {
  const [error, setError] = useState(false);
  const src =
    "https://www.figma.com/api/mcp/asset/0f9405cf-b2e2-4227-af33-30d805c7727f";

  return (
    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-slate-200">
      {!error ? (
        <img
          src={src}
          alt="Lucas Mendes"
          className="size-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-xs font-bold text-slate-600">LM</span>
      )}
    </div>
  );
}
