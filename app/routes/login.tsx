import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { AppLogoMark } from "~/components/ui/app-logo-mark";
import { AppLoadingSplash } from "~/components/ui/app-loading-splash";
import { toast } from "~/components/ui/toast";
import { signIn } from "~/modules/auth/service";
import { loginSchema, type LoginForm } from "~/modules/auth/schemas/login";
import { AuthVisualPanel } from "~/modules/auth/components/auth-visual-panel";
import { useAuth } from "~/hooks/use-auth";

const EMAIL_NOT_CONFIRMED_PT =
  "Confirme seu e-mail antes de entrar. Abra o link que enviamos na caixa de entrada (e na pasta de spam) e depois tente de novo.";

function getFriendlyLoginError(rawMessage?: string | null): string {
  if (!rawMessage?.trim()) return "Não foi possível entrar. Tente novamente.";
  const lower = rawMessage.toLowerCase();
  if (
    lower.includes("email not confirmed") ||
    lower.includes("email_not_confirmed")
  ) {
    return EMAIL_NOT_CONFIRMED_PT;
  }
  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid_credentials") ||
    lower.includes("wrong password") ||
    lower.includes("incorrect password")
  ) {
    return "E-mail ou senha incorretos. Verifique seus dados e tente novamente.";
  }
  if (lower.includes("user not found") || lower.includes("email not found")) {
    return "Nenhuma conta encontrada com este e-mail. Cadastre-se ou verifique o endereço.";
  }
  if (lower.includes("too many requests") || lower.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }
  return rawMessage;
}

export default function AuthLoginRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (loading) return <AppLoadingSplash />;
  if (user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(data: LoginForm) {
    setIsPending(true);
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast.error(getFriendlyLoginError(error.message || error.code));
        return;
      }
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? getFriendlyLoginError(err.message)
          : "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      {/* Left: Visual panel (desktop only) */}
      <AuthVisualPanel variant="login" />

      {/* Right: Form */}
      <section className="flex min-h-screen w-full flex-col items-center justify-start bg-white px-6 pt-8 pb-6 lg:h-screen lg:w-2/5 lg:justify-center lg:overflow-y-auto lg:px-12 lg:py-0">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="mb-4 flex flex-col items-center lg:hidden">
            <AppLogoMark preset="md" />
            <span className="mt-2 text-lg font-black tracking-tight text-[#0f172a]">
              UGC Local
            </span>
          </div>

          {/* Heading */}
          <div className="mb-5 text-center">
            <h1 className="text-[28px] font-black tracking-tight text-[#0f172a] lg:text-[32px]">
              Bem-vindo de volta
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              Acesse sua conta para gerenciar campanhas e conteúdos.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors" />
                <input
                  id="login-email"
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

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-400"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Sua senha"
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
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 pl-1 text-xs font-medium text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-[#895af6]"
                />
                Lembrar de mim
              </label>
              <Link
                to="/auth/esqueci-senha"
                className="text-sm font-semibold text-[#895af6] transition-opacity hover:opacity-75"
              >
                Esqueci a senha
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded-xl bg-[#895af6] text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(137,90,246,0.35)] transition-all hover:bg-[#7c4aed] hover:shadow-[0_12px_24px_-4px_rgba(137,90,246,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-slate-500">
            Não tem uma conta?{" "}
            <Link
              to="/cadastro"
              className="font-bold text-[#895af6] transition-opacity hover:opacity-75"
            >
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
