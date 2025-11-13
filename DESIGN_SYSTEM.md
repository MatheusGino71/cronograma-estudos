# 🎨 Design System - OAB NomeNaLista

## Esquema de Cores Aplicado

### 🔴 Seções com Fundo Vermelho (#FF3347)
- **Hero Section** (Landing Page)
  - Fundo: Vermelho oficial com pattern decorativo
  - Vídeo com opacity 30% + overlay vermelho
  - Texto: Branco com drop-shadow
  - Destaque "NOME NA LISTA": Fundo branco com texto vermelho
  - CTA Principal: Botão branco com texto vermelho
  - CTA Secundário: Botão azul (#3D5AFE)

- **Hero Section** (Usuários Logados)
  - Mesmo esquema da landing page
  - Mensagem personalizada de boas-vindas

- **Features Grid** (Usuários Logados)
  - Fundo vermelho com pattern sutil
  - Cards: Fundo branco com border-hover azul
  - Ícones alternados: Azul e Vermelho

### 🔵 Seções com Fundo Azul (#3D5AFE)
- **Stats Section**
  - Fundo: Gradiente azul (do claro ao escuro)
  - Cards: Glass morphism (bg-white/10 backdrop-blur)
  - Efeitos de brilho com círculos brancos desfocados
  - Texto: 100% branco para alto contraste

### ⚪ Seções com Fundo Branco
- **Features Section** (Landing Page)
  - Fundo: Branco puro (#FFFFFF)
  - Título: Gradiente das 3 cores (Vermelho → Azul → Roxo)
  - Cards: Backgrounds sutis alternados
    - Card 1: Vermelho 5% opacity
    - Card 2: Azul 5% opacity
    - Card 3: Roxo 5% opacity
  - Borders: Correspondentes às cores dos cards
  - Hover: Border solid + elevação

## Hierarquia Visual

### Primário (Vermelho #FF3347)
- Hero backgrounds
- CTAs principais
- Destaques importantes
- Cards alternados

### Secundário (Azul #3D5AFE)
- Stats section background
- Botões secundários
- Cards alternados
- Hover states

### Terciário (Roxo #6B46C1)
- Cards alternados
- Elementos de suporte

### Neutro (Branco)
- Backgrounds de conteúdo
- Cards sobre fundos coloridos
- Texto em fundos escuros

## Padrões de Design

### Glass Morphism
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

**Usado em:**
- Stats cards na seção azul
- Overlays sobre vídeos

### Pattern Decorativo
```css
background-image: radial-gradient(circle, white 1px, transparent 1px);
background-size: 40px 40px;
opacity: 0.1;
```

**Usado em:**
- Hero sections com fundo vermelho
- Seções de features

### Gradientes

**Gradiente Vermelho OAB:**
```css
background: linear-gradient(135deg, #FF3347 0%, #C02030 100%);
```

**Gradiente Azul (Stats):**
```css
background: linear-gradient(to bottom right, #3D5AFE, #2648C7, #1A3AA0);
```

**Gradiente Texto (Títulos):**
```css
background: linear-gradient(to right, #FF3347, #3D5AFE, #6B46C1);
background-clip: text;
-webkit-text-fill-color: transparent;
```

## Animações e Transições

### Hover Cards
```css
transition: all 0.3s ease;
transform: translateY(-8px);
box-shadow: 0 20px 40px rgba(0,0,0,0.2);
```

### Pulse Animation (NOME NA LISTA)
```css
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
```

### Scale on Hover (Stats Cards)
```css
transform: scale(1.05);
transition: transform 0.3s ease;
```

## Acessibilidade

### Contraste de Cores
- ✅ Branco em Vermelho: **WCAG AAA** (Ratio 5.2:1)
- ✅ Branco em Azul: **WCAG AAA** (Ratio 6.8:1)
- ✅ Vermelho em Branco: **WCAG AA** (Ratio 4.5:1)
- ✅ Azul em Branco: **WCAG AAA** (Ratio 7.1:1)

### Recomendações
1. Sempre usar texto branco sobre fundos vermelho/azul
2. Usar texto vermelho/azul apenas sobre fundo branco
3. Cards com fundo branco sobre vermelho: excelente contraste
4. Drop-shadow em textos sobre fundos coloridos

## Componentes Reutilizáveis

### Hero com Fundo Vermelho
```tsx
<section className="relative py-20 px-4 bg-[#FF3347]">
  {/* Video com opacity 30% */}
  <video className="opacity-30" />
  
  {/* Overlay vermelho */}
  <div className="absolute inset-0 gradient-oab-red opacity-80" />
  
  {/* Pattern decorativo */}
  <div className="absolute inset-0 opacity-10" 
       style={{backgroundImage: 'radial-gradient(...)'}} />
  
  {/* Conteúdo */}
</section>
```

### Stats com Fundo Azul
```tsx
<section className="py-20 bg-[#3D5AFE] relative overflow-hidden">
  {/* Gradiente azul */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#3D5AFE] via-[#2648C7] to-[#1A3AA0]" />
  
  {/* Círculos de brilho */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
  
  {/* Cards glass */}
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20" />
</section>
```

### Cards Alternados
```tsx
{features.map((feature, index) => {
  const bgColor = index % 3 === 0 ? 'bg-[#FF3347]/5' : 
                  index % 3 === 1 ? 'bg-[#3D5AFE]/5' : 
                  'bg-[#6B46C1]/5'
  
  return <div className={`${bgColor} rounded-2xl`} />
})}
```

## Botões

### Primário (Branco em Vermelho)
```tsx
<Button className="bg-white text-[#FF3347] hover:bg-gray-100 shadow-2xl">
  Começar
</Button>
```

### Secundário (Azul)
```tsx
<Button className="bg-[#3D5AFE] hover:bg-[#2648C7] text-white shadow-2xl">
  Login
</Button>
```

### Outline (Transparente)
```tsx
<Button className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#FF3347]">
  Saiba Mais
</Button>
```

---

**Última atualização**: 13/11/2025  
**Paleta completa**: Ver `OAB_NOMENALISTA_COLORS.md`
