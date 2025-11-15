# 🔄 Fluxo Operacional da Aplicação

## 1. Visão de Mesas
- Usuário abre o app.
- Vê lista de mesas com status:
  - Verde → livre
  - Amarelo → comanda em aberto
  - Vermelho → pedido enviado/cozinha

## 2. Abertura da Comanda
- Toca na mesa.
- Caso livre → abrir nova comanda.
- Caso comanda aberta → entrar na comanda.

## 3. Comanda (itens)
- Visualiza lista de itens.
- Adiciona item via cardápio.
- Modifica quantidade.
- Adiciona observação.
- Marca itens para cozinha.

## 4. Cozinha
- Tela separada (tabs/cozinha.jsx).
- Mostra somente itens pendentes.
- Cozinheiro pode marcar como “pronto”.

## 5. Fechamento da Comanda
- Itens prontos → comanda concluída.
- Liberar mesa.

## 6. Offline → Online
- Tudo funciona offline.
- Quando internet voltar:
  - itens modificados → enviados
  - servidor devolve alterações
