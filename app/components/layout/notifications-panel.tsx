import * as Dialog from "@radix-ui/react-dialog";
import { Bell, CreditCard, MapPin, MessageCircle, Star, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export type AppNotification = {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
  type: "campaign" | "message" | "payment" | "review" | "general";
  navigationPath?: string;
};

const NOTIFICATION_ICONS: Record<AppNotification["type"], LucideIcon> = {
  campaign: MapPin,
  message: MessageCircle,
  payment: CreditCard,
  review: Star,
  general: Bell,
};

type NotificationsPanelProps = {
  open: boolean;
  onClose: () => void;
  notifications?: AppNotification[];
};

export function NotificationsPanel({
  open,
  onClose,
  notifications = [],
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen: boolean) => { if (!isOpen) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 max-h-[80dvh] rounded-t-2xl bg-white shadow-2xl",
            "flex flex-col",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          )}
        >
          <Dialog.Title className="sr-only">Notificações</Dialog.Title>

          {/* Handle bar */}
          <div className="flex justify-center pb-1 pt-3">
            <div className="h-1 w-10 rounded-full bg-slate-200" />
          </div>

          {/* Panel header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Notificações</h2>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                aria-label="Fechar notificações"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-4 px-5 py-12 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-slate-100">
                  <Bell className="size-7 text-slate-400" />
                </div>
                <div>
                  <p className="font-bold text-[#2c2f30]">Nenhuma notificação</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Quando houver novidades, elas aparecerão aqui.
                  </p>
                </div>
              </div>
            ) : (
              <ul>
                {notifications.map((notification) => {
                  const Icon = NOTIFICATION_ICONS[notification.type];
                  return (
                    <li key={notification.id}>
                      <button
                        type="button"
                        onClick={onClose}
                        className={cn(
                          "flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50",
                          !notification.read && "bg-[rgba(137,90,246,0.03)]",
                        )}
                      >
                        <div
                          className={cn(
                            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full",
                            notification.read
                              ? "bg-slate-100 text-slate-500"
                              : "bg-[rgba(137,90,246,0.12)] text-[#895af6]",
                          )}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={cn(
                                "text-sm leading-snug",
                                notification.read
                                  ? "font-medium text-slate-700"
                                  : "font-semibold text-slate-900",
                              )}
                            >
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#895af6]" />
                            )}
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                            {notification.description}
                          </p>
                          <p className="mt-1 text-[10px] text-slate-400">{notification.timeAgo}</p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
