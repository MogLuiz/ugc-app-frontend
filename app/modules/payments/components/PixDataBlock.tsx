import { DashboardCard } from "~/components/ui/dashboard-card";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import { Button } from "~/components/ui/button";

// Tipo esperado de uma futura API GET /creators/me/payout-settings
export type PixSettings = {
  keyType: "CPF" | "CNPJ" | "PHONE" | "EMAIL" | "RANDOM";
  key: string;
  holderName: string;
};

const KEY_TYPE_LABELS: Record<PixSettings["keyType"], string> = {
  CPF: "CPF",
  CNPJ: "CNPJ",
  PHONE: "Telefone",
  EMAIL: "E-mail",
  RANDOM: "Chave aleatória",
};

function maskKey(key: string, type: PixSettings["keyType"]): string {
  if (type === "EMAIL") {
    const [local, domain] = key.split("@");
    if (!local || !domain) return key;
    return `${local.slice(0, 2)}***@${domain}`;
  }
  if (type === "CPF") {
    return key.replace(/(\d{3})\.(\d{3})\.(\d{3})-(\d{2})/, "$1.***.***-$4")
      ?? key.slice(0, 3) + "*".repeat(key.length - 6) + key.slice(-2);
  }
  if (type === "PHONE") {
    return key.slice(0, 3) + "****" + key.slice(-4);
  }
  return key.slice(0, 4) + "****" + key.slice(-4);
}

type Props = {
  settings: PixSettings | null;
  isLoading?: boolean;
  onEdit: () => void;
};

export function PixDataBlock({ settings, isLoading, onEdit }: Props) {
  if (isLoading) {
    return (
      <DashboardCard shadowTone="neutral" className="animate-pulse space-y-3">
        <div className="h-3 bg-slate-100 rounded w-1/2" />
        <div className="h-3 bg-slate-100 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </DashboardCard>
    );
  }

  if (!settings) {
    return (
      <MobileEmptyState
        title="Nenhuma chave PIX cadastrada"
        description="Cadastre sua chave PIX para receber seus repasses direto na sua conta."
        actions={
          <Button onClick={onEdit}>Cadastrar chave PIX</Button>
        }
      />
    );
  }

  return (
    <DashboardCard shadowTone="neutral" className="space-y-4">
      <p className="text-sm font-semibold text-slate-700">Dados de recebimento</p>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Tipo de chave</span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
            {KEY_TYPE_LABELS[settings.keyType]}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Chave PIX</span>
          <span className="text-sm text-slate-800 font-mono">{maskKey(settings.key, settings.keyType)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">Titular</span>
          <span className="text-sm text-slate-800">{settings.holderName}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="w-full text-center text-sm font-medium text-[#895af6] hover:text-[#7c4de0] pt-1"
      >
        Editar dados PIX
      </button>
    </DashboardCard>
  );
}
