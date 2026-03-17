# Company Portfolio Media Specification

## Problem Statement

A tela de edição de perfil da empresa precisa refletir o layout novo com `Informações da Empresa` e `Portfólio & Mídia`, consumindo uma API real para imagens e vídeos. Hoje o frontend só edita texto e avatar, então precisamos integrar o payload autenticado ao novo domínio de portfólio sem criar duplicação entre desktop e mobile.

## Goals

- [ ] Exibir e editar dados da empresa conforme o layout enviado.
- [ ] Renderizar a seção `Portfólio & Mídia` consumindo API real.
- [ ] Preparar um contrato reutilizável para creator.

## Out of Scope

- Descrição do portfólio
- Caption textual por mídia
- Reordenação drag and drop avançada
- Tela pública do creator neste mesmo slice

---

## User Stories

### P1: Empresa edita perfil e portfólio ⭐ MVP

**User Story**: Como empresa autenticada, quero editar meus dados e gerenciar a galeria de mídia do perfil para mostrar melhor a minha marca.

**Why P1**: Essa é a funcionalidade central do layout novo e depende de integração real com backend.

**Acceptance Criteria**:

1. WHEN a empresa abrir a tela THEN o sistema SHALL exibir as seções `Informações da Empresa` e `Portfólio & Mídia`
2. WHEN não existir mídia THEN o sistema SHALL exibir estado vazio com CTA de adicionar
3. WHEN a empresa enviar uma imagem ou vídeo válido THEN o sistema SHALL atualizar a galeria na tela
4. WHEN a empresa remover uma mídia THEN o sistema SHALL remover apenas aquele item da galeria
5. WHEN a empresa salvar alterações THEN o sistema SHALL persistir descrição, endereço, site e redes sociais

**Independent Test**: Abrir a tela, subir mídia, remover mídia, salvar o perfil e recarregar.

---

### P1: Frontend usa contrato compartilhado ⭐ MVP

**User Story**: Como frontend, quero mapear o payload do backend para um contrato de portfólio compartilhado para não manter mocks nem tipos duplicados.

**Why P1**: Sem isso a tela fica acoplada à implementação atual e o reuso para creator fica caro.

**Acceptance Criteria**:

1. WHEN `GET /profiles/me` responder THEN o frontend SHALL mapear `portfolio` para `AuthUser`
2. WHEN o portfólio mudar THEN o frontend SHALL refletir o novo payload invalidando a sessão

**Independent Test**: Verificar o cache da sessão após upload e remoção.

---

## Edge Cases

- WHEN o usuário não estiver carregado THEN a tela SHALL continuar sem renderização insegura
- WHEN o upload falhar THEN a tela SHALL exibir toast de erro
- WHEN o portfólio estiver vazio THEN a UI SHALL mostrar card de upload
- WHEN uma mídia for vídeo THEN a UI SHALL renderizar preview compatível com o card

## Success Criteria

- [ ] Desktop e mobile exibem a nova seção com consistência visual
- [ ] Portfólio deixa de depender de mock nessa área
- [ ] Dados de empresa adicionais persistem corretamente
