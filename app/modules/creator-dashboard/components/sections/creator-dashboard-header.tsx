import { MapPin, MessageCircle } from "lucide-react";
import { Link } from "react-router";

export function CreatorDashboardHeader({
  creatorName,
}: {
  creatorName: string;
}) {
  return (
    <>
      {/* Desktop header */}
      <div className="hidden lg:block">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.75px] text-[#2c2f30]">
              Início
            </h1>
            <p className="mt-2 max-w-xl text-base text-[#595c5d]">
              Convites, campanhas e oportunidades.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <Link
              to="/chat"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[rgba(106,54,213,0.25)] px-6 text-sm font-semibold text-[#6a36d5] transition-colors hover:bg-[rgba(106,54,213,0.05)]"
            >
              <MessageCircle className="size-4" />
              Mensagens
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile screen title (below AppHeader) */}
      <section className="lg:hidden">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-[#2c2f30]">Início</h2>
          <p className="text-sm leading-snug text-slate-500">
            Convites, campanhas e oportunidades.
          </p>
        </div>
      </section>
    </>
  );
}
