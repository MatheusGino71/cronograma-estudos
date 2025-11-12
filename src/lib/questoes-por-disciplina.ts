// Mapeamento de questões específicas por disciplina
// Baseado nas questões reais do arquivo questoes.csv

export interface QuestoesDisciplina {
  id: string
  disciplinaId: string
  nome: string
  quantidade: number
  totalQuestoes: number
  areasCobertas: string[]
  bancas: string[]
}

export const questoesPorDisciplina: QuestoesDisciplina[] = [
  { id: '1', disciplinaId: '1', nome: 'Direito Constitucional', quantidade: 47, totalQuestoes: 47, areasCobertas: ['Constitucional', 'Direitos Fundamentais', 'Organização do Estado', 'Controle de Constitucionalidade', 'Poder Constituinte'], bancas: ['CESPE/CEBRASPE', 'FCC', 'FGV', 'VUNESP'] },
  { id: '2', disciplinaId: '2', nome: 'Direito Administrativo', quantidade: 38, totalQuestoes: 38, areasCobertas: ['Administrativo', 'Atos Administrativos', 'Licitações', 'Servidores Públicos', 'Poderes Administrativos'], bancas: ['FCC', 'CESPE/CEBRASPE', 'FGV'] },
  { id: '3', disciplinaId: '3', nome: 'Direito Penal', quantidade: 52, totalQuestoes: 52, areasCobertas: ['Penal', 'Parte Geral', 'Crimes em Espécie', 'Execução Penal', 'Legislação Especial'], bancas: ['FGV', 'CESPE/CEBRASPE', 'VUNESP'] },
  { id: '4', disciplinaId: '4', nome: 'Direito Civil', quantidade: 64, totalQuestoes: 64, areasCobertas: ['Civil', 'Parte Geral', 'Obrigações', 'Contratos', 'Direitos Reais', 'Responsabilidade Civil'], bancas: ['CESPE/CEBRASPE', 'FCC', 'FGV'] },
  { id: '5', disciplinaId: '5', nome: 'Direito Processual Civil', quantidade: 45, totalQuestoes: 45, areasCobertas: ['Processo Civil', 'Processo de Conhecimento', 'Recursos', 'Execução', 'Tutelas Provisórias'], bancas: ['FCC', 'CESPE/CEBRASPE', 'VUNESP'] },
  { id: '6', disciplinaId: '6', nome: 'Direito Processual Penal', quantidade: 41, totalQuestoes: 41, areasCobertas: ['Processo Penal', 'Inquérito Policial', 'Ação Penal', 'Provas', 'Recursos'], bancas: ['VUNESP', 'FGV', 'CESPE/CEBRASPE'] },
  { id: '7', disciplinaId: '7', nome: 'Direito Trabalhista', quantidade: 35, totalQuestoes: 35, areasCobertas: ['Trabalho', 'CLT', 'Contrato de Trabalho', 'Direitos do Trabalhador', 'Jornada de Trabalho'], bancas: ['FGV', 'FCC', 'CESPE/CEBRASPE'] },
  { id: '8', disciplinaId: '8', nome: 'Direito Processual do Trabalho', quantidade: 28, totalQuestoes: 28, areasCobertas: ['Processo Trabalhista', 'Reclamação Trabalhista', 'Audiência', 'Recursos Trabalhistas'], bancas: ['CESPE/CEBRASPE', 'FGV'] },
  { id: '9', disciplinaId: '9', nome: 'Direito Tributário', quantidade: 53, totalQuestoes: 53, areasCobertas: ['Tributário', 'CTN', 'Tributos', 'Processo Administrativo Fiscal', 'ICMS', 'ISS'], bancas: ['FCC', 'CESPE/CEBRASPE', 'FGV'] },
  { id: '10', disciplinaId: '10', nome: 'Direito Empresarial', quantidade: 32, totalQuestoes: 32, areasCobertas: ['Empresarial', 'Empresa', 'Sociedades', 'Títulos de Crédito', 'Falência'], bancas: ['VUNESP', 'FCC', 'FGV'] },
  { id: '11', disciplinaId: '11', nome: 'Direito Previdenciário', quantidade: 29, totalQuestoes: 29, areasCobertas: ['Previdenciário', 'INSS', 'Benefícios', 'Segurados', 'Custeio'], bancas: ['FGV', 'CESPE/CEBRASPE'] },
  { id: '12', disciplinaId: '12', nome: 'Direito Ambiental', quantidade: 24, totalQuestoes: 24, areasCobertas: ['Ambiental', 'Meio Ambiente', 'Licenciamento', 'Crimes Ambientais', 'Responsabilidade Ambiental'], bancas: ['CESPE/CEBRASPE', 'FCC'] }
]

// Função para obter o número de questões disponíveis para uma disciplina
export function getQuestoesCount(disciplinaId: string): number {
  const disciplina = questoesPorDisciplina.find(d => d.disciplinaId === disciplinaId)
  return disciplina?.totalQuestoes || 0
}

// Função para obter informações completas sobre questões de uma disciplina
export function getQuestoesInfo(disciplinaId: string): QuestoesDisciplina | null {
  return questoesPorDisciplina.find(d => d.disciplinaId === disciplinaId) || null
}

// Total de questões disponíveis no sistema
export const TOTAL_QUESTOES = questoesPorDisciplina.reduce((acc, d) => acc + d.totalQuestoes, 0)
