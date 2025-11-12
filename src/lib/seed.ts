import { Discipline, Template } from '@/types';

export const disciplines: Discipline[] = [
  {
    id: '1',
    name: 'Direito Constitucional',
    board: 'CESPE/CEBRASPE',
    level: 'Intermediário',
    durationMin: 120,
    tags: ['Direitos Fundamentais', 'Organização do Estado', 'Poder Constituinte', 'Controle de Constitucionalidade'],
    description: 'Estudo completo da Constituição Federal de 1988 com foco em princípios, direitos fundamentais e organização dos poderes. Aborda desde teoria constitucional até aplicação prática em concursos públicos.',
    materials: {
      videos: 0,
      pdfs: 25,
      exercises: 47,
      simulados: 15,
      resumos: 12
    },
    prerequisites: ['Introdução ao Direito', 'Teoria Geral do Estado']
  },
  {
    id: '2',
    name: 'Direito Administrativo',
    board: 'FCC',
    level: 'Avançado',
    durationMin: 100,
    tags: ['Atos Administrativos', 'Licitações', 'Servidores Públicos', 'Responsabilidade Civil', 'Poderes Administrativos'],
    description: 'Princípios da administração pública, atos administrativos, licitações, contratos e responsabilidade civil do Estado. Disciplina essencial para concursos da área administrativa.',
    materials: {
      videos: 0,
      pdfs: 30,
      exercises: 38,
      simulados: 12,
      resumos: 15
    },
    prerequisites: ['Direito Constitucional', 'Introdução ao Direito']
  },
  {
    id: '3',
    name: 'Direito Penal',
    board: 'FGV',
    level: 'Avançado',
    durationMin: 130,
    tags: ['Parte Geral', 'Crimes em Espécie', 'Execução Penal', 'Legislação Especial'],
    description: 'Teoria geral do crime, penas e medidas de segurança, crimes em espécie e lei de execução penal. Abordagem completa do Código Penal e legislação especial.',
    materials: {
      videos: 0,
      pdfs: 35,
      exercises: 52,
      simulados: 18,
      resumos: 20
    },
    prerequisites: ['Direito Constitucional', 'Introdução ao Direito']
  },
  {
    id: '4',
    name: 'Direito Civil',
    board: 'CESPE/CEBRASPE',
    level: 'Intermediário',
    durationMin: 140,
    tags: ['Parte Geral', 'Obrigações', 'Contratos', 'Direitos Reais', 'Responsabilidade Civil'],
    description: 'Código Civil brasileiro: parte geral, direito das obrigações, contratos, responsabilidade civil e direitos reais. Base fundamental para diversas áreas jurídicas.',
    materials: {
      videos: 0,
      pdfs: 40,
      exercises: 64,
      simulados: 20,
      resumos: 25
    },
    prerequisites: ['Direito Constitucional', 'Introdução ao Direito']
  },
  {
    id: '5',
    name: 'Direito Processual Civil',
    board: 'FCC',
    level: 'Avançado',
    durationMin: 110,
    tags: ['Processo de Conhecimento', 'Recursos', 'Execução', 'Tutelas Provisórias'],
    description: 'Novo Código de Processo Civil: processo de conhecimento, recursos, execução e cumprimento de sentença. Procedimentos especiais e tutelas de urgência.',
    materials: {
      videos: 0,
      pdfs: 35,
      exercises: 45,
      simulados: 16,
      resumos: 22
    },
    prerequisites: ['Direito Civil', 'Teoria Geral do Processo']
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
      videos: 0,
      pdfs: 28,
      exercises: 41,
      simulados: 14,
      resumos: 18
    },
    prerequisites: ['Direito Penal']
  },
  {
    id: '7',
    name: 'Direito Trabalhista',
    board: 'FGV',
    level: 'Intermediário',
    durationMin: 100,
    tags: ['CLT', 'Contrato de Trabalho', 'Direitos do Trabalhador', 'Jornada de Trabalho'],
    description: 'Consolidação das Leis do Trabalho: contrato de trabalho, direitos e deveres, jornada de trabalho e rescisão.',
    materials: {
      videos: 0,
      pdfs: 25,
      exercises: 35,
      simulados: 12,
      resumos: 16
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
      videos: 0,
      pdfs: 22,
      exercises: 28,
      simulados: 10,
      resumos: 14
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
      videos: 0,
      pdfs: 32,
      exercises: 53,
      simulados: 15,
      resumos: 19
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
      videos: 0,
      pdfs: 24,
      exercises: 32,
      simulados: 11,
      resumos: 13
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
      videos: 0,
      pdfs: 20,
      exercises: 29,
      simulados: 9,
      resumos: 12
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
      videos: 0,
      pdfs: 18,
      exercises: 24,
      simulados: 8,
      resumos: 11
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
    studyToReviewRatio: 0.7,
    simulationFrequency: 3
  },
  {
    id: 'equilibrio',
    name: 'Equilíbrio',
    description: 'Balanceamento entre estudo, revisão e descanso',
    weeklyHours: 35,
    studyToReviewRatio: 0.6,
    simulationFrequency: 7
  },
  {
    id: 'revisao',
    name: 'Revisão',
    description: 'Foco em revisão e fixação do conteúdo já estudado',
    weeklyHours: 25,
    studyToReviewRatio: 0.3,
    simulationFrequency: 5
  }
];

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Logs de progresso vazios - serão preenchidos com dados reais do usuário
export const mockProgressLogs: Array<{blockId: string; actualMinutes: number; completedAt: string}> = [];

export const defaultTimeSlots = [
  { start: '06:00', end: '07:00' },
  { start: '07:00', end: '08:00' },
  { start: '12:00', end: '13:00' },
  { start: '18:00', end: '19:00' },
  { start: '19:00', end: '20:00' },
  { start: '20:00', end: '21:00' },
  { start: '21:00', end: '22:00' }
];
