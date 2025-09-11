import { TemasConcurso } from '@/types/simulado'

export const TEMAS_CONCURSO: TemasConcurso[] = [
  {
    id: 'direito-publico',
    nome: 'Direito Público',
    descricao: 'Concursos focados em Direito Constitucional, Administrativo e áreas públicas',
    disciplinas: [
      'Direito Constitucional',
      'Direito Administrativo',
      'Direito Tributário',
      'Direito Penal',
      'Direito Processual Penal',
      'Português',
      'Raciocínio Lógico'
    ],
    icone: '⚖️'
  },
  {
    id: 'direito-privado',
    nome: 'Direito Privado',
    descricao: 'Advocacia, concursos jurídicos com foco em direito privado',
    disciplinas: [
      'Direito Civil',
      'Direito Empresarial',
      'Direito do Trabalho',
      'Direito do Consumidor',
      'Direito Processual Civil',
      'Português',
      'Ética Profissional'
    ],
    icone: '📋'
  },
  {
    id: 'area-fiscal',
    nome: 'Área Fiscal',
    descricao: 'Receita Federal, Estadual, ICMS, ISS e outros órgãos fiscais',
    disciplinas: [
      'Direito Tributário',
      'Direito Constitucional',
      'Direito Administrativo',
      'Contabilidade Geral',
      'Matemática Financeira',
      'Português',
      'Raciocínio Lógico',
      'Economia'
    ],
    icone: '💰'
  },
  {
    id: 'area-policial',
    nome: 'Área Policial',
    descricao: 'Polícia Civil, Militar, Federal, PRF e órgãos de segurança',
    disciplinas: [
      'Direito Penal',
      'Direito Processual Penal',
      'Direito Constitucional',
      'Direito Administrativo',
      'Criminologia',
      'Português',
      'Raciocínio Lógico',
      'Informática'
    ],
    icone: '👮'
  },
  {
    id: 'ministerio-publico',
    nome: 'Ministério Público',
    descricao: 'Promotor, Procurador e cargos do Ministério Público',
    disciplinas: [
      'Direito Constitucional',
      'Direito Penal',
      'Direito Processual Penal',
      'Direito Civil',
      'Direito Processual Civil',
      'Direito Administrativo',
      'Direitos Humanos',
      'Português'
    ],
    icone: '🏛️'
  },
  {
    id: 'magistratura',
    nome: 'Magistratura',
    descricao: 'Juiz Estadual, Federal, do Trabalho e Tribunais',
    disciplinas: [
      'Direito Civil',
      'Direito Processual Civil',
      'Direito Penal',
      'Direito Processual Penal',
      'Direito Constitucional',
      'Direito Administrativo',
      'Direito do Trabalho',
      'Direito Empresarial'
    ],
    icone: '⚖️'
  },
  {
    id: 'tribunais',
    nome: 'Tribunais (Técnico/Analista)',
    descricao: 'STF, STJ, TST, TRT, TRF e outros tribunais',
    disciplinas: [
      'Direito Constitucional',
      'Direito Administrativo',
      'Direito Civil',
      'Direito Processual Civil',
      'Português',
      'Raciocínio Lógico',
      'Informática',
      'Administração Pública'
    ],
    icone: '🏢'
  },
  {
    id: 'area-bancaria',
    nome: 'Área Bancária',
    descricao: 'Banco do Brasil, Caixa, Banrisul e instituições financeiras',
    disciplinas: [
      'Matemática Financeira',
      'Conhecimentos Bancários',
      'Português',
      'Raciocínio Lógico',
      'Informática',
      'Ética',
      'Economia',
      'Direito Administrativo'
    ],
    icone: '🏦'
  },
  {
    id: 'area-administrativa',
    nome: 'Área Administrativa',
    descricao: 'Técnico e Analista Administrativo em diversos órgãos',
    disciplinas: [
      'Direito Administrativo',
      'Direito Constitucional',
      'Administração Geral',
      'Administração Pública',
      'Português',
      'Raciocínio Lógico',
      'Informática',
      'Matemática'
    ],
    icone: '📊'
  },
  {
    id: 'area-educacao',
    nome: 'Área da Educação',
    descricao: 'Professor, Pedagogo e cargos educacionais',
    disciplinas: [
      'Pedagogia',
      'Didática',
      'Psicologia da Educação',
      'Legislação Educacional',
      'Português',
      'Matemática',
      'História',
      'Geografia'
    ],
    icone: '📚'
  },
  {
    id: 'area-saude',
    nome: 'Área da Saúde',
    descricao: 'Enfermeiro, Técnico em Saúde e cargos hospitalares',
    disciplinas: [
      'Enfermagem',
      'Anatomia',
      'Farmacologia',
      'Saúde Pública',
      'Português',
      'Raciocínio Lógico',
      'Informática',
      'Ética Profissional'
    ],
    icone: '🏥'
  },
  {
    id: 'concursos-militares',
    nome: 'Concursos Militares',
    descricao: 'ESA, EsPCEx, EEAR, Colégio Naval e Academia Militar',
    disciplinas: [
      'Matemática',
      'Português',
      'Física',
      'Química',
      'História do Brasil',
      'Geografia do Brasil',
      'Inglês',
      'Redação'
    ],
    icone: '🎖️'
  }
]

export function obterTemaPorId(id: string): TemasConcurso | undefined {
  return TEMAS_CONCURSO.find(tema => tema.id === id)
}

export function obterDisciplinasPorTema(temaId: string): string[] {
  const tema = obterTemaPorId(temaId)
  return tema ? tema.disciplinas : []
}
