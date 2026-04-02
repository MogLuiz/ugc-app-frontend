import { Link } from "react-router";
import { AppLogoMark } from "~/components/ui/app-logo-mark";

export default function TermosRoute() {
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
          Termos e Condições
        </h1>

        <p className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
          Página provisória. Os termos completos serão disponibilizados em breve.
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-600">
          <section>
            <h2 className="mb-2 text-base font-bold text-slate-900">1. Aceitação dos Termos</h2>
            <p>
              Ao criar uma conta no UGC Local, você concorda com estes Termos e Condições.
              O conteúdo completo será publicado antes do lançamento oficial da plataforma.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-slate-900">2. Uso da Plataforma</h2>
            <p>
              A plataforma conecta criadores de conteúdo a empresas para a realização de
              campanhas de UGC (User Generated Content). O uso deve ser feito de forma
              ética e de acordo com as leis aplicáveis.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-bold text-slate-900">3. Contato</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato pelo suporte da plataforma.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
