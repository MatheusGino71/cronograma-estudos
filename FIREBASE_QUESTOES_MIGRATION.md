# 🔥 Migração do Sistema de Questões para Firebase

## ✅ O que foi implementado

### 1. **Integração com Firebase Firestore**
- Substituído carregamento de CSV por queries ao Firestore
- Função `carregarQuestoes()` agora busca dados do Firebase
- Fallback automático para CSV caso Firebase falhe
- Suporte para ambos os formatos de dados (Excel e CSV)

### 2. **Sistema de Migração**
Criados 3 caminhos para migrar dados:

#### a) Via Script Admin (firebase-admin)
```bash
npm run migrate:questoes
```
- Usa Firebase Admin SDK
- Requer credenciais de serviço
- Arquivo: `scripts/migrar-questoes-firebase.ts`

#### b) Via API Route
```
POST /api/admin/migrar-questoes
```
- Já existente no projeto
- Migra do arquivo Excel "Questões MC.xlsx"
- Arquivo: `src/app/api/admin/migrar-questoes/route.ts`

#### c) Via Interface Web (Recomendado ⭐)
```
http://localhost:3001/admin/migrar-questoes
```
- Interface visual simples
- Botão "Iniciar Migração"
- Feedback em tempo real
- Arquivo: `src/app/admin/migrar-questoes/page.tsx`

### 3. **Estrutura de Dados no Firestore**

**Collection:** `questoes`

**Documento:**
```typescript
{
  id: number | string
  disciplina: string  // ou 'area'
  enunciado: string
  alternativas: [
    {
      letra: string       // A, B, C, D, E
      texto: string       // ou 'descricao'
      correta: boolean
    }
  ]
  createdAt: Date
  updatedAt: Date
  ativo?: boolean       // opcional
}
```

### 4. **Arquivos Modificados**

#### Atualizado para usar Firebase:
- ✅ `src/lib/questoes-loader.ts` - Agora busca do Firestore com fallback CSV
- ✅ `src/app/questoes/page.tsx` - Usa Firebase
- ✅ `src/app/questoes/pratica/page.tsx` - Usa Firebase  
- ✅ `src/app/questoes/resultado/page.tsx` - Usa Firebase

#### Criados:
- ✅ `src/lib/migrar-questoes-client.ts` - Migração client-side
- ✅ `src/app/admin/migrar-questoes/page.tsx` - UI de migração
- ✅ `scripts/migrar-questoes-firebase.ts` - Script CLI
- ✅ `.env.example` - Template de variáveis

#### Já existentes (reutilizados):
- ✅ `src/lib/migrador-questoes.ts` - Migração Excel → Firebase
- ✅ `src/app/api/admin/migrar-questoes/route.ts` - API endpoint

## 📋 Como usar

### Passo 1: Verificar Firebase configurado
Certifique-se de que o Firebase está configurado em `src/lib/firebase.ts`

### Passo 2: Migrar dados (escolha uma opção)

#### Opção A: Interface Web (mais fácil) ⭐
1. Acesse: `http://localhost:3001/admin/migrar-questoes`
2. Certifique-se de ter o arquivo `Questões MC.xlsx` na raiz do projeto
3. Clique em "Iniciar Migração"
4. Aguarde a confirmação

#### Opção B: Via API
```bash
curl -X POST http://localhost:3001/api/admin/migrar-questoes
```

#### Opção C: Via Script (requer Firebase Admin)
1. Configure as credenciais no `.env.local`:
```env
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```
2. Execute:
```bash
npm run migrate:questoes
```

### Passo 3: Verificar migração
1. Acesse: `http://localhost:3001/questoes`
2. Verifique se as questões aparecem
3. Teste o sistema de prática

## 🎯 Benefícios da Migração

### Antes (CSV):
- ❌ Dados estáticos
- ❌ Sem edição em tempo real
- ❌ Sem sincronização entre usuários
- ❌ Difícil de atualizar

### Depois (Firebase):
- ✅ Dados dinâmicos e escaláveis
- ✅ Edição em tempo real possível
- ✅ Sincronização automática
- ✅ Fácil de adicionar/editar questões
- ✅ Estatísticas centralizadas
- ✅ Backup automático
- ✅ Queries otimizadas

## 🔧 Próximos Passos Opcionais

### 1. Adicionar autenticação na página de admin
```typescript
// src/app/admin/migrar-questoes/page.tsx
import { useAuth } from '@/contexts/AuthContext'

// Verificar se usuário é admin
if (!user?.isAdmin) {
  return <div>Acesso negado</div>
}
```

### 2. Adicionar filtros no Firestore
```typescript
// Buscar apenas questões ativas de uma disciplina
const q = query(
  collection(db, 'questoes'),
  where('disciplina', '==', 'Direito Constitucional'),
  where('ativo', '==', true),
  limit(50)
)
```

### 3. Implementar cache local
```typescript
// Usar React Query ou SWR para cache
import { useQuery } from '@tanstack/react-query'

const { data: questoes } = useQuery({
  queryKey: ['questoes'],
  queryFn: carregarQuestoes,
  staleTime: 1000 * 60 * 5 // 5 minutos
})
```

### 4. Adicionar paginação
```typescript
// Paginar questões para melhor performance
const questoesRef = collection(db, 'questoes')
const q = query(questoesRef, limit(20), startAfter(lastDoc))
```

## 📊 Estatísticas Esperadas

Após a migração, você terá no Firebase:
- **~488 questões** (do CSV original)
- **12 disciplinas** diferentes
- **~2.440 alternativas** (5 por questão em média)

## ⚠️ Notas Importantes

1. **Backup**: O sistema mantém fallback para CSV caso Firebase falhe
2. **Performance**: Firebase é mais rápido que carregar CSV
3. **Custo**: Firebase tem tier gratuito generoso (50K reads/dia)
4. **Segurança**: Configure regras do Firestore para produção

## 🐛 Troubleshooting

### Erro: "Firebase not initialized"
→ Verifique `src/lib/firebase.ts` e as variáveis de ambiente

### Erro: "Permission denied"
→ Configure as regras do Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /questoes/{document} {
      allow read: if true;  // Permitir leitura pública
      allow write: if request.auth != null;  // Apenas autenticados podem escrever
    }
  }
}
```

### Questões não aparecem
→ Verifique o console do navegador
→ Verifique se a migração foi executada
→ Teste o fallback CSV está funcionando

---

**Status:** ✅ Sistema pronto para usar Firebase como fonte principal de dados de questões!
