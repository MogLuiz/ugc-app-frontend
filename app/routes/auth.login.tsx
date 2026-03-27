import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Lock, Mail, Rocket, Eye, EyeOff } from "lucide-react";
import { toast } from "~/components/ui/toast";
import { signIn, getStoredRole } from "~/modules/auth/service";
import { useBootstrapMutation } from "~/modules/auth/mutations";
import { loginSchema, type LoginForm } from "~/modules/auth/schemas/login";
import { AuthVisualPanel } from "~/modules/auth/components/auth-visual-panel";

function getFriendlyLoginError(rawMessage?: string | null): string {
  if (!rawMessage?.trim()) return "Não foi possível entrar. Tente novamente.";
  const lower = rawMessage.toLowerCase();
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
  const navigate = useNavigate();
  const bootstrapMutation = useBootstrapMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast.error(getFriendlyLoginError(error.message));
        return;
      }
      const role = getStoredRole() ?? "business";
      await bootstrapMutation.mutateAsync({ role });
      toast.success("Login realizado com sucesso");
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? getFriendlyLoginError(err.message)
          : "Erro ao fazer login. Tente novamente."
      );
    }
  }

  const isPending = bootstrapMutation.isPending;

  return (
    <div className="min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      {/* Left: Visual panel (desktop only) */}
      <AuthVisualPanel variant="login" />

      {/* Right: Form */}
      <section className="flex min-h-screen w-full flex-col items-center justify-center bg-white px-6 py-10 lg:h-screen lg:w-2/5 lg:overflow-y-auto lg:px-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#895af6]">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <span className="mt-2 text-lg font-black tracking-tight text-[#0f172a]">
              UGC Local
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
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
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  className={`h-14 w-full rounded-2xl border bg-white pl-11 pr-5 text-sm text-[#0f172a] outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#895af6]/15 ${
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
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  className={`h-14 w-full rounded-2xl border bg-white pl-11 pr-12 text-sm text-[#0f172a] outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#895af6]/15 ${
                    errors.password
                      ? "border-red-400 focus:border-red-400"
                      : "border-slate-200 hover:border-slate-300 focus:border-[#895af6]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
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
              <button
                type="button"
                className="text-sm font-semibold text-[#895af6] transition-opacity hover:opacity-75"
              >
                Esqueci a senha
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="h-14 w-full rounded-2xl bg-[#895af6] text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(137,90,246,0.35)] transition-all hover:bg-[#7c4aed] hover:shadow-[0_12px_24px_-4px_rgba(137,90,246,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
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
              to="/auth/register"
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
