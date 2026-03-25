import { useState } from "react";
import { Bell, MapPin, Menu, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function CreatorDashboardHeader({
  creatorName,
}: {
  creatorName: string;
}) {
  return (
    <>
      <header className="sticky top-0 z-20 -mx-4 flex items-center justify-between border-b border-[rgba(106,54,213,0.1)] bg-[rgba(245,246,247,0.85)] px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-[rgba(106,54,213,0.12)]"
            aria-label="Menu"
          >
            <Menu className="size-5 text-[#6a36d5]" />
          </button>
          <h1 className="text-lg font-black tracking-[-0.45px] text-[#2c2f30]">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/chat"
            className="flex size-9 items-center justify-center rounded-full text-[#595c5d] hover:bg-[#6a36d5]/10"
            aria-label="Mensagens"
          >
            <MessageCircle className="size-5" />
          </Link>
          <button
            type="button"
            className="relative p-2"
            aria-label="Notificações"
          >
            <Bell className="size-5 text-[#595c5d]" />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-[#f5f6f7] bg-red-500" />
          </button>
          <HeaderAvatar />
        </div>
      </header>

      <div className="hidden lg:block">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-black leading-tight tracking-[-0.75px] text-[#2c2f30]">
              Bem-vindo, {creatorName}! 👋
            </h1>
            <p className="mt-2 max-w-xl text-base text-[#595c5d]">
              Veja suas campanhas, convites e oportunidades perto de você.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
            <Button
              asChild
              className="h-12 rounded-full bg-[#6a36d5] px-6 font-bold shadow-md hover:bg-[#5b2fc4]"
            >
              <Link to="/mapa" className="inline-flex items-center gap-2">
                <MapPin className="size-4" />
                Oportunidades no mapa
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[rgba(106,54,213,0.25)] px-6 font-semibold text-[#6a36d5]"
            >
              <Link to="/chat" className="inline-flex items-center gap-2">
                <MessageCircle className="size-4" />
                Mensagens
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <section className="mt-2 lg:hidden">
        <h2 className="text-2xl font-black tracking-[-0.5px] text-[#2c2f30]">
          Bem-vindo, {creatorName}! 👋
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#595c5d]">
          Veja suas campanhas, convites e oportunidades perto de você.
        </p>
        <Button
          asChild
          className="mt-5 h-14 w-full rounded-2xl bg-[#6a36d5] text-base font-bold shadow-md hover:bg-[#5b2fc4]"
        >
          <Link
            to="/mapa"
            className="inline-flex items-center justify-center gap-2"
          >
            <MapPin className="size-5" />
            Ver oportunidades perto de você
          </Link>
        </Button>
      </section>
    </>
  );
}

function HeaderAvatar() {
  const [error, setError] = useState(false);
  const src =
    "https://www.figma.com/api/mcp/asset/0f9405cf-b2e2-4227-af33-30d805c7727f";

  return (
    <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border-2 border-[#6a36d5] bg-slate-200">
      {!error ? (
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="text-[10px] font-bold text-slate-600">UGC</span>
      )}
    </div>
  );
}
