import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Rocket } from "lucide-react";
import { z } from "zod/v3";
import { toast } from "~/components/ui/toast";
import { supabase } from "~/lib/supabase";
import { useResetPasswordMutation } from "~/modules/auth/mutations";
import { AuthVisualPanel } from "~/modules/auth/components/auth-visual-panel";

type LinkState = "checking" | "valid" | "invalid";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mínimo de 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function AuthRedefinirSenhaRoute() {
  const navigate = useNavigate();
  const mutation = useResetPasswordMutation();
  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    let resolved = false;

    const resolve = (state: "valid" | "invalid") => {
      if (resolved) return;
      resolved = true;
      setLinkState(state);
    };

    // 1. Subscrever antes para não perder eventos disparados antes do getSession()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        resolve("valid");
      } else if (event === "SIGNED_OUT" || (event === "INITIAL_SESSION" && !session)) {
        resolve("invalid");
      }
    });

    // 2. Checar sessão existente — se já há sessão ativa, considerar válido
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) resolve("valid");
      // null: aguardar evento PASSWORD_RECOVERY ou fallback abaixo
    });

    // 3. Fallback defensivo — só dispara se nenhum dos acima resolveu
    const timeout = setTimeout(() => resolve("invalid"), 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function onSubmit(data: ResetPasswordForm) {
    try {
      await mutation.mutateAsync(data.password);
      toast.success("Senha redefinida com sucesso! Faça login com a nova senha.");
      navigate("/auth/login");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao redefinir a senha. Tente novamente."
      );
    }
  }

  return (
    <div className="min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      <AuthVisualPanel variant="login" />

      <section className="flex min-h-screen w-full flex-col items-center justify-start bg-white px-6 pt-8 pb-6 lg:h-screen lg:w-2/5 lg:justify-center lg:overflow-y-auto lg:px-12 lg:py-0">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="mb-4 flex flex-col items-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#895af6]">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <span className="mt-2 text-lg font-black tracking-tight text-[#0f172a]">
              UGC Local
            </span>
          </div>

          {linkState === "checking" && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#895af6]" />
              <p className="text-sm text-slate-500">Verificando link...</p>
            </div>
          )}

          {linkState === "invalid" && (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <Lock className="h-7 w-7 text-red-400" />
              </div>
              <h1 className="text-[26px] font-black tracking-tight text-[#0f172a]">
                Link inválido ou expirado
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Este link de redefinição não é mais válido. Solicite um novo link abaixo.
              </p>
              <Link
                to="/auth/esqueci-senha"
                className="mt-6 inline-block h-11 rounded-xl bg-[#895af6] px-6 text-sm font-bold leading-[44px] text-white shadow-[0_8px_20px_-4px_rgba(137,90,246,0.35)] transition-all hover:bg-[#7c4aed]"
              >
                Solicitar novo link
              </Link>
              <p className="mt-4 text-sm text-slate-500">
                <Link
                  to="/auth/login"
                  className="font-semibold text-[#895af6] transition-opacity hover:opacity-75"
                >
                  Voltar para o login
                </Link>
              </p>
            </div>
          )}

          {linkState === "valid" && (
            <>
              <div className="mb-5">
                <h1 className="text-[28px] font-black tracking-tight text-[#0f172a] lg:text-[32px]">
                  Redefinir senha
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  Escolha uma nova senha para sua conta.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Nova senha */}
                <div>
                  <label
                    htmlFor="reset-password"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400"
                  >
                    Nova senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Mínimo 8 caracteres"
                      {...register("password")}
                      aria-invalid={!!errors.password}
                      className={`h-12 w-full rounded-xl border bg-white pl-10 pr-10 text-base text-[#0f172a] outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#895af6]/15 lg:h-11 ${
                        errors.password
                          ? "border-red-400 focus:border-red-400"
                          : "border-slate-200 hover:border-slate-300 focus:border-[#895af6]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirmar nova senha */}
                <div>
                  <label
                    htmlFor="reset-confirm-password"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400"
                  >
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reset-confirm-password"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Repita a nova senha"
                      {...register("confirmPassword")}
                      aria-invalid={!!errors.confirmPassword}
                      className={`h-12 w-full rounded-xl border bg-white pl-10 pr-10 text-base text-[#0f172a] outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#895af6]/15 lg:h-11 ${
                        errors.confirmPassword
                          ? "border-red-400 focus:border-red-400"
                          : "border-slate-200 hover:border-slate-300 focus:border-[#895af6]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                      aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="h-12 w-full rounded-xl bg-[#895af6] text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(137,90,246,0.35)] transition-all hover:bg-[#7c4aed] hover:shadow-[0_12px_24px_-4px_rgba(137,90,246,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
