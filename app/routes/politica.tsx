import { Link } from "react-router";
import { AppLogoMark } from "~/components/ui/app-logo-mark";

export default function PoliticaRoute() {
  return (
    <div className="min-h-screen bg-white px-6 py-10 lg:px-0">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/cadastro"
            className="text-sm font-medium text-[#895af6] hover:underline"
          >
            ← Voltar
          </Link>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <AppLogoMark preset="sm" />
          <span className="text-base font-black tracking-tight text-[#0f172a]">
            UGC Local
          </span>
        </div>

        <h1 className="mb-3 text-3xl font-black tracking-tight text-[#0f172a]">
          Política de Privacidade
        </h1>

        <p className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Página provisória. A política completa será disponibilizada em breve.
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-600">
          <section>
            <h2 className="mb-2 text-base font-bold text-slate-900">1. Dados Coletados</h2>
            <p>
              Coletamos dados necessários para o funcionamento da plataforma, como nome,
              e-mail e informações de perfil. O detalhamento completo será publicado antes
              do lançamento oficial.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-slate-900">2. Uso dos Dados</h2>
            <p>
              Seus dados são utilizados exclusivamente para operação da plataforma,
              correspondência entre criadores e empresas, e melhoria dos nossos serviços.
              Não compartilhamos dados com terceiros sem seu consentimento.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-slate-900">3. Seus Direitos</h2>
            <p>
              Você pode solicitar a exclusão ou exportação dos seus dados a qualquer
              momento pelo suporte da plataforma.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
