export const ItemPedidoSchema = {
  name: "ItemPedido",
  primaryKey: "id",
  properties: {
    id: "string",
    produtoId: "string",
    quantidade: "int",
    observacao: "string?",
    updatedAt: "date",
  },
};
