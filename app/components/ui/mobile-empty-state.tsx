import type { ReactNode } from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "~/lib/utils";

/**
 * Variant semântico para o empty state.
 * Atualmente todos os variantes têm aparência idêntica — o tipo existe
 * para preparar diferenciação futura (ex: mensagem contextual por variante,
 * ícone diferente, cor diferente etc.) sem quebrar a API.
 */
export type EmptyStateVariant = "initial" | "filtered" | "period" | "no-data";

type MobileEmptyStateProps = {
  /** Área visual decorativa no topo (ilustração CSS ou SVG). Aria-hidden aplicado automaticamente. */
  illustration?: ReactNode;
  /** Título principal — font-black, tracking apertado, idêntico ao padrão Figma. */
  title: string;
  /** Texto de apoio — max 300px de largura para boa legibilidade no mobile. */
  description: string;
  /** CTA(s) — renderizados abaixo do texto. Geralmente um Link ou Button. */
  actions?: ReactNode;
  /** Blocos contextuais opcionais (OrbitTipCard, quick-info cards, bento etc.). */
  footer?: ReactNode;
  /**
   * Semântica do motivo do estado vazio. Não altera visuais agora,
   * mas é exposto via data-empty-variant para futuros estilos/testes.
   */
  variant?: EmptyStateVariant;
  className?: string;
};

export function MobileEmptyState({
  illustration,
  title,
  description,
  actions,
  footer,
  variant = "initial",
  className,
}: MobileEmptyStateProps) {
  return (
    <div
      className={cn("flex flex-col items-center py-6 text-center", className)}
      data-empty-variant={variant}
    >
      {illustration ? (
        <div className="mb-5 flex items-center justify-center" aria-hidden="true">
          {illustration}
        </div>
      ) : null}

      <h2 className="text-xl font-black tracking-[-0.5px] text-[#0f172a]">
        {title}
      </h2>
      <p className="mt-2 max-w-[280px] text-sm font-medium leading-relaxed text-slate-500">
        {description}
      </p>

      {actions ? <div className="mt-6 w-full">{actions}</div> : null}
      {footer ? <div className="mt-4 w-full">{footer}</div> : null}
    </div>
  );
}

/**
 * Bloco de dica contextual "Dica Orbit" — reutilizável no footer de qualquer empty state.
 */
export function OrbitTipCard({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#fef3c7]">
        <Lightbulb className="size-4 text-amber-500" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[1.65px] text-[#895af6]">
          Dica Orbit
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
      </div>
    </div>
  );
}
