import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Eye, EyeOff, Lock } from "lucide-react";
import { z } from "zod/v3";
import { useChangePasswordMutation } from "~/modules/auth/mutations";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: z.string().min(8, "Mínimo de 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

type FieldVisibility = {
  current: boolean;
  newPwd: boolean;
  confirm: boolean;
};

const inputBase =
  "h-11 w-full rounded-xl border bg-white pl-10 pr-10 text-sm text-[#0f172a] outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#895af6]/15";
const inputNormal = "border-slate-200 hover:border-slate-300 focus:border-[#895af6]";
const inputError = "border-red-400 focus:border-red-400";

export function ChangePasswordSection() {
  const mutation = useChangePasswordMutation();
  const [success, setSuccess] = useState(false);
  const [visibility, setVisibility] = useState<FieldVisibility>({
    current: false,
    newPwd: false,
    confirm: false,
  });

  const toggle = (field: keyof FieldVisibility) =>
    setVisibility((v) => ({ ...v, [field]: !v[field] }));

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(data: ChangePasswordForm) {
    setSuccess(false);
    try {
      await mutation.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      reset();
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao trocar a senha";
      if (message === "Senha atual incorreta") {
        setError("currentPassword", { message: "Senha atual incorreta" });
      } else {
        setError("root", { message });
      }
    }
  }

  return (
    <div className="rounded-[24px] border border-slate-100 bg-white shadow-sm lg:rounded-[32px]">
      {/* Card header */}
      <div className="flex items-center gap-4 p-5 lg:p-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#895af6]/10">
          <Lock className="size-5 text-[#895af6]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#0f172a]">Alterar senha</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
            Troque sua senha de acesso regularmente para manter sua conta protegida.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* Form */}
      <div className="p-5 lg:p-6">
        {errors.root && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            {/* Senha atual — largura total */}
            <div>
              <label
                htmlFor="change-current-password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400"
              >
                Senha atual
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  id="change-current-password"
                  type={visibility.current ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Sua senha atual"
                  {...register("currentPassword")}
                  aria-invalid={!!errors.currentPassword}
                  className={`${inputBase} ${errors.currentPassword ? inputError : inputNormal}`}
                />
                <button
                  type="button"
                  onClick={() => toggle("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={visibility.current ? "Ocultar senha" : "Mostrar senha"}
                >
                  {visibility.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* Nova senha + Confirmar — 2 colunas no desktop */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Nova senha */}
              <div>
                <label
                  htmlFor="change-new-password"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400"
                >
                  Nova senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="change-new-password"
                    type={visibility.newPwd ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    {...register("newPassword")}
                    aria-invalid={!!errors.newPassword}
                    className={`${inputBase} ${errors.newPassword ? inputError : inputNormal}`}
                  />
                  <button
                    type="button"
                    onClick={() => toggle("newPwd")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={visibility.newPwd ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {visibility.newPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirmar nova senha */}
              <div>
                <label
                  htmlFor="change-confirm-password"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400"
                >
                  Confirmar nova senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="change-confirm-password"
                    type={visibility.confirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repita a nova senha"
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                    className={`${inputBase} ${errors.confirmPassword ? inputError : inputNormal}`}
                  />
                  <button
                    type="button"
                    onClick={() => toggle("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={visibility.confirm ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {visibility.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer: sucesso + botão */}
          <div className="mt-5 flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between">
            {success ? (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <CheckCircle2 className="size-4 shrink-0" />
                Senha alterada com sucesso!
              </div>
            ) : (
              <div /> /* spacer para manter botão à direita */
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="h-11 w-full rounded-xl bg-[#895af6] text-sm font-bold text-white shadow-[0_4px_12px_-2px_rgba(137,90,246,0.3)] transition-all hover:bg-[#7c4aed] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto lg:px-6"
            >
              {mutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Salvando...
                </span>
              ) : (
                "Salvar nova senha"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
