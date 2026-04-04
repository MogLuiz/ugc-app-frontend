import type { ElementType } from "react";
import { useMemo } from "react";
import { Briefcase, Home, MessageCircle, Plus, User, UserPlus } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { usePartnerProfileQuery } from "~/modules/referrals/hooks/use-referrals-data";

type NavItem = {
  id: string;
  label: string;
  icon: ElementType;
  to: string;
  special?: boolean;
};

/**
 * Mesma lógica do creator: com parceiro ativo, "Mensagens" vira "Indicações" no mobile
 * (decisão temporária por espaço na barra).
 */
function buildBusinessBottomItems(showIndicacoes: boolean): NavItem[] {
  const fourth: NavItem = showIndicacoes
    ? { id: "indicacoes", label: "Indicações", icon: UserPlus, to: "/indicacoes" }
    : { id: "mensagens", label: "Mensagens", icon: MessageCircle, to: "/chat" };
  return [
    { id: "inicio", label: "Início", icon: Home, to: "/dashboard" },
    { id: "campanhas", label: "Campanhas", icon: Briefcase, to: "/campanhas" },
    { id: "criar", label: "Criar", icon: Plus, to: "/criar", special: true },
    fourth,
    { id: "perfil", label: "Perfil", icon: User, to: "/perfil" },
  ];
}

export function BusinessBottomNav() {
  const location = useLocation();
  const partnerQuery = usePartnerProfileQuery();
  const showIndicacoes = partnerQuery.data?.kind === "active";
  const items = useMemo(
    () => buildBusinessBottomItems(showIndicacoes),
    [showIndicacoes],
  );

  return (
    <nav
      data-business-bottom-nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === "/indicacoes"
              ? location.pathname.startsWith("/indicacoes")
              : location.pathname === item.to;

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
                <span
                  className={cn(
                    "text-[10px]",
                    isActive ? "font-bold text-[#895af6]" : "font-medium text-slate-400",
                  )}
                >
                  {item.label}
                </span>
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
