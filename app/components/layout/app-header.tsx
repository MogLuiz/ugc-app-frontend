import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Bell, LogOut, Settings, User } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { useAuth } from "~/hooks/use-auth";
import { NotificationsPanel } from "./notifications-panel";
import type { AppNotification } from "./notifications-panel";

type AppHeaderProps = {
  notifications?: AppNotification[];
  title?: string;
  /** Short label shown next to the avatar on mobile (e.g. "Criador"). Falls back to `title` if not provided. */
  mobileLabel?: string;
  /** Mobile positioning. `"sticky"` (default) keeps the header fixed at the top while scrolling. `"inline"` lets it scroll with the page content. Desktop is unaffected. */
  mobileBehavior?: "sticky" | "inline";
};

export function AppHeader({
  notifications: notificationsProp,
  title,
  mobileLabel,
  mobileBehavior = "sticky",
}: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const nameParts = (user?.name ?? "").trim().split(/\s+/).filter(Boolean);

  const photo = user?.profile?.photoUrl;
  const initials =
    nameParts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?";

  const notifications = notificationsProp ?? [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Label shown next to avatar in header (only if explicitly provided)
  const headerLabel = mobileLabel ?? title;

  // Label shown inside the bottom sheet identity block (always meaningful)
  const accountLabel =
    mobileLabel ?? title ?? (user?.role === "business" ? "Empresa" : "Criador");

  return (
    <header
      className={cn(
        "flex items-center justify-between border-b border-[rgba(137,90,246,0.1)] bg-[rgba(246,245,248,0.9)] px-4 py-3 backdrop-blur-md lg:hidden",
        mobileBehavior === "sticky" ? "sticky top-0 z-20" : "relative",
      )}
    >
      {/* Left: Avatar + optional context label */}
      <button
        type="button"
        onClick={() => setAvatarMenuOpen(true)}
        className="flex items-center gap-2.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#895af6]"
        aria-label="Menu do usuário"
      >
        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#895af6] bg-[rgba(137,90,246,0.1)]">
          {photo ? (
            <img src={photo} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-[11px] font-bold text-[#895af6]">
              {initials}
            </span>
          )}
        </span>
        {headerLabel && (
          <span className="text-sm font-semibold text-slate-700">
            {headerLabel}
          </span>
        )}
      </button>

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

      {/* Avatar bottom sheet */}
      <Dialog.Root open={avatarMenuOpen} onOpenChange={setAvatarMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            aria-describedby={undefined}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white shadow-2xl",
              "flex flex-col",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
            )}
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <Dialog.Title className="sr-only">Menu do usuário</Dialog.Title>

            {/* Handle bar */}
            <div className="flex justify-center pb-1 pt-3">
              <div className="h-1 w-10 rounded-full bg-slate-200" />
            </div>

            {/* Identity block */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
              <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#895af6] bg-[rgba(137,90,246,0.1)]">
                {photo ? (
                  <img src={photo} alt="" className="size-full object-cover" />
                ) : (
                  <span className="text-base font-bold text-[#895af6]">
                    {initials}
                  </span>
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-base font-bold text-slate-900">
                  {user?.name ?? "—"}
                </p>
                <p className="text-sm text-slate-500">{accountLabel}</p>
              </div>
            </div>

            {/* Navigation block */}
            <nav className="flex flex-col">
              <Dialog.Close asChild>
                <Link
                  to="/perfil"
                  className="flex items-center gap-3 border-b border-slate-100 px-5 py-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50 active:bg-slate-100"
                >
                  <User className="size-5 shrink-0 text-slate-500" />
                  Meu perfil
                </Link>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Link
                  to="/configuracoes"
                  className="flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50 active:bg-slate-100"
                >
                  <Settings className="size-5 shrink-0 text-slate-500" />
                  Configurações
                </Link>
              </Dialog.Close>
            </nav>

            {/* Destructive action */}
            <div className="mt-2 border-t border-slate-100 px-5 py-3">
              <button
                type="button"
                onClick={() => {
                  setAvatarMenuOpen(false);
                  void logout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 active:bg-red-100"
              >
                <LogOut className="size-5 shrink-0" />
                Sair
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <NotificationsPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
      />
    </header>
  );
}
