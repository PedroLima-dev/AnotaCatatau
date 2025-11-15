import Realm from "realm";
import { PedidoSchema } from "./schemas/Pedido";
import { ItemPedidoSchema } from "./schemas/ItemPedido";
import { ProdutoSchema } from "./schemas/Produto";

let realmInstance;

export default function getRealm() {
  if (realmInstance) return realmInstance;

  realmInstance = new Realm({
    schema: [PedidoSchema, ItemPedidoSchema, ProdutoSchema],
    schemaVersion: 1,
  });

  return realmInstance;
}
