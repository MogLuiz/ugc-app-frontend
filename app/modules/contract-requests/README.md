# contract-requests

Estado atual do módulo:

- empresa: o fluxo oficial evolui em `open-offers`
- creator: parte do fluxo ainda depende de `contract-requests`
- redirects legados compatíveis continuam suportados enquanto houver dependência real
- helpers, tipos e queries compartilhados com `open-offers` são intencionais por enquanto

Regra de manutenção:

- mudanças futuras do fluxo da empresa devem acontecer em `open-offers`
- `contract-requests` permanece ativo porque ainda sustenta creator e handoffs
