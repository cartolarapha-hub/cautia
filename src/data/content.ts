// Todo o conteúdo factual vem da apresentação CAUTIA (19 slides). Nada comercial foi inventado.

export type Profile = 'usa' | 'desenvolve' | 'seguradora'
export type Need = 'avaliar' | 'analise' | 'conhecer'

export const PROFILES: { id: Profile; label: string; short: string; desc: string }[] = [
  { id: 'usa', label: 'Empresa que utiliza IA', short: 'Usa IA', desc: 'Compra ou integra ferramentas prontas de IA na operação.' },
  { id: 'desenvolve', label: 'Empresa que desenvolve IA', short: 'Desenvolve IA', desc: 'Constrói, integra modelos ou vende produtos de IA a clientes.' },
  { id: 'seguradora', label: 'Seguradora', short: 'Seguradora', desc: 'Avalia capacidade, subscrição e distribuição de risco de IA.' },
]

export const NEEDS: { id: Need; title: string; desc: string; deliverable: string }[] = [
  { id: 'avaliar', title: 'Avaliar riscos de IA', desc: 'Mapear onde a IA entra na operação e que riscos isso cria.', deliverable: 'Leitura técnica do risco de IA' },
  { id: 'analise', title: 'Solicitar análise de cobertura', desc: 'Raio-X das apólices atuais: exclusões e lacunas para o risco de IA.', deliverable: 'Raio-X das apólices + risco de IA' },
  { id: 'conhecer', title: 'Conhecer possibilidades de seguro', desc: 'Entender caminhos de estruturação e colocação para o seu perfil.', deliverable: 'Panorama de estruturação e colocação' },
]

export const CASES = [
  {
    id: 'tst', tag: 'Judiciário', source: 'Notícias do TST',
    headline: 'Empresa e advogado são condenados por possível uso de IA com citações falsas de jurisprudência',
    short: 'Citações falsas de IA',
    body: 'A 6ª Turma caracterizou litigância de má-fé. O erro da IA virou condenação para quem a usou sem checagem.',
    questions: ['Há revisão humana antes de a IA virar entrega ao cliente?', 'A apólice de RC Profissional cobre erro originado em IA?'],
  },
  {
    id: 'deloitte', tag: 'Consultoria', source: 'Citada na apresentação',
    headline: 'Deloitte devolve US$ 440 mil após usar IA em relatório',
    short: 'Relatório com erro de IA',
    body: 'O caso expõe um erro que muitas empresas ainda vão cometer: IA sem filtro humano é um risco.',
    questions: ['Que entregas a clientes passam por IA?', 'Existe documentação de como a IA é supervisionada?'],
  },
  {
    id: 'ford', tag: 'Indústria', source: 'StartSe',
    headline: 'A Ford apostou na IA para garantir qualidade. Teve que recontratar 350 engenheiros para corrigir o erro',
    short: 'IA em controle de qualidade',
    body: 'Quando a IA participa de decisões relevantes, o custo do erro deixa de ser teórico.',
    questions: ['A IA decide sozinha algo relevante para o negócio?', 'Qual o plano se o sistema errar em escala?'],
  },
  {
    id: 'advogados', tag: 'Mercado de seguros', source: 'O Fator',
    headline: 'Advogados buscam seguro contra erros profissionais na era da IA, diz corretora',
    short: 'Procura por proteção',
    body: 'Especialistas afirmam que a camada de proteção serve para resguardar defensores de eventuais erros não intencionais.',
    questions: ['Seu seguro atual menciona IA de forma expressa?', 'Quem fornece sua IA oferece alguma garantia?'],
  },
  {
    id: 'exclusoes', tag: 'Capacidade', source: 'Financial Times (nov/2025), via apresentação',
    headline: 'AIG, WR Berkley e Great American pediram exclusões de IA às apólices nos EUA',
    short: 'Exclusões nas apólices',
    body: 'Quem usa IA pode ficar sem cobertura e precisa de quem estruture a solução.',
    questions: ['Suas apólices têm cláusulas de exclusão para IA?', 'Há espaço para um endosso específico de IA?'],
  },
]

export const STEPS = [
  { n: 1, id: 'entrada', title: 'Entrada', line: 'Empresa que usa ou vende IA',
    what: 'A jornada começa com a empresa que usa ou vende IA. Nesta etapa a CAUTIA entende o perfil e o contexto de uso.',
    you: 'Conta como a IA aparece na sua operação ou no seu produto.', us: 'Define o caminho de análise adequado ao seu perfil.' },
  { n: 2, id: 'diagnostico', title: 'Diagnóstico', line: 'Raio-X das apólices + risco de IA',
    what: 'Leitura técnica do risco de IA somada ao raio-X das apólices que a empresa já possui.',
    you: 'Compartilha as apólices existentes e informações sobre a IA utilizada.', us: 'Identifica lacunas, exclusões e a documentação técnica que seguradoras exigem.' },
  { n: 3, id: 'estruturacao', title: 'Estruturação', line: 'Remove exclusões, cria endosso de IA',
    what: 'Com o diagnóstico, estrutura-se a proposta: remoção de exclusões e criação de um endosso de IA.',
    you: 'Valida o desenho do risco e a documentação.', us: 'Prepara a proposta técnica para apresentar às seguradoras.' },
  { n: 4, id: 'colocacao', title: 'Colocação', line: 'Seguradora local',
    what: 'A proposta é colocada junto a uma seguradora local. A CAUTIA não assume o risco: ela o coloca.',
    you: 'Acompanha as respostas e condições das seguradoras.', us: 'Negocia a colocação em seu nome.' },
  { n: 5, id: 'emissao', title: 'Emissão', line: 'Apólice emitida + comissão CAUTIA',
    what: 'A apólice é emitida. A receita da CAUTIA vem da comissão, e há renovação e monitoramento anual.',
    you: 'Recebe a apólice emitida.', us: 'Segue com renovação e monitoramento anual.' },
]

export const PERSONAS = {
  empresas: {
    title: 'Empresas que utilizam ou desenvolvem IA',
    persona: 'Marina', role: 'Fundadora de startup de IA (integra LLMs, vende B2B)',
    pains: ['Trava negócio com cliente grande por falta de seguro.', 'Não tem a documentação técnica que seguradora tradicional exige.'],
    promise: 'Diagnóstico técnico do risco de IA e endosso estruturado, para destravar a contratação.',
    profile: 'desenvolve' as Profile,
  },
  seguradoras: {
    title: 'Seguradoras',
    persona: 'A Seguradora', role: 'Capacidade e subscrição',
    pains: ['Exposição a riscos de IA não precificados nas carteiras atuais.', 'Falta de subscrição técnica especializada para avaliar sistemas de IA.', 'Baixa capacidade de distribuição e captação desse novo perfil de cliente.'],
    promise: 'Risco de IA lido tecnicamente e apresentado de forma estruturada, com distribuição de um novo perfil de cliente.',
    profile: 'seguradora' as Profile,
  },
}

export const MARKET = [
  { value: 415, prefix: 'R$ ', suffix: ' bi', label: 'Mercado segurador brasileiro (2025)', dec: 0 },
  { value: 1.5, prefix: '~R$ ', suffix: ' bi/ano', label: 'Cyber + RC Profissional', dec: 1 },
  { value: 71, prefix: '+', suffix: '%', label: 'Crescimento de Cyber em 2026', dec: 0 },
]

export const SETORES = ['Tecnologia / Software', 'Serviços jurídicos', 'Consultoria', 'Saúde', 'Financeiro', 'Indústria', 'Varejo', 'Educação', 'Seguros', 'Outro']
export const APLICACOES = ['Atendimento ao cliente', 'Textos e documentos', 'Análise de crédito ou risco', 'Desenvolvimento de software', 'Tratamento de dados pessoais', 'Operações internas']

// ---------- Preços e oferta (fonte: Plano Financeiro CAUTIA, aba "Notas CAUTIA") ----------
// Honorário de consultoria: dado do grupo. Comissão e prêmio: estimativas do plano, sem fonte primária.
export const HONORARIO = 35000
export const PREMIO_REF = 30000
export const brl = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export type Modalidade = 'projeto' | 'intermediacao'
export const MODALIDADES: { id: Modalidade; title: string; price: number; unit: string; desc: string; includes: string[] }[] = [
  { id: 'projeto', title: 'Projeto completo', price: HONORARIO, unit: 'por projeto',
    desc: 'Consultoria da CAUTIA do diagnóstico à emissão da apólice.',
    includes: ['Diagnóstico técnico do risco de IA', 'Raio-X das apólices que você já tem', 'Estruturação: remoção de exclusões e endosso de IA', 'Colocação em seguradora local', 'Emissão da apólice e monitoramento anual'] },
  { id: 'intermediacao', title: 'Somente intermediação', price: 0, unit: 'sem honorário',
    desc: 'Colocação e emissão da apólice. A CAUTIA é remunerada por comissão da seguradora.',
    includes: ['Colocação em seguradora local', 'Emissão da apólice', 'Renovação e monitoramento anual'] },
]

export const FAQ = [
  { q: 'Quanto custa o projeto da CAUTIA?', a: `O projeto de consultoria tem honorário de ${brl(HONORARIO)} por projeto. A intermediação da apólice não tem custo direto para você: a CAUTIA é remunerada por comissão paga pela seguradora, que já está embutida no prêmio.` },
  { q: 'E o preço do seguro em si?', a: `O prêmio é definido pela seguradora na etapa de colocação, conforme o seu risco. Para planejamento, usamos a referência de ${brl(PREMIO_REF)} por ano, que é uma premissa do nosso plano e não uma cotação.` },
  { q: 'Preciso contratar o projeto para ter a apólice?', a: 'Não. A consultoria é opcional. Você pode contratar somente a intermediação, sem honorário, e a CAUTIA recebe apenas a comissão da seguradora.' },
  { q: 'A CAUTIA assume o risco do meu seguro?', a: 'Não. A CAUTIA é uma corretora especializada: não assumimos o risco, nós o colocamos junto a uma seguradora.' },
  { q: 'O que é o endosso de IA?', a: 'É uma alteração na apólice que remove exclusões ligadas a IA e cria uma cobertura específica para o risco de IA. Criar esse endosso é parte da etapa de estruturação.' },
  { q: 'Esta página é uma contratação real?', a: 'Não. Este site é uma demonstração: nenhum pagamento é processado e nenhuma apólice é emitida. Os valores vêm das premissas do plano financeiro da CAUTIA.' },
]

// Promoção da fase de teste (definida pela CAUTIA): 35% de desconto no plano anual = Projeto completo (inclui monitoramento anual).
export const DESCONTO = 0.35
export const CUPOM = 'TESTE35'
export const precoFinal = (m: Modalidade, desconto: boolean) => {
  const base = MODALIDADES.find(x => x.id === m)!.price
  return desconto && base > 0 ? Math.round(base * (1 - DESCONTO)) : base
}
