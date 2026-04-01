import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppLogoMark } from "~/components/ui/app-logo-mark";
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

/** Deep link: ?role=company | business | creator */
function parseRoleFromSearch(roleParam: string | null): UserRole | null {
  if (!roleParam?.trim()) return null;
  const v = roleParam.trim().toLowerCase();
  if (v === "company" || v === "business") return "business";
  if (v === "creator") return "creator";
  return null;
}

const ROLE_OPTIONS: {
  value: UserRole;
  title: string;
  Icon: LucideIcon;
}[] = [
  { value: "business", title: "Sou empresa", Icon: Building2 },
  { value: "creator", title: "Sou criador", Icon: Video },
];

/** Única microcopy dinâmica abaixo dos cards (após seleção) */
const ROLE_SELECTED_COPY: Record<UserRole, string> = {
  business: "Contrate criadores para o seu negócio",
  creator: "Receba oportunidades e monetize seu conteúdo",
};

const roleCardBase =
  "relative flex w-full min-h-0 items-center gap-3 rounded-2xl border-2 px-3.5 py-2.5 text-left transition-all outline-none sm:flex-1 sm:gap-3 sm:px-4 sm:py-3";
const roleCardIdle =
  "border-slate-300 bg-white text-[#0f172a] shadow-sm hover:border-slate-400 hover:bg-slate-50/90 active:scale-[0.99] active:bg-slate-100/70";
const roleCardSelected =
  "border-[#895af6] bg-[#f3edff] text-[#0f172a] shadow-[0_8px_20px_-6px_rgba(137,90,246,0.38)] ring-2 ring-[#895af6]/35";
const roleCardFocus =
  "focus-visible:ring-2 focus-visible:ring-[#895af6] focus-visible:ring-offset-2";

export default function AuthRegisterRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCodeFromUrl = searchParams.get("ref")?.trim() || undefined;
  const bootstrapMutation = useBootstrapMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  const [role, setRole] = useState<UserRole | null>(() =>
    parseRoleFromSearch(searchParams.get("role")),
  );

  useEffect(() => {
    const parsed = parseRoleFromSearch(searchParams.get("role"));
    if (parsed !== null) setRole(parsed);
  }, [searchParams]);
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
    if (!role) return;
    try {
      const { data: signUpData, error } = await signUp(
        data.email,
        data.password,
        { name: data.name, role, referralCode: referralCodeFromUrl },
      );
      if (error) {
        toast.error(getFriendlyRegisterError(error.message));
        return;
      }

      if (signUpData.user?.identities?.length === 0) {
        toast.error("Este e-mail já está cadastrado. Faça login ou recupere sua senha.");
        return;
      }

      if (signUpData.session) {
        setStoredRole(role);
        await bootstrapMutation.mutateAsync({ role, referralCode: referralCodeFromUrl });
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
        navigate("/login");
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? getFriendlyRegisterError(err.message)
          : "Erro ao criar conta. Tente novamente.",
      );
    }
  }

  const inputBase =
    "h-12 w-full rounded-xl border bg-white pl-10 pr-5 text-base text-[#0f172a] outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-[#895af6]/15 lg:h-11";
  const inputOk =
    "border-slate-200 hover:border-slate-300 focus:border-[#895af6]";
  const inputErr = "border-red-400 focus:border-red-400";

  const ctaDisabled = isSubmitting || !role;

  return (
    <div className="min-h-screen lg:flex lg:h-screen lg:overflow-hidden">
      <AuthVisualPanel variant="register" />

      <section className="flex min-h-screen w-full flex-col bg-white lg:h-screen lg:w-2/5 lg:overflow-y-auto">
        <div className="flex items-center bg-white px-4 py-3 lg:hidden mt-4">
          <Link
            to="/login"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
            aria-label="Voltar"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex flex-1 items-center justify-center gap-2">
            <AppLogoMark preset="sm" />
            <span className="text-base font-black tracking-tight text-[#0f172a]">
              UGC Local
            </span>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex flex-1 items-start justify-center px-6 pt-4 pb-8 lg:items-center lg:px-10 lg:py-3 lg:pb-5">
          <div className="w-full max-w-[400px]">
            <div className="mb-8 text-center lg:mb-5">
              <h1 className="text-2xl font-black tracking-tight text-[#0f172a]">
                Crie sua conta
              </h1>
              <p className="mt-2 text-sm font-medium leading-snug text-slate-600">
                Escolha como deseja usar a plataforma
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="flex flex-col"
            >
              <fieldset className="min-w-0 border-0 p-0">
                <legend className="sr-only">
                  Passo 1: escolha seu perfil na plataforma
                </legend>
                <p className="mb-4 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#895af6]">
                  Passo 1 · Escolha seu perfil
                </p>
                <div
                  className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch sm:gap-3"
                  role="radiogroup"
                  aria-label="Tipo de conta"
                >
                  {ROLE_OPTIONS.map(({ value: r, title, Icon }) => {
                    const selected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setRole(r)}
                        className={`cursor-pointer ${roleCardBase} ${
                          selected ? roleCardSelected : roleCardIdle
                        } ${roleCardFocus} ${selected ? "pr-11 sm:pr-12" : ""}`}
                      >
                        {selected && (
                          <span
                            className="pointer-events-none absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center sm:right-2.5"
                            aria-hidden
                          >
                            <CheckCircle2
                              className="h-6 w-6 text-[#895af6]"
                              strokeWidth={2}
                            />
                          </span>
                        )}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${
                            selected
                              ? "bg-[#e4d7ff] text-[#6d28d9]"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <Icon
                            className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
                            strokeWidth={2}
                          />
                        </div>
                        <span className="min-w-0 flex-1 text-left text-sm font-bold leading-tight tracking-tight text-[#0f172a] sm:text-[15px]">
                          {title}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {!role && (
                  <p className="mt-4 text-center text-xs leading-relaxed text-slate-500">
                    Selecione uma opção acima para liberar o cadastro
                  </p>
                )}
                {role && (
                  <p
                    className="mt-4 text-center text-xs font-medium text-[#895af6] lg:mt-3"
                    aria-live="polite"
                  >
                    {ROLE_SELECTED_COPY[role]}
                  </p>
                )}
              </fieldset>

              <div className="mt-10 border-t border-slate-200 pt-10 lg:mt-6 lg:pt-6">
                <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400 lg:mb-3">
                  Passo 2 · Seus dados
                </p>
                <div className="flex flex-col gap-5 lg:gap-3">
                  <div>
                    <label
                      htmlFor="register-name"
                      className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-400"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-600"
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
                </div>
              </div>

              <div className="mt-10 lg:mt-6">
                <label className="flex cursor-pointer items-start gap-3 rounded-lg px-0.5 py-1.5 -mx-0.5 -my-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#895af6]/30 has-[:focus-visible]:ring-offset-2">
                  <input
                    type="checkbox"
                    {...register("acceptTerms")}
                    className="mt-[0.35rem] h-[18px] w-[18px] shrink-0 cursor-pointer rounded border-slate-300 accent-[#895af6]"
                  />
                  <span className="min-w-0 flex-1 text-xs leading-snug text-slate-600">
                    Eu aceito os{" "}
                    <button
                      type="button"
                      className="cursor-pointer py-0.5 font-semibold text-[#895af6] hover:underline"
                    >
                      Termos e Condições
                    </button>{" "}
                    e a{" "}
                    <button
                      type="button"
                      className="cursor-pointer py-0.5 font-semibold text-[#895af6] hover:underline"
                    >
                      Política de Privacidade
                    </button>
                    <span className="text-slate-500"> do UGC Local.</span>
                  </span>
                </label>
                {errors.acceptTerms && (
                  <p className="mt-2 pl-8 text-xs font-medium text-red-500">
                    {errors.acceptTerms.message}
                  </p>
                )}
              </div>

              <div className="mt-10 lg:mt-6">
                <button
                  type="submit"
                  disabled={ctaDisabled}
                  className="h-12 w-full cursor-pointer rounded-xl bg-[#895af6] text-sm font-bold text-white shadow-[0_8px_20px_-4px_rgba(137,90,246,0.35)] transition-all hover:bg-[#7c4aed] hover:shadow-[0_12px_24px_-4px_rgba(137,90,246,0.4)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#895af6] disabled:hover:shadow-[0_8px_20px_-4px_rgba(137,90,246,0.35)]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Criando conta...
                    </span>
                  ) : !role ? (
                    "Escolha seu perfil para continuar"
                  ) : role === "business" ? (
                    "Criar conta como Empresa"
                  ) : (
                    "Criar conta como Criador"
                  )}
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 lg:mt-4">
              Já possui conta?{" "}
              <Link
                to="/login"
                className="cursor-pointer font-bold text-[#895af6] transition-opacity hover:opacity-75"
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
