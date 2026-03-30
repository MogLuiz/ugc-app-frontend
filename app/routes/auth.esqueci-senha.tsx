import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { Mail, Rocket } from "lucide-react";
import { z } from "zod/v3";
import { toast } from "~/components/ui/toast";
import { useForgotPasswordMutation } from "~/modules/auth/mutations";
import { AuthVisualPanel } from "~/modules/auth/components/auth-visual-panel";

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function AuthEsqueciSenhaRoute() {
  const [submitted, setSubmitted] = useState(false);
  const mutation = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordForm) {
    try {
      await mutation.mutateAsync(data.email);
      setSubmitted(true);
    } catch {
      toast.error("Erro ao enviar o link. Tente novamente em alguns instantes.");
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

          {submitted ? (
            /* Estado de sucesso — neutro (anti-enumeração) */
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#895af6]/10">
                <Mail className="h-7 w-7 text-[#895af6]" />
              </div>
              <h1 className="text-[26px] font-black tracking-tight text-[#0f172a]">
                Verifique seu e-mail
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Se existir uma conta com esse e-mail, você receberá um link para
                redefinição em breve.
              </p>
              <Link
                to="/auth/login"
                className="mt-6 inline-block text-sm font-semibold text-[#895af6] transition-opacity hover:opacity-75"
              >
                Voltar para o login
              </Link>
            </div>
          ) : (
            /* Estado do formulário */
            <>
              <div className="mb-5">
                <h1 className="text-[28px] font-black tracking-tight text-[#0f172a] lg:text-[32px]">
                  Esqueci a senha
                </h1>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                  Informe seu e-mail e enviaremos um link para redefinir sua senha.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400"
                  >
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      {...register("email")}
                      aria-invalid={!!errors.email}
                      className={`h-12 w-full rounded-xl border bg-white pl-10 pr-5 text-base text-[#0f172a] outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#895af6]/15 lg:h-11 ${
                        errors.email
                          ? "border-red-400 focus:border-red-400"
                          : "border-slate-200 hover:border-slate-300 focus:border-[#895af6]"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                      {errors.email.message}
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
                      Enviando...
                    </span>
                  ) : (
                    "Enviar link"
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                <Link
                  to="/auth/login"
                  className="font-semibold text-[#895af6] transition-opacity hover:opacity-75"
                >
                  Voltar para o login
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
