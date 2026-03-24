import { Home, MessageCircle, Users } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

const BOTTOM_NAV_ITEMS = [
  { id: "inicio", label: "Início", icon: Home, to: "/dashboard" },
  { id: "mensagens", label: "Mensagens", icon: MessageCircle, to: "/chat" },
  { id: "criadores", label: "Criadores", icon: Users, to: "/marketplace" },
];

export function BusinessBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-around gap-4">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === "criadores"
              ? location.pathname === "/marketplace"
              : location.pathname === item.to;

          const content = (
            <div
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-[#895af6]" : "text-slate-400",
              )}
            >
              <Icon className="size-5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          );

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
