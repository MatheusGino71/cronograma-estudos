import { disciplines } from '@/lib/seed'

/**
 * Mapear disciplinas do simulado para disciplinas do sistema
 */
export function mapearDisciplinaSimulado(disciplinaSimulado: string): string {
  const mapeamento: Record<string, string> = {
    'Direito Constitucional': '1',
    'Direito Administrativo': '2', 
    'Direito Penal': '3',
    'Direito Processual Penal': '4',
    'Direito Civil': '5',
    'Direito Processual Civil': '6',
    'Direito Tributário': '7',
    'Direito do Trabalho': '8',
    'Direito Empresarial': '9',
    'Direito Previdenciário': '10'
  }

  return mapeamento[disciplinaSimulado] || disciplinaSimulado.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Obter nome da disciplina por ID
 */
export function obterNomeDisciplina(disciplinaId: string): string {
  const disciplina = disciplines.find(d => d.id === disciplinaId)
  return disciplina?.name || disciplinaId
}

/**
 * Calcular prioridade baseada no percentual de acertos
 */
export function calcularPrioridade(percentual: number): 'alta' | 'media' | 'baixa' {
  if (percentual < 30) return 'alta'
  if (percentual < 60) return 'media'
  return 'baixa'
}

/**
 * Calcular horas recomendadas por semana baseado na prioridade
 */
export function calcularHorasRecomendadas(prioridade: 'alta' | 'media' | 'baixa'): number {
  switch (prioridade) {
    case 'alta': return 6
    case 'media': return 4
    case 'baixa': return 2
  }
}

/**
 * Gerar tópicos de estudo baseados na disciplina e desempenho
 */
export function gerarTopicosEstudo(disciplina: string, percentual: number): string[] {
  const topicos: Record<string, string[]> = {
    'Direito Constitucional': [
      'Princípios Fundamentais',
      'Direitos e Garantias Fundamentais', 
      'Organização do Estado',
      'Poderes da República',
      'Defesa do Estado e Instituições',
      'Tributação e Orçamento'
    ],
    'Direito Administrativo': [
      'Atos Administrativos',
      'Licitações e Contratos',
      'Servidores Públicos',
      'Responsabilidade Civil do Estado',
      'Controle da Administração',
      'Serviços Públicos'
    ],
    'Direito Penal': [
      'Teoria Geral do Crime',
      'Crimes contra a Pessoa',
      'Crimes contra o Patrimônio',
      'Crimes contra a Administração Pública',
      'Lei de Drogas',
      'Crimes Hediondos'
    ],
    'Direito Processual Penal': [
      'Princípios Processuais',
      'Ação Penal',
      'Provas',
      'Prisões e Medidas Cautelares',
      'Recursos',
      'Júri'
    ],
    'Direito Civil': [
      'Parte Geral',
      'Obrigações',
      'Contratos',
      'Responsabilidade Civil',
      'Direitos Reais',
      'Família e Sucessões'
    ],
    'Direito Processual Civil': [
      'Princípios do CPC',
      'Processo de Conhecimento',
      'Recursos',
      'Execução',
      'Tutelas Provisórias',
      'Procedimentos Especiais'
    ],
    'Direito Tributário': [
      'Sistema Tributário Nacional',
      'Impostos Federais',
      'Impostos Estaduais',
      'Impostos Municipais',
      'Processo Administrativo Tributário',
      'Execução Fiscal'
    ],
    'Direito do Trabalho': [
      'Relação de Emprego',
      'Contratos de Trabalho',
      'Jornada de Trabalho',
      'Salário e Remuneração',
      'Estabilidade e FGTS',
      'Segurança do Trabalho'
    ],
    'Direito Empresarial': [
      'Teoria Geral do Direito Empresarial',
      'Sociedades',
      'Títulos de Crédito',
      'Contratos Empresariais',
      'Falência e Recuperação',
      'Propriedade Industrial'
    ],
    'Direito Previdenciário': [
      'Seguridade Social',
      'Regime Geral de Previdência',
      'Benefícios Previdenciários',
      'Custeio da Previdência',
      'Processo Administrativo Previdenciário',
      'Previdência do Servidor Público'
    ]
  }

  const topicosDisciplina = topicos[disciplina] || [
    'Revisão Geral',
    'Teoria',
    'Exercícios',
    'Jurisprudência',
    'Doutrina',
    'Legislação'
  ]
  
  // Se o percentual for muito baixo, focar em todos os tópicos fundamentais
  if (percentual < 30) {
    return topicosDisciplina.slice(0, 4)
  }
  
  // Se for médio, focar nos tópicos mais importantes
  if (percentual < 60) {
    return topicosDisciplina.slice(0, 2)
  }
  
  // Se for alto, apenas revisão pontual
  return topicosDisciplina.slice(0, 1)
}
