# 🤖 Configuração da API do Google Gemini

Este guia explica como configurar a API do Google Gemini para habilitar completamente os recursos de **Chat IA** e **Assistente IA** da plataforma.

## 🎯 **O que será habilitado**

Com a API configurada, você terá acesso a:

- ✅ **Chat Interativo Real**: Conversas naturais com IA especializada em Direito
- ✅ **Explicações Detalhadas**: Conceitos jurídicos explicados de forma didática  
- ✅ **Cronogramas Personalizados**: Planos de estudo adaptados ao seu objetivo
- ✅ **Questões Customizadas**: Geração de questões específicas para seu concurso
- ✅ **Assistente Jurídico**: Suporte 24/7 para dúvidas de estudo

## 🆓 **API Gratuita**

A API do Google Gemini oferece uma **cota gratuita generosa**, suficiente para uso pessoal intensivo:

- 🔢 **15 requisições por minuto**
- 📊 **1 milhão de tokens por mês**
- 💰 **Completamente gratuito** para uso moderado

## 📋 **Passo a Passo**

### **1. Obter a API Key**

1. Acesse: [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em **"Create API Key"**
4. Selecione um projeto existente ou crie um novo
5. **Copie a chave gerada** (ex: `AIzaSy...`)

### **2. Configurar no Projeto**

#### **Opção A: Arquivo .env.local (Recomendado)**

1. Na **raiz do projeto**, crie o arquivo `.env.local`
2. Adicione a linha:
```bash
# API do Google Gemini para Chat IA e Assistente IA
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...sua_chave_aqui
```

#### **Opção B: Deploy na Vercel**

1. No dashboard da Vercel, vá em **Settings > Environment Variables**
2. Adicione:
   - **Name**: `NEXT_PUBLIC_GEMINI_API_KEY`
   - **Value**: `AIzaSy...sua_chave_aqui`
3. Faça redeploy do projeto

### **3. Testar a Configuração**

1. **Reinicie o servidor**: `npm run dev`
2. Acesse o **Chat IA**: `/chat-ia`
3. Envie uma mensagem teste
4. Se configurado corretamente, você verá respostas reais da IA

## 🔧 **Troubleshooting**

### **❌ Ainda vejo "Modo Demonstração"**

**Possíveis causas:**
- Chave não foi salva corretamente no `.env.local`
- Servidor não foi reiniciado após adicionar a chave
- Chave contém caracteres especiais ou espaços extras

**Solução:**
1. Verifique se o arquivo `.env.local` está na raiz do projeto
2. Confirme que a chave está correta (sem espaços extras)
3. Reinicie o servidor: `Ctrl+C` e depois `npm run dev`

### **❌ Erro "API Key Invalid"**

**Possíveis causas:**
- Chave digitada incorretamente
- Chave foi revogada no Google AI Studio
- Projeto não tem permissões necessárias

**Solução:**
1. Gere uma nova chave no [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Substitua no `.env.local`
3. Reinicie o servidor

### **❌ Error "Quota Exceeded"**

**Causa:** Cota gratuita foi ultrapassada

**Solução:**
1. Aguarde até o próximo mês para renovação da cota
2. Ou configure billing no Google Cloud Console para cota ilimitada

## 🔒 **Segurança**

### **⚠️ Nunca commite a chave no Git**

O arquivo `.env.local` está no `.gitignore` por segurança. **Nunca** adicione sua chave diretamente no código.

### **✅ Boas práticas:**

- Use `.env.local` para desenvolvimento local
- Use variáveis de ambiente na produção
- Regenere a chave periodicamente
- Monitore o uso no Google AI Studio

## 📊 **Monitoramento**

Acompanhe o uso da sua API em:
- [Google AI Studio - Usage](https://makersuite.google.com/app/usage)
- Visualize requisições, tokens usados e limites

## 💡 **Dicas Avançadas**

### **Performance**
- A IA funciona melhor com perguntas específicas
- Contexto de conversas anteriores melhora respostas
- Use linguagem natural e detalhada

### **Prompts Eficazes**
```
❌ Ruim: "Explique direito"
✅ Bom: "Explique o princípio da legalidade no Direito Administrativo com exemplos práticos"

❌ Ruim: "Cronograma"  
✅ Bom: "Crie um cronograma de 20h semanais para concurso de Procurador do Estado, focando em minhas dificuldades em Direito Penal"
```

## 🆘 **Suporte**

Se ainda tiver problemas:

1. **Verifique os logs** no console do navegador (F12)
2. **Teste a chave** diretamente no Google AI Studio
3. **Abra uma issue** no GitHub com detalhes do erro
4. **Contate o suporte**: mindtech.suporte@gmail.com

---

**✨ Com a API configurada, você terá uma experiência completa de estudo com IA!**