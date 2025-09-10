export interface Alternativa {
  letra: string;
  texto: string;
  correta: boolean;
}

export interface Questao {
  id: number;
  disciplina: string;
  enunciado: string;
  alternativas: Alternativa[];
}

export interface RespostaUsuario {
  questaoId: number;
  alternativaSelecionada: string;
  correta: boolean;
  tempo: number; // tempo em segundos para responder
}

export interface ResultadoDisciplina {
  disciplina: string;
  total: number;
  acertos: number;
  erros: number;
  percentual: number;
}

export interface ResultadoSimulado {
  questoesRespondidas: number;
  totalQuestoes: number;
  acertos: number;
  erros: number;
  percentualGeral: number;
  tempoTotal: number; // em segundos
  resultadosPorDisciplina: ResultadoDisciplina[];
  respostas: RespostaUsuario[];
}

export type ModoSimulado = 'geral' | 'disciplina' | 'personalizado';

export interface ConfigSimulado {
  modo: ModoSimulado;
  disciplinas?: string[];
  numeroQuestoes?: number;
  tempoLimite?: number; // em minutos
  mostrarGabarito?: boolean;
  dataProva?: Date; // data da prova para cronograma de estudos
}
