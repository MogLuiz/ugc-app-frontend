import { useMemo, useState } from "react";
import {
  Banknote,
  BarChart3,
  Briefcase,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  MapPin,
  MessageCircle,
  Settings,
  User,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useAuth } from "~/hooks/use-auth";
import { AppLogoMark } from "~/components/ui/app-logo-mark";
import { cn } from "~/lib/utils";
import { usePartnerProfileQuery } from "~/modules/referrals/hooks/use-referrals-data";
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
      {
        id: "indicacoes",
        label: "Indicações",
        icon: UserPlus,
        to: "/indicacoes",
      },
      {
        id: "ofertas",
        label: "Campanhas",
        icon: Briefcase,
        to: "/ofertas",
      },
      {
        id: "criadores",
        label: "Marketplace",
        icon: Users,
        to: "/marketplace",
      },
      { id: "financeiro", label: "Financeiro", icon: Wallet, to: "/financeiro" },
      { id: "mapa", label: "Mapa de Criadores", icon: MapPin, to: "/mapa" },
      { id: "chat", label: "Chat", icon: MessageCircle, to: "/chat" },
      { id: "perfil", label: "Perfil da Empresa", icon: Users, to: "/perfil" },
      {
        id: "configuracoes",
        label: "Configurações",
        icon: Settings,
        to: "/configuracoes",
      },
    ],
  },
  creator: {
    homeTo: "/dashboard",
    subtitle: "Portal do Criador",
    footer: "creator",
    navItems: [
      { id: "dashboard", label: "Dashboard", icon: Home, to: "/dashboard" },
      {
        id: "indicacoes",
        label: "Indicações",
        icon: UserPlus,
        to: "/indicacoes",
      },
      { id: "ofertas", label: "Ofertas", icon: Briefcase, to: "/ofertas" },
      {
        id: "calendario",
        label: "Calendário",
        icon: CalendarDays,
        to: "/agenda",
      },
      { id: "perfil", label: "Meu Perfil", icon: User, to: "/perfil" },
      { id: "ganhos", label: "Ganhos", icon: Banknote, to: "/ganhos" },
      { id: "mensagens", label: "Mensagens", icon: MessageCircle, to: "/chat" },
      {
        id: "configuracoes",
        label: "Configurações",
        icon: Settings,
        to: "/configuracoes",
      },
    ],
  },
};

function readCollapsed(): boolean {
  try {
    return localStorage.getItem("sidebar-collapsed") === "true";
  } catch {
    return false;
  }
}

function writeCollapsed(value: boolean) {
  try {
    localStorage.setItem("sidebar-collapsed", String(value));
  } catch {
    // ignore
  }
}

export function AppSidebar({ variant }: AppSidebarProps) {
  const { pathname } = useLocation();
  const config = SIDEBAR_CONFIG[variant];
  const partnerQuery = usePartnerProfileQuery();
  const [collapsed, setCollapsed] = useState(readCollapsed);

  function toggle() {
    setCollapsed((v) => {
      writeCollapsed(!v);
      return !v;
    });
  }

  const navItems = useMemo(() => {
    const showIndicacoes = partnerQuery.data?.kind === "active";
    if (showIndicacoes) return config.navItems;
    return config.navItems.filter((item) => item.id !== "indicacoes");
  }, [config.navItems, partnerQuery.data?.kind]);

  return (
    <aside
      className={cn(
        "sticky top-0 z-40 flex h-screen shrink-0 flex-col justify-between self-start border-r border-[rgba(137,90,246,0.1)] bg-white py-6 transition-all duration-200 ease-in-out",
        collapsed ? "w-[68px] px-3" : "w-[288px] px-6",
      )}
    >
      <div className="flex flex-col">
        {/* Header */}
        <div
          className={cn(
            "mb-10 flex items-center",
            collapsed ? "flex-col gap-3" : "justify-between gap-3",
          )}
        >
          <Link
            to={config.homeTo}
            className={cn(
              "flex items-center gap-3",
              collapsed && "justify-center",
            )}
          >
            <AppLogoMark preset={collapsed ? "sm" : "lg"} />
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="whitespace-nowrap text-xl font-bold tracking-[-0.5px] text-slate-900">
                  UGC Local
                </p>
                <p className="whitespace-nowrap text-xs font-medium text-[#895af6]">
                  {config.subtitle}
                </p>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={toggle}
            title={collapsed ? "Expandir menu" : "Recolher menu"}
            className={cn(
              "flex items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700",
              collapsed ? "h-7 w-7" : "h-7 w-7 flex-shrink-0",
            )}
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.to !== "#" &&
              (item.to === "/ofertas"
                ? pathname === "/ofertas" || pathname.startsWith("/ofertas/")
                : item.to === "/financeiro"
                  ? pathname === "/financeiro" || pathname.startsWith("/financeiro/")
                  : item.to === "/ganhos"
                    ? pathname === "/ganhos" || pathname.startsWith("/ganhos/")
                    : pathname === item.to);

            const itemClass = cn(
              "flex items-center transition-colors",
              collapsed
                ? cn(
                    "justify-center rounded-xl p-2.5",
                    isActive
                      ? "bg-[#895af6] text-white shadow-[0px_4px_10px_-2px_rgba(137,90,246,0.35)]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                  )
                : cn(
                    "gap-3 rounded-[48px] px-4 py-3 text-sm font-medium",
                    isActive
                      ? "bg-[#895af6] text-white shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.2),0px_4px_6px_-4px_rgba(137,90,246,0.2)]"
                      : "text-slate-600 hover:bg-slate-50",
                  ),
            );

            const inner = (
              <>
                <Icon className="size-[18px] shrink-0" />
                {!collapsed && item.label}
                {/* Tooltip shown only when collapsed */}
                {collapsed && (
                  <span
                    className="pointer-events-none absolute left-full z-[100] ml-3 whitespace-nowrap rounded-lg bg-[#895af6] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-[0px_4px_10px_-2px_rgba(137,90,246,0.35)] transition-opacity duration-150 group-hover:opacity-100"
                    role="tooltip"
                  >
                    {item.label}
                    {/* Arrow */}
                    <span className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#895af6]" />
                  </span>
                )}
              </>
            );

            if (item.to === "#") {
              return (
                <div
                  key={item.id}
                  className={cn(collapsed && "relative group")}
                >
                  <a href="#" className={itemClass}>
                    {inner}
                  </a>
                </div>
              );
            }

            return (
              <div key={item.id} className={cn(collapsed && "relative group")}>
                <Link to={item.to} className={itemClass}>
                  {inner}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      {config.footer === "business" ? (
        <BusinessFooter collapsed={collapsed} />
      ) : (
        <CreatorFooter collapsed={collapsed} />
      )}
    </aside>
  );
}

function getUserDisplayData(user: AuthUser) {
  const displayName = user.profile?.name ?? user.name ?? "Usuário";
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
  collapsed?: boolean;
  onLogout?: () => Promise<void>;
};

function SidebarUserMenu({
  displayName,
  initials,
  photoUrl,
  subtitle,
  collapsed,
  onLogout,
}: SidebarUserMenuProps) {
  const [avatarError, setAvatarError] = useState(false);
  const showImage = photoUrl && !avatarError;

  const avatar = (
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
  );

  if (collapsed) {
    if (onLogout) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title={displayName}
              className="flex w-full justify-center rounded-lg p-1 transition-colors hover:bg-slate-50"
            >
              {avatar}
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
    return (
      <div className="flex justify-center p-1" title={displayName}>
        {avatar}
      </div>
    );
  }

  const content = (
    <div className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-slate-50">
      {avatar}
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

function BusinessFooter({ collapsed }: { collapsed: boolean }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const { displayName, initials, photoUrl } = getUserDisplayData(user);
  const firstName = displayName.split(" ")[0] ?? displayName;

  return (
    <SidebarUserMenu
      displayName={firstName}
      initials={initials}
      photoUrl={photoUrl}
      collapsed={collapsed}
      onLogout={logout}
    />
  );
}

function CreatorFooter({ collapsed }: { collapsed: boolean }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const { displayName, initials, photoUrl } = getUserDisplayData(user);

  return (
    <div
      className={cn(
        "border-t border-slate-200 pt-4",
        collapsed && "border-0 pt-0",
      )}
    >
      <SidebarUserMenu
        displayName={displayName}
        initials={initials}
        photoUrl={photoUrl}
        subtitle={collapsed ? undefined : "Criador de conteúdo"}
        collapsed={collapsed}
        onLogout={logout}
      />
    </div>
  );
}
