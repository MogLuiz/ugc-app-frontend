import { Briefcase, CalendarDays, Home, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

const BOTTOM_NAV_ITEMS = [
  { id: "inicio",    label: "Início",    icon: Home,          to: "/dashboard" },
  { id: "campanhas", label: "Campanhas", icon: Briefcase,     to: "/ofertas"   },
  { id: "agenda",    label: "Agenda",    icon: CalendarDays,  to: "/agenda"    },
  { id: "mensagens", label: "Mensagens", icon: MessageCircle, to: "/chat"      },
  { id: "perfil",    label: "Perfil",    icon: User,          to: "/perfil"    },
];

export function CreatorBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgba(137,90,246,0.1)] bg-white/90 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.id}
              to={item.to}
              className="flex flex-col items-center gap-1"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  isActive ? "text-[#895af6]" : "text-slate-400",
                )}
              >
                <Icon className="size-5" />
                <span className={cn("text-[10px]", isActive ? "font-bold" : "font-medium")}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
