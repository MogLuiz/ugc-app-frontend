import type { ElementType } from "react";
import { Briefcase, Home, MessageCircle, Plus, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: ElementType;
  to: string;
  special?: boolean;
};

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { id: "inicio",    label: "Dashboard", icon: Home,          to: "/dashboard"  },
  { id: "criar",     label: "Criar",     icon: Plus,          to: "/criar",     special: true },
  { id: "campanhas", label: "Campanhas", icon: Briefcase,     to: "/campanhas"  },
  { id: "mensagens", label: "Mensagens", icon: MessageCircle, to: "/chat"       },
  { id: "perfil",    label: "Perfil",    icon: User,          to: "/perfil"     },
];

export function BusinessBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          if (item.special) {
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
                    "flex size-12 items-center justify-center rounded-full transition-shadow",
                    isActive
                      ? "bg-[#6a2fc4] shadow-[0_4px_14px_rgba(137,90,246,0.5)]"
                      : "bg-[#895af6] shadow-[0_4px_14px_rgba(137,90,246,0.35)]",
                  )}
                >
                  <Icon className="size-6 text-white" />
                </div>
              </Link>
            );
          }

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
