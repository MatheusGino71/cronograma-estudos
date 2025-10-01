# NotebookLM IA - Funcionalidade

## Visão Geral

A página **NotebookLM IA** é uma funcionalidade inspirada no Google NotebookLM que permite aos usuários transformar seus conteúdos de estudo em:

- 📊 **Mapas Mentais Interativos** - Visualização hierárquica dos conceitos
- 🎧 **Podcasts Narrados por IA** - Conversas entre vozes artificiais sobre o conteúdo
- 📈 **Análises Inteligentes** - Insights sobre progresso e recomendações

## Funcionalidades

### 1. Analisador de Estudos
- Análise automática do conteúdo de estudo
- Identificação de disciplinas
- Pontos fortes e fracos
- Recomendações personalizadas
- Estimativa de tempo de estudo e eficiência

### 2. Gerador de Mapas Mentais
- Criação automática de mapas mentais visuais
- Múltiplos temas visuais (Moderno, Acadêmico, Natureza, etc.)
- Estrutura hierárquica com até 3 níveis
- Export em formato SVG
- Cores dinâmicas baseadas no tema escolhido

### 3. Gerador de Podcasts IA
- Transformação de conteúdo em roteiros de podcast
- Múltiplos estilos (Conversa, Entrevista, Debate, etc.)
- Opções de vozes (Masculina/Feminina, Individual/Múltipla)
- Player integrado com controles
- Transcrição completa com timestamps
- Controle de velocidade de reprodução

## Estrutura de Arquivos

```
src/
├── app/
│   └── notebook-ia/
│       └── page.tsx                 # Página principal
├── components/
│   └── notebook-ia/
│       ├── StudyAnalyzer.tsx        # Análise de estudos
│       ├── MindMapGenerator.tsx     # Geração de mapas mentais
│       └── PodcastGenerator.tsx     # Geração de podcasts
└── hooks/
    └── useNotebookIA.ts            # Hook para integração com IA
```

## Integração com IA

A funcionalidade utiliza a **API do Google Gemini 2.0 Flash** para:

- Análise inteligente de conteúdo
- Geração de estruturas de mapas mentais
- Criação de roteiros de podcast
- Formatação automática em JSON estruturado

### Configuração da API

A chave da API está configurada em `.env.local`:
```bash
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_aqui
```

## Como Usar

### Acessando a Funcionalidade
1. Navegue para `/notebook-ia` no sistema
2. A página está disponível no menu de navegação como "NotebookLM IA"

### Analisando Conteúdo
1. Cole ou faça upload do seu conteúdo de estudo
2. Clique em "Analisar Conteúdo"
3. Visualize insights sobre disciplinas, pontos fortes/fracos e recomendações

### Gerando Mapas Mentais
1. Insira o conteúdo que deseja mapear
2. Escolha um tema visual
3. Clique em "Gerar Mapa Mental"
4. Baixe o resultado em SVG se desejar

### Criando Podcasts
1. Adicione o conteúdo para transformar em podcast
2. Selecione o estilo e tipo de vozes
3. Ajuste a velocidade se necessário
4. Clique em "Gerar Podcast"
5. Use o player integrado para ouvir e acompanhar a transcrição

## Tecnologias Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes de UI
- **Lucide React** - Ícones
- **Google Gemini API** - Inteligência Artificial
- **SVG** - Geração de gráficos vetoriais

## Melhorias Futuras

- [ ] Integração com Text-to-Speech real
- [ ] Export de podcasts em formato MP3
- [ ] Mapas mentais mais interativos (zoom, pan)
- [ ] Integração com conteúdo do cronograma do usuário
- [ ] Templates personalizáveis para mapas mentais
- [ ] Compartilhamento social dos conteúdos gerados
- [ ] Histórico de gerações anteriores
- [ ] Suporte a múltiplos idiomas

## Status

✅ **Implementado e Funcional**
- Interface completa
- Integração com IA do Gemini
- Todas as funcionalidades principais
- Design responsivo
- Tratamento de erros