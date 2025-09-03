import { GoogleGenerativeAI } from '@google/generative-ai';

// Inicializar o Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Configuração do modelo
export const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 1024,
  },
});

// Prompt system para o assistente jurídico
export const SYSTEM_PROMPT = `
Você é um assistente de estudos especializado em Direito brasileiro, criado para ajudar estudantes que se preparam para concursos públicos. Suas principais características:

IDENTIDADE:
- Nome: MindLegal AI
- Especialização: Direito brasileiro e preparação para concursos
- Tom: Profissional, didático e encorajador

CONHECIMENTOS:
- Todas as áreas do Direito brasileiro
- Jurisprudência dos tribunais superiores
- Legislação atualizada
- Técnicas de estudo para concursos
- Estratégias de memorização
- Resolução de questões

DISCIPLINAS DE FOCO:
1. Direito Constitucional
2. Direito Administrativo  
3. Direito Civil
4. Direito Penal
5. Direito Processual Civil
6. Direito Processual Penal
7. Direito Trabalhista
8. Direito Processual do Trabalho
9. Direito Tributário
10. Direito Empresarial
11. Direito Previdenciário
12. Direito Ambiental

FUNÇÕES:
- Explicar conceitos jurídicos complexos de forma simples
- Criar cronogramas de estudo personalizados
- Elaborar questões de concurso
- Dar dicas de memorização
- Orientar sobre jurisprudência relevante
- Sugerir materiais de estudo
- Motivar e encorajar o estudante

DIRETRIZES:
- Sempre cite a legislação pertinente
- Use exemplos práticos quando possível
- Seja conciso mas completo
- Adapte a linguagem ao nível do usuário
- Incentive a prática constante
- Mantenha-se atualizado com mudanças legislativas

LIMITAÇÕES:
- Não forneça consultoria jurídica pessoal
- Sempre lembre que é para fins educativos
- Encoraje a consulta a fontes oficiais
- Não substitui professores ou cursos especializados

Responda sempre de forma educativa, motivadora e focada no sucesso do estudante em concursos públicos.
`;

// Função para fazer uma pergunta à IA
export async function askGemini(question: string, context?: string) {
  try {
    const prompt = `${SYSTEM_PROMPT}\n\nContexto: ${context || 'Estudo geral de Direito'}\n\nPergunta do usuário: ${question}\n\nResposta:`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      text: text,
      error: null
    };
  } catch (error) {
    console.error('Erro ao consultar Gemini:', error);
    return {
      success: false,
      text: '',
      error: 'Erro ao processar sua pergunta. Tente novamente.'
    };
  }
}

// Função específica para gerar cronogramas
export async function generateStudyPlan(userInfo: {
  availableHours: number;
  targetExam: string;
  weakAreas: string[];
  studyMethod: string;
}) {
  const question = `
    Preciso de um cronograma de estudos personalizado com as seguintes informações:
    - Horas disponíveis por semana: ${userInfo.availableHours}
    - Concurso alvo: ${userInfo.targetExam}
    - Áreas de dificuldade: ${userInfo.weakAreas.join(', ')}
    - Método de estudo preferido: ${userInfo.studyMethod}
    
    Crie um cronograma semanal detalhado considerando as 12 disciplinas jurídicas principais.
  `;
  
  return await askGemini(question, 'Criação de cronograma personalizado');
}

// Função para explicar conceitos jurídicos
export async function explainLegalConcept(concept: string, subject: string) {
  const question = `
    Explique de forma didática o conceito "${concept}" na área de ${subject}.
    Inclua:
    - Definição clara
    - Base legal
    - Exemplo prático
    - Dica para memorização
    - Possível questão de concurso sobre o tema
  `;
  
  return await askGemini(question, `Explicação de conceito - ${subject}`);
}

// Função para gerar questões de concurso
export async function generateQuestions(subject: string, difficulty: 'básico' | 'intermediário' | 'avançado', quantity: number = 5) {
  const question = `
    Crie ${quantity} questões de múltipla escolha sobre ${subject} no nível ${difficulty}.
    
    Para cada questão, forneça:
    - Enunciado claro
    - 5 alternativas (a, b, c, d, e)
    - Gabarito correto
    - Breve explicação da resposta
    - Referência legal
    
    Formato das questões no estilo das principais bancas (CESPE, FCC, FGV, VUNESP).
  `;
  
  return await askGemini(question, `Geração de questões - ${subject}`);
}
