import { MessageCircle, Plus, Search } from "lucide-react";
import { Link } from "react-router";

type BusinessDashboardHeaderProps = {
  greetingName: string;
  subtitle: string;
};

export function BusinessDashboardHeader({ greetingName, subtitle }: BusinessDashboardHeaderProps) {
  return (
    <>
      {/* Desktop header */}
      <div className="hidden w-full flex-col gap-6 lg:flex">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6e8ea] pb-4 text-[#2c2f30]">
          <h2 className="text-lg font-bold text-[#2c2f30]">Dashboard</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#eff1f2] p-1">
              <Link
                to="/criar"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-[#2c2f30] transition hover:bg-white/80"
              >
                <Plus className="size-3.5" aria-hidden />
                Nova campanha
              </Link>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-[#2c2f30] transition hover:bg-white/80"
              >
                <Search className="size-3.5 shrink-0" aria-hidden />
                Explorar criadores
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold text-[#2c2f30] transition hover:bg-white/80"
              >
                <MessageCircle className="size-3.5 shrink-0" aria-hidden />
                Abrir chat
              </Link>
            </div>
          </div>
        </header>

        <div>
          <h1 className="text-4xl font-extrabold tracking-[-2px] text-[#2c2f30] xl:text-5xl xl:leading-[48px]">
            Bem-vindo de volta, {greetingName} 👋
          </h1>
          <p className="mt-2 max-w-3xl text-base leading-7 text-[#595c5d] lg:text-lg">{subtitle}</p>
        </div>
      </div>

      {/* Mobile greeting section (below the AppHeader) */}
      <div className="lg:hidden">
        <p className="text-sm font-medium text-[#595c5d]">Bem-vindo de volta,</p>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.75px] text-[#2c2f30]">
          {greetingName}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#595c5d]">{subtitle}</p>
      </div>
    </>
  );
}
