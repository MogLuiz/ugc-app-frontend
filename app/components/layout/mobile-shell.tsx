import { Link, NavLink, Outlet, useLocation } from "react-router";
import { Building2, Home, MessageCircle, UserCircle2 } from "lucide-react";
import { cn } from "~/lib/utils";

const navItems = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/empresa", label: "Empresa", icon: Building2 },
  { to: "/criadora", label: "Criadora", icon: UserCircle2 },
  { to: "/jobs/novo", label: "Jobs", icon: MessageCircle }
];

export function MobileShellLayout() {
  const { pathname } = useLocation();
  const isAuthRoute = pathname.startsWith("/auth/");

  if (isAuthRoute) {
    return (
      <div className="min-h-screen bg-[#f6f5f8]">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 p-4 backdrop-blur">
        <Link to="/" className="text-sm font-semibold tracking-tight text-slate-900">
          UGC App BH
        </Link>
      </header>

      <main className="flex-1 p-4">
        <Outlet />
      </main>

      <nav className="sticky bottom-0 border-t border-slate-200 bg-white px-3 py-2">
        <ul className="grid grid-cols-4 gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center rounded-lg px-2 py-1 text-[11px] font-medium text-slate-500",
                    isActive && "bg-slate-100 text-slate-900"
                  )
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
