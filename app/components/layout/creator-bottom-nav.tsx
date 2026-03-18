import { Home, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

const BOTTOM_NAV_ITEMS = [
  { id: "inicio", label: "Início", icon: Home, to: "/dashboard" },
  { id: "mensagens", label: "Mensagens", icon: MessageCircle, to: "#" },
  { id: "perfil", label: "Perfil", icon: User, to: "/perfil" },
];

export function CreatorBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgba(137,90,246,0.1)] bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-around gap-4">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === "perfil"
              ? location.pathname === "/perfil"
              : location.pathname === item.to;

          const content = (
            <div
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-[#895af6] font-bold" : "text-slate-400 font-medium"
              )}
            >
              <Icon className="size-5" />
              <span className="text-[10px]">{item.label}</span>
            </div>
          );

          if (item.to.startsWith("#")) {
            return (
              <button key={item.id} type="button" className="flex flex-col">
                {content}
              </button>
            );
          }

          return (
            <Link key={item.id} to={item.to} className="flex flex-col">
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
