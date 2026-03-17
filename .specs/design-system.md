# UGC Local Design System

> Documento de referência para garantir consistência visual e funcional em todo o projeto.  
> **Fonte:** [Figma Design System](https://www.figma.com/design/JjJEgzy9OinpEG2tceo1zi/Sem-t%C3%ADtulo?node-id=6-393)  
> **Versão:** 1.0.0

---

## 1. Identidade de Marca

### Conceito do Logo

O **UGC Local** conecta criadores de conteúdo autêntico a estabelecimentos locais. O logo utiliza uma tipografia sans-serif moderna com o roxo vibrante para transmitir criatividade, tecnologia e autoridade no mercado de "User Generated Content".

### Missão

> "Empoderar criadores locais e transformar a forma como empresas regionais se conectam com seu público através de conteúdos autênticos, reais e humanizados."

---

## 2. Paleta de Cores

### Cores Primárias e Funcionais

| Nome | Hex | Uso |
|------|-----|-----|
| **Primária** | `#895af6` | CTAs, links, destaques, logo |
| **Secundária** | `#6366f1` | Variações de destaque |
| **Sucesso** | `#10b981` | Estados positivos, disponibilidade |
| **Erro** | `#ef4444` | Erros, validações negativas |
| **Aviso** | `#f59e0b` | Alertas, atenção |

### Cores Neutras

| Nome | Hex | Uso |
|------|-----|-----|
| **Texto/Dark** | `#1f2937` | Texto principal, títulos |
| **Texto Secundário** | `#4b5563` | Parágrafos, descrições |
| **Texto Terciário** | `#6b7280` | Placeholders, labels secundários |
| **Cinza Médio** | `#9ca3af` | Bordas suaves, ícones inativos |
| **Background** | `#f3f4f6` | Fundos de cards, superfícies |
| **Background Page** | `#f9fafb` | Fundo geral da página |
| **Borda** | `#e5e7eb` | Bordas de inputs, divisores |

### Badges / Nichos

| Nicho | Background | Texto |
|-------|------------|-------|
| Beleza | `#f3e8ff` | `#7e22ce` |
| Gastronomia | `#ffedd5` | `#c2410c` |
| Fitness | `#dbeafe` | `#1d4ed8` |
| Decor | `#dcfce7` | `#15803d` |
| Trend (primário) | `#895af6` | `#ffffff` |

---

## 3. Tipografia

**Fonte principal:** Inter

### Escala de Tipografia

| Estilo | Tamanho | Peso | Line-height | Uso |
|--------|---------|------|-------------|-----|
| **H1** | 48px (3rem) | 800 (Extra Bold) | 48px | Títulos hero |
| **H2** | 30px (1.875rem) | 700 (Bold) | 36px | Subtítulos de seção |
| **H3** | 20px (1.25rem) | 700 (Bold) | 28px | Títulos de card |
| **H4** | 18px (1.125rem) | 700 (Bold) | 28px | Títulos menores |
| **Body** | 16px (1rem) | 400 (Regular) | 26px | Parágrafos |
| **Body Small** | 14px (0.875rem) | 400 (Regular) | 20px | Texto secundário |
| **Caption** | 12px (0.75rem) | 500 (Medium) | 16px | Legendas, labels |
| **Label** | 14px (0.875rem) | 500 (Medium) | 20px | Labels de formulário |

### Tracking (letter-spacing)

- **H1:** `-1.2px`
- **Caption:** `1.2px` (uppercase)

---

## 4. Componentes de UI

### Botões

| Variante | Background | Borda | Texto |
|----------|------------|-------|-------|
| **Primário** | `#895af6` | — | `#ffffff` |
| **Secundário** | `transparent` | 2px `#895af6` | `#895af6` |
| **Ghost** | `transparent` | — | `#4b5563` |

**Especificações:**
- Padding: `14px 24px` (vertical horizontal)
- Border-radius: `12px`
- Font: 16px, Semi Bold (600)

### Campos de Entrada

- Border: `1px solid #e5e7eb`
- Border-radius: `12px`
- Padding: `15px 13px`
- Placeholder: `#6b7280`, 16px Regular
- Label: 14px Medium, `#374151`

### Badges / Chips (Nichos)

- Padding: `6px 16px`
- Border-radius: `9999px` (pill)
- Font: 14px Medium

### Cards de Criadores

**Small Card (perfil):**
- Border-radius: `16px`
- Shadow: `0px 1px 2px 0px rgba(0,0,0,0.05)`
- Avatar: `12px` border-radius

**Detailed Card (oferta):**
- Badge "Disponível": `#dcfce7` bg, `#16a34a` texto
- Preço: 18px Extra Bold, cor primária
- Botão "Ver Perfil": 14px Bold, primário

---

## 5. Ícones Principais

| Ícone | Uso |
|-------|-----|
| 📍 Mapa / Local | Localização, mapa de criadores |
| 👤 Usuário | Perfil, autenticação |
| 💬 Chat | Mensagens |
| 💰 Pagamentos | Transações, financeiro |
| 📹 Vídeo / UGC | Conteúdo, vídeos |

> **Nota:** O projeto usa [Lucide React](https://lucide.dev/) para ícones. Mapear os emojis acima para os equivalentes em Lucide quando implementar.

---

## 6. Espaçamento & Grid

### Sistema de 12 Colunas

- **Desktop:** Grid responsivo de 12 colunas
- **Container máximo:** 1280px
- **Mobile:** Coluna única com margens laterais de 16px

### Métrica de 4px

Todo o espaçamento (padding, margin, gap) segue **múltiplos de 4px**:

| Token | Valor |
|-------|-------|
| `4` | 4px |
| `8` | 8px |
| `12` | 12px |
| `16` | 16px |
| `20` | 20px |
| `24` | 24px |
| `32` | 32px |
| `48` | 48px |
| `64` | 64px |
| `80` | 80px |

### Border Radius

| Uso | Valor |
|-----|-------|
| Pequeno | 4px |
| Médio | 8px |
| Padrão | 12px |
| Grande | 16px |
| Pill | 9999px |

---

## 7. Referência Figma

- **Arquivo:** [UGC Local Design System](https://www.figma.com/design/JjJEgzy9OinpEG2tceo1zi/Sem-t%C3%ADtulo?node-id=6-393)
- **Node ID:** `6:393`

---

© 2023 UGC Local. Documento de Design System v1.0.0. Criado para o mercado brasileiro.
