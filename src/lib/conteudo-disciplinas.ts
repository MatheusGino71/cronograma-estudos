// Conteúdo detalhado das disciplinas
export interface ConteudoTopico {
  id: string;
  titulo: string;
  subtopicos: string[];
  descricao: string;
  importancia: 'alta' | 'média' | 'baixa';
  tempoEstimado: number; // em minutos
}

export interface ConteudoDisciplina {
  disciplinaId: string;
  topicos: ConteudoTopico[];
}

export const conteudoDisciplinas: ConteudoDisciplina[] = [
  {
    disciplinaId: '1',
    topicos: [
      {
        id: 'const-01',
        titulo: 'Princípios Fundamentais',
        subtopicos: [
          'Fundamentos da República (art. 1º)',
          'Separação de Poderes (art. 2º)',
          'Objetivos Fundamentais (art. 3º)',
          'Princípios das Relações Internacionais (art. 4º)',
        ],
        descricao: 'Base da organização constitucional brasileira, incluindo fundamentos, objetivos e princípios que regem a República Federativa do Brasil.',
        importancia: 'alta',
        tempoEstimado: 120
      },
      {
        id: 'const-02',
        titulo: 'Direitos e Garantias Fundamentais',
        subtopicos: [
          'Direitos Individuais e Coletivos (art. 5º)',
          'Direitos Sociais (art. 6º ao 11)',
          'Nacionalidade (art. 12 e 13)',
          'Direitos Políticos (art. 14 a 16)',
          'Partidos Políticos (art. 17)',
        ],
        descricao: 'Conjunto de direitos e garantias assegurados pela Constituição, abrangendo direitos individuais, sociais, de nacionalidade e políticos.',
        importancia: 'alta',
        tempoEstimado: 180
      },
      {
        id: 'const-03',
        titulo: 'Organização do Estado',
        subtopicos: [
          'Organização Político-Administrativa',
          'União, Estados, Municípios e DF',
          'Intervenção Federal e Estadual',
          'Repartição de Competências',
        ],
        descricao: 'Estrutura federativa do Estado brasileiro, competências de cada ente e mecanismos de intervenção.',
        importancia: 'alta',
        tempoEstimado: 150
      },
      {
        id: 'const-04',
        titulo: 'Organização dos Poderes',
        subtopicos: [
          'Poder Legislativo',
          'Poder Executivo',
          'Poder Judiciário',
          'Funções Essenciais à Justiça',
        ],
        descricao: 'Organização e funcionamento dos três poderes da República e das funções essenciais à Justiça.',
        importancia: 'alta',
        tempoEstimado: 200
      },
      {
        id: 'const-05',
        titulo: 'Controle de Constitucionalidade',
        subtopicos: [
          'Controle Difuso',
          'Controle Concentrado',
          'ADI, ADC, ADPF e ADO',
          'Efeitos das Decisões',
        ],
        descricao: 'Mecanismos de controle da constitucionalidade das leis e atos normativos no ordenamento jurídico brasileiro.',
        importancia: 'alta',
        tempoEstimado: 140
      },
    ]
  },
  {
    disciplinaId: '2',
    topicos: [
      {
        id: 'adm-01',
        titulo: 'Princípios Administrativos',
        subtopicos: [
          'Legalidade, Impessoalidade, Moralidade',
          'Publicidade e Eficiência',
          'Supremacia do Interesse Público',
          'Indisponibilidade do Interesse Público',
        ],
        descricao: 'Princípios fundamentais que norteiam toda a atuação da Administração Pública.',
        importancia: 'alta',
        tempoEstimado: 90
      },
      {
        id: 'adm-02',
        titulo: 'Atos Administrativos',
        subtopicos: [
          'Conceito e Requisitos',
          'Atributos dos Atos',
          'Classificação',
          'Extinção e Invalidação',
          'Revogação e Anulação',
        ],
        descricao: 'Manifestações de vontade da Administração Pública, seus elementos, atributos e formas de extinção.',
        importancia: 'alta',
        tempoEstimado: 120
      },
      {
        id: 'adm-03',
        titulo: 'Poderes Administrativos',
        subtopicos: [
          'Poder Vinculado e Discricionário',
          'Poder Hierárquico',
          'Poder Disciplinar',
          'Poder Regulamentar',
          'Poder de Polícia',
        ],
        descricao: 'Prerrogativas conferidas à Administração para cumprimento de suas finalidades.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'adm-04',
        titulo: 'Licitações e Contratos',
        subtopicos: [
          'Lei 14.133/2021 (Nova Lei de Licitações)',
          'Modalidades de Licitação',
          'Dispensa e Inexigibilidade',
          'Contratos Administrativos',
          'Pregão Eletrônico',
        ],
        descricao: 'Procedimentos licitatórios e regime jurídico dos contratos administrativos.',
        importancia: 'alta',
        tempoEstimado: 160
      },
      {
        id: 'adm-05',
        titulo: 'Serviços Públicos',
        subtopicos: [
          'Conceito e Classificação',
          'Concessão e Permissão',
          'Autorização de Serviços',
          'Parcerias Público-Privadas',
        ],
        descricao: 'Regime jurídico da prestação de serviços públicos e formas de delegação.',
        importancia: 'média',
        tempoEstimado: 110
      },
      {
        id: 'adm-06',
        titulo: 'Responsabilidade Civil do Estado',
        subtopicos: [
          'Responsabilidade Objetiva',
          'Ação de Regresso',
          'Excludentes de Responsabilidade',
          'Danos Causados por Agentes Públicos',
        ],
        descricao: 'Responsabilização do Estado por atos de seus agentes e hipóteses de reparação.',
        importancia: 'alta',
        tempoEstimado: 90
      },
    ]
  },
  {
    disciplinaId: '3',
    topicos: [
      {
        id: 'penal-01',
        titulo: 'Aplicação da Lei Penal',
        subtopicos: [
          'Princípios Penais',
          'Lei Penal no Tempo',
          'Lei Penal no Espaço',
          'Conflito de Leis Penais',
        ],
        descricao: 'Regras de aplicação da lei penal, princípios fundamentais e resolução de conflitos normativos.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'penal-02',
        titulo: 'Teoria Geral do Crime',
        subtopicos: [
          'Fato Típico',
          'Ilicitude',
          'Culpabilidade',
          'Excludentes de Ilicitude',
          'Excludentes de Culpabilidade',
        ],
        descricao: 'Estrutura analítica do crime: tipicidade, antijuridicidade e culpabilidade.',
        importancia: 'alta',
        tempoEstimado: 150
      },
      {
        id: 'penal-03',
        titulo: 'Penas',
        subtopicos: [
          'Espécies de Penas',
          'Penas Privativas de Liberdade',
          'Penas Restritivas de Direitos',
          'Pena de Multa',
          'Aplicação e Dosimetria',
        ],
        descricao: 'Tipos de penas, formas de aplicação e sistema trifásico de dosimetria.',
        importancia: 'alta',
        tempoEstimado: 120
      },
      {
        id: 'penal-04',
        titulo: 'Crimes Contra a Pessoa',
        subtopicos: [
          'Homicídio',
          'Lesão Corporal',
          'Crimes Contra a Honra',
          'Crimes Contra a Liberdade',
        ],
        descricao: 'Crimes que atingem a vida, integridade física, honra e liberdade individual.',
        importancia: 'alta',
        tempoEstimado: 140
      },
      {
        id: 'penal-05',
        titulo: 'Crimes Contra o Patrimônio',
        subtopicos: [
          'Furto e Roubo',
          'Extorsão',
          'Estelionato',
          'Receptação',
          'Apropriação Indébita',
        ],
        descricao: 'Crimes que violam o patrimônio alheio, incluindo furto, roubo e fraudes.',
        importancia: 'alta',
        tempoEstimado: 130
      },
      {
        id: 'penal-06',
        titulo: 'Crimes Contra a Administração Pública',
        subtopicos: [
          'Peculato',
          'Corrupção',
          'Prevaricação',
          'Concussão',
          'Advocacia Administrativa',
        ],
        descricao: 'Crimes praticados por funcionários públicos contra a Administração.',
        importancia: 'alta',
        tempoEstimado: 110
      },
    ]
  },
  {
    disciplinaId: '4',
    topicos: [
      {
        id: 'civil-01',
        titulo: 'Lei de Introdução às Normas do Direito Brasileiro',
        subtopicos: [
          'Vigência e Aplicação das Leis',
          'Integração e Interpretação',
          'Direito Internacional Privado',
        ],
        descricao: 'Normas sobre aplicação, vigência e interpretação das leis no ordenamento brasileiro.',
        importancia: 'média',
        tempoEstimado: 80
      },
      {
        id: 'civil-02',
        titulo: 'Pessoas Naturais e Jurídicas',
        subtopicos: [
          'Personalidade e Capacidade',
          'Direitos da Personalidade',
          'Domicílio',
          'Pessoas Jurídicas de Direito Privado',
        ],
        descricao: 'Conceitos fundamentais sobre pessoas, personalidade jurídica e capacidade.',
        importancia: 'alta',
        tempoEstimado: 120
      },
      {
        id: 'civil-03',
        titulo: 'Fatos Jurídicos',
        subtopicos: [
          'Negócio Jurídico',
          'Atos Jurídicos Lícitos',
          'Atos Ilícitos',
          'Prescrição e Decadência',
        ],
        descricao: 'Eventos que criam, modificam ou extinguem relações jurídicas.',
        importancia: 'alta',
        tempoEstimado: 110
      },
      {
        id: 'civil-04',
        titulo: 'Obrigações',
        subtopicos: [
          'Modalidades de Obrigações',
          'Transmissão das Obrigações',
          'Adimplemento e Extinção',
          'Inadimplemento',
        ],
        descricao: 'Teoria geral das obrigações, cumprimento e consequências do inadimplemento.',
        importancia: 'alta',
        tempoEstimado: 140
      },
      {
        id: 'civil-05',
        titulo: 'Contratos',
        subtopicos: [
          'Princípios Contratuais',
          'Formação e Classificação',
          'Extinção dos Contratos',
          'Contratos em Espécie',
        ],
        descricao: 'Teoria geral dos contratos e principais tipos contratuais.',
        importancia: 'alta',
        tempoEstimado: 160
      },
      {
        id: 'civil-06',
        titulo: 'Responsabilidade Civil',
        subtopicos: [
          'Responsabilidade Subjetiva',
          'Responsabilidade Objetiva',
          'Nexo de Causalidade',
          'Excludentes de Responsabilidade',
          'Dano Material e Moral',
        ],
        descricao: 'Obrigação de reparar danos causados a terceiros por ato próprio ou de outrem.',
        importancia: 'alta',
        tempoEstimado: 130
      },
      {
        id: 'civil-07',
        titulo: 'Direitos Reais',
        subtopicos: [
          'Posse',
          'Propriedade',
          'Direitos Reais sobre Coisas Alheias',
          'Usucapião',
        ],
        descricao: 'Direitos que incidem diretamente sobre coisas, especialmente imóveis.',
        importancia: 'alta',
        tempoEstimado: 150
      },
    ]
  },
  {
    disciplinaId: '5',
    topicos: [
      {
        id: 'proc-civil-01',
        titulo: 'Normas Processuais',
        subtopicos: [
          'Normas Fundamentais do Processo',
          'Aplicação das Normas Processuais',
          'Jurisdição e Ação',
        ],
        descricao: 'Princípios e normas fundamentais do processo civil brasileiro.',
        importancia: 'alta',
        tempoEstimado: 90
      },
      {
        id: 'proc-civil-02',
        titulo: 'Competência',
        subtopicos: [
          'Competência Interna',
          'Competência Internacional',
          'Modificação de Competência',
          'Incompetência',
        ],
        descricao: 'Regras de determinação do juízo competente para processar e julgar ações.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'proc-civil-03',
        titulo: 'Sujeitos do Processo',
        subtopicos: [
          'Partes e Procuradores',
          'Litisconsórcio',
          'Intervenção de Terceiros',
          'Capacidade Processual',
        ],
        descricao: 'Legitimidade, capacidade e formas de participação no processo.',
        importancia: 'alta',
        tempoEstimado: 110
      },
      {
        id: 'proc-civil-04',
        titulo: 'Atos Processuais',
        subtopicos: [
          'Forma dos Atos',
          'Prazos Processuais',
          'Comunicação dos Atos',
          'Nulidades',
        ],
        descricao: 'Forma, tempo e lugar dos atos processuais e suas invalidades.',
        importancia: 'média',
        tempoEstimado: 90
      },
      {
        id: 'proc-civil-05',
        titulo: 'Tutelas Provisórias',
        subtopicos: [
          'Tutela de Urgência',
          'Tutela Antecipada',
          'Tutela Cautelar',
          'Tutela da Evidência',
        ],
        descricao: 'Medidas urgentes para proteção de direitos antes da decisão final.',
        importancia: 'alta',
        tempoEstimado: 120
      },
      {
        id: 'proc-civil-06',
        titulo: 'Procedimento Comum',
        subtopicos: [
          'Petição Inicial',
          'Resposta do Réu',
          'Provas',
          'Sentença',
        ],
        descricao: 'Fases do procedimento ordinário de conhecimento.',
        importancia: 'alta',
        tempoEstimado: 140
      },
      {
        id: 'proc-civil-07',
        titulo: 'Recursos',
        subtopicos: [
          'Teoria Geral dos Recursos',
          'Apelação',
          'Agravo de Instrumento',
          'Recursos Especial e Extraordinário',
        ],
        descricao: 'Meios de impugnação de decisões judiciais.',
        importancia: 'alta',
        tempoEstimado: 130
      },
      {
        id: 'proc-civil-08',
        titulo: 'Cumprimento de Sentença',
        subtopicos: [
          'Cumprimento Provisório',
          'Cumprimento Definitivo',
          'Impugnação',
          'Execução de Alimentos',
        ],
        descricao: 'Procedimento para efetivação de decisões judiciais.',
        importancia: 'alta',
        tempoEstimado: 110
      },
    ]
  },
  {
    disciplinaId: '6',
    topicos: [
      {
        id: 'proc-penal-01',
        titulo: 'Princípios Processuais Penais',
        subtopicos: [
          'Devido Processo Legal',
          'Presunção de Inocência',
          'Contraditório e Ampla Defesa',
          'Publicidade',
        ],
        descricao: 'Princípios constitucionais aplicáveis ao processo penal.',
        importancia: 'alta',
        tempoEstimado: 90
      },
      {
        id: 'proc-penal-02',
        titulo: 'Inquérito Policial',
        subtopicos: [
          'Natureza e Características',
          'Instauração',
          'Arquivamento',
          'Investigação Criminal',
        ],
        descricao: 'Procedimento administrativo de apuração de infrações penais.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'proc-penal-03',
        titulo: 'Ação Penal',
        subtopicos: [
          'Ação Penal Pública',
          'Ação Penal Privada',
          'Denúncia e Queixa',
          'Condições da Ação',
        ],
        descricao: 'Classificação e procedimentos iniciais da ação penal.',
        importancia: 'alta',
        tempoEstimado: 110
      },
      {
        id: 'proc-penal-04',
        titulo: 'Jurisdição e Competência',
        subtopicos: [
          'Competência Territorial',
          'Competência por Prerrogativa de Função',
          'Conflitos de Competência',
        ],
        descricao: 'Regras de determinação do juízo competente na esfera penal.',
        importancia: 'média',
        tempoEstimado: 80
      },
      {
        id: 'proc-penal-05',
        titulo: 'Provas',
        subtopicos: [
          'Teoria Geral das Provas',
          'Prova Ilícita',
          'Provas em Espécie',
          'Ônus da Prova',
        ],
        descricao: 'Meios de prova admitidos no processo penal e suas limitações.',
        importancia: 'alta',
        tempoEstimado: 130
      },
      {
        id: 'proc-penal-06',
        titulo: 'Prisões e Medidas Cautelares',
        subtopicos: [
          'Prisão em Flagrante',
          'Prisão Preventiva',
          'Prisão Temporária',
          'Medidas Cautelares Diversas',
        ],
        descricao: 'Medidas restritivas de liberdade durante o processo.',
        importancia: 'alta',
        tempoEstimado: 120
      },
      {
        id: 'proc-penal-07',
        titulo: 'Procedimentos',
        subtopicos: [
          'Procedimento Comum Ordinário',
          'Procedimento Sumário',
          'Procedimento do Júri',
          'Procedimentos Especiais',
        ],
        descricao: 'Ritos processuais aplicáveis conforme a gravidade do delito.',
        importancia: 'alta',
        tempoEstimado: 140
      },
    ]
  },
  {
    disciplinaId: '7',
    topicos: [
      {
        id: 'trab-01',
        titulo: 'Princípios do Direito do Trabalho',
        subtopicos: [
          'Proteção ao Trabalhador',
          'Irrenunciabilidade',
          'Continuidade da Relação',
          'Primazia da Realidade',
        ],
        descricao: 'Princípios fundamentais que regem as relações trabalhistas.',
        importancia: 'alta',
        tempoEstimado: 80
      },
      {
        id: 'trab-02',
        titulo: 'Relação de Trabalho e Emprego',
        subtopicos: [
          'Requisitos da Relação de Emprego',
          'Trabalho Autônomo',
          'Trabalho Eventual',
          'Terceirização',
        ],
        descricao: 'Caracterização da relação de emprego e formas de prestação de serviços.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'trab-03',
        titulo: 'Contrato Individual de Trabalho',
        subtopicos: [
          'Formação do Contrato',
          'Alteração Contratual',
          'Suspensão e Interrupção',
          'Extinção do Contrato',
        ],
        descricao: 'Ciclo completo do contrato de trabalho, desde formação até extinção.',
        importancia: 'alta',
        tempoEstimado: 120
      },
      {
        id: 'trab-04',
        titulo: 'Duração do Trabalho',
        subtopicos: [
          'Jornada de Trabalho',
          'Horas Extras',
          'Intervalo para Repouso',
          'Trabalho Noturno',
          'Escalas de Revezamento',
        ],
        descricao: 'Regras sobre jornada, horas extras e períodos de descanso.',
        importancia: 'alta',
        tempoEstimado: 110
      },
      {
        id: 'trab-05',
        titulo: 'Remuneração e Salário',
        subtopicos: [
          'Salário e Remuneração',
          'Salário Mínimo',
          '13º Salário',
          'Adicionais',
          'Descontos Salariais',
        ],
        descricao: 'Normas sobre pagamento, adicionais e proteção salarial.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'trab-06',
        titulo: 'Férias e Descansos',
        subtopicos: [
          'Férias Anuais',
          'Descanso Semanal Remunerado',
          'Feriados',
        ],
        descricao: 'Direito a férias e períodos de descanso obrigatórios.',
        importancia: 'média',
        tempoEstimado: 80
      },
      {
        id: 'trab-07',
        titulo: 'Segurança e Medicina do Trabalho',
        subtopicos: [
          'Normas Regulamentadoras',
          'Equipamentos de Proteção',
          'Acidente do Trabalho',
          'Insalubridade e Periculosidade',
        ],
        descricao: 'Proteção à saúde e segurança do trabalhador.',
        importancia: 'média',
        tempoEstimado: 90
      },
    ]
  },
  {
    disciplinaId: '8',
    topicos: [
      {
        id: 'proc-trab-01',
        titulo: 'Organização da Justiça do Trabalho',
        subtopicos: [
          'Composição',
          'Competência da Justiça do Trabalho',
          'Varas do Trabalho',
          'Tribunais Regionais',
          'TST',
        ],
        descricao: 'Estrutura e organização da Justiça do Trabalho.',
        importancia: 'média',
        tempoEstimado: 70
      },
      {
        id: 'proc-trab-02',
        titulo: 'Reclamação Trabalhista',
        subtopicos: [
          'Petição Inicial',
          'Jus Postulandi',
          'Audiência',
          'Defesa',
        ],
        descricao: 'Procedimento de ajuizamento e tramitação inicial da ação trabalhista.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'proc-trab-03',
        titulo: 'Provas no Processo do Trabalho',
        subtopicos: [
          'Ônus da Prova',
          'Confissão',
          'Testemunhas',
          'Perícia',
        ],
        descricao: 'Meios de prova específicos do processo trabalhista.',
        importancia: 'alta',
        tempoEstimado: 90
      },
      {
        id: 'proc-trab-04',
        titulo: 'Sentença e Recursos',
        subtopicos: [
          'Sentença Trabalhista',
          'Recurso Ordinário',
          'Recurso de Revista',
          'Embargos',
        ],
        descricao: 'Decisões judiciais e sistema recursal trabalhista.',
        importancia: 'alta',
        tempoEstimado: 110
      },
      {
        id: 'proc-trab-05',
        titulo: 'Execução Trabalhista',
        subtopicos: [
          'Liquidação de Sentença',
          'Penhora',
          'Embargos à Execução',
          'Execução contra Entes Públicos',
        ],
        descricao: 'Procedimento de cumprimento das decisões trabalhistas.',
        importancia: 'alta',
        tempoEstimado: 100
      },
    ]
  },
  {
    disciplinaId: '9',
    topicos: [
      {
        id: 'trib-01',
        titulo: 'Sistema Tributário Nacional',
        subtopicos: [
          'Princípios Constitucionais Tributários',
          'Competência Tributária',
          'Limitações ao Poder de Tributar',
          'Imunidades',
        ],
        descricao: 'Base constitucional do sistema tributário brasileiro.',
        importancia: 'alta',
        tempoEstimado: 120
      },
      {
        id: 'trib-02',
        titulo: 'Código Tributário Nacional',
        subtopicos: [
          'Normas Gerais',
          'Vigência e Aplicação',
          'Interpretação e Integração',
        ],
        descricao: 'Disposições gerais do CTN sobre normas tributárias.',
        importancia: 'alta',
        tempoEstimado: 80
      },
      {
        id: 'trib-03',
        titulo: 'Tributos em Espécie',
        subtopicos: [
          'Impostos',
          'Taxas',
          'Contribuições de Melhoria',
          'Empréstimos Compulsórios',
          'Contribuições Especiais',
        ],
        descricao: 'Classificação e características dos tributos.',
        importancia: 'alta',
        tempoEstimado: 140
      },
      {
        id: 'trib-04',
        titulo: 'Obrigação Tributária',
        subtopicos: [
          'Fato Gerador',
          'Sujeitos da Obrigação',
          'Responsabilidade Tributária',
          'Domicílio Tributário',
        ],
        descricao: 'Elementos da obrigação tributária e responsáveis pelo pagamento.',
        importancia: 'alta',
        tempoEstimado: 110
      },
      {
        id: 'trib-05',
        titulo: 'Crédito Tributário',
        subtopicos: [
          'Lançamento',
          'Suspensão da Exigibilidade',
          'Extinção do Crédito',
          'Exclusão do Crédito',
        ],
        descricao: 'Constituição, suspensão e extinção do crédito tributário.',
        importancia: 'alta',
        tempoEstimado: 130
      },
      {
        id: 'trib-06',
        titulo: 'Administração Tributária',
        subtopicos: [
          'Fiscalização',
          'Dívida Ativa',
          'Certidões Negativas',
          'Processo Administrativo Fiscal',
        ],
        descricao: 'Atividades de fiscalização e cobrança de tributos.',
        importancia: 'média',
        tempoEstimado: 90
      },
    ]
  },
  {
    disciplinaId: '10',
    topicos: [
      {
        id: 'emp-01',
        titulo: 'Teoria da Empresa',
        subtopicos: [
          'Empresário Individual',
          'EIRELI',
          'Estabelecimento Empresarial',
          'Registro de Empresa',
        ],
        descricao: 'Conceitos fundamentais de empresa e empresário.',
        importancia: 'alta',
        tempoEstimado: 90
      },
      {
        id: 'emp-02',
        titulo: 'Sociedades Empresárias',
        subtopicos: [
          'Sociedade Limitada',
          'Sociedade Anônima',
          'Sociedade em Nome Coletivo',
          'Sociedade em Comandita',
        ],
        descricao: 'Tipos societários e suas características.',
        importancia: 'alta',
        tempoEstimado: 120
      },
      {
        id: 'emp-03',
        titulo: 'Títulos de Crédito',
        subtopicos: [
          'Teoria Geral',
          'Letra de Câmbio',
          'Nota Promissória',
          'Cheque',
          'Duplicata',
        ],
        descricao: 'Documentos representativos de obrigações creditícias.',
        importancia: 'alta',
        tempoEstimado: 110
      },
      {
        id: 'emp-04',
        titulo: 'Falência e Recuperação',
        subtopicos: [
          'Recuperação Judicial',
          'Recuperação Extrajudicial',
          'Falência',
          'Credores',
        ],
        descricao: 'Mecanismos de superação de crise empresarial.',
        importancia: 'alta',
        tempoEstimado: 130
      },
      {
        id: 'emp-05',
        titulo: 'Contratos Empresariais',
        subtopicos: [
          'Compra e Venda Mercantil',
          'Franquia',
          'Representação Comercial',
          'Distribuição',
        ],
        descricao: 'Contratos típicos das relações empresariais.',
        importancia: 'média',
        tempoEstimado: 80
      },
    ]
  },
  {
    disciplinaId: '11',
    topicos: [
      {
        id: 'prev-01',
        titulo: 'Seguridade Social',
        subtopicos: [
          'Conceito e Princípios',
          'Saúde, Assistência e Previdência',
          'Organização',
          'Financiamento',
        ],
        descricao: 'Base constitucional da seguridade social brasileira.',
        importancia: 'alta',
        tempoEstimado: 90
      },
      {
        id: 'prev-02',
        titulo: 'Regime Geral de Previdência Social',
        subtopicos: [
          'Segurados Obrigatórios',
          'Segurados Facultativos',
          'Dependentes',
          'Inscrição e Filiação',
        ],
        descricao: 'Sujeitos protegidos pelo RGPS.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'prev-03',
        titulo: 'Benefícios Previdenciários',
        subtopicos: [
          'Aposentadorias',
          'Auxílios',
          'Pensão por Morte',
          'Salário-Família',
          'Salário-Maternidade',
        ],
        descricao: 'Prestações pagas aos segurados e dependentes.',
        importancia: 'alta',
        tempoEstimado: 140
      },
      {
        id: 'prev-04',
        titulo: 'Custeio da Previdência',
        subtopicos: [
          'Contribuições da Empresa',
          'Contribuições do Segurado',
          'Base de Cálculo',
          'Arrecadação',
        ],
        descricao: 'Sistema de financiamento da previdência social.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'prev-05',
        titulo: 'Regimes Próprios',
        subtopicos: [
          'Servidores Públicos',
          'Militares',
          'Previdência Complementar',
        ],
        descricao: 'Sistemas especiais de previdência.',
        importancia: 'média',
        tempoEstimado: 70
      },
    ]
  },
  {
    disciplinaId: '12',
    topicos: [
      {
        id: 'amb-01',
        titulo: 'Princípios do Direito Ambiental',
        subtopicos: [
          'Desenvolvimento Sustentável',
          'Prevenção e Precaução',
          'Poluidor-Pagador',
          'Informação Ambiental',
        ],
        descricao: 'Princípios norteadores da proteção ambiental.',
        importancia: 'alta',
        tempoEstimado: 80
      },
      {
        id: 'amb-02',
        titulo: 'Política Nacional do Meio Ambiente',
        subtopicos: [
          'Lei 6.938/81',
          'SISNAMA',
          'Instrumentos de Política',
          'Licenciamento Ambiental',
        ],
        descricao: 'Sistema nacional de proteção ao meio ambiente.',
        importancia: 'alta',
        tempoEstimado: 100
      },
      {
        id: 'amb-03',
        titulo: 'Responsabilidade Ambiental',
        subtopicos: [
          'Responsabilidade Civil',
          'Responsabilidade Administrativa',
          'Responsabilidade Penal',
          'Dano Ambiental',
        ],
        descricao: 'Formas de responsabilização por danos ambientais.',
        importancia: 'alta',
        tempoEstimado: 110
      },
      {
        id: 'amb-04',
        titulo: 'Áreas Protegidas',
        subtopicos: [
          'Unidades de Conservação',
          'APP e Reserva Legal',
          'Código Florestal',
        ],
        descricao: 'Espaços territoriais especialmente protegidos.',
        importancia: 'média',
        tempoEstimado: 90
      },
      {
        id: 'amb-05',
        titulo: 'Crimes Ambientais',
        subtopicos: [
          'Lei 9.605/98',
          'Crimes Contra a Fauna',
          'Crimes Contra a Flora',
          'Poluição e Crimes Urbanísticos',
        ],
        descricao: 'Infrações penais contra o meio ambiente.',
        importancia: 'alta',
        tempoEstimado: 100
      },
    ]
  },
];

export function getConteudoPorDisciplina(disciplinaId: string): ConteudoTopico[] {
  const conteudo = conteudoDisciplinas.find(c => c.disciplinaId === disciplinaId);
  return conteudo?.topicos || [];
}

export function getTotalTempoEstimado(disciplinaId: string): number {
  const topicos = getConteudoPorDisciplina(disciplinaId);
  return topicos.reduce((total, topico) => total + topico.tempoEstimado, 0);
}

export function getTopicoPorId(disciplinaId: string, topicoId: string): ConteudoTopico | undefined {
  const topicos = getConteudoPorDisciplina(disciplinaId);
  return topicos.find(t => t.id === topicoId);
}
