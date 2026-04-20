import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod/v3";
import { DashboardCard } from "~/components/ui/dashboard-card";
import { MobileEmptyState } from "~/components/ui/mobile-empty-state";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select } from "~/components/ui/select";
import { toast } from "~/components/ui/toast";
import type {
  CreatorPayoutSettings,
  PixKeyType,
  UpdateCreatorPayoutSettingsInput,
} from "../types/payment.types";

const payoutSettingsSchema = z.object({
  pixKeyType: z.enum(["cpf", "cnpj", "email", "phone", "random"], {
    message: "Selecione o tipo da chave PIX",
  }),
  pixKey: z.string().trim().min(1, "Informe a chave PIX"),
  holderName: z.string().trim().optional().or(z.literal("")),
  holderDocument: z.string().trim().optional().or(z.literal("")),
});

type PayoutSettingsForm = z.infer<typeof payoutSettingsSchema>;

const KEY_TYPE_LABELS: Record<PixKeyType, string> = {
  cpf: "CPF",
  cnpj: "CNPJ",
  phone: "Telefone",
  email: "E-mail",
  random: "Chave aleatória",
};

const PIX_KEY_PLACEHOLDERS: Record<PixKeyType, string> = {
  cpf: "000.000.000-00",
  cnpj: "00.000.000/0000-00",
  email: "seu@email.com",
  phone: "(00) 00000-0000",
  random: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
};

type Props = {
  settings: CreatorPayoutSettings | undefined;
  isLoading?: boolean;
  isSaving?: boolean;
  onSubmit: (payload: UpdateCreatorPayoutSettingsInput) => Promise<unknown>;
};

function defaultValuesFromSettings(
  settings: CreatorPayoutSettings | undefined
): PayoutSettingsForm {
  return {
    pixKeyType: settings?.pixKeyType ?? "cpf",
    pixKey: settings?.pixKey ?? "",
    holderName: settings?.holderName ?? "",
    holderDocument: settings?.holderDocument ?? "",
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function PixDataBlock({ settings, isLoading, isSaving, onSubmit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PayoutSettingsForm>({
    resolver: zodResolver(payoutSettingsSchema),
    defaultValues: defaultValuesFromSettings(settings),
  });

  const pixKeyType = watch("pixKeyType");

  useEffect(() => {
    reset(defaultValuesFromSettings(settings));
  }, [reset, settings]);

  async function submitForm(values: PayoutSettingsForm) {
    try {
      await onSubmit({
        pixKeyType: values.pixKeyType,
        pixKey: values.pixKey,
        holderName: values.holderName || null,
        holderDocument: values.holderDocument || null,
      });
      setIsEditing(false);
      toast.success("Dados PIX salvos com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar os dados PIX."
      );
    }
  }

  if (isLoading) {
    return (
      <DashboardCard shadowTone="neutral" className="animate-pulse space-y-3">
        <div className="h-3 w-1/2 rounded bg-slate-100" />
        <div className="h-3 w-3/4 rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </DashboardCard>
    );
  }

  if (!isEditing && !settings?.isConfigured) {
    return (
      <MobileEmptyState
        title="Nenhuma chave PIX cadastrada"
        description="Cadastre sua chave PIX para receber seus repasses direto na sua conta."
        actions={
          <Button onClick={() => setIsEditing(true)}>Cadastrar chave PIX</Button>
        }
      />
    );
  }

  if (!isEditing && settings?.isConfigured) {
    return (
      <DashboardCard shadowTone="neutral" className="space-y-4">
        <p className="text-sm font-semibold text-slate-700">Dados de recebimento</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Tipo de chave</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              {settings.pixKeyType ? KEY_TYPE_LABELS[settings.pixKeyType] : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Chave PIX</span>
            <span className="text-sm font-mono text-slate-800">
              {settings.pixKeyMasked ?? settings.pixKey ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Titular</span>
            <span className="text-sm text-slate-800">{settings.holderName ?? "—"}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Documento do titular</span>
            <span className="text-sm text-slate-800">{settings.holderDocument ?? "—"}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-full pt-1 text-center text-sm font-medium text-[#895af6] hover:text-[#7c4de0]"
        >
          Editar dados PIX
        </button>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard shadowTone="neutral" className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-slate-700">Configurar dados PIX</p>
        <p className="mt-1 text-xs text-slate-500">
          Esses dados serão usados para recebimento dos repasses.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(submitForm)} noValidate>
        <div className="space-y-1.5">
          <FieldLabel>Tipo de chave</FieldLabel>
          <Select
            {...register("pixKeyType")}
            onChange={(e) => {
              void register("pixKeyType").onChange(e);
              setValue("pixKey", "", { shouldValidate: false });
            }}
          >
            {Object.entries(KEY_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <FieldError message={errors.pixKeyType?.message} />
        </div>

        <div className="space-y-1.5">
          <FieldLabel>Chave PIX</FieldLabel>
          <Input
            {...register("pixKey")}
            placeholder={PIX_KEY_PLACEHOLDERS[pixKeyType]}
            autoComplete="off"
          />
          <FieldError message={errors.pixKey?.message} />
        </div>

        <div className="space-y-1.5">
          <FieldLabel>Nome do titular</FieldLabel>
          <Input
            {...register("holderName")}
            placeholder="Opcional"
            autoComplete="name"
          />
          <FieldError message={errors.holderName?.message} />
        </div>

        <div className="space-y-1.5">
          <FieldLabel>Documento do titular</FieldLabel>
          <Input
            {...register("holderDocument")}
            placeholder="Opcional"
            autoComplete="off"
          />
          <FieldError message={errors.holderDocument?.message} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            variant="purple"
            className="flex-1"
            disabled={isSubmitting || isSaving}
          >
            {isSubmitting || isSaving ? "Salvando..." : "Salvar dados PIX"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={isSubmitting || isSaving}
            onClick={() => {
              reset(defaultValuesFromSettings(settings));
              setIsEditing(false);
            }}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </DashboardCard>
  );
}
