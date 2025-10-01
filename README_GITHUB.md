# 🎓 Sistema de Cronograma de Estudos - Plataforma Educacional com IA

> **Plataforma educacional completa com inteligência artificial integrada para cronogramas de estudo personalizados**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-10.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Visão Geral

Sistema completo de cronograma de estudos com recursos avançados de IA, incluindo:

- **🔥 Firebase Database**: 5.422+ questões jurídicas reais
- **🤖 NotebookLM + Gemini AI**: Integração dupla para geração de conteúdo
- **🎙️ Sistema de Voz Premium**: ElevenLabs com vozes humanizadas
- **🎬 Geração de Videoaulas**: Criação automática com thumbnails dinâmicos
- **🗂️ Mapas Mentais Inteligentes**: Baseados em dados reais
- **📻 Podcasts Educacionais**: Até 15+ minutos de duração
- **📊 Analytics Avançados**: Acompanhamento detalhado de progresso

## ✨ Funcionalidades Principais

### 🎯 Cronograma Inteligente
- Planejamento personalizado baseado em metas
- Distribuição otimizada de disciplinas
- Acompanhamento de aderência em tempo real
- Calendário interativo com visualização semanal

### 🤖 IA Integrada (NotebookLM + Gemini)
- **NotebookLM API**: Análise profunda de conteúdo
- **Gemini AI**: Fallback inteligente
- Geração de mapas mentais contextualizados
- Criação de podcasts educacionais longos
- Análise inteligente de progresso

### 🎥 Sistema de Videoaulas
- Geração automática de scripts
- Thumbnails dinâmicos com Canvas API
- Player integrado com controles completos
- Armazenamento local persistente
- Sistema de qualidade configurável (720p, 1080p, 4K)

### 🎙️ Vozes Humanizadas Premium
- **ElevenLabs API**: 15+ vozes portuguesas premium
- **Web Speech API**: Fallback nativo
- Controle de velocidade e tom
- Suporte a textos longos (15+ minutos)
- Sistema de retry automático

### 📊 Database Firebase Completo
- **5.422+ questões jurídicas** reais extraídas
- 20+ disciplinas jurídicas categorizadas
- Sistema de busca inteligente
- Extração automática de palavras-chave
- Pontuação de relevância

### 🔐 Sistema de Autenticação
- Firebase Authentication
- Autenticação de dois fatores
- Perfis de usuário personalizados
- Sincronização cross-device

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15.5.2** - Framework React com Turbopack
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes modernos
- **Recharts** - Gráficos e visualizações

### Backend & IA
- **Firebase** - Database e autenticação
- **NotebookLM API** - IA primária para análise
- **Google Gemini AI** - IA secundária (fallback)
- **ElevenLabs API** - Síntese de voz premium
- **Canvas API** - Geração de thumbnails

### Infraestrutura
- **Vercel** - Deploy e hosting
- **GitHub Actions** - CI/CD automatizado
- **ESLint** - Qualidade de código
- **TypeScript** - Verificação de tipos

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Firebase
- Chaves de API (NotebookLM, Gemini, ElevenLabs)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/cronograma-estudos.git
cd cronograma-estudos
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# IA APIs
NOTEBOOKLM_API_KEY=key_seu_notebooklm_api_key_aqui
GOOGLE_GEMINI_API_KEY=AIzaSy...sua_gemini_key_aqui

# ElevenLabs (Vozes Premium)
ELEVENLABS_API_KEY=sk_...sua_elevenlabs_key_aqui
```

### 4. Execute o projeto
```bash
npm run dev
# ou
yarn dev
```

O sistema estará disponível em `http://localhost:3000`

## 📱 Uso do Sistema

### Dashboard Principal
1. Acesse a página inicial para visão geral do progresso
2. Configure suas metas e preferências
3. Visualize estatísticas detalhadas

### NotebookLM IA
1. Acesse `/notebook-ia`
2. Gere mapas mentais inteligentes
3. Crie podcasts educacionais longos
4. Analise seu progresso com IA
5. Gere videoaulas automaticamente

### Cronograma
1. Configure disciplinas e horários
2. Defina metas semanais/mensais  
3. Acompanhe aderência em tempo real
4. Ajuste automaticamente com base no progresso

### Simulados
1. Acesse banco com 5.422+ questões reais
2. Configure simulados personalizados
3. Receba feedback detalhado
4. Identifique pontos de melhoria

## 🔧 Estrutura do Projeto

```
cronograma-estudos/
├── src/
│   ├── app/                     # App Router (Next.js 15)
│   │   ├── api/                 # API Routes
│   │   ├── notebook-ia/         # IA Integrada
│   │   └── ...páginas
│   ├── components/              # Componentes React
│   │   ├── notebook-ia/         # Componentes IA
│   │   ├── ui/                  # UI Components (shadcn)
│   │   └── ...outros
│   ├── lib/                     # Utilities e configurações
│   │   ├── firebase.ts          # Config Firebase
│   │   ├── gemini.ts           # Gemini AI
│   │   └── tts-service.ts      # Serviço de voz
│   └── types/                   # Definições TypeScript
├── public/                      # Assets estáticos
└── docs/                        # Documentação
```

## 🎯 Funcionalidades em Destaque

### 🤖 IA NotebookLM + Gemini
- Sistema hierárquico com fallback inteligente
- Geração de conteúdo baseado em 5.422+ questões reais
- Análise contextual profunda
- Criação de mapas mentais dinâmicos

### 🎙️ Sistema de Voz ElevenLabs Premium
- 15+ vozes portuguesas humanizadas
- Podcasts de até 15+ minutos
- Controle avançado de qualidade
- Sistema de retry para estabilidade

### 🎬 Geração de Videoaulas
- Scripts automáticos baseados em IA
- Thumbnails gerados dinamicamente
- Player completo com controles
- Múltiplas qualidades (720p, 1080p, 4K)

### 📊 Analytics Avançados
- Acompanhamento de aderência
- Gráficos interativos de progresso
- Insights baseados em IA
- Relatórios personalizados

## 🐛 Debugging e Qualidade

### Sistema de Logs Avançado
- Logs detalhados para cada operação
- Sistema de fallback robusto
- Tratamento de erros abrangente
- Validação de entrada rigorosa

### Testes de Qualidade
- Validação de API keys
- Testes de timeout e retry
- Verificação de corrupção de dados
- Sistema de cleanup automático

## 🔒 Segurança

- Validação de entrada em todas as APIs
- Sanitização de dados do usuário
- Rate limiting implementado
- Chaves de API protegidas
- Autenticação de dois fatores

## 📈 Performance

- Next.js 15 com Turbopack
- Lazy loading de componentes
- Otimização de imagens automática
- Cache inteligente
- Compressão de assets

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

- 📧 Email: suporte@cronograma-estudos.com
- 💬 Discord: [Link do servidor]
- 📖 Documentação: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/cronograma-estudos/issues)

## 🙏 Agradecimentos

- Firebase por fornecer infraestrutura robusta
- NotebookLM pela API de IA avançada
- ElevenLabs pelas vozes premium
- Comunidade Next.js pelo framework incrível
- Contributors que tornaram este projeto possível

---

**⭐ Se este projeto te ajudou, considere dar uma estrela no GitHub!**

**🚀 Desenvolvido com ❤️ para a comunidade educacional brasileira**