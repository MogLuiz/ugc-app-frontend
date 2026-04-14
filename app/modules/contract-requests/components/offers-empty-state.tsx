import type { ReactNode } from "react";
import { Link } from "react-router";
import { Tag, ArrowRight } from "lucide-react";

export type OffersEmptyStateProps = {
  title: string;
  description: string;
  /** Dica, CTA ou outro bloco abaixo do texto (opcional). */
  footer?: ReactNode;
};

export function OffersEmptyState({ title, description, footer }: OffersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Illustration card — compact */}
      <div className="relative mb-6 w-full max-w-[220px]">
        {/* Floating element top-right */}
        <div className="absolute -right-3 -top-3 z-10 flex size-12 items-center justify-center rounded-xl border border-white/20 bg-white/70 shadow-md backdrop-blur-md">
          <Tag className="size-4 text-[#895af6]" />
        </div>

        {/* Floating element bottom-left */}
        <div className="absolute -bottom-4 -left-4 z-10 flex size-10 items-center justify-center rounded-full bg-[#895af6] shadow-[0px_10px_15px_-3px_rgba(137,90,246,0.4)]">
          <ArrowRight className="size-3.5 text-white" />
        </div>

        {/* Main illustration card */}
        <div className="relative z-0 overflow-hidden rounded-2xl bg-white px-6 py-10 shadow-[0px_10px_30px_-8px_rgba(137,90,246,0.12)]">
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex size-16 items-center justify-center rounded-full bg-[#f6f5f8]">
              <Tag className="size-7 text-slate-300" />
              <div className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-red-500">
                <span className="text-[10px] font-black text-white">0</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-1.5 w-24 rounded-full bg-[#f1f0f3]" />
              <div className="h-1.5 w-16 rounded-full bg-[rgba(241,240,243,0.6)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Copy */}
      <h2 className="mb-2 text-center text-xl font-black tracking-tight text-slate-900">
        {title}
      </h2>
      <p className="mb-6 max-w-[280px] text-center text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      {footer ? (
        <div className="flex w-full max-w-[280px] flex-col items-center">{footer}</div>
      ) : null}
    </div>
  );
}

/** Empty padrão da lista de ofertas do creator (perfil + tip). */
export function CreatorOffersEmptyState() {
  return (
    <OffersEmptyState
      title="Nenhuma oferta por enquanto"
      description="Assim que empresas enviarem propostas, elas aparecerão aqui."
      footer={
        <Link
          to="/perfil"
          className="mt-4 inline-flex items-center justify-center gap-1 rounded-full border border-white bg-white/60 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/80"
        >
          Complete seu perfil para receber mais ofertas.
          <ArrowRight className="size-4 shrink-0" aria-hidden />
        </Link>
      }
    />
  );
}
