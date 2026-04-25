import { LEGAL_TERM_VERSIONS } from "./legal.constants";
import type { LegalDocument } from "./legal.types";

export const LEGAL_DOCUMENTS: Record<LegalDocument["slug"], LegalDocument> = {
  empresa: {
    slug: "empresa",
    termType: "COMPANY_SIGNUP",
    title: "Termos de Uso e Política de Privacidade",
    description:
      "Condições aplicáveis ao cadastro de empresas na UGC Local, incluindo regras de uso da plataforma, responsabilidades, privacidade e foro.",
    version: LEGAL_TERM_VERSIONS.COMPANY_SIGNUP,
    updatedAt: "25 de abril de 2026",
    path: "/termos/empresa",
    content: [
      {
        heading: "1. Aceite e vinculação",
        paragraphs: [
          "Ao realizar o cadastro na plataforma UGC LOCAL, a empresa declara, para todos os fins de direito, que leu, compreendeu e concorda integralmente com os presentes Termos de Uso e Política de Privacidade, obrigando-se ao seu fiel cumprimento.",
          "O cadastro e utilização da plataforma implicam aceitação expressa e inequívoca das disposições aqui estabelecidas.",
        ],
      },
      {
        heading: "2. Objeto e natureza da plataforma",
        paragraphs: [
          "A UGC LOCAL consiste em uma plataforma digital destinada à intermediação entre empresas e criadores de conteúdo independentes, podendo ainda atuar como facilitadora de pagamentos por meio de sistemas de intermediação financeira (split).",
          "A UGC LOCAL limita-se a fornecer ambiente tecnológico para conexão entre as partes e operacionalização do fluxo financeiro, não integrando a relação contratual estabelecida entre empresa e criador.",
        ],
      },
      {
        heading: "3. Ausência de vínculo",
        paragraphs: [
          "A utilização da plataforma não estabelece entre a UGC LOCAL e a empresa, tampouco entre a UGC LOCAL e os criadores, vínculo empregatício, relação de sociedade ou parceria, representação comercial ou exclusividade de qualquer natureza.",
        ],
      },
      {
        heading: "4. Cadastro e veracidade das informações",
        paragraphs: [
          "A empresa declara que todas as informações fornecidas são verdadeiras, completas e atualizadas, que possui capacidade legal para contratar e operar na plataforma e que manterá seus dados atualizados durante a utilização.",
          "A UGC LOCAL poderá, a qualquer tempo, solicitar informações adicionais ou comprovações, bem como suspender contas em caso de inconsistências.",
        ],
      },
      {
        heading: "5. Responsabilidades da empresa",
        paragraphs: [
          "A empresa é exclusivamente responsável pelo cumprimento da legislação aplicável, incluindo normas consumeristas, publicitárias e de proteção de dados, pelo conteúdo de campanhas, produtos e serviços divulgados, pela veracidade das informações transmitidas aos criadores e pela utilização adequada da plataforma.",
        ],
      },
      {
        heading: "6. Precificação",
        paragraphs: [
          "A empresa declara ciência de que os valores dos serviços são previamente definidos pela UGC LOCAL e que a contratação implica aceitação integral das condições econômicas estabelecidas.",
        ],
      },
      {
        heading: "7. Pagamentos e intermediação financeira",
        paragraphs: [
          "A UGC LOCAL poderá atuar como facilitadora de pagamentos por meio de sistema de intermediação financeira (split).",
          "A empresa declara ciência de que os pagamentos poderão ser processados por meio da plataforma, que a UGC LOCAL não atua como prestadora do serviço e que a responsabilidade pela execução do serviço permanece exclusiva das partes envolvidas.",
        ],
      },
      {
        heading: "8. Uso da plataforma",
        paragraphs: [
          "A empresa compromete-se a utilizar a plataforma de forma ética, legal e em conformidade com estes termos, abstendo-se de qualquer prática que possa prejudicar a UGC LOCAL, os criadores ou terceiros.",
        ],
      },
      {
        heading: "9. Limitação de responsabilidade",
        paragraphs: [
          "A UGC LOCAL não se responsabiliza, em nenhuma hipótese, por serviços prestados pelos criadores, qualidade, execução ou entrega dos serviços, resultados comerciais, financeiros ou de marketing, nem por danos diretos ou indiretos decorrentes da relação entre as partes.",
        ],
      },
      {
        heading: "10. Privacidade e tratamento de dados",
        paragraphs: [
          "A empresa autoriza a coleta, tratamento e armazenamento de seus dados para funcionamento da plataforma, conexão com criadores, comunicação e suporte.",
          "Os dados poderão ser compartilhados com terceiros quando necessário à execução dos serviços.",
        ],
      },
      {
        heading: "11. Condutas proibidas",
        paragraphs: [
          "É vedado à empresa fornecer informações falsas, manipular processos da plataforma, negociar ou realizar pagamentos fora do sistema, contatar criadores com o objetivo de evitar taxas, utilizar a plataforma para fins ilícitos, interferir no funcionamento do sistema, solicitar conteúdos ilegais, enganosos ou abusivos, violar direitos de terceiros, bem como praticar assédio, ameaça ou comportamento antiético.",
        ],
      },
      {
        heading: "12. Penalidades",
        paragraphs: [
          "O descumprimento destes termos poderá resultar, a critério da UGC LOCAL, em suspensão ou exclusão da conta, bloqueio de acesso, retenção de valores, quando aplicável, e adoção de medidas legais cabíveis.",
        ],
      },
      {
        heading: "13. Disponibilidade da plataforma",
        paragraphs: [
          "A UGC LOCAL não garante funcionamento contínuo e ininterrupto, podendo realizar manutenções, atualizações ou suspensões temporárias.",
        ],
      },
      {
        heading: "14. Alterações dos termos",
        paragraphs: [
          "A UGC LOCAL poderá alterar estes termos a qualquer momento, sendo responsabilidade da empresa consultá-los periodicamente.",
        ],
      },
      {
        heading: "15. Foro",
        paragraphs: [
          "Fica eleito o foro da comarca de Belo Horizonte/MG, com renúncia a qualquer outro, por mais privilegiado que seja.",
        ],
      },
    ],
  },
  creator: {
    slug: "creator",
    termType: "CREATOR_SIGNUP",
    title: "Termos de Uso e Política de Privacidade",
    description:
      "Condições aplicáveis ao cadastro de criadores na UGC Local, incluindo responsabilidades, pagamentos, privacidade, penalidades e foro.",
    version: LEGAL_TERM_VERSIONS.CREATOR_SIGNUP,
    updatedAt: "25 de abril de 2026",
    path: "/termos/creator",
    content: [
      {
        heading: "1. Aceite e vinculação",
        paragraphs: [
          "Ao realizar seu cadastro na plataforma UGC LOCAL, o criador declara, para todos os fins de direito, que leu, compreendeu e concorda integralmente com os presentes Termos de Uso e Política de Privacidade, obrigando-se ao seu integral cumprimento.",
        ],
      },
      {
        heading: "2. Objeto e natureza da plataforma",
        paragraphs: [
          "A UGC LOCAL consiste em plataforma digital destinada à intermediação entre criadores de conteúdo independentes e empresas, podendo atuar como facilitadora de pagamentos por meio de sistema de intermediação financeira (split).",
          "A UGC LOCAL não integra a relação contratual entre as partes, limitando-se à disponibilização de ambiente tecnológico para conexão e operacionalização financeira.",
        ],
      },
      {
        heading: "3. Ausência de vínculo",
        paragraphs: [
          "O criador reconhece que não há, em nenhuma hipótese, vínculo empregatício com a UGC LOCAL, relação de sociedade, parceria ou representação, nem garantia de demanda mínima ou recorrência de serviços.",
        ],
      },
      {
        heading: "4. Responsabilidades do criador",
        paragraphs: [
          "O criador é responsável pela veracidade das informações fornecidas, pela execução integral do serviço contratado, pela qualidade técnica, estética e criativa do conteúdo, pelo cumprimento dos prazos estabelecidos, pela observância do briefing fornecido pela empresa e pela conformidade com a legislação aplicável.",
        ],
      },
      {
        heading: "5. Precificação",
        paragraphs: [
          "O criador declara ciência de que os valores dos serviços são definidos pela UGC LOCAL, que não há negociação direta de valores com a empresa e que a aceitação de um serviço implica concordância integral com os valores e condições estabelecidos.",
        ],
      },
      {
        heading: "6. Pagamentos e intermediação financeira",
        paragraphs: [
          "Os pagamentos serão realizados por meio da plataforma, mediante sistema de intermediação financeira (split).",
          "O criador declara ciência de que o pagamento está condicionado à aprovação do serviço pela empresa, que o valor poderá permanecer retido até a conclusão do serviço e que a liberação ocorrerá em até 48 (quarenta e oito) horas após aprovação.",
          "Caso a empresa não se manifeste no prazo de até 48 (quarenta e oito) horas após a entrega, o serviço poderá ser considerado automaticamente aprovado, autorizando a liberação do pagamento.",
          "A UGC LOCAL atua exclusivamente como facilitadora operacional do pagamento.",
        ],
      },
      {
        heading: "7. Deslocamento e compensação",
        paragraphs: [
          "Nos casos em que o criador realizar deslocamento até o local indicado pela empresa e, por motivos atribuíveis à empresa, o serviço não puder ser executado, o criador fará jus ao recebimento do valor correspondente ao transporte previamente definido na plataforma.",
          "Tal valor possui natureza de compensação de deslocamento, não caracterizando multa.",
        ],
      },
      {
        heading: "8. Uso de imagem e direitos",
        paragraphs: [
          "O criador declara que possui plena autorização para uso de sua imagem, que é responsável por terceiros incluídos no conteúdo e que autoriza o uso do conteúdo pela empresa conforme acordado.",
          "A UGC LOCAL não participa da cessão de direitos e não se responsabiliza por eventual uso indevido.",
        ],
      },
      {
        heading: "9. Limitação de responsabilidade",
        paragraphs: [
          "A UGC LOCAL não se responsabiliza por inadimplemento da empresa, cancelamentos ou alterações, decisões comerciais ou criativas, nem por danos diretos ou indiretos decorrentes da relação entre as partes.",
        ],
      },
      {
        heading: "10. Privacidade e dados",
        paragraphs: [
          "O criador autoriza a coleta e tratamento de seus dados para funcionamento da plataforma, conexão com empresas e comunicação.",
        ],
      },
      {
        heading: "11. Cancelamento e penalidades",
        paragraphs: [
          "O criador poderá cancelar o serviço sem penalidade desde que o cancelamento ocorra com antecedência mínima de 48 (quarenta e oito) horas.",
          "Cancelamentos fora deste prazo poderão resultar nas seguintes penalidades: 1ª ocorrência: bloqueio temporário de 36 (trinta e seis) horas; 2ª ocorrência: bloqueio para análise manual, com prazo de até 7 (sete) dias úteis; 3ª ocorrência: bloqueio por tempo indeterminado, sujeito à análise, podendo resultar em exclusão definitiva da plataforma.",
          "A aplicação das penalidades será realizada a critério da UGC LOCAL, considerando as circunstâncias do caso.",
        ],
      },
      {
        heading: "12. Condutas proibidas",
        paragraphs: [
          "É vedado ao criador fornecer informações falsas, simular entregas ou aprovações, negociar ou receber valores fora da plataforma, descumprir prazos ou condições acordadas, produzir conteúdo ilegal, enganoso ou ofensivo e violar direitos de terceiros.",
        ],
      },
      {
        heading: "13. Penalidades",
        paragraphs: [
          "O descumprimento destes termos poderá resultar em suspensão ou exclusão da conta, retenção ou bloqueio de valores, cancelamento de serviços e medidas legais cabíveis.",
        ],
      },
      {
        heading: "14. Disponibilidade",
        paragraphs: [
          "A plataforma poderá apresentar indisponibilidades temporárias.",
        ],
      },
      {
        heading: "15. Alterações",
        paragraphs: [
          "A UGC LOCAL poderá alterar estes termos a qualquer momento.",
        ],
      },
      {
        heading: "16. Foro",
        paragraphs: [
          "Fica eleito o foro da comarca de Belo Horizonte/MG.",
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
        heading: "1. Declaração e aceite específico",
        paragraphs: [
          "Ao solicitar um serviço por meio da plataforma UGC LOCAL, a empresa declara, para todos os fins de direito, que leu e compreendeu integralmente as condições do serviço.",
          "A empresa declara também que forneceu briefing claro, completo, verídico e lícito e que aceita integralmente os valores e condições previamente definidos pela plataforma.",
          "A solicitação do serviço implica aceite vinculante destas condições.",
        ],
      },
      {
        heading: "2. Precificação e condições econômicas",
        paragraphs: [
          "A empresa reconhece que os valores dos serviços são previamente definidos pela UGC LOCAL.",
          "Não há negociação direta de valores com o criador, e a contratação implica aceitação integral do valor apresentado.",
        ],
      },
      {
        heading: "3. Pagamento e intermediação financeira",
        paragraphs: [
          "A empresa declara ciência de que o pagamento será realizado no ato da contratação, por meio da plataforma.",
          "Os valores serão processados via sistema de intermediação financeira (split).",
          "Os valores poderão permanecer retidos até a conclusão do serviço, conforme o fluxo operacional da plataforma.",
          "A UGC LOCAL atua como facilitadora operacional do fluxo financeiro, não assumindo responsabilidade pela execução do serviço.",
        ],
      },
      {
        heading: "4. Aprovação e liberação de valores",
        paragraphs: [
          "A empresa declara que deverá avaliar o serviço após sua entrega.",
          "A aprovação implicará liberação do pagamento ao criador.",
          "O pagamento será liberado em até 48 (quarenta e oito) horas após a aprovação.",
          "Caso a empresa não se manifeste no prazo de até 48 (quarenta e oito) horas após a entrega do conteúdo, o serviço poderá ser considerado automaticamente aprovado, autorizando a liberação do pagamento ao criador.",
        ],
      },
      {
        heading: "5. Relação entre as partes",
        paragraphs: [
          "A empresa reconhece que a contratação ocorre diretamente com o criador.",
          "A UGC LOCAL não integra a execução do serviço e não é responsável por obrigações decorrentes da prestação do serviço.",
        ],
      },
      {
        heading: "6. Deslocamento e compensação de transporte",
        paragraphs: [
          "Nos casos em que o criador de conteúdo se deslocar até o local indicado pela empresa e, por motivos atribuíveis à empresa, o serviço não puder ser realizado, será devido ao criador o valor correspondente ao transporte previamente definido na plataforma.",
          "Consideram-se motivos atribuíveis à empresa, dentre outros, indisponibilidade no local, cancelamento no momento da execução, impossibilidade de realização do serviço ou qualquer circunstância que impeça a execução após o comparecimento do criador.",
          "Tal valor possui natureza de compensação de deslocamento, não caracterizando multa.",
        ],
      },
      {
        heading: "7. Cancelamento",
        paragraphs: [
          "A empresa poderá cancelar o serviço sem penalidade desde que o cancelamento ocorra com antecedência mínima de 48 (quarenta e oito) horas do horário previsto para execução.",
          "Cancelamentos fora deste prazo poderão ser registrados pela plataforma para fins de controle operacional.",
          "Em caso de reincidência de cancelamentos, a UGC LOCAL poderá realizar bloqueio temporário da conta, submeter a conta à análise manual e aplicar medidas adicionais conforme avaliação interna.",
        ],
      },
      {
        heading: "8. Limitação de responsabilidade",
        paragraphs: [
          "A UGC LOCAL não se responsabiliza, em nenhuma hipótese, pela qualidade, adequação ou entrega do serviço.",
          "Também não se responsabiliza pelo cumprimento de prazos, pela adequação do conteúdo às expectativas da empresa, por resultados comerciais, financeiros ou de marketing, nem por danos diretos ou indiretos decorrentes da contratação.",
        ],
      },
      {
        heading: "9. Mediação e disputas",
        paragraphs: [
          "Em caso de divergência entre empresa e criador, a UGC LOCAL poderá, a seu exclusivo critério, analisar as informações disponíveis, mediar a comunicação entre as partes e decidir sobre a liberação ou retenção dos valores.",
          "Tal atuação não implica assunção de responsabilidade sobre o serviço.",
        ],
      },
      {
        heading: "10. Uso de conteúdo",
        paragraphs: [
          "A empresa é exclusivamente responsável por definir os direitos de uso do conteúdo com o criador e por respeitar direitos autorais, de imagem e propriedade intelectual.",
          "A UGC LOCAL não participa da negociação de direitos e não se responsabiliza por eventual uso indevido.",
        ],
      },
      {
        heading: "11. Confirmação",
        paragraphs: [
          "Ao prosseguir com a solicitação, a empresa confirma sua concordância integral com os presentes termos, reconhecendo suas responsabilidades e os limites de atuação da plataforma.",
        ],
      },
    ],
  },
};
