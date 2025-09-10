// API direta do Google Gemini 2.0 Flash usando fetch
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    safetyRatings: Array<any>;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export async function callGeminiAPI(prompt: string): Promise<{ success: boolean; text: string; error?: string }> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      text: '',
      error: 'API Key do Gemini não configurada. Adicione NEXT_PUBLIC_GEMINI_API_KEY no .env.local'
    };
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      if (response.status === 403) {
        return {
          success: false,
          text: '',
          error: 'API Key inválida ou sem permissão. Verifique sua chave do Gemini.'
        };
      }
      
      return {
        success: false,
        text: '',
        error: `Erro na API: ${response.status} - ${errorText}`
      };
    }

    const data: GeminiResponse = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const text = data.candidates[0].content.parts[0].text;
      return {
        success: true,
        text: text,
      };
    } else {
      return {
        success: false,
        text: '',
        error: 'Resposta vazia da API do Gemini'
      };
    }

  } catch {
    return {
      success: false,
      text: '',
      error: 'Erro de conexão com a API do Gemini'
    };
  }
}

// Função para fazer perguntas jurídicas com contexto especializado
export async function askLegalAI(question: string, context?: string): Promise<{ success: boolean; text: string; error?: string }> {
  const systemPrompt = `
Você é o MindLegal AI, um assistente especializado em Direito brasileiro para concursos públicos.

ESPECIALIZAÇÃO:
- Direito brasileiro (todas as áreas)
- Preparação para concursos públicos
- Jurisprudência dos tribunais superiores
- Legislação atualizada

DISCIPLINAS:
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

INSTRUÇÕES:
- Seja didático e claro
- Use exemplos práticos
- Cite legislação quando relevante
- Adapte ao nível do estudante
- Seja motivador e encorajador
- Mantenha foco em concursos públicos

IMPORTANTE:
- Apenas para fins educativos
- Não substitui consultoria jurídica
- Sempre recomende consulta a fontes oficiais

CONTEXTO: ${context || 'Estudo geral de Direito'}

PERGUNTA: ${question}

RESPOSTA:`;

  return await callGeminiAPI(systemPrompt);
}

// Função específica para gerar cronogramas de estudo
export async function generateLegalStudyPlan(params: {
  availableHours: number;
  targetExam: string;
  weakAreas: string[];
  studyMethod: string;
  timeFrame: string;
}): Promise<{ success: boolean; text: string; error?: string }> {
  
  const prompt = `
Como MindLegal AI, crie um cronograma detalhado de estudos jurídicos:

DADOS DO ESTUDANTE:
- Horas disponíveis: ${params.availableHours}h por semana
- Concurso alvo: ${params.targetExam}
- Áreas de dificuldade: ${params.weakAreas.join(', ')}
- Método preferido: ${params.studyMethod}
- Prazo: ${params.timeFrame}

DISCIPLINAS OBRIGATÓRIAS:
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

CRIE:
1. Cronograma semanal detalhado
2. Distribuição de horas por matéria
3. Sequência lógica de estudos
4. Momentos de revisão
5. Simulados periódicos
6. Dicas específicas para o concurso

Seja específico e prático!
`;

  return await callGeminiAPI(prompt);
}

// Função para explicar conceitos jurídicos
export async function explainLegalConcept(concept: string, subject: string, level: 'básico' | 'intermediário' | 'avançado' = 'intermediário'): Promise<{ success: boolean; text: string; error?: string }> {
  
  const prompt = `
Como MindLegal AI, explique de forma didática:

CONCEITO: "${concept}"
DISCIPLINA: ${subject}
NÍVEL: ${level}

ESTRUTURA DA EXPLICAÇÃO:
1. 📖 DEFINIÇÃO CLARA
   - O que é o conceito
   - Palavras-chave principais

2. ⚖️ BASE LEGAL
   - Legislação pertinente
   - Artigos específicos

3. 💡 EXEMPLO PRÁTICO
   - Situação real de aplicação
   - Como aparece na prática

4. 🧠 DICA DE MEMORIZAÇÃO
   - Técnica para decorar
   - Associação ou mnemônico

5. 📝 QUESTÃO TÍPICA
   - Como é cobrado em concursos
   - Exemplo de questão

Seja claro, didático e focado em concursos públicos!
`;

  return await callGeminiAPI(prompt);
}

// Função para gerar questões de concurso
export async function generateLegalQuestions(
  subject: string, 
  difficulty: 'básico' | 'intermediário' | 'avançado', 
  examBoard: 'CESPE' | 'FCC' | 'FGV' | 'VUNESP' | 'Qualquer' = 'Qualquer',
  quantity: number = 5
): Promise<{ success: boolean; text: string; error?: string }> {
  
  const prompt = `
Como MindLegal AI, crie ${quantity} questões de múltipla escolha:

ESPECIFICAÇÕES:
- Disciplina: ${subject}
- Nível: ${difficulty}
- Banca: ${examBoard}
- Quantidade: ${quantity} questões

FORMATO PARA CADA QUESTÃO:
---
**QUESTÃO X**
[Enunciado claro e objetivo]

a) [Alternativa A]
b) [Alternativa B]
c) [Alternativa C]
d) [Alternativa D]
e) [Alternativa E]

**GABARITO:** [Letra correta]

**EXPLICAÇÃO:**
[Justificativa da resposta correta]

**BASE LEGAL:**
[Artigo ou dispositivo legal]
---

CARACTERÍSTICAS:
- Estilo da banca ${examBoard}
- Nível de dificuldade ${difficulty}
- Baseado em jurisprudência recente
- Foco em concursos públicos atuais

Crie questões práticas e bem fundamentadas!
`;

  return await callGeminiAPI(prompt);
}
