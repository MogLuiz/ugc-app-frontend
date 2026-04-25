import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";
import { AppLogoMark } from "~/components/ui/app-logo-mark";

type LegalLayoutProps = {
  children: ReactNode;
};

export function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f7fb] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-3 text-slate-900"
            aria-label="UGC Local"
          >
            <AppLogoMark preset="sm" />
            <span className="text-sm font-black tracking-tight sm:text-base">
              UGC Local
            </span>
          </Link>

          <Link
            to="/cadastro"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-5 text-xs text-slate-500 sm:px-6 sm:text-sm">
          <p className="font-semibold text-slate-600">UGC Local</p>
          <p>Documento público para consulta</p>
        </div>
      </footer>
    </div>
  );
}
