# MindTech - Plataforma Completa de Gestão de Estudos

Uma plataforma completa para organização de cronogramas de estudo, catálogo de disciplinas, simulados interativos, assistente de IA especializado em Direito e acompanhamento de progresso com analytics avançados.

🌐 **Aplicação Online**: https://cronograma-estudos-c3a5b.web.app
🔗 **Repositório**: https://github.com/MatheusGino71/cronograma-estudos

## 🚀 Funcionalidades Principais

### 🤖 **MindLegal AI - Assistente Jurídico Inteligente** ⭐ **NOVO!**
- **Google Gemini Integration**: IA especializada em Direito brasileiro
- **Chat Interativo**: Interface dedicada com layout responsivo (`/chat-ia`)
- **Respostas Especializadas**: Cronogramas, explicações jurídicas, questões de concurso
- **Sistema de Fallback**: Funciona mesmo sem chave API (modo demonstração)
- **Markdown Rendering**: Respostas formatadas com sintaxe destacada
- **Sugestões Inteligentes**: Detecção automática do tipo de pergunta
- **Especialização Jurídica**: Focado em concursos públicos brasileiros

### 🔐 Sistema de Autenticação
- **Firebase Authentication**: Login seguro com email/senha
- **Perfil Personalizado**: Informações do usuário e preferências
- **Recuperação de Senha**: Sistema de reset por email
- **Sessões Persistentes**: Mantenha-se logado com segurança

### 📅 Cronograma Inteligente
- **Drag & Drop Calendar**: Interface intuitiva para organizar blocos de estudo
- **Método 1-3-7**: Implementação do sistema de revisões espaçadas
- **Notificações Push**: Lembretes automáticos para sessões de estudo
- **Widget de Aderência**: Acompanhamento em tempo real do cumprimento do cronograma
- **Gerador de Planos**: Wizard para criação automática de cronogramas

### 📚 Catálogo de Disciplinas
- **Busca Avançada**: Filtros por área, dificuldade, carga horária e mais
- **Sistema de Favoritos**: Marque disciplinas de interesse
- **Comparação**: Compare até 3 disciplinas lado a lado
- **Visualizações**: Modo grade e tabela com ordenação avançada
- **Estatísticas Detalhadas**: Progresso individual por disciplina

### 🎯 Simulados Interativos
- **62 Questões Reais**: Base de questões de concursos públicos
- **Configuração Avançada**: Por disciplina ou modo geral
- **Feedback Imediato**: Gabarito após cada questão (opcional)
- **Estatísticas Detalhadas**: Performance por disciplina
- **Sistema de Filtros**: Quantidade personalizável (5, 10, 20, 30, 50, todas)

### 📊 Analytics de Progresso
- **KPIs Dinâmicos**: Métricas automáticas de performance
- **Gráficos Interativos**: Trends de estudo e distribuição por disciplinas
- **Heatmap Semanal**: Visualização da consistência de estudos
- **Insights Automáticos**: Sugestões baseadas no comportamento de estudo
- **Exportação**: Relatórios em PDF e CSV

### ⚙️ Configurações Avançadas
- **Painel de Configurações**: Personalização completa da experiência
- **Notificações**: Controle total sobre alertas e lembretes
- **Aparência**: Temas claro/escuro e tamanho de fonte
- **Privacidade**: Controles de visibilidade e compartilhamento
- **Backup de Dados**: Exportação e importação de dados

## 🤖 **Como Usar o MindLegal AI**

### 🚀 **Acesso Rápido:**
- **Chat Direto**: https://cronograma-estudos-c3a5b.web.app/chat-ia
- **Página Completa**: https://cronograma-estudos-c3a5b.web.app/assistente-ia

### 💡 **Exemplos de Perguntas:**
```
📅 "Crie um cronograma de estudos para Procurador Federal com 25h semanais"
📚 "Explique o princípio da legalidade com exemplos práticos"
📝 "Gere 10 questões de Direito Constitucional estilo CESPE"
🧠 "Como memorizar as competências do STF?"
```

### ⚡ **Funcionalidades da IA:**
- **Cronogramas Personalizados** - Para qualquer concurso público
- **Explicações Jurídicas** - Conceitos com exemplos e jurisprudência
- **Questões de Concurso** - No estilo das principais bancas (CESPE, FCC, FGV)
- **Técnicas de Memorização** - Métodos específicos para Direito
- **Jurisprudência Atualizada** - Decisões dos tribunais superiores

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - React Framework com App Router e Turbopack
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Styling utilitário
- **shadcn/ui** - Componentes UI modernos baseados em Radix UI
- **Lucide React** - Ícones consistentes
- **React Markdown** - Renderização de markdown para IA

### Inteligência Artificial
- **Google Gemini AI** - Modelo de linguagem especializado
- **@google/generative-ai** - SDK oficial do Google Gemini
- **Sistema de Fallback** - Respostas simuladas quando offline
- **Especialização Jurídica** - Prompts otimizados para Direito brasileiro

### Backend & Banco de Dados
- **🔥 Firebase** - Plataforma completa do Google
  - **Authentication**: Sistema de autenticação com email/senha
  - **Firestore**: Banco de dados NoSQL em tempo real
  - **Hosting**: Deploy automático com CDN global
  - **Storage**: Armazenamento de arquivos (configurado)
  - **Analytics**: Métricas de uso da aplicação

### Configuração Firebase
```typescript
// Projeto Firebase: cronograma-estudos-c3a5b
const firebaseConfig = {
  projectId: "cronograma-estudos-c3a5b",
  authDomain: "cronograma-estudos-c3a5b.firebaseapp.com",
  // Configurações de segurança omitidas
}
```

### Estrutura do Banco (Firestore)
```typescript
// Coleções principais:
users/           // Dados dos usuários
├── {userId}/
    ├── name: string
    ├── email: string
    ├── avatar: string
    ├── createdAt: timestamp
    └── updatedAt: timestamp

schedules/       // Cronogramas de estudo  
├── {scheduleId}/
    ├── userId: string
    ├── blocks: StudyBlock[]
    ├── createdAt: timestamp
    └── updatedAt: timestamp

progress/        // Logs de progresso
├── {progressId}/
    ├── userId: string
    ├── disciplineId: string
    ├── hoursStudied: number
    ├── adherenceRate: number
    └── date: timestamp
```

### Estado e Dados
- **Zustand** - Gerenciamento de estado global com persistência
- **TanStack Query** - Cache e sincronização de dados
- **Firebase SDK** - Integração nativa com serviços Firebase

### Formulários e Validação
- **React Hook Form** - Gestão de formulários
- **Zod** - Validação de esquemas TypeScript

### Tabelas e Dados
- **TanStack Table** - Tabelas avançadas com filtros e ordenação
- **date-fns** - Manipulação de datas com locale pt-BR

### Gráficos e Visualizações
- **Recharts** - Gráficos responsivos e interativos
- **html2canvas + jsPDF** - Exportação de relatórios

### Qualidade de Código
- **ESLint** - Linting
- **Prettier** - Formatação
- **Husky + lint-staged** - Git hooks

### Testes (Configuração Preparada)
- **Vitest** - Testes unitários
- **Testing Library** - Testes de componentes
- **Playwright** - Testes E2E

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── cronograma/        # Página de cronograma
│   ├── disciplinas/       # Página de disciplinas  
│   ├── progresso/         # Página de analytics
│   ├── perfil/           # Página de perfil do usuário
│   ├── estudos/          # Dashboard de estudos
│   ├── configuracoes/    # Painel de configurações
│   ├── simulado/         # Sistema de simulados
│   ├── assistente-ia/    # Página completa da IA ⭐ NOVO!
│   ├── chat-ia/          # Chat dedicado da IA ⭐ NOVO!
│   └── api/              # API Routes
│       └── ai/           # Endpoint da IA ⭐ NOVO!
├── components/            # Componentes reutilizáveis
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Componentes de autenticação
│   ├── ai/               # Componentes da IA ⭐ NOVO!
│   │   ├── AIChat.tsx    # Chat principal
│   │   └── ImprovedAIChat.tsx # Chat melhorado
│   ├── scheduler/        # Componentes de cronograma
│   ├── disciplines/      # Componentes de disciplinas
│   └── charts/           # Componentes de gráficos
├── contexts/             # React Context (Auth)
├── hooks/                # Custom React hooks
├── lib/                  # Utilitários e configurações
│   ├── firebase.ts       # Configuração Firebase
│   ├── gemini.ts         # Configuração Gemini ⭐ NOVO!
│   └── gemini-api.ts     # API da IA ⭐ NOVO!
├── store/                # Zustand stores
├── types/                # TypeScript type definitions
└── styles/               # CSS global e configurações
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Firebase (para funcionalidades completas)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/MatheusGino71/cronograma-estudos.git
cd cronograma-estudos
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id

# Google Gemini AI Configuration ⭐ NOVO!
GOOGLE_GEMINI_API_KEY=sua_chave_gemini_aqui
```

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

### 🔥 Configuração Firebase (Opcional para desenvolvimento)

1. **Crie um projeto no Firebase Console**
   - Acesse [Firebase Console](https://console.firebase.google.com)
   - Crie um novo projeto
   - Ative Authentication, Firestore e Hosting

2. **Configure Authentication**
   - Ative o provedor Email/Senha
   - Configure domínios autorizados

3. **Configure Firestore**
   - Crie o banco em modo teste
   - Importe as regras de segurança do arquivo `firestore.rules`

4. **Deploy (Opcional)**
```bash
npm run build
firebase deploy
```

## 📜 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento com Turbopack
npm run build        # Build para produção com export estático
npm start            # Servidor de produção
npm run lint         # Verificar linting
npm run type-check   # Verificar tipos TypeScript

# Firebase Commands
firebase login       # Fazer login no Firebase CLI
firebase init        # Inicializar projeto Firebase
firebase deploy      # Deploy completo
firebase deploy --only hosting  # Deploy apenas do frontend
```

## 🔐 Configuração de Segurança

### Firestore Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cronogramas privados por usuário
    match /schedules/{scheduleId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Progress logs privados por usuário  
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### Configuração de Hosting
```json
// firebase.json
{
  "hosting": {
    "public": "out",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|ico|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

## 🗄️ Estrutura de Dados

### Tipos Principais

```typescript
interface StudyBlock {
  id: string
  disciplineId: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  completed: boolean
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'study' | 'review' | 'practice'
}

interface Discipline {
  id: string
  name: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedHours: number
  color: string
  description: string
  prerequisites: string[]
  tags: string[]
}

interface ProgressLog {
  id: string
  disciplineId: string
  date: Date
  hoursStudied: number
  blocksCompleted: number
  adherenceRate: number
}
```

## 🎨 Design System

### Cores Principais
- **Primária**: Red-600 (#DC2626)
- **Secundária**: Green-600 (#16A34A) 
- **Acento**: Purple-600 (#9333EA)
- **Alerta**: Orange-600 (#EA580C)

### Tipografia
- **Fonte**: Inter (variável)
- **Escala**: 4xl, 3xl, 2xl, xl, lg, base, sm, xs

## 🔧 Configurações Avançadas

### Persistência de Estado
O estado da aplicação é automaticamente persistido no localStorage através do Zustand:

```typescript
export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      // estado e actions
    }),
    {
      name: 'schedule-storage'
    }
  )
)
```

### React Query
Configuração para cache e sincronização:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
  },
})
```

## 🧪 Testes (Preparado para Implementação)

Estrutura preparada para testes:

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📱 PWA e Acessibilidade

- **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Acessibilidade**: Segue diretrizes WCAG 2.1
- **Performance**: Otimizado para Core Web Vitals
- **SEO**: Meta tags otimizadas e structured data

## 🌐 Internacionalização (Preparado)

Estrutura preparada para múltiplos idiomas:

```typescript
// Configuração next-intl preparada
const locale = 'pt-BR' // Padrão português brasileiro
```

## 🚀 Deploy

### 🔥 Firebase Hosting (Atual)
```bash
# Build e deploy automático
npm run build
firebase deploy --only hosting

# URL de produção
# https://cronograma-estudos-c3a5b.web.app
```

### Vercel (Alternativo)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
# Dockerfile incluído no projeto
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🌐 URLs do Projeto

- **🚀 Aplicação**: https://cronograma-estudos-c3a5b.web.app
- **📊 Firebase Console**: https://console.firebase.google.com/project/cronograma-estudos-c3a5b
- **📁 GitHub**: https://github.com/MatheusGino71/cronograma-estudos
- **🔧 Local**: http://localhost:3000

## 📈 Métricas e Analytics

### KPIs Monitorados
- Taxa de aderência ao cronograma
- Horas de estudo por dia/semana/mês  
- Distribuição de tempo por disciplina
- Sequências de estudo (streaks)
- Progresso por categoria de dificuldade

### Insights Automáticos
- Detecção de padrões de estudo
- Sugestões de otimização
- Alertas de baixa aderência
- Recomendações de revisão

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade incrível'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/) - Framework React
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - CSS utilitário
- [Recharts](https://recharts.org/) - Biblioteca de gráficos
- Inspiração: [meucurso.com.br](https://meucurso.com.br)

---

**Feito com ❤️ para estudantes que buscam excelência acadêmica**
