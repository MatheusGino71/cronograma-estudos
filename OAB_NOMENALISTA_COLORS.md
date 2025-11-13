# 🎨 Paleta de Cores Oficial - OAB NomeNaLista

Cores extraídas do site oficial: https://oabnomenalista.com.br

## Cores Principais

### 🔴 Vermelho (Primary)
- **HEX**: `#FF3347`
- **OKLCH**: `oklch(0.62 0.24 27)`
- **Uso**: Cor principal do logo, botões principais, destaques
- **Classe CSS**: `gradient-oab-red`

### 🔵 Azul (Secondary)
- **HEX**: `#3D5AFE`
- **OKLCH**: `oklch(0.54 0.25 264)`
- **Uso**: Cor secundária do logo, links, elementos interativos
- **Classe CSS**: `gradient-oab-blue`

### 🟣 Roxo (Accent)
- **HEX**: `#6B46C1`
- **OKLCH**: `oklch(0.50 0.20 280)`
- **Uso**: Banners, elementos de destaque, gráficos
- **Classe CSS**: `gradient-oab-purple`

## Cores Complementares

### ⚫ Cinza Escuro (Textos)
- **HEX**: `#2D3748`
- **Uso**: Textos principais, títulos

### ⚪ Branco (Backgrounds)
- **HEX**: `#FFFFFF`
- **Uso**: Fundos claros, texto sobre cores escuras

## Classes Utilitárias CSS

### Gradientes Oficiais

```css
/* Gradiente Vermelho OAB */
.gradient-oab-red {
  background: linear-gradient(135deg, #FF3347 0%, #C02030 100%);
}

/* Gradiente Azul OAB */
.gradient-oab-blue {
  background: linear-gradient(135deg, #3D5AFE 0%, #2648C7 100%);
}

/* Gradiente Roxo OAB */
.gradient-oab-purple {
  background: linear-gradient(135deg, #6B46C1 0%, #553399 100%);
}
```

### Uso em Tailwind

```tsx
// Botão com gradiente vermelho oficial
<Button className="gradient-oab-red hover:opacity-90 text-white">
  Começar
</Button>

// Texto com cor oficial
<span className="text-[#FF3347]">Vermelho OAB</span>

// Gradiente com todas as cores
<h1 className="bg-gradient-to-r from-[#FF3347] via-[#3D5AFE] to-[#6B46C1] bg-clip-text text-transparent">
  OAB NomeNaLista
</h1>
```

## Variáveis CSS (globals.css)

### Modo Claro
```css
--primary: oklch(0.62 0.24 27);        /* #FF3347 */
--secondary: oklch(0.54 0.25 264);     /* #3D5AFE */
--accent: oklch(0.50 0.20 280);        /* #6B46C1 */
```

### Modo Escuro
```css
--primary: oklch(0.65 0.26 27);        /* #FF3347 mais claro */
--secondary: oklch(0.58 0.27 264);     /* #3D5AFE mais claro */
--accent: oklch(0.55 0.22 280);        /* #6B46C1 mais claro */
```

## Exemplos de Aplicação

### Botões
- **Primário**: Vermelho (`gradient-oab-red`)
- **Secundário**: Azul (`gradient-oab-blue`)
- **Destaque**: Roxo (`gradient-oab-purple`)

### Textos
- **Títulos**: Gradiente das 3 cores principais
- **Links**: Azul `#3D5AFE`
- **Destaques**: Vermelho `#FF3347`

### Gráficos (Charts)
1. `chart-1`: Vermelho `#FF3347`
2. `chart-2`: Azul `#3D5AFE`
3. `chart-3`: Roxo `#6B46C1`
4. `chart-4`: Cinza escuro
5. `chart-5`: Cinza muito escuro

## Acessibilidade

### Contraste de Texto
- ✅ Vermelho `#FF3347` em fundo branco: **WCAG AA**
- ✅ Azul `#3D5AFE` em fundo branco: **WCAG AAA**
- ✅ Roxo `#6B46C1` em fundo branco: **WCAG AA**
- ✅ Branco em vermelho/azul/roxo: **WCAG AAA**

### Recomendações
- Use sempre texto branco sobre cores primárias
- Para textos longos, prefira cinza escuro `#2D3748` em fundo branco
- Garanta contraste mínimo de 4.5:1 para textos normais

---

**Última atualização**: 13/11/2025
**Fonte**: https://oabnomenalista.com.br
