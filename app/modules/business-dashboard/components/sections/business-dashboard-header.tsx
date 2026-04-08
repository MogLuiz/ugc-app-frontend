import { MessageCircle, Plus } from "lucide-react";
import { Link } from "react-router";

type BusinessDashboardHeaderProps = {
  greetingName: string;
  subtitle: string;
};

export function BusinessDashboardHeader({
  greetingName,
  subtitle,
}: BusinessDashboardHeaderProps) {
  return (
    <>
      {/* Desktop header */}
      <div className="hidden lg:block">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.75px] text-[#2c2f30]">
              Bem-vindo, {greetingName} 👋
            </h1>
            <p className="mt-2 max-w-xl text-base text-[#595c5d]">{subtitle}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <Link
              to="/criar"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#6a36d5] px-6 text-sm font-bold text-white shadow-md transition-colors hover:bg-[#5b2fc4]"
            >
              <Plus className="size-4" aria-hidden />
              Nova campanha
            </Link>
            <Link
              to="/chat"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[rgba(106,54,213,0.25)] px-6 text-sm font-semibold text-[#6a36d5] transition-colors hover:bg-[rgba(106,54,213,0.05)]"
            >
              <MessageCircle className="size-4" aria-hidden />
              Mensagens
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile greeting section (below the AppHeader) */}
      <div className="lg:hidden">
        <p className="text-sm font-medium text-[#595c5d]">
          Bem-vindo de volta,
        </p>
        <h1 className="text-[28px] font-extrabold leading-tight tracking-[-0.75px] text-[#2c2f30]">
          {greetingName}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#595c5d]">
          {subtitle}
        </p>
      </div>
    </>
  );
}
