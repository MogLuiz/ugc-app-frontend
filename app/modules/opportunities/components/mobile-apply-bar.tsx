import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

interface MobileApplyBarProps {
  value: number;
  hasApplied: boolean;
  canApply: boolean;
  hasMinimumPortfolio: boolean;
  isApplying: boolean;
  onApply: () => void;
}

export function MobileApplyBar({
  value,
  hasApplied,
  canApply,
  hasMinimumPortfolio,
  isApplying,
  onApply,
}: MobileApplyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t-2 border-slate-200 bg-white p-4 shadow-lg lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500">Valor do projeto</div>
          <div className="text-xl font-bold text-slate-900">
            {value.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>

        {hasApplied ? (
          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircle2 className="size-5" />
            Candidatura enviada
          </div>
        ) : !hasMinimumPortfolio ? (
          <Button
            asChild
            variant="outline"
            className="border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            <Link to="/perfil">
              <AlertCircle className="mr-2 size-4" />
              Completar portfólio
            </Link>
          </Button>
        ) : (
          <Button
            className="bg-[#895af6] font-semibold hover:bg-[#6a36d5] px-6"
            onClick={onApply}
            disabled={isApplying || !canApply}
          >
            {isApplying ? "Enviando..." : "Candidatar-se"}
          </Button>
        )}
      </div>
    </div>
  );
}
