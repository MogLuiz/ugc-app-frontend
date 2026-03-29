import { useState } from "react";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useAuth } from "~/hooks/use-auth";
import {
  MOCK_BUSINESS_NOTIFICATIONS,
  MOCK_NOTIFICATIONS,
  NotificationsPanel,
} from "./notifications-panel";
import type { AppNotification } from "./notifications-panel";

type AppHeaderProps = {
  notifications?: AppNotification[];
  title?: string;
};

export function AppHeader({
  notifications: notificationsProp,
  title,
}: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const nameParts = (user?.name ?? "").trim().split(/\s+/).filter(Boolean);
  const greeting = "Portal do Criador";

  const photo = user?.profile?.photoUrl;
  const initials =
    nameParts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?";

  const defaultNotifications =
    user?.role === "business"
      ? MOCK_BUSINESS_NOTIFICATIONS
      : MOCK_NOTIFICATIONS;
  const notifications = notificationsProp ?? defaultNotifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[rgba(137,90,246,0.1)] bg-[rgba(246,245,248,0.9)] px-4 py-3 backdrop-blur-md lg:hidden">
      {/* Left: Avatar + dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#895af6] bg-[rgba(137,90,246,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#895af6]"
            aria-label="Menu do usuário"
          >
            {photo ? (
              <img src={photo} alt="" className="size-full object-cover" />
            ) : (
              <span className="text-[11px] font-bold text-[#895af6]">
                {initials}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem asChild>
            <Link
              to="/perfil"
              className="flex cursor-pointer items-center gap-2"
            >
              <User className="size-4" />
              Meu perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/configuracoes"
              className="flex cursor-pointer items-center gap-2"
            >
              <Settings className="size-4" />
              Configurações
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 text-red-600 focus:text-red-600"
            onSelect={(e) => {
              e.preventDefault();
              void logout();
            }}
          >
            <LogOut className="size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Center: Screen title or greeting */}
      <p className="text-sm font-semibold text-slate-900">
        {title ?? greeting}
      </p>

      {/* Right: Notifications bell */}
      <button
        type="button"
        onClick={() => setNotifOpen(true)}
        className="relative flex size-9 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#895af6]"
        aria-label={
          unreadCount > 0
            ? `Notificações — ${unreadCount} não lida${unreadCount !== 1 ? "s" : ""}`
            : "Notificações"
        }
      >
        <Bell className="size-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationsPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
      />
    </header>
  );
}
