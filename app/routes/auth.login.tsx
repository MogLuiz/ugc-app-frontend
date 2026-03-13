import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "~/components/ui/toast";

const ASSET_LOGO_ICON =
  "https://www.figma.com/api/mcp/asset/ae5bd879-fa0c-42e9-b9a6-2bf79ffd38c5";
const ASSET_HERO_BG =
  "https://www.figma.com/api/mcp/asset/0c00b7c1-e488-41c7-9a2b-84aa67be278d";
const ASSET_AVATAR_1 =
  "https://www.figma.com/api/mcp/asset/6b632e9f-42ea-4062-ba5a-a7e62d5f68ce";
const ASSET_AVATAR_2 =
  "https://www.figma.com/api/mcp/asset/0cb7256d-7062-4372-9f58-1cac02741cbf";
const ASSET_AVATAR_3 =
  "https://www.figma.com/api/mcp/asset/88ad6e44-10a9-4d12-bfe1-156998c47e8e";
const ASSET_GOOGLE_DESKTOP =
  "https://www.figma.com/api/mcp/asset/f12bfb6e-5e06-4d14-9dc5-86101e923899";
const ASSET_APPLE_DESKTOP =
  "https://www.figma.com/api/mcp/asset/9ff18a80-4e6f-469f-8a38-6891aa5a73f6";
const ASSET_GOOGLE_MOBILE =
  "https://www.figma.com/api/mcp/asset/1876d882-212d-4634-af84-3781aa16bf77";
const ASSET_APPLE_MOBILE =
  "https://www.figma.com/api/mcp/asset/78bf9190-b564-483a-98f0-4b87eda0802b";

export default function AuthLoginRoute() {
  const navigate = useNavigate();
  const [role, setRole] = useState("business");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    toast.success("Login simulado com sucesso");
    navigate(role === "business" ? "/empresa" : "/criadora");
  }

  return (
    <div className="min-h-screen bg-[#f6f5f8]">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col lg:flex-row">
        <section className="flex w-full justify-center px-4 pb-8 pt-4 sm:px-6 lg:min-h-screen lg:w-1/2 lg:px-32 lg:py-12">
          <div className="w-full max-w-[448px] lg:max-w-[384px]">
            <div className="pt-4 lg:pt-0">
              <h1 className="text-center text-[24px] font-bold leading-[1.25] text-[#7c56f3] lg:hidden">
                UGC Local
              </h1>
              <div className="hidden items-center gap-3 lg:flex">
                <img src={ASSET_LOGO_ICON} alt="" className="h-8 w-8" />
                <span className="text-[36px] font-bold tracking-[-0.03em] text-[#0f172a]">
                  UGC Local
                </span>
              </div>
            </div>

            <div className="mt-6 text-center lg:mt-8 lg:text-left">
              <h2 className="text-[28px] font-bold leading-[1.25] tracking-[-0.02em] text-[#0f172a] lg:text-[30px]">
                Bem-vindo de volta
                <span className="lg:hidden">!</span>
              </h2>
              <p className="mt-1.5 text-sm leading-5 text-[#64748b] lg:max-w-[340px] lg:text-base lg:leading-6">
                <span className="lg:hidden">
                  Acesse sua conta para continuar
                </span>
                <span className="hidden lg:inline">
                  Acesse sua conta para gerenciar campanhas e conteúdos.
                </span>
              </p>
            </div>

            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-4 lg:mt-10 lg:space-y-5"
            >
              <div className="flex rounded-full bg-[rgba(137,90,246,0.1)] p-1">
                <button
                  type="button"
                  onClick={() => setRole("business")}
                  className={`h-11 flex-1 rounded-full text-sm font-semibold transition ${
                    role === "business"
                      ? "bg-white text-[#895af6] shadow-sm"
                      : "text-[#64748b]"
                  }`}
                >
                  Empresa
                </button>
                <button
                  type="button"
                  onClick={() => setRole("creator")}
                  className={`h-11 flex-1 rounded-full text-sm font-semibold transition ${
                    role === "creator"
                      ? "bg-white text-[#895af6] shadow-sm"
                      : "text-[#64748b] lg:text-[#0f172a]"
                  }`}
                >
                  Criador
                </button>
              </div>

              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block pl-1 text-sm font-semibold text-[#334155] lg:font-medium"
                >
                  E-mail
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  required
                  className="h-14 w-full rounded-[48px] border border-[#e2e8f0] bg-white px-5 text-base text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#895af6]"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block pl-1 text-sm font-semibold text-[#334155] lg:font-medium"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    required
                    className="h-14 w-full rounded-[48px] border border-[#e2e8f0] bg-white px-5 pr-14 text-base text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#895af6]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition hover:text-[#64748b]"
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6 fill-none stroke-current stroke-2"
                    >
                      <path d="M2.25 12S5.25 6.75 12 6.75 21.75 12 21.75 12 18.75 17.25 12 17.25 2.25 12 2.25 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1 py-1 text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-[#475569] lg:text-[#334155]">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded-full border border-[#cbd5e1] accent-[#895af6]"
                  />
                  Lembrar de mim
                </label>
                <button type="button" className="font-semibold text-[#895af6]">
                  Esqueci a senha
                </button>
              </div>

              <button
                type="submit"
                className="h-14 w-full rounded-[48px] bg-[#895af6] text-base font-bold text-white shadow-[0_10px_15px_-3px_rgba(137,90,246,0.2),0_4px_6px_-4px_rgba(137,90,246,0.2)] transition hover:brightness-105"
              >
                Entrar
              </button>
            </form>

            <p className="pb-4 pt-4 text-center text-base leading-5 text-[#475569] lg:pb-0 lg:pt-6 lg:text-sm lg:leading-5">
              Não tem uma conta?
              <button
                type="button"
                className="ml-1 font-bold text-[#895af6] lg:font-semibold"
              >
                Cadastre-se grátis
              </button>
            </p>
          </div>
        </section>

        <aside className="relative hidden min-h-screen w-1/2 overflow-hidden lg:block">
          <img
            src={ASSET_HERO_BG}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(137,90,246,0.6)] to-transparent mix-blend-multiply" />

          <div className="absolute bottom-16 left-16 max-w-[448px] text-white">
            <div className="inline-flex items-center rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 text-xs font-bold uppercase tracking-[0.05em] backdrop-blur-[6px]">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#4ade80]" />
              Novas vagas abertas
            </div>

            <h3 className="mt-4 text-[50px] font-black leading-[1.25]">
              Crie conteúdo autêntico que converte.
            </h3>

            <p className="mt-4 text-[26px] leading-[1.5] text-[rgba(255,255,255,0.9)]">
              A maior rede de criadores UGC do Brasil espera por você.
              Conecte-se com marcas globais e locais.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img
                  src={ASSET_AVATAR_1}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-[0_0_0_2px_white]"
                />
                <img
                  src={ASSET_AVATAR_2}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-[0_0_0_2px_white]"
                />
                <img
                  src={ASSET_AVATAR_3}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-[0_0_0_2px_white]"
                />
              </div>
              <span className="text-sm font-medium text-[rgba(255,255,255,0.8)]">
                +5.000 criadores ativos
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
