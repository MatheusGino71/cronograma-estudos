# Sistema Administrativo - OAB Nomenalista

## 🔐 Acesso Administrativo

### Credenciais de Admin
```
Email: stadm@administrativo.com
Senha: adm2714
```

### Como Acessar

1. **Via Tela de Login:**
   - Clique no botão "Entrar" na navegação
   - Na tela de login, clique em "Área Administrativa"
   - As credenciais serão preenchidas automaticamente
   - Clique em "Entrar"

2. **Via Navegação (após login):**
   - Após fazer login como administrador, um link "Admin" aparecerá na navegação
   - Clique no link "Admin" para acessar o painel administrativo

## 📊 Funcionalidades Administrativas

### 1. Dashboard Principal (`/admin`)
- **Estatísticas Globais:**
  - Total de usuários cadastrados
  - Total de questões no banco
  - Total de questões respondidas
  - Taxa média de acerto

- **Cards de Ação:**
  - Gerenciar Usuários
  - Histórico de Questões
  - Estatísticas Avançadas (em desenvolvimento)

### 2. Gerenciar Usuários (`/admin/usuarios`)
- **Visualização de Usuários:**
  - Lista completa de todos os usuários
  - Avatar personalizado com iniciais
  - Informações: Nome, Email, Telefone
  - Estatísticas: Questões respondidas, Taxa de acerto

- **Funcionalidades:**
  - 🔍 Busca por nome ou email
  - 👁️ Ver detalhes completos do usuário
  - ✏️ Editar informações (em desenvolvimento)
  - 🗑️ Excluir usuário
  - 🛡️ Tornar/Remover administrador
  - 📊 Ver questões respondidas por usuário

### 3. Histórico de Questões (`/admin/historico`)
- **Visualização Global:**
  - Todas as questões respondidas por todos os usuários
  - Informações detalhadas de cada resposta

- **Filtros Avançados:**
  - Por tipo: Todas / Acertos / Erros
  - Por disciplina
  - Busca por conteúdo ou usuário

- **Estatísticas:**
  - Total de questões respondidas
  - Total de acertos
  - Total de erros
  - Taxa de acerto global

- **Detalhes de Cada Questão:**
  - Usuário que respondeu
  - Data e hora da resposta
  - Tempo gasto
  - Resposta do usuário vs Resposta correta
  - Número de tentativas
  - Todas as alternativas com feedback visual

### 4. Gestão de Questões (`/admin/questoes`)
- Migração de questões do Excel para Firebase
- Limpeza do banco de dados
- Estatísticas de migração

## 🔒 Segurança

### Proteção de Rotas
- Todas as páginas administrativas verificam se o usuário tem `isAdmin: true`
- Redirecionamento automático para home se não for admin
- Componente `AdminGuard` para proteção adicional

### Modo de Desenvolvimento
- Em desenvolvimento, qualquer email pode fazer login
- O email `stadm@administrativo.com` com senha `adm2714` garante privilégios de admin
- O email `admin@admin.com` também tem privilégios de admin (modo desenvolvimento)

### Produção (Firebase)
- Em produção, apenas usuários com campo `isAdmin: true` no Firestore terão acesso
- As credenciais devem ser validadas pelo Firebase Authentication
- Para tornar um usuário admin em produção, adicione `isAdmin: true` no documento do Firestore

## 🎨 Interface

### Cores do Sistema Admin
- **Principal:** Roxo (`#9333EA`, `purple-600`)
- **Acertos:** Verde (`#16A34A`, `green-600`)
- **Erros:** Vermelho (`#FF3347`)
- **Informação:** Azul (`#3D5AFE`)

### Ícones
- 🛡️ Shield - Administração
- 👥 Users - Usuários
- 📋 FileQuestion - Questões
- 📊 BarChart3 - Estatísticas
- ⚙️ Settings - Configurações

## 📱 Responsividade

Todas as páginas administrativas são totalmente responsivas:
- Desktop: Grid com múltiplas colunas
- Tablet: Grid adaptativo
- Mobile: Lista vertical com scroll

## 🚀 Próximas Funcionalidades

- [ ] Edição completa de dados de usuários
- [ ] Exportação de relatórios em PDF/Excel
- [ ] Gráficos e dashboards avançados
- [ ] Logs de atividade do sistema
- [ ] Configurações globais da plataforma
- [ ] Sistema de notificações para usuários
- [ ] Backup automático do banco de dados
- [ ] Análise de performance dos usuários
- [ ] Recomendações personalizadas baseadas em IA

## 📝 Notas Técnicas

### Estrutura de Arquivos
```
src/
├── app/
│   └── admin/
│       ├── page.tsx                 # Dashboard principal
│       ├── usuarios/
│       │   └── page.tsx            # Gestão de usuários
│       ├── historico/
│       │   └── page.tsx            # Histórico de questões
│       └── questoes/
│           └── page.tsx            # Migração de questões
├── components/
│   └── auth/
│       └── AdminGuard.tsx          # Proteção de rotas
├── contexts/
│   └── AuthContext.tsx             # Contexto com isAdmin
└── types/
    └── auth.ts                     # User type com isAdmin
```

### localStorage
O sistema admin utiliza os mesmos dados do localStorage dos usuários:
- `historico-questoes`: Array com todas as questões respondidas
- `estatisticas-questoes`: Objeto com estatísticas gerais

### Simulação de Dados
Atualmente, os dados de múltiplos usuários são simulados no histórico.
Em produção, isso virá do Firebase Firestore com queries reais.

## 🐛 Troubleshooting

### "Acesso Negado"
- Verifique se fez login com `stadm@administrativo.com`
- Verifique se a senha está correta: `adm2714`
- Limpe o cache e tente novamente

### Link "Admin" não aparece
- Faça logout e login novamente
- Verifique se o email usado tem privilégios de admin
- Verifique o console do navegador para erros

### Dados não aparecem
- Em desenvolvimento, os dados vêm do localStorage
- Responda algumas questões em `/questoes/pratica` primeiro
- Verifique se há dados no localStorage (DevTools → Application → Local Storage)
