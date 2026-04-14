import type { ElementType } from "react";
import { Briefcase, Compass, Home, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

type NavItem = {
  id: string;
  label: string;
  icon: ElementType;
  to: string;
};

const BUSINESS_NAV_ITEMS: NavItem[] = [
  { id: "inicio", label: "Início", icon: Home, to: "/dashboard" },
  { id: "ofertas", label: "Ofertas", icon: Briefcase, to: "/ofertas" },
  { id: "marketplace", label: "Marketplace", icon: Compass, to: "/marketplace" },
  { id: "mensagens", label: "Mensagens", icon: MessageCircle, to: "/chat" },
  { id: "perfil", label: "Perfil", icon: User, to: "/perfil" },
];

export function BusinessBottomNav() {
  const location = useLocation();

  return (
    <nav
      data-business-bottom-nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgba(137,90,246,0.1)] bg-white/90 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {BUSINESS_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === "/marketplace"
              ? location.pathname === "/marketplace" || location.pathname.startsWith("/marketplace/")
              : item.to === "/ofertas"
                ? location.pathname === "/ofertas" || location.pathname.startsWith("/ofertas/")
                : location.pathname === item.to;

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
