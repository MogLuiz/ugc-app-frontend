import { useMemo } from "react";
import { Briefcase, CalendarDays, Home, MessageCircle, User, UserPlus } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { usePartnerProfileQuery } from "~/modules/referrals/hooks/use-referrals-data";

type NavItem = {
  id: string;
  label: string;
  icon: typeof Home;
  to: string;
};

const CREATOR_BOTTOM_BASE: NavItem[] = [
  { id: "inicio", label: "Início", icon: Home, to: "/dashboard" },
  { id: "campanhas", label: "Campanhas", icon: Briefcase, to: "/ofertas" },
  { id: "agenda", label: "Agenda", icon: CalendarDays, to: "/agenda" },
];

/**
 * Temporário: com parceiro ativo no programa de indicações, substituímos "Mensagens" por
 * "Indicações" no mobile para manter 5 itens na barra (limitação de espaço — não é regra
 * definitiva de produto).
 */
function buildCreatorBottomItems(showIndicacoes: boolean): NavItem[] {
  const fourth: NavItem = showIndicacoes
    ? { id: "indicacoes", label: "Indicações", icon: UserPlus, to: "/indicacoes" }
    : { id: "mensagens", label: "Mensagens", icon: MessageCircle, to: "/chat" };
  const perfil: NavItem = { id: "perfil", label: "Perfil", icon: User, to: "/perfil" };
  return [...CREATOR_BOTTOM_BASE, fourth, perfil];
}

export function CreatorBottomNav() {
  const location = useLocation();
  const partnerQuery = usePartnerProfileQuery();
  const showIndicacoes = partnerQuery.data?.kind === "active";

  const items = useMemo(
    () => buildCreatorBottomItems(showIndicacoes),
    [showIndicacoes],
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-[rgba(137,90,246,0.1)] bg-white/90 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.to === "/indicacoes"
              ? location.pathname.startsWith("/indicacoes")
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
