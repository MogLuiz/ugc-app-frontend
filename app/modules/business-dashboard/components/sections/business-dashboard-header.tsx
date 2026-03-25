import { Bell, Menu, MessageCircle, Plus, Search } from "lucide-react";
import { Link } from "react-router";

type BusinessDashboardHeaderProps = {
  greetingName: string;
  subtitle: string;
};

export function BusinessDashboardHeader({ greetingName, subtitle }: BusinessDashboardHeaderProps) {
  return (
    <>
      <div className="hidden w-full flex-col gap-6 lg:flex">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e6e8ea] pb-4 text-[#2c2f30]">
          <h2 className="text-lg font-bold text-[#2c2f30]">Dashboard</h2>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap items-center gap-1 rounded-full bg-[#eff1f2] p-1">
              <Link
                to="/marketplace"
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
            <div className="hidden h-8 w-px bg-[#e6e8ea] sm:block" aria-hidden />
            <button
              type="button"
              className="relative flex size-11 items-center justify-center rounded-full border border-[rgba(106,54,213,0.12)] bg-white"
              aria-label="Notificações"
            >
              <Bell className="size-5 text-[#595c5d]" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full border-2 border-white bg-[#b41340]" />
            </button>
          </div>
        </header>

        <div>
          <h1 className="text-4xl font-extrabold tracking-[-2px] text-[#2c2f30] xl:text-5xl xl:leading-[48px]">
            Bem-vindo de volta, {greetingName} 👋
          </h1>
          <p className="mt-2 max-w-3xl text-base leading-7 text-[#595c5d] lg:text-lg">{subtitle}</p>
        </div>
      </div>

      <header className="sticky top-0 z-20 -mx-4 flex flex-col gap-4 border-b border-[#e6e8ea] bg-[#f5f6f7] px-4 pb-4 pt-6 lg:hidden">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Menu"
          >
            <Menu className="size-5 text-[#595c5d]" />
          </button>
          <button
            type="button"
            className="relative flex size-10 items-center justify-center rounded-full bg-white shadow-sm"
            aria-label="Notificações"
          >
            <Bell className="size-5 text-[#595c5d]" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-[#b41340]" />
          </button>
        </div>

        <div>
          <p className="text-sm font-medium text-[#595c5d]">Bem-vindo de volta,</p>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.75px] text-[#2c2f30]">
            {greetingName}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#595c5d]">{subtitle}</p>
        </div>

        <div
          className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex min-w-max items-center gap-1 rounded-full bg-[#eff1f2] p-1">
            <Link
              to="/marketplace"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#2c2f30]"
            >
              <Plus className="size-3.5" aria-hidden />
              Nova campanha
            </Link>
            <Link
              to="/marketplace"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#2c2f30]"
            >
              <Search className="size-3.5" aria-hidden />
              Explorar
            </Link>
            <Link
              to="/chat"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#2c2f30]"
            >
              <MessageCircle className="size-3.5" aria-hidden />
              Chat
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
