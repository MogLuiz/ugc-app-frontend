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

/**
 * `compact`  — seções secundárias (Convites, Próximos trabalhos)
 * `expanded` — seções intermediárias (Atividade recente)
 * `default`  — seção principal (Campanhas disponíveis)
 */
export type EmptyStateDensity = "default" | "compact" | "expanded";

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
  /**
   * `compact`: blocos secundários na dashboard — padding e tipografia menores.
   * Layout do texto prioriza copy curta + max-width + leading-snug.
   */
  density?: EmptyStateDensity;
  className?: string;
};

export function MobileEmptyState({
  illustration,
  title,
  description,
  actions,
  footer,
  variant = "initial",
  density = "default",
  className,
}: MobileEmptyStateProps) {
  const isCompact = density === "compact";
  const isExpanded = density === "expanded";

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        isCompact ? "py-3" : isExpanded ? "py-5" : "py-6",
        className,
      )}
      data-empty-variant={variant}
      data-empty-density={density}
    >
      {illustration ? (
        <div
          className={cn(
            "flex items-center justify-center",
            isCompact ? "mb-2" : isExpanded ? "mb-4" : "mb-5",
          )}
          aria-hidden="true"
        >
          {illustration}
        </div>
      ) : null}

      <h2
        className={cn(
          "font-black text-[#0f172a]",
          isCompact
            ? "text-base tracking-[-0.35px]"
            : isExpanded
              ? "text-lg tracking-[-0.4px]"
              : "text-xl tracking-[-0.5px]",
        )}
      >
        {title}
      </h2>
      <p
        className={cn(
          "font-medium text-slate-500",
          isCompact
            ? "mt-1.5 max-w-[240px] text-xs leading-snug lg:max-w-[260px]"
            : isExpanded
              ? "mt-2 max-w-[250px] text-sm leading-snug"
              : "mt-2 max-w-[280px] text-sm leading-relaxed",
        )}
      >
        {description}
      </p>

      {actions ? (
        <div
          className={cn(
            "w-full",
            isCompact ? "mt-2.5" : isExpanded ? "mt-4" : "mt-6",
          )}
        >
          {actions}
        </div>
      ) : null}
      {footer ? (
        <div
          className={cn(
            "w-full",
            isCompact ? "mt-3" : isExpanded ? "mt-3" : "mt-4",
          )}
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Bloco de dica contextual "Dica" — reutilizável no footer de qualquer empty state.
 */
export function OrbitTipCard({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-slate-100 bg-white p-5 text-left shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#fef3c7]">
        <Lightbulb className="size-4 text-amber-500" aria-hidden="true" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[1.65px] text-[#895af6]">
          Dica
        </p>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
      </div>
    </div>
  );
}
