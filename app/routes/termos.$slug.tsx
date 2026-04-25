import type { MetaFunction } from "react-router";
import { Link, useParams } from "react-router";
import { LegalDocumentPage } from "~/modules/legal/components/legal-document-page";
import { getLegalDocumentBySlug } from "~/modules/legal/legal-routes";

export const meta: MetaFunction = ({ params }) => {
  const document = getLegalDocumentBySlug(params.slug);

  if (!document) {
    return [
      { title: "Termo não encontrado | UGC Local" },
      {
        name: "description",
        content: "O documento legal solicitado não está disponível.",
      },
    ];
  }

  return [
    { title: `${document.title} | UGC Local` },
    { name: "description", content: document.description },
  ];
};

export default function LegalDocumentRoute() {
  const { slug } = useParams();
  const document = getLegalDocumentBySlug(slug);

  if (!document) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f8f7fb] px-4 text-center">
        <h1 className="text-xl font-black tracking-tight text-slate-900">
          Documento não encontrado
        </h1>
        <p className="max-w-md text-sm leading-6 text-slate-600">
          O termo solicitado não existe ou foi removido.
        </p>
        <Link
          to="/cadastro"
          className="rounded-full bg-[#895af6] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#7c4aed]"
        >
          Voltar para o cadastro
        </Link>
      </div>
    );
  }

  return <LegalDocumentPage document={document} />;
}
