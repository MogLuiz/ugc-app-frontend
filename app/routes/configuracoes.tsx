import { Link } from "react-router";
import { ArrowLeft, Settings } from "lucide-react";
import { AuthGuard } from "~/components/auth-guard";
import { AppSidebar } from "~/components/app-sidebar";
import { ChangePasswordSection } from "~/modules/auth/components/change-password-section";
import { useAuth } from "~/hooks/use-auth";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
      {children}
    </p>
  );
}

function ConfiguracoesScreen() {
  const { user } = useAuth();
  const variant = user?.role === "creator" ? "creator" : "business";

  return (
    <div className="min-h-screen bg-[#f6f5f8] lg:flex">
      <div className="hidden lg:block">
        <AppSidebar variant={variant} />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-[#f6f5f8] px-4 py-4 lg:hidden">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="size-5" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Configurações</h1>
          <div className="w-20" />
        </header>

        <main className="flex-1 px-4 py-6 lg:overflow-auto lg:p-8">
          <div className="mx-auto w-full max-w-3xl">

            {/* Desktop heading */}
            <div className="mb-8 hidden lg:flex lg:items-center lg:gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[#895af6]/10">
                <Settings className="size-5 text-[#895af6]" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-[#0f172a]">
                  Configurações
                </h1>
                <p className="text-sm text-slate-500">
                  Gerencie a segurança da sua conta.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              {/* Seção: Segurança */}
              <section>
                <SectionLabel>Segurança</SectionLabel>
                <ChangePasswordSection />
              </section>


            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default function ConfiguracoesRoute() {
  return (
    <AuthGuard>
      <ConfiguracoesScreen />
    </AuthGuard>
  );
}
