import { LEGAL_TERM_VERSIONS } from "./legal.constants";
import type { LegalDocument } from "./legal.types";

export const LEGAL_DOCUMENTS: Record<LegalDocument["slug"], LegalDocument> = {
  empresa: {
    slug: "empresa",
    termType: "COMPANY_SIGNUP",
    title: "Termos de Uso para Empresa",
    description:
      "Condições gerais para empresas que criam conta e utilizam a UGC Local para encontrar creators, gerenciar demandas e contratar serviços.",
    version: LEGAL_TERM_VERSIONS.COMPANY_SIGNUP,
    updatedAt: "25 de abril de 2026",
    path: "/termos/empresa",
    content: [
      {
        heading: "1. Objeto",
        paragraphs: [
          "Estes Termos de Uso disciplinam o acesso e o uso da plataforma UGC Local por empresas interessadas em contratar creators para produção de conteúdo.",
          "Ao criar uma conta como empresa, o usuário declara que leu e concorda com as condições descritas neste documento.",
        ],
      },
      {
        heading: "2. Cadastro e responsabilidade da conta",
        paragraphs: [
          "A empresa é responsável por fornecer informações verdadeiras, atualizadas e completas durante o cadastro e ao longo do uso da plataforma.",
          "O titular da conta responde pela confidencialidade das credenciais de acesso e por toda atividade realizada em seu ambiente.",
        ],
      },
      {
        heading: "3. Uso adequado da plataforma",
        paragraphs: [
          "A UGC Local deve ser utilizada exclusivamente para fins legítimos de prospecção, relacionamento e contratação de creators.",
          "É vedado o uso da plataforma para práticas ilícitas, discriminatórias, enganosas ou que violem direitos de terceiros.",
        ],
      },
      {
        heading: "4. Regras de contratação e pagamentos",
        paragraphs: [
          "As condições comerciais de cada contratação podem variar conforme o serviço, a disponibilidade do creator e as regras operacionais vigentes na plataforma.",
          "A empresa reconhece que pagamentos, aprovações e eventuais disputas seguirão os fluxos disponibilizados pela UGC Local.",
        ],
      },
      {
        heading: "5. Disposições finais",
        paragraphs: [
          "A UGC Local poderá atualizar estes Termos periodicamente. A versão vigente será sempre identificada nesta página pública.",
          "O uso continuado da plataforma após atualizações relevantes poderá exigir novo aceite, conforme a natureza da alteração.",
        ],
      },
    ],
  },
  creator: {
    slug: "creator",
    termType: "CREATOR_SIGNUP",
    title: "Termos de Uso para Creator",
    description:
      "Condições gerais para creators que se cadastram na UGC Local para receber oportunidades, participar de campanhas e prestar serviços para empresas.",
    version: LEGAL_TERM_VERSIONS.CREATOR_SIGNUP,
    updatedAt: "25 de abril de 2026",
    path: "/termos/creator",
    content: [
      {
        heading: "1. Objeto",
        paragraphs: [
          "Estes Termos de Uso regulam a criação e o uso de conta por creators dentro da plataforma UGC Local.",
          "Ao seguir com o cadastro, o creator declara estar ciente das regras operacionais da plataforma e das responsabilidades associadas ao seu perfil.",
        ],
      },
      {
        heading: "2. Perfil e informações fornecidas",
        paragraphs: [
          "O creator deve manter seu perfil com informações verdadeiras, portfólio compatível com sua atuação e dados de contato atualizados.",
          "A precisão dessas informações é essencial para elegibilidade em oportunidades e para o relacionamento com empresas contratantes.",
        ],
      },
      {
        heading: "3. Conduta e entregas",
        paragraphs: [
          "O creator se compromete a atuar com boa-fé, profissionalismo e respeito às condições acordadas em cada oportunidade ou contratação.",
          "O envio de materiais, mensagens e propostas dentro da plataforma deve observar padrões mínimos de qualidade, urbanidade e legalidade.",
        ],
      },
      {
        heading: "4. Contratações e remuneração",
        paragraphs: [
          "Os valores, prazos e regras de pagamento dependem do tipo de contratação firmada com cada empresa e dos fluxos operacionais disponíveis na plataforma.",
          "A participação em uma oportunidade não garante contratação automática nem exclusividade, salvo previsão expressa no fluxo aplicável.",
        ],
      },
      {
        heading: "5. Disposições finais",
        paragraphs: [
          "A UGC Local poderá revisar estes Termos sempre que necessário para refletir mudanças de produto, operação ou exigências legais.",
          "Sempre que houver nova versão aplicável ao cadastro, o creator poderá ser solicitado a registrar novo aceite.",
        ],
      },
    ],
  },
  contratacao: {
    slug: "contratacao",
    termType: "COMPANY_HIRING",
    title: "Termos de Contratação",
    description:
      "Condições aplicáveis às empresas no momento de contratar creators pela UGC Local, incluindo regras operacionais, pagamento e execução do serviço.",
    version: LEGAL_TERM_VERSIONS.COMPANY_HIRING,
    updatedAt: "25 de abril de 2026",
    path: "/termos/contratacao",
    content: [
      {
        heading: "1. Aplicação",
        paragraphs: [
          "Estes Termos de Contratação se aplicam às empresas que utilizam a UGC Local para formalizar a contratação de creators.",
          "O aceite deste documento complementa os Termos de Uso da conta empresarial e vale para a versão vigente indicada nesta página.",
        ],
      },
      {
        heading: "2. Escopo da contratação",
        paragraphs: [
          "Antes de concluir uma contratação, a empresa deve revisar briefing, endereço, data, duração, valores e demais condições exibidas no fluxo.",
          "Ao confirmar, a empresa declara que as informações fornecidas são suficientes para a execução do serviço e refletem sua real intenção de contratação.",
        ],
      },
      {
        heading: "3. Pagamentos e aprovações",
        paragraphs: [
          "Os pagamentos e liberações financeiras observarão o fluxo operacional definido pela UGC Local para cada tipo de contratação.",
          "A empresa reconhece que aprovações, contestação de conclusão e demais eventos operacionais podem impactar a liberação final do pagamento.",
        ],
      },
      {
        heading: "4. Cancelamentos, conflitos e responsabilidades",
        paragraphs: [
          "Situações de cancelamento, indisponibilidade, conflito de agenda ou disputa devem seguir as regras e status previstos pela plataforma.",
          "A empresa é responsável por agir de boa-fé, fornecer contexto adequado e respeitar os compromissos assumidos ao gerar a contratação.",
        ],
      },
      {
        heading: "5. Vigência da versão",
        paragraphs: [
          "A UGC Local pode atualizar estes Termos de Contratação a qualquer momento, mantendo a versão vigente disponível em URL pública.",
          "Novas contratações podem exigir novo aceite sempre que a versão atual for alterada.",
        ],
      },
    ],
  },
};
