export const PedidoSchema = {
  name: "Pedido",
  primaryKey: "id",
  properties: {
    id: "string",
    mesa: "string",
    itens: "ItemPedido[]",
    status: "string", // aberto | fechado | sincronizado
    createdAt: "date",
    updatedAt: "date",
    lastSync: "date?",
  },
};
