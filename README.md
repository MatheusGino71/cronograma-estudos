# MindTech - Plataforma Completa de Gestão de Estudos

Uma plataforma completa para organização de cronogramas de estudo, catálogo de disciplinas, simulados interativos e acompanhamento de progresso com analytics avançados.

## 🚀 Funcionalidades Principais

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

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 15** - React Framework com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Styling utilitário
- **shadcn/ui** - Componentes UI modernos
- **Lucide React** - Ícones consistentes

### Estado e Dados
- **Zustand** - Gerenciamento de estado global com persistência
- **TanStack Query** - Cache e sincronização de dados
- **localStorage** - Persistência local

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
│   └── api/               # API Routes
├── components/            # Componentes reutilizáveis
│   ├── ui/               # shadcn/ui components
│   ├── scheduler/        # Componentes de cronograma
│   ├── disciplines/      # Componentes de disciplinas
│   └── charts/           # Componentes de gráficos
├── hooks/                # Custom React hooks
├── lib/                  # Utilitários e configurações
├── store/                # Zustand stores
├── types/                # TypeScript type definitions
└── styles/               # CSS global e configurações
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
```bash
cd mindtech
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📜 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm start            # Servidor de produção
npm run lint         # Verificar linting
npm run type-check   # Verificar tipos TypeScript
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

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Docker
```dockerfile
# Dockerfile incluído no projeto
FROM node:18-alpine
# ... configuração completa
```

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
