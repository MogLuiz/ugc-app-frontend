import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Building2, ChevronLeft, Lock, Mail, User, Video } from "lucide-react";
import { toast } from "~/components/ui/toast";
import { signUp, setStoredRole } from "~/modules/auth/service";
import { useBootstrapMutation, useUpdateProfileMutation } from "~/modules/auth/mutations";
import type { UserRole } from "~/modules/auth/types";

const ASSET_LEFT_VISUAL =
  "https://www.figma.com/api/mcp/asset/2704f17a-e3bd-4784-9b30-3d7841a12d77";
const ASSET_LOGO_CONTAINER =
  "https://www.figma.com/api/mcp/asset/1cb61c4b-0340-4130-9bcd-ccd2f5960742";
const ASSET_AVATAR_1 =
  "https://www.figma.com/api/mcp/asset/009efe73-82f1-4cdc-913a-1a62c6b078ef";
const ASSET_AVATAR_2 =
  "https://www.figma.com/api/mcp/asset/61874088-d904-46a3-859c-e3ff7ff78257";
const ASSET_AVATAR_3 =
  "https://www.figma.com/api/mcp/asset/8142ad20-13a3-479d-bdd5-b5015b1f2e9a";

export default function AuthRegisterRoute() {
  const navigate = useNavigate();
  const bootstrapMutation = useBootstrapMutation();
  const updateProfileMutation = useUpdateProfileMutation();
  const [role, setRole] = useState<UserRole>("business");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const isSubmitting =
    bootstrapMutation.isPending || updateProfileMutation.isPending;

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    if (!acceptTerms) {
      toast.error("Aceite os Termos e Condições para continuar");
      return;
    }

    const form = event.currentTarget as HTMLFormElement;
    const name = (form.elements.namedItem("register-name") as HTMLInputElement)
      ?.value;
    const email = (form.elements.namedItem("register-email") as HTMLInputElement)
      ?.value;
    const password = (
      form.elements.namedItem("register-password") as HTMLInputElement
    )?.value;
    const confirmPassword = (
      form.elements.namedItem("register-confirm-password") as HTMLInputElement
    )?.value;

    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    try {
      const { data, error } = await signUp(email, password, { name, role });
      if (error) {
        const msg =
          error.message?.toLowerCase().includes("already registered") ||
          error.message?.toLowerCase().includes("already exists")
            ? "Este e-mail já está cadastrado. Faça login ou recupere sua senha."
            : error.message ?? "Erro ao criar conta. Tente novamente.";
        toast.error(msg);
        return;
      }

      if (data.session) {
        setStoredRole(role);
        await bootstrapMutation.mutateAsync({ role });
        if (name?.trim()) {
          await updateProfileMutation.mutateAsync({ data: { name: name.trim() } });
        }
        toast.success("Cadastro realizado com sucesso");
        navigate("/dashboard");
      } else {
        toast.success(
          "Conta criada! Verifique seu e-mail para ativar sua conta."
        );
        navigate("/auth/login");
      }
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Erro ao criar conta. Tente novamente."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f5f8]">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col lg:flex-row">
        {/* Left: Visual (desktop) - ordem invertida no mobile */}
        <aside className="relative hidden min-h-screen w-1/2 overflow-hidden lg:block">
          <img
            src={ASSET_LEFT_VISUAL}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-left"
          />
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "linear-gradient(122deg, rgba(137, 90, 246, 0.6) 0%, rgba(21, 16, 34, 0.8) 100%)",
            }}
          />
          <div className="relative flex h-full flex-col justify-between p-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                <img
                  src={ASSET_LOGO_CONTAINER}
                  alt=""
                  className="h-4 w-5 object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-[-0.03em] text-white">
                UGC Local
              </span>
            </div>

            <div className="max-w-[380px] space-y-4">
              <h2 className="text-[36px] font-black leading-[1.2] text-white">
                Conectando marcas a criadores locais.
              </h2>
              <p className="text-base leading-6 text-[#e2e8f0]">
                A maior plataforma de conteúdo gerado pelo usuário para
                empresas que buscam autenticidade e resultados reais.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <img
                  src={ASSET_AVATAR_1}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src={ASSET_AVATAR_2}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
                <img
                  src={ASSET_AVATAR_3}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
              </div>
              <span className="text-xs font-medium text-white">
                +2.000 criadores ativos hoje
              </span>
            </div>
          </div>
        </aside>

        {/* Right: Form */}
        <section className="flex w-full flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-4 py-6 lg:px-16 lg:py-8">
          <div className="flex w-full max-w-[448px] flex-col">
            {/* Mobile: Top nav (Figma 12:102) */}
            <div className="flex w-full items-center justify-between border-b border-[#e2e8f0] px-4 py-4 lg:hidden">
              <Link
                to="/auth/login"
                className="flex h-12 w-12 items-center justify-center text-[#0f172a]"
                aria-label="Voltar"
              >
                <ChevronLeft className="h-6 w-6" />
              </Link>
              <h1 className="flex-1 text-center text-lg font-bold tracking-[-0.27px] text-[#0f172a]">
                UGC Local
              </h1>
              <div className="w-12" />
            </div>

            <div className="flex-1 px-4 py-6 lg:px-0 lg:py-0">
              {/* Mobile: Header (Figma 12:108) | Desktop: título alternativo */}
              <div className="mb-6 lg:mb-4">
                <h2 className="text-center text-[32px] font-bold leading-10 text-[#0f172a] lg:text-left lg:text-[28px] lg:font-black lg:leading-tight lg:tracking-[-0.025em]">
                  <span className="lg:hidden">Bem-vindo!</span>
                  <span className="hidden lg:inline">Crie sua conta</span>
                </h2>
                <p className="mt-1.5 text-center text-base leading-6 text-[#475569] lg:mt-1 lg:text-left lg:text-sm lg:text-[#64748b]">
                  <span className="lg:hidden">Crie sua conta para começar</span>
                  <span className="hidden lg:inline">
                    Escolha como você deseja usar o UGC Local
                  </span>
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4 lg:space-y-3">
                {/* Role selection - Mobile: cards (Figma 12:116) | Desktop: pills */}
                <div>
                  <p className="mb-4 text-lg font-bold tracking-[-0.27px] text-[#0f172a] lg:sr-only lg:mb-0">
                    Eu sou:
                  </p>
                  <div className="grid grid-cols-2 gap-4 lg:flex lg:rounded-full lg:bg-[rgba(137,90,246,0.05)] lg:p-1">
                    <button
                      type="button"
                      onClick={() => setRole("business")}
                      className={`flex flex-col items-center justify-center gap-3 rounded-[48px] px-5 py-10 transition lg:h-11 lg:flex-1 lg:flex-row lg:gap-0 lg:py-0 ${
                        role === "business"
                          ? "border-2 border-[#895af6] bg-[rgba(137,90,246,0.1)] lg:border-0 lg:bg-white lg:shadow-sm"
                          : "border-2 border-transparent bg-[rgba(226,232,240,0.5)] lg:bg-transparent"
                      } ${role === "business" ? "text-[#895af6] lg:text-[#895af6]" : "text-[#0f172a] lg:text-[#64748b]"}`}
                    >
                      <Building2
                        className={`h-10 w-10 lg:hidden ${role === "business" ? "text-[#895af6]" : "text-[#94a3b8]"}`}
                      />
                      <span className="text-base font-bold lg:text-sm lg:font-semibold">
                        <span className="lg:hidden">Empresa</span>
                        <span className="hidden lg:inline">Sou uma Empresa</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("creator")}
                      className={`flex flex-col items-center justify-center gap-3 rounded-[48px] px-5 py-10 transition lg:h-11 lg:flex-1 lg:flex-row lg:gap-0 lg:py-0 ${
                        role === "creator"
                          ? "border-2 border-[#895af6] bg-[rgba(137,90,246,0.1)] lg:border-0 lg:bg-white lg:shadow-sm"
                          : "border-2 border-transparent bg-[rgba(226,232,240,0.5)] lg:bg-transparent"
                      } ${role === "creator" ? "text-[#895af6] lg:text-[#895af6]" : "text-[#0f172a] lg:text-[#64748b]"}`}
                    >
                      <Video
                        className={`h-10 w-10 lg:hidden ${role === "creator" ? "text-[#895af6]" : "text-[#94a3b8]"}`}
                      />
                      <span className="text-base font-bold lg:text-sm lg:font-semibold">
                        <span className="lg:hidden">Criador</span>
                        <span className="hidden lg:inline">Sou um Criador</span>
                      </span>
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4 lg:space-y-3">
                  <div>
                    <label
                      htmlFor="register-name"
                      className="mb-1 block pl-1 text-sm font-semibold text-[#334155]"
                    >
                      Nome completo
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
                        strokeWidth={2}
                      />
                      <input
                        id="register-name"
                        type="text"
                        placeholder="Como quer ser chamado?"
                        required
                        className="h-14 w-full rounded-[48px] border border-[#e2e8f0] bg-white pl-10 pr-5 text-base text-[#0f172a] outline-none placeholder:text-[#6b7280] focus:border-[#895af6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-email"
                      className="mb-1 block pl-1 text-sm font-semibold text-[#334155]"
                    >
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
                        strokeWidth={2}
                      />
                      <input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        className="h-14 w-full rounded-[48px] border border-[#e2e8f0] bg-white pl-10 pr-5 text-base text-[#0f172a] outline-none placeholder:text-[#6b7280] focus:border-[#895af6]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-password"
                      className="mb-1 block pl-1 text-sm font-semibold text-[#334155]"
                    >
                      Senha
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
                        strokeWidth={2}
                      />
                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        className="h-14 w-full rounded-[48px] border border-[#e2e8f0] bg-white pl-10 pr-12 text-base text-[#0f172a] outline-none placeholder:text-[#6b7280] focus:border-[#895af6]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] transition hover:text-[#64748b]"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 fill-none stroke-current stroke-2"
                        >
                          <path d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className="mb-1 block pl-1 text-sm font-semibold text-[#334155]"
                    >
                      Confirmar Senha
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]"
                        strokeWidth={2}
                      />
                      <input
                        id="register-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirme sua senha"
                        required
                        className="h-14 w-full rounded-[48px] border border-[#e2e8f0] bg-white pl-10 pr-12 text-base text-[#0f172a] outline-none placeholder:text-[#6b7280] focus:border-[#895af6]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9ca3af] transition hover:text-[#64748b]"
                        aria-label={
                          showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5 fill-none stroke-current stroke-2"
                        >
                          <path d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-start gap-3 py-1 lg:py-0">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 rounded-full border border-[rgba(137,90,246,0.2)] accent-[#895af6] lg:mt-0.5 lg:h-4"
                    />
                    <span className="text-sm leading-5 text-[#475569] lg:text-xs">
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-[48px] bg-[#895af6] text-base font-bold text-white shadow-[0_10px_15px_-3px_rgba(137,90,246,0.25),0_4px_6px_-4px_rgba(137,90,246,0.25)] transition hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Criando conta..." : "Criar conta"}
                  </button>
                </div>
              </form>

              <p className="mt-6 text-center text-sm leading-5 text-[#475569] lg:mt-4">
                Já possui conta?{" "}
                <Link
                  to="/auth/login"
                  className="font-bold text-[#895af6] hover:underline"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
