# 🤖 MindLegal AI - Assistente Jurídico Inteligente

## Configuração da IA

### 1. Obter API Key do Google Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### 2. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Adicione sua chave do Gemini no arquivo `.env.local`:
```env
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_aqui
```

## Funcionalidades da IA

### 🎯 **Especialização em Direito**
- **12 disciplinas jurídicas** cobertas
- **Jurisprudência** dos tribunais superiores
- **Legislação** sempre atualizada
- **Técnicas de estudo** para concursos

### 💬 **Chat Inteligente**
- Respostas contextualizadas
- Explicações didáticas
- Exemplos práticos
- Citações legais

### 📚 **Funcionalidades Avançadas**

#### 1. **Explicações Jurídicas**
```typescript
// Exemplo de uso
explainLegalConcept('devido processo legal', 'Direito Constitucional')
```

#### 2. **Cronogramas Personalizados**
```typescript
// Geração de plano de estudos
generateStudyPlan({
  availableHours: 20,
  targetExam: 'Procurador do Estado',
  weakAreas: ['Direito Tributário', 'Direito Administrativo'],
  studyMethod: 'Teoria + Questões'
})
```

#### 3. **Questões de Concurso**
```typescript
// Criação de questões
generateQuestions('Direito Constitucional', 'intermediário', 5)
```

## Como Usar

### 1. **Acesse o Assistente**
- Navegue para `/assistente-ia`
- Ou clique no ícone 🤖 na navegação

### 2. **Tipos de Perguntas**

#### ✅ **Conceitos Jurídicos**
- "Explique o princípio da legalidade"
- "O que é devido processo legal?"
- "Diferença entre recurso ordinário e extraordinário"

#### ✅ **Cronogramas de Estudo**
- "Crie um cronograma de 30h semanais para OAB"
- "Plano de estudos para Delegado Civil"
- "Como organizar estudos em 6 meses?"

#### ✅ **Questões de Concurso**
- "5 questões de Direito Penal nível básico"
- "Questões sobre controle de constitucionalidade"
- "Simulado de Direito Administrativo CESPE"

#### ✅ **Técnicas de Memorização**
- "Como memorizar prazos do CPC?"
- "Dicas para decorar competências constitucionais"
- "Mapa mental de recursos no processo civil"

### 3. **Sugestões Rápidas**
O sistema oferece sugestões automáticas para começar:
- Explicar conceitos
- Criar cronogramas
- Gerar questões
- Dicas de estudo

## Disciplinas Cobertas

1. **Direito Constitucional** - Princípios, direitos fundamentais, organização do Estado
2. **Direito Administrativo** - Atos, licitações, servidores públicos
3. **Direito Civil** - Parte geral, obrigações, contratos, direitos reais
4. **Direito Penal** - Parte geral, crimes em espécie, execução penal
5. **Direito Processual Civil** - Novo CPC, recursos, execução
6. **Direito Processual Penal** - Inquérito, ação penal, provas, recursos
7. **Direito Trabalhista** - CLT, contrato de trabalho, direitos do trabalhador
8. **Direito Processual do Trabalho** - Reclamação, audiência, recursos
9. **Direito Tributário** - CTN, tributos, processo administrativo fiscal
10. **Direito Empresarial** - Empresa, sociedades, títulos de crédito
11. **Direito Previdenciário** - INSS, benefícios, segurados
12. **Direito Ambiental** - Meio ambiente, licenciamento, responsabilidade

## Características Técnicas

### 🧠 **Modelo: Google Gemini 1.5 Flash**
- Respostas rápidas e precisas
- Contexto de até 1024 tokens
- Temperatura otimizada para educação

### 🎯 **Prompt Engineering**
- Sistema especializado em Direito
- Contexto brasileiro
- Foco em concursos públicos
- Tom didático e profissional

### 🔒 **Limitações Importantes**
- ⚠️ **Não substitui advogado** - Apenas para fins educativos
- ⚠️ **Não é consultoria jurídica** - Conteúdo para estudos
- ⚠️ **Sempre consulte fontes oficiais** - Legislação e jurisprudência
- ⚠️ **Complementa professores** - Não substitui cursos especializados

## Troubleshooting

### ❌ **Erro: API Key inválida**
- Verifique se a chave está correta no `.env.local`
- Confirme se a API está ativa no Google AI Studio

### ❌ **Erro: Limite de requests**
- Google Gemini tem limite gratuito
- Aguarde ou considere upgrade do plano

### ❌ **Respostas lentas**
- Verifique conexão com internet
- Tente novamente em alguns segundos

## Suporte

Para dúvidas sobre a IA:
1. Verifique a configuração da API key
2. Consulte a documentação do Google Gemini
3. Teste com perguntas simples primeiro

---

**🎓 Bons estudos com seu assistente jurídico inteligente!**
