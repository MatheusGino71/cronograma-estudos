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
    id: '4',
    name: 'Direito Civil',
    board: 'CESPE/CEBRASPE',
    level: 'Intermediário',
    durationMin: 140,
    tags: ['Parte Geral', 'Obrigações', 'Contratos', 'Direitos Reais'],
    description: 'Código Civil brasileiro: parte geral, direito das obrigações, contratos, responsabilidade civil e direitos reais.',
    materials: {
      videos: 55,
      pdfs: 18,
      exercises: 180
    },
    prerequisites: ['Direito Constitucional']
  },
  {
    id: '5',
    name: 'Direito Processual Civil',
    board: 'FCC',
    level: 'Avançado',
    durationMin: 110,
    tags: ['Processo de Conhecimento', 'Recursos', 'Execução'],
    description: 'Novo Código de Processo Civil: processo de conhecimento, recursos, execução e cumprimento de sentença.',
    materials: {
      videos: 50,
      pdfs: 20,
      exercises: 170
    },
    prerequisites: ['Direito Civil']
  },
  {
    id: '6',
    name: 'Direito Processual Penal',
    board: 'VUNESP',
    level: 'Avançado',
    durationMin: 120,
    tags: ['Inquérito Policial', 'Ação Penal', 'Provas', 'Recursos'],
    description: 'Código de Processo Penal: inquérito policial, ação penal, teoria geral das provas e recursos criminais.',
    materials: {
      videos: 46,
      pdfs: 17,
      exercises: 155
    },
    prerequisites: ['Direito Penal']
  },
  {
    id: '7',
    name: 'Direito Trabalhista',
    board: 'FGV',
    level: 'Intermediário',
    durationMin: 100,
    tags: ['CLT', 'Contrato de Trabalho', 'Direitos do Trabalhador'],
    description: 'Consolidação das Leis do Trabalho: contrato de trabalho, direitos e deveres, jornada de trabalho e rescisão.',
    materials: {
      videos: 42,
      pdfs: 14,
      exercises: 140
    },
    prerequisites: ['Direito Constitucional']
  },
  {
    id: '8',
    name: 'Direito Processual do Trabalho',
    board: 'CESPE/CEBRASPE',
    level: 'Avançado',
    durationMin: 90,
    tags: ['Reclamação Trabalhista', 'Audiência', 'Recursos'],
    description: 'Processo trabalhista: reclamação trabalhista, audiência, instrução processual e recursos na Justiça do Trabalho.',
    materials: {
      videos: 38,
      pdfs: 13,
      exercises: 130
    },
    prerequisites: ['Direito Trabalhista']
  },
  {
    id: '9',
    name: 'Direito Tributário',
    board: 'FCC',
    level: 'Avançado',
    durationMin: 115,
    tags: ['CTN', 'Tributos', 'Processo Administrativo Fiscal'],
    description: 'Código Tributário Nacional: sistema tributário, tributos em espécie, processo administrativo fiscal e execução fiscal.',
    materials: {
      videos: 44,
      pdfs: 16,
      exercises: 165
    },
    prerequisites: ['Direito Administrativo']
  },
  {
    id: '10',
    name: 'Direito Empresarial',
    board: 'VUNESP',
    level: 'Intermediário',
    durationMin: 95,
    tags: ['Empresa', 'Sociedades', 'Títulos de Crédito'],
    description: 'Direito empresarial moderno: teoria da empresa, sociedades empresárias, títulos de crédito e falência.',
    materials: {
      videos: 40,
      pdfs: 15,
      exercises: 135
    },
    prerequisites: ['Direito Civil']
  },
  {
    id: '11',
    name: 'Direito Previdenciário',
    board: 'FGV',
    level: 'Intermediário',
    durationMin: 85,
    tags: ['INSS', 'Benefícios', 'Segurados'],
    description: 'Sistema previdenciário brasileiro: segurados, dependentes, benefícios previdenciários e custeio da previdência.',
    materials: {
      videos: 36,
      pdfs: 12,
      exercises: 125
    },
    prerequisites: ['Direito Constitucional']
  },
  {
    id: '12',
    name: 'Direito Ambiental',
    board: 'CESPE/CEBRASPE',
    level: 'Intermediário',
    durationMin: 80,
    tags: ['Meio Ambiente', 'Licenciamento', 'Responsabilidade'],
    description: 'Direito ambiental brasileiro: princípios, licenciamento ambiental, crimes ambientais e responsabilidade.',
    materials: {
      videos: 34,
      pdfs: 11,
      exercises: 115
    },
    prerequisites: ['Direito Administrativo']
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
