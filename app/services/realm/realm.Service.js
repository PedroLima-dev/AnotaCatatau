import getRealm from "./realmConfig";
import { v4 as uuid } from "uuid";

/* ======================
    PEDIDOS (Comandas)
====================== */

export function criarPedido(mesa) {
  const realm = getRealm();

  realm.write(() => {
    realm.create("Pedido", {
      id: uuid(),
      mesa,
      itens: [],
      status: "aberto",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSync: null,
    });
  });
}

export function listarPedidos() {
  return getRealm()
    .objects("Pedido")
    .sorted("createdAt", true);
}

export function buscarPedido(id) {
  return getRealm().objectForPrimaryKey("Pedido", id);
}

export function fecharPedido(id) {
  const realm = getRealm();
  realm.write(() => {
    const p = realm.objectForPrimaryKey("Pedido", id);
    if (!p) return;

    p.status = "fechado";
    p.updatedAt = new Date();
  });
}

/* ======================
      ITENS
====================== */

export function adicionarItem(pedidoId, produto, quantidade = 1, observacao = "") {
  const realm = getRealm();

  realm.write(() => {
    const pedido = realm.objectForPrimaryKey("Pedido", pedidoId);
    if (!pedido) return;

    pedido.itens.push({
      id: uuid(),
      produtoId: produto.id,
      quantidade,
      observacao,
      updatedAt: new Date(),
    });

    pedido.updatedAt = new Date();
  });
}

export function removerItem(itemId) {
  const realm = getRealm();

  realm.write(() => {
    const item = realm.objectForPrimaryKey("ItemPedido", itemId);
    if (item) realm.delete(item);
  });
}

/* ======================
      PRODUTOS
====================== */

export function listarProdutos() {
  return getRealm().objects("Produto");
}

export function inserirProduto(nome, preco, categoria) {
  const realm = getRealm();

  realm.write(() => {
    realm.create("Produto", {
      id: uuid(),
      nome,
      preco,
      categoria,
    });
  });
}
