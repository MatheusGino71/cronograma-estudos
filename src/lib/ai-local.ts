// Simulador de API local para funcionar com export estático
interface AIResponse {
  success: boolean;
  response: string;
  timestamp: string;
}

interface AIRequest {
  type: 'question' | 'study-plan' | 'explain-concept' | 'generate-questions';
  data: any;
}

const SIMULATED_RESPONSES = {
  'cronograma': `# 📅 Cronograma de Estudos Personalizado - Direito

## **Meta Semanal**: 20 horas de estudo

### **📋 Distribuição por disciplina:**

**Segunda-feira (3h)**
- 🏛️ **Direito Constitucional** - 1h30
  - Princípios fundamentais
  - Direitos e garantias fundamentais
- ⚖️ **Direito Administrativo** - 1h30
  - Princípios da administração pública

**Terça-feira (3h)**
- 👨‍⚖️ **Direito Civil** - 1h30
  - Parte geral do Código Civil
- 🚔 **Direito Penal** - 1h30
  - Teoria geral do crime

**Quarta-feira (3h)**
- 📋 **Direito Processual Civil** - 1h30
  - Novo CPC - processo de conhecimento
- 🔍 **Direito Processual Penal** - 1h30
  - Inquérito policial e ação penal

**Quinta-feira (3h)**
- 💼 **Direito Trabalhista** - 1h30
  - CLT e contrato de trabalho
- 🏭 **Direito Processual do Trabalho** - 1h30
  - Reclamação trabalhista

**Sexta-feira (3h)**
- 💰 **Direito Tributário** - 1h30
  - Sistema tributário nacional
- 🏢 **Direito Empresarial** - 1h30
  - Teoria da empresa

**Sábado (3h)**
- 🏥 **Direito Previdenciário** - 1h30
  - Benefícios do INSS
- 🌱 **Direito Ambiental** - 1h30
  - Princípios ambientais

**Domingo (2h)**
- 📝 **Revisão geral**
- 🧠 **Simulados**

## **💡 Dicas importantes:**
1. Faça resumos de cada tópico estudado
2. Resolva questões após cada sessão de teoria
3. Use mapas mentais para conectar conceitos
4. Mantenha um caderno de jurisprudências importantes`,

  'conceito': `# ⚖️ Princípio da Legalidade no Direito

## **📖 Definição**
O princípio da legalidade estabelece que **"ninguém será obrigado a fazer ou deixar de fazer alguma coisa senão em virtude de lei"** (CF/88, art. 5º, II).

## **🏛️ Base Legal**
- **Constituição Federal/88**: Art. 5º, II
- **Código Civil**: Art. 1º
- **Aplicação**: Todos os ramos do Direito

## **🎯 Características**
### **Para os particulares:**
- Podem fazer tudo que a lei não proíbe
- Autonomia da vontade
- Liberdade é a regra

### **Para o Estado:**
- Só pode fazer o que a lei autoriza
- Vinculação absoluta à legalidade
- Atos dependem de previsão legal

## **📚 Exemplo Prático**
Um policial só pode efetuar uma prisão nas hipóteses previstas em lei (flagrante, mandado judicial, etc.). Não pode prender por critério próprio.

## **🧠 Dica de Memorização**
**"PartiCULAR faz TUDO, menos o proibido"**
**"EsTAdo faz SÓ o permitido"**

## **❓ Questão Tipo Concurso**
**(CESPE) O princípio da legalidade:**
a) Aplica-se apenas ao Poder Executivo
b) Permite ao particular fazer tudo que não é proibido por lei ✅
c) Autoriza o Estado a criar obrigações por decreto
d) É exclusivo do Direito Administrativo
e) Não tem previsão constitucional

**Resposta: B** - O particular pode fazer tudo que a lei não proíbe.`,

  'questoes': `# 📝 Questões de Direito Constitucional - Nível Intermediário

## **Questão 1 (Estilo CESPE)**
Sobre os direitos fundamentais previstos na Constituição Federal de 1988, assinale a alternativa CORRETA:

a) Os direitos fundamentais têm aplicação imediata, dispensando regulamentação infraconstitucional ✅
b) Os direitos sociais não são considerados direitos fundamentais
c) Os direitos fundamentais aplicam-se exclusivamente aos brasileiros
d) A dignidade da pessoa humana não integra os direitos fundamentais
e) Os direitos fundamentais podem ser suspensos a qualquer tempo

**Gabarito: A**
**Explicação:** CF/88, art. 5º, §1º: "As normas definidoras dos direitos e garantias fundamentais têm aplicação imediata."

---

## **Questão 2 (Estilo FCC)**
O controle de constitucionalidade no Brasil:

a) É exercido apenas pelo Supremo Tribunal Federal
b) Pode ser concentrado ou difuso ✅
c) Não admite controle preventivo
d) É exclusivamente repressivo
e) Não se aplica às emendas constitucionais

**Gabarito: B**
**Explicação:** Brasil adota sistema misto: concentrado (STF) e difuso (qualquer juiz).

---

## **Questão 3 (Estilo FGV)**
Assinale a alternativa que apresenta competência EXCLUSIVA da União:

a) Legislar sobre direito civil
b) Manter o ensino fundamental
c) Emitir moeda ✅
d) Proteger o meio ambiente
e) Combater as drogas

**Gabarito: C**
**Explicação:** CF/88, art. 21, VII - competência exclusiva da União emitir moeda.

---

## **Questão 4 (Estilo VUNESP)**
Sobre o processo legislativo federal:

a) Lei complementar exige maioria absoluta ✅
b) Lei ordinária exige maioria qualificada
c) Emenda constitucional exige maioria simples
d) Medida provisória tem vigência de 90 dias, improrrogável
e) Todas as leis dependem de sanção presidencial

**Gabarito: A**
**Explicação:** Lei complementar exige maioria absoluta (mais da metade dos membros).

---

## **Questão 5 (Estilo CESPE)**
Julgue o item: "O princípio da proporcionalidade não possui previsão expressa na Constituição Federal, mas é reconhecido pela doutrina e jurisprudência como implícito no sistema constitucional."

**Gabarito: CERTO** ✅
**Explicação:** Princípio implícito, derivado do Estado de Direito e devido processo legal.`,

  'default': `# 🤖 MindLegal AI - Seu Assistente Jurídico

Olá! 👋 Sou o **MindLegal AI**, especializado em Direito brasileiro e preparação para concursos públicos.

## **🎯 Como posso ajudar você:**

### **📚 Explicações Jurídicas**
- Conceitos de todas as disciplinas
- Doutrina e jurisprudência atualizada
- Legislação com exemplos práticos

### **📅 Cronogramas de Estudo**
- Planos personalizados para seu tempo disponível
- Distribuição equilibrada de disciplinas
- Metas realistas e alcançáveis

### **📝 Questões de Concurso**
- Estilo das principais bancas (CESPE, FCC, FGV)
- Diferentes níveis de dificuldade
- Explicações detalhadas dos gabaritos

### **🧠 Técnicas de Memorização**
- Métodos comprovados de fixação
- Resumos estruturados e mapas mentais
- Dicas específicas para Direito

## **💡 Exemplos de perguntas que posso responder:**
- "Explique o devido processo legal com exemplos"
- "Crie um cronograma para Procurador Federal"
- "Gere 5 questões de Direito Penal estilo CESPE"
- "Como memorizar as competências do STF?"
- "Qual a diferença entre dolo e culpa?"

## **🏆 Vamos conquistar sua aprovação juntos!**

Digite sua pergunta abaixo e vamos começar seus estudos! 📖✨`
};

// Função principal da IA local
export function processAIRequest(request: AIRequest): Promise<AIResponse> {
  return new Promise((resolve) => {
    // Simular delay de resposta da API
    setTimeout(() => {
      let response = SIMULATED_RESPONSES.default;
      
      if (request.type === 'question' && request.data.question) {
        const question = request.data.question.toLowerCase();
        
        // Respostas específicas baseadas em palavras-chave
        if (question.includes('cronograma') || question.includes('plano') || question.includes('estudos')) {
          response = SIMULATED_RESPONSES.cronograma;
        } else if (question.includes('explique') || question.includes('conceito') || question.includes('princípio') || question.includes('legalidade')) {
          response = SIMULATED_RESPONSES.conceito;
        } else if (question.includes('questão') || question.includes('questões') || question.includes('simulado')) {
          response = SIMULATED_RESPONSES.questoes;
        } else if (question.includes('ola') || question.includes('olá') || question.includes('oi')) {
          response = SIMULATED_RESPONSES.default;
        } else {
          // Resposta genérica personalizada
          response = `# 🤖 MindLegal AI Responde

Entendi sua pergunta: **"${request.data.question}"**

## **📚 Resposta Especializada:**

Essa é uma excelente pergunta sobre Direito! Como especialista em concursos públicos, posso te ajudar com explicações detalhadas sobre diversos temas jurídicos.

### **💡 Para uma resposta mais específica, tente perguntar:**
- "Explique [conceito jurídico específico]"
- "Crie cronograma para [nome do concurso]"
- "Gere questões de [disciplina]"
- "Como memorizar [tópico específico]"

### **🎯 Áreas que domino:**
- 🏛️ **Direito Constitucional** - Princípios, direitos fundamentais
- ⚖️ **Direito Administrativo** - Atos, licitações, servidores
- 👨‍⚖️ **Direito Civil** - Contratos, responsabilidade civil
- 🚔 **Direito Penal** - Crimes, penas, teoria do delito
- 💼 **Direito Trabalhista** - CLT, processo do trabalho
- 💰 **Direito Tributário** - Impostos, contribuições
- E muito mais!

**Continue perguntando! Estou aqui para te ajudar a conquistar sua aprovação! 🏆**`;
        }
      }

      resolve({
        success: true,
        response: response,
        timestamp: new Date().toISOString()
      });
    }, 800); // Delay de 800ms para simular processamento
  });
}

// Função de conveniência para perguntas simples
export async function askMindLegalAI(question: string, context?: string): Promise<string> {
  const response = await processAIRequest({
    type: 'question',
    data: { question, context }
  });
  
  return response.response;
}
