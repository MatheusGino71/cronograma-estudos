import { NextRequest, NextResponse } from 'next/server';
import { 
  askLegalAI, 
  generateLegalStudyPlan, 
  explainLegalConcept, 
  generateLegalQuestions 
} from '@/lib/gemini-api';

// Respostas simuladas para quando a API do Gemini não estiver disponível
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
b) Permite ao particular fazer tudo que não é proibido por lei
c) Autoriza o Estado a criar obrigações por decreto
d) É exclusivo do Direito Administrativo
e) Não tem previsão constitucional

**Resposta: B** - O particular pode fazer tudo que a lei não proíbe.`,

  'questoes': `# 📝 Questões de Direito Constitucional - Nível Intermediário

## **Questão 1 (Estilo CESPE)**
Sobre os direitos fundamentais previstos na Constituição Federal de 1988, assinale a alternativa CORRETA:

a) Os direitos fundamentais têm aplicação imediata, dispensando regulamentação infraconstitucional
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
b) Pode ser concentrado ou difuso
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
c) Emitir moeda
d) Proteger o meio ambiente
e) Combater as drogas

**Gabarito: C**
**Explicação:** CF/88, art. 21, VII - competência exclusiva da União emitir moeda.

---

## **Questão 4 (Estilo VUNESP)**
Sobre o processo legislativo federal:

a) Lei complementar exige maioria absoluta
b) Lei ordinária exige maioria qualificada
c) Emenda constitucional exige maioria simples
d) Medida provisória tem vigência de 90 dias, improrrogável
e) Todas as leis dependem de sanção presidencial

**Gabarito: A**
**Explicação:** Lei complementar exige maioria absoluta (mais da metade dos membros).

---

## **Questão 5 (Estilo CESPE)**
Julgue o item: "O princípio da proporcionalidade não possui previsão expressa na Constituição Federal, mas é reconhecido pela doutrina e jurisprudência como implícito no sistema constitucional."

**Gabarito: CERTO**
**Explicação:** Princípio implícito, derivado do Estado de Direito e devido processo legal.`,

  'default': `# 🤖 MindLegal AI - Seu Assistente Jurídico

Olá! Sou o **MindLegal AI**, especializado em Direito brasileiro e preparação para concursos públicos.

## **🎯 Como posso ajudar você:**

### **📚 Explicações Jurídicas**
- Conceitos de todas as disciplinas
- Doutrina e jurisprudência
- Legislação atualizada

### **📅 Cronogramas de Estudo**
- Planos personalizados
- Distribuição de disciplinas
- Metas realistas

### **📝 Questões de Concurso**
- Estilo das principais bancas
- Diferentes níveis de dificuldade
- Explicações detalhadas

### **🧠 Técnicas de Memorização**
- Métodos de fixação
- Resumos estruturados
- Dicas de memorização

## **💡 Exemplos de perguntas:**
- "Explique o devido processo legal"
- "Crie cronograma para Procurador"
- "5 questões de Direito Penal"
- "Como memorizar competências do STF?"

**🎓 Vamos estudar juntos para sua aprovação!**`
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    // Verificar se a API key do Gemini está configurada (cliente ou servidor)
    const clientKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const serverKey = process.env.GEMINI_API_KEY;
    
    const hasGeminiKey = (clientKey && clientKey !== '' && !clientKey.includes('sua_chave')) ||
                        (serverKey && serverKey !== '' && !serverKey.includes('sua_chave'));
    
    console.log('🔑 Verificando API Keys:', {
      hasClientKey: !!clientKey,
      hasServerKey: !!serverKey,
      hasValidKey: hasGeminiKey
    });

    if (!hasGeminiKey) {
      // Usar respostas simuladas
      let simulatedResponse = SIMULATED_RESPONSES.default;

      if (data.question) {
        const question = data.question.toLowerCase();
        if (question.includes('cronograma') || question.includes('plano') || question.includes('estudo')) {
          simulatedResponse = SIMULATED_RESPONSES.cronograma;
        } else if (question.includes('explique') || question.includes('conceito') || question.includes('princípio') || question.includes('legalidade')) {
          simulatedResponse = SIMULATED_RESPONSES.conceito;
        } else if (question.includes('questão') || question.includes('questões') || question.includes('simulado')) {
          simulatedResponse = SIMULATED_RESPONSES.questoes;
        }
      }

      return NextResponse.json({
        success: true,
        response: `${simulatedResponse}\n\n---\n\n⚠️ **Modo Demonstração**: Esta resposta foi simulada. Para habilitar o **Chat IA** e **Assistente IA** completos, configure sua chave da API do Google Gemini:\n\n### 🔧 **Como configurar:**\n\n1. **Obtenha sua chave gratuita**: [Google AI Studio](https://makersuite.google.com/app/apikey)\n2. **Crie o arquivo** \`.env.local\` na raiz do projeto\n3. **Adicione a linha**:\n   \`\`\`\n   # Para Chat IA e Assistente IA\n   NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_aqui\n   \`\`\`\n4. **Reinicie o servidor**: \`npm run dev\`\n\n### ✨ **Com a API configurada você terá**:\n- 🤖 Respostas reais da IA especializada em Direito\n- 📚 Explicações detalhadas de conceitos jurídicos\n- 📅 Cronogramas personalizados inteligentes\n- 🎯 Questões específicas para seu concurso\n- 💬 Chat interativo ilimitado`,
        timestamp: new Date().toISOString(),
        isDemo: true
      });
    }

    // Usar a API real do Gemini
    let result;

    switch (type) {
      case 'question':
        result = await askLegalAI(data.question, data.context);
        break;
        
      case 'study-plan':
        result = await generateLegalStudyPlan({
          availableHours: data.availableHours,
          targetExam: data.targetExam,
          weakAreas: data.weakAreas,
          studyMethod: data.studyMethod,
          timeFrame: data.timeFrame || '6 meses'
        });
        break;
        
      case 'explain-concept':
        result = await explainLegalConcept(
          data.concept, 
          data.subject, 
          data.level || 'intermediário'
        );
        break;
        
      case 'generate-questions':
        result = await generateLegalQuestions(
          data.subject, 
          data.difficulty, 
          data.examBoard || 'Qualquer',
          data.quantity || 5
        );
        break;
        
      default:
        return NextResponse.json(
          { error: 'Tipo de requisição não reconhecido' },
          { status: 400 }
        );
    }

    if (!result.success) {
      // Se for erro de API key inválida, usar resposta simulada
      if (result.error === 'API_KEY_INVALID') {
        let simulatedResponse = SIMULATED_RESPONSES.default;

        if (data.question) {
          const question = data.question.toLowerCase();
          if (question.includes('cronograma') || question.includes('plano') || question.includes('estudo')) {
            simulatedResponse = SIMULATED_RESPONSES.cronograma;
          } else if (question.includes('explique') || question.includes('conceito') || question.includes('princípio') || question.includes('legalidade')) {
            simulatedResponse = SIMULATED_RESPONSES.conceito;
          } else if (question.includes('questão') || question.includes('questões') || question.includes('simulado')) {
            simulatedResponse = SIMULATED_RESPONSES.questoes;
          }
        }

        return NextResponse.json({
          success: true,
          response: `${simulatedResponse}\n\n---\n\n⚠️ **API Key Inválida**: A chave do Google Gemini no \`.env.local\` não é válida. Para usar a IA real:\n\n### 🔧 **Como obter uma chave válida:**\n\n1. **Acesse**: [Google AI Studio](https://makersuite.google.com/app/apikey)\n2. **Faça login** com sua conta Google\n3. **Clique** em "Create API Key"\n4. **Copie** a chave gerada\n5. **Substitua** no arquivo \`.env.local\`:\n   \`\`\`\n   NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_real_aqui\n   \`\`\`\n6. **Reinicie** o servidor: \`npm run dev\`\n\n### ✨ **A API do Gemini é gratuita** com cota generosa para uso pessoal!`,
          timestamp: new Date().toISOString(),
          isDemo: true
        });
      }
      
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      response: result.text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API da IA:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
