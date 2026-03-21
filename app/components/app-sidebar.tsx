import { useState } from "react";
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  Rocket,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { useAuth } from "~/hooks/use-auth";
import type { AuthUser, UserRole } from "~/modules/auth/types";

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
      {
        id: "dashboard",
        label: "Dashboard",
        icon: BarChart3,
        to: "/dashboard",
      },
      { id: "campanhas", label: "Campanhas", icon: Briefcase, to: "/campanhas" },
      {
        id: "criadores",
        label: "Marketplace",
        icon: Users,
        to: "/marketplace",
      },
      { id: "mapa", label: "Mapa de Criadores", icon: MapPin, to: "/mapa" },
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
      { id: "ofertas", label: "Ofertas", icon: Briefcase, to: "/ofertas" },
      { id: "calendario", label: "Calendário", icon: CalendarDays, to: "/agenda" },
      { id: "perfil", label: "Meu Perfil", icon: User, to: "/perfil" },
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
                : "text-slate-600 hover:bg-slate-50",
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

function getUserDisplayData(user: AuthUser) {
  const displayName =
    user.profile?.name ?? user.name ?? user.email?.split("@")[0] ?? "Usuário";
  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  const photoUrl = user.profile?.photoUrl;
  return { displayName, initials, photoUrl };
}

type SidebarUserMenuProps = {
  displayName: string;
  initials: string;
  photoUrl?: string;
  subtitle?: string;
  onLogout?: () => Promise<void>;
};

function SidebarUserMenu({
  displayName,
  initials,
  photoUrl,
  subtitle,
  onLogout,
}: SidebarUserMenuProps) {
  const [avatarError, setAvatarError] = useState(false);
  const showImage = photoUrl && !avatarError;

  const content = (
    <div className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-slate-50">
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200">
        {showImage ? (
          <img
            src={photoUrl}
            alt={displayName}
            className="size-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <span className="text-xs font-bold text-slate-600">{initials}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-bold text-slate-900">
          {displayName}
        </p>
        {subtitle && (
          <p className="truncate text-[10px] text-slate-500">{subtitle}</p>
        )}
      </div>
      <ChevronRight className="size-[18px] shrink-0 text-slate-400" />
    </div>
  );

  if (onLogout) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="w-full">
            {content}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[12rem]">
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onSelect={(e) => {
              e.preventDefault();
              void onLogout();
            }}
          >
            <LogOut className="size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return content;
}

function BusinessFooter() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const { displayName, initials, photoUrl } = getUserDisplayData(user);
  const firstName = displayName.split(" ")[0] ?? displayName;

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
      <SidebarUserMenu
        displayName={firstName}
        initials={initials}
        photoUrl={photoUrl}
        onLogout={logout}
      />
    </div>
  );
}

function CreatorFooter() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const { displayName, initials, photoUrl } = getUserDisplayData(user);

  return (
    <div className="border-t border-slate-200 pt-4">
      <SidebarUserMenu
        displayName={displayName}
        initials={initials}
        photoUrl={photoUrl}
        subtitle="Premium Creator"
        onLogout={logout}
      />
    </div>
  );
}
