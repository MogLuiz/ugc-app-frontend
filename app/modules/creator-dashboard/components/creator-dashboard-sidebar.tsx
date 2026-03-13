import { useState } from "react";
import {
  Briefcase,
  ChevronRight,
  CreditCard,
  Home,
  Settings,
  User
} from "lucide-react";
import { cn } from "~/lib/utils";

const AVATAR_FALLBACK = "LM";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home, active: true },
  { id: "jobs", label: "Meus Jobs", icon: Briefcase },
  { id: "pagamentos", label: "Pagamentos", icon: CreditCard },
  { id: "perfil", label: "Perfil", icon: User },
  { id: "configuracoes", label: "Configurações", icon: Settings }
];

export function CreatorDashboardSidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex gap-3 p-6">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#895af6]">
          <Home className="size-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">UGC Local</p>
          <p className="text-xs font-medium text-[#895af6]">Portal do Criador</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-2 px-4 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href="#"
              className={cn(
                "flex items-center gap-3 rounded-[48px] px-4 py-3 text-sm font-medium transition-colors",
                item.active
                  ? "bg-[rgba(137,90,246,0.1)] text-[#895af6]"
                  : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <UserAvatar />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-900">Lucas Mendes</p>
            <p className="truncate text-[10px] text-slate-500">Premium Creator</p>
          </div>
          <ChevronRight className="size-[18px] shrink-0 text-slate-400" />
        </div>
      </div>
    </aside>
  );
}

function UserAvatar() {
  const [error, setError] = useState(false);
  const src =
    "https://www.figma.com/api/mcp/asset/0f9405cf-b2e2-4227-af33-30d805c7727f";

  return (
    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-slate-200">
      {!error ? (
        <img
          src={src}
          alt="Lucas Mendes"
          className="size-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-xs font-bold text-slate-600">{AVATAR_FALLBACK}</span>
      )}
    </div>
  );
}
