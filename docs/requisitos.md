# 📌 Levantamento de Requisitos — Sistema de Comandas "Offline First"

## 1. Requisitos Funcionais

### RF01 — Visualizar Mesas
O atendente deve visualizar todas as mesas e o status da comanda associada.

### RF02 — Criar Comanda
Usuário pode abrir uma comanda em qualquer mesa.

### RF03 — Adicionar Itens
Usuário pode adicionar itens do cardápio na comanda.

### RF04 — Editar Itens
Alterar quantidade, observações e remover itens.

### RF05 — Enviar para Cozinha
A comanda ou itens modificados devem ser sinalizados para preparo.

### RF06 — Visualizar Pedidos na Cozinha
A cozinha deve visualizar somente pedidos pendentes ou modificados.

### RF07 — Fechar Comanda
Quando concluído, a comanda deve ser encerrada.

### RF08 — Funcionamento Offline
Todas as funções devem operar mesmo sem internet.

### RF09 — Sincronização Automática
Ao voltar conexão, sincronizar dados com o servidor.

---

## 2. Requisitos Não Funcionais

### RNF01 — Mobile First
Interface otimizada para tablets e celulares.

### RNF02 — Baixo Consumo de Bateria
Uso mínimo de recursos enquanto offline.

### RNF03 — Armazenamento Local
Uso obrigatório de banco orientado a objetos (Realm).

### RNF04 — Desempenho
Carregamento de telas deve ocorrer em menos de 1 segundo.

### RNF05 — Robustez Offline
Nada pode impedir operação mesmo sem internet.

### RNF06 — Consistência Eventual
Sincronização garante que dados convergem no servidor.

---

## 3. Restrições

- Internet limitada ou inexistente.
- Dispositivos simples (baixo custo).
- Ambiente com poeira, calor (afeta hardware).
