# Responsive Architecture

## Shared-first

`frontend/app/modules` segue uma arquitetura shared-first para software web responsivo:

- cada feature deve expor um único `*-screen.tsx`
- lógica, estado e derived data ficam em `hooks/use-*-controller.ts`
- UI da feature deve ser quebrada em `components/sections/*`
- diferenças de breakpoint devem ser tratadas por layout, ordem visual, densidade e wrappers de navegação

## Quando separar árvores

Só é aceitável manter shells distintos quando a interação muda de verdade entre breakpoints, como:

- mapa com painel lateral no desktop
- mapa full-screen com overlays ou carrossel no mobile

Não é aceitável duplicar a feature inteira quando o domínio, os dados e as ações são os mesmos.

## Convenções

- preferir componentes orientados a domínio, como `ProfileSummarySection` ou `CampaignListSection`
- evitar componentes orientados a device, como `Desktop`, `Mobile` ou `Content`, como estrutura principal da feature
- sidebars desktop e bottom navigation mobile são considerados shells aceitáveis
