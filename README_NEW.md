# MindTech - Plataforma de Estudos para Concursos Jurídicos

Uma aplicação completa para gerenciamento de estudos voltada especificamente para estudantes de Direito e candidatos a concursos públicos da área jurídica.

## 🚀 Funcionalidades

### 🎯 **Core Features**
- **Autenticação Completa**: Sistema de login/registro via Firebase Auth
- **Cronogramas Personalizados**: Criação e gestão de cronogramas de estudo
- **Dashboard Inteligente**: Visualização de progresso e estatísticas
- **Perfil Dinâmico**: Gerenciamento completo do perfil do usuário
- **Tema Personalizável**: Modo claro/escuro com preferências do sistema

### 📚 **Disciplinas Especializadas**
- Direito Constitucional
- Direito Administrativo
- Direito Civil
- Direito Penal
- Direito Processual Civil
- Direito Processual Penal
- Direito Trabalhista
- Direito Processual do Trabalho
- Direito Tributário
- Direito Empresarial
- Direito Previdenciário
- Direito Ambiental

### 🤖 **MindLegal AI - Assistente Inteligente**
Powered by **Google Gemini 2.0 Flash**, nosso assistente oferece:

#### **Funcionalidades Principais**
- **Explicações Detalhadas**: Conceitos jurídicos explicados de forma clara
- **Cronogramas Personalizados**: Planos de estudo adaptados ao seu tempo
- **Geração de Questões**: Questões de concurso por disciplina e nível
- **Dicas de Memorização**: Técnicas específicas para conteúdo jurídico
- **Consulta de Jurisprudência**: Decisões relevantes dos tribunais superiores
- **Resumos de Leis**: Sínteses das principais legislações
- **Simulados**: Provas completas para prática
- **Planos de Revisão**: Estratégias de revisão periódica

#### **Especialização em Direito**
- Sistema prompts especializados em Direito brasileiro
- Base de conhecimento atualizada com legislação vigente
- Foco em concursos públicos e exame da OAB
- Linguagem técnica apropriada e didática

## 🛠 Tecnologias

### **Frontend**
- **Next.js 15.5.2** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de alta qualidade
- **Lucide React** - Ícones modernos

### **Backend & Serviços**
- **Firebase Authentication** - Sistema de autenticação
- **Firestore Database** - Banco de dados NoSQL
- **Firebase Hosting** - Hospedagem em produção
- **Google Gemini 2.0 Flash** - IA para assistente de estudos

### **Arquitetura**
- **React Context API** - Gerenciamento de estado global
- **Custom Hooks** - Lógica reutilizável
- **API Routes** - Endpoints Next.js
- **Responsive Design** - Interface adaptável

## 📦 Instalação

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta do Firebase
- Google AI Studio API Key

### **Setup do Projeto**
```bash
# Clone o repositório
git clone <repository-url>
cd mindtech

# Instale dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

### **Configuração do Firebase**
1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Configure Authentication (Email/Password)
3. Configure Firestore Database
4. Adicione as credenciais ao `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### **Configuração da IA**
1. Obtenha uma API Key no [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Adicione ao `.env.local`:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### **Execução**
```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 📱 Interface

### **Páginas Principais**
- **Dashboard** (`/`) - Visão geral e estatísticas
- **Cronogramas** (`/cronogramas`) - Gestão de cronogramas
- **Disciplinas** (`/disciplinas`) - Catálogo de matérias
- **Perfil** (`/perfil`) - Configurações do usuário
- **Assistente IA** (`/assistente-ia`) - Chat inteligente

### **Componentes Principais**
- **UserMenu** - Menu do usuário com navegação
- **ThemeToggle** - Alternador de tema
- **AIChat** - Interface de chat com IA
- **ProgressCard** - Cards de progresso
- **DisciplineCard** - Cards de disciplinas

## 🎨 Design System

### **Cores**
- **Primary**: Blue (Azul institucional)
- **Secondary**: Purple (Roxo complementar)
- **Accent**: Green (Verde de sucesso)
- **Neutral**: Gray scales

### **Tipografia**
- **Headings**: Font weight 600-700
- **Body**: Font weight 400-500
- **Mono**: Font family monospace para código

### **Componentes**
Baseado no **shadcn/ui** com customizações para:
- Cards responsivos
- Formulários acessíveis
- Navegação intuitiva
- Feedback visual

## 🔐 Segurança

### **Autenticação**
- Firebase Auth com email/senha
- Sessões seguras com tokens JWT
- Logout automático por inatividade
- Proteção de rotas sensíveis

### **Dados**
- Firestore Security Rules
- Validação client/server-side
- Sanitização de inputs
- Rate limiting para IA

### **API**
- CORS configurado
- Validação de API keys
- Error handling robusto
- Logs de segurança

## 📊 Analytics & Monitoramento

### **Métricas de Usuário**
- Tempo de estudo total
- Disciplinas mais estudadas
- Progresso por cronograma
- Atividade no assistente IA

### **Performance**
- Next.js Analytics
- Core Web Vitals
- Firebase Performance
- Error tracking

## 🚀 Deploy

### **Desenvolvimento**
```bash
# Servidor local
npm run dev # http://localhost:3000
```

### **Produção**
```bash
# Build e deploy Firebase
npm run build
firebase deploy
```

### **Ambientes**
- **Development**: `localhost:3000`
- **Production**: Firebase Hosting URL

## 📈 Roadmap

### **Próximas Features**
- [ ] Integração com calendário
- [ ] Notificações push
- [ ] Gamificação com pontos
- [ ] Grupos de estudo
- [ ] Integração com YouTube/PDF
- [ ] App mobile React Native
- [ ] Modo offline
- [ ] Sincronização multi-dispositivo

### **Melhorias de IA**
- [ ] Histórico de conversas
- [ ] Favoritar respostas
- [ ] Feedback de qualidade
- [ ] Múltiplos assistentes especializados
- [ ] Integração com jurisprudência em tempo real

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 🆘 Suporte

- **Documentação**: [Wiki do projeto]
- **Issues**: [GitHub Issues]
- **Email**: suporte@mindtech.com
- **Discord**: [Comunidade MindTech]

---

**MindTech** - Transformando a forma como você estuda Direito 🎓⚖️
