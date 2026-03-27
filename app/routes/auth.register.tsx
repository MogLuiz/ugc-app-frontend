import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import {
  ChevronLeft,
  Lock,
  Mail,
  Rocket,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "~/components/ui/toast";
import { signUp, setStoredRole } from "~/modules/auth/service";
import {
  useBootstrapMutation,
  useUpdateProfileMutation,
} from "~/modules/auth/mutations";
import {
  registerSchema,
  type RegisterForm,
} from "~/modules/auth/schemas/register";
import type { UserRole } from "~/modules/auth/types";
import { AuthVisualPanel } from "~/modules/auth/components/auth-visual-panel";

function getFriendlyRegisterError(rawMessage?: string | null): string {
  if (!rawMessage?.trim()) return "Erro ao criar conta. Tente novamente.";
  const lower = rawMessage.toLowerCase();
  if (
    lower.includes("already registered") ||
    lower.includes("already exists")
  ) {
    return "Este e-mail já está cadastrado. Faça login ou recupere sua senha.";
  }
  if (lower.includes("too many requests") || lower.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }
  return rawMessage;
}

const ROLE_MICROCOPY: Record<UserRole, string> = {
  creator: "Receba oportunidades de gravação perto de você",
  business: "Encontre criadores locais para suas campanhas",
};

export default function AuthRegisterRoute() {
  const navigate = useNavigate();
  const bootstrapMutation = useBootstrapMutation();
  const updateProfileMutation = useUpdateProfileMutation();
  const [role, setRole] = useState<UserRole>("business");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isSubmitting =
    bootstrapMutation.isPending || updateProfileMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  async function onSubmit(data: RegisterForm) {
    try {
      const { data: signUpData, error } = await signUp(
        data.email,
        data.password,
        { name: data.name, role },
      );
      if (error) {
        toast.error(getFriendlyRegisterError(error.message));
        return;
      }

      if (signUpData.session) {
        setStoredRole(role);
        await bootstrapMutation.mutateAsync({ role });
        if (data.name?.trim()) {
          await updateProfileMutation.mutateAsync({
            data: { name: data.name.trim() },
          });
        }
        toast.success("Cadastro realizado com sucesso");
        navigate("/dashboard");
      } else {
        toast.success(
          "Conta criada! Verifique seu e-mail para ativar sua conta.",
        );
        navigate("/auth/login");
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? getFriendlyRegisterError(err.message)
          : "Erro ao criar conta. Tente novamente.",
      );
    }
  }

  // Shared input class — compact height for desktop to avoid scroll
  const inputBase =
    "h-12 w-full rounded-xl border bg-white pl-10 pr-5 text-sm text-[#0f172a] outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#895af6]/15 lg:h-11";
  const inputOk =
    "border-slate-200 hover:border-slate-300 focus:border-[#895af6]";
  const inputErr = "border-red-400 focus:border-red-400";

  return (
    <div className="min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      {/* Left: Visual panel (desktop only) */}
      <AuthVisualPanel variant="register" />

      {/* Right: Form */}
      <section className="flex min-h-screen w-full flex-col bg-white lg:h-screen lg:w-2/5 lg:overflow-y-auto">
        {/* Mobile nav */}
        <div className="flex items-center bg-white px-4 py-3 lg:hidden mt-4">
          <Link
            to="/auth/login"
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-1 items-center justify-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#895af6]">
              <Rocket className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-black tracking-tight text-[#0f172a]">
              UGC Local
            </span>
          </div>
          <div className="w-10" />
        </div>

        {/* Form area */}
        <div className="flex flex-1 items-start justify-center px-6 pt-4 pb-6 lg:items-center lg:px-10 lg:py-4">
          <div className="w-full max-w-[400px]">
            {/* Heading */}
            <div className="mb-5">
              <h1 className="text-2xl font-black tracking-tight text-[#0f172a]">
                Crie sua conta
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Escolha como você deseja usar o UGC Local
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4 lg:space-y-3"
            >
              {/* Role selector */}
              <div className="lg:mb-0 mb-1">
                <div className="flex rounded-full bg-[#f1f0f3] p-1">
                  {(["business", "creator"] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex flex-1 items-center justify-center rounded-full py-2 text-sm font-bold transition-all ${
                        role === r
                          ? "bg-white text-[#895af6] shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {r === "business" ? "Sou uma Empresa" : "Sou um Criador"}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 pl-1 text-xs font-medium text-[#895af6]">
                  {ROLE_MICROCOPY[role]}
                </p>
              </div>

              {/* Name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mt-7 mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400"
                >
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Como quer ser chamado?"
                    {...register("name")}
                    aria-invalid={!!errors.name}
                    className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 pl-1 text-xs font-medium text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 pl-1 text-xs font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Mínimo 8 caracteres"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    className={`${inputBase} pr-10 ${errors.password ? inputErr : inputOk}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 pl-1 text-xs font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400"
                >
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Confirme sua senha"
                    {...register("confirmPassword")}
                    aria-invalid={!!errors.confirmPassword}
                    className={`${inputBase} pr-10 ${errors.confirmPassword ? inputErr : inputOk}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={
                      showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 pl-1 text-xs font-medium text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="pt-1 lg:pt-0">
                <label className="flex cursor-pointer items-start gap-2.5">
                  <input
                    type="checkbox"
                    {...register("acceptTerms")}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-[#895af6]"
                  />
                  <span className="text-xs leading-relaxed text-slate-500">
                    Eu aceito os{" "}
                    <button
                      type="button"
                      className="font-semibold text-[#895af6] hover:underline"
                    >
                      Termos e Condições
                    </button>{" "}
                    e a{" "}
                    <button
                      type="button"
                      className="font-semibold text-[#895af6] hover:underline"
                    >
                      Política de Privacidade
                    </button>{" "}
                    do UGC Local.
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-1 pl-6 text-xs font-medium text-red-500">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[#895af6] text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(137,90,246,0.35)] transition-all hover:bg-[#7c4aed] hover:shadow-[0_12px_24px_-4px_rgba(137,90,246,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Criando conta...
                  </span>
                ) : (
                  "Criar conta grátis"
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-4 text-center text-sm text-slate-500">
              Já possui conta?{" "}
              <Link
                to="/auth/login"
                className="font-bold text-[#895af6] transition-opacity hover:opacity-75"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
