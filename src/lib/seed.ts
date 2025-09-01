import { Discipline, Template } from '@/types';

export const disciplines: Discipline[] = [
  {
    id: '1',
    name: 'Direito Constitucional',
    board: 'CESPE/CEBRASPE',
    level: 'Intermediário',
    durationMin: 120,
    tags: ['Direitos Fundamentais', 'Organização do Estado', 'Poder Constituinte'],
    description: 'Estudo completo da Constituição Federal de 1988 com foco em princípios, direitos fundamentais e organização dos poderes.',
    materials: {
      videos: 45,
      pdfs: 12,
      exercises: 150
    },
    prerequisites: ['Introdução ao Direito']
  },
  {
    id: '2',
    name: 'Direito Administrativo',
    board: 'FCC',
    level: 'Avançado',
    durationMin: 100,
    tags: ['Atos Administrativos', 'Licitações', 'Servidores Públicos'],
    description: 'Princípios da administração pública, atos administrativos, licitações, contratos e responsabilidade civil do Estado.',
    materials: {
      videos: 38,
      pdfs: 15,
      exercises: 120
    },
    prerequisites: ['Direito Constitucional']
  },
  {
    id: '3',
    name: 'Português',
    board: 'FGV',
    level: 'Iniciante',
    durationMin: 80,
    tags: ['Gramática', 'Interpretação de Texto', 'Redação'],
    description: 'Gramática normativa, interpretação e compreensão textual, redação oficial e técnicas de escrita.',
    materials: {
      videos: 52,
      pdfs: 8,
      exercises: 200
    },
    prerequisites: []
  },
  {
    id: '4',
    name: 'Matemática e Raciocínio Lógico',
    board: 'VUNESP',
    level: 'Intermediário',
    durationMin: 150,
    tags: ['Álgebra', 'Geometria', 'Estatística', 'Lógica'],
    description: 'Matemática básica, álgebra, geometria, estatística descritiva e raciocínio lógico-matemático.',
    materials: {
      videos: 60,
      pdfs: 20,
      exercises: 300
    },
    prerequisites: []
  },
  {
    id: '5',
    name: 'Contabilidade Geral',
    board: 'FCC',
    level: 'Avançado',
    durationMin: 110,
    tags: ['Balanço Patrimonial', 'DRE', 'Análise de Demonstrações'],
    description: 'Princípios contábeis, elaboração e análise das demonstrações financeiras, contabilidade societária.',
    materials: {
      videos: 42,
      pdfs: 18,
      exercises: 180
    },
    prerequisites: ['Matemática e Raciocínio Lógico']
  },
  {
    id: '6',
    name: 'Informática',
    board: 'CESPE/CEBRASPE',
    level: 'Iniciante',
    durationMin: 60,
    tags: ['Windows', 'Microsoft Office', 'Internet', 'Segurança'],
    description: 'Sistema operacional Windows, pacote Microsoft Office, navegação na internet e segurança da informação.',
    materials: {
      videos: 35,
      pdfs: 10,
      exercises: 100
    },
    prerequisites: []
  },
  {
    id: '7',
    name: 'Direito Penal',
    board: 'FGV',
    level: 'Avançado',
    durationMin: 130,
    tags: ['Parte Geral', 'Crimes em Espécie', 'Execução Penal'],
    description: 'Teoria geral do crime, penas e medidas de segurança, crimes em espécie e lei de execução penal.',
    materials: {
      videos: 48,
      pdfs: 16,
      exercises: 160
    },
    prerequisites: ['Direito Constitucional']
  },
  {
    id: '8',
    name: 'Atualidades',
    board: 'VUNESP',
    level: 'Intermediário',
    durationMin: 40,
    tags: ['Política', 'Economia', 'Sociedade', 'Meio Ambiente'],
    description: 'Acontecimentos políticos, econômicos, sociais e ambientais do Brasil e do mundo nos últimos dois anos.',
    materials: {
      videos: 25,
      pdfs: 6,
      exercises: 80
    },
    prerequisites: []
  }
];

export const templates: Template[] = [
  {
    id: 'intensivo',
    name: 'Intensivo',
    description: 'Para quem tem pouco tempo e precisa de alta intensidade de estudos',
    weeklyHours: 50,
    studyToReviewRatio: 0.7, // 70% estudo, 30% revisão
    simulationFrequency: 3 // simulados a cada 3 dias
  },
  {
    id: 'equilibrio',
    name: 'Equilíbrio',
    description: 'Balanceamento entre estudo, revisão e descanso',
    weeklyHours: 35,
    studyToReviewRatio: 0.6, // 60% estudo, 40% revisão
    simulationFrequency: 7 // simulados semanais
  },
  {
    id: 'revisao',
    name: 'Revisão',
    description: 'Foco em revisão e fixação do conteúdo já estudado',
    weeklyHours: 25,
    studyToReviewRatio: 0.3, // 30% estudo, 70% revisão
    simulationFrequency: 5 // simulados a cada 5 dias
  }
];

// Função para gerar IDs únicos
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Dados mock para progresso
export const mockProgressLogs = [
  {
    blockId: '1',
    actualMinutes: 45,
    completedAt: '2025-08-29T19:45:00.000Z'
  },
  {
    blockId: '2',
    actualMinutes: 50,
    completedAt: '2025-08-28T20:50:00.000Z'
  },
  {
    blockId: '3',
    actualMinutes: 25,
    completedAt: '2025-08-27T19:25:00.000Z'
  }
];

// Horários padrão para geração de blocos
export const defaultTimeSlots = [
  { start: '06:00', end: '07:00' },
  { start: '07:00', end: '08:00' },
  { start: '12:00', end: '13:00' },
  { start: '18:00', end: '19:00' },
  { start: '19:00', end: '20:00' },
  { start: '20:00', end: '21:00' },
  { start: '21:00', end: '22:00' }
];
