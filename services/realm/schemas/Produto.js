export const ProdutoSchema = {
  name: "Produto",
  primaryKey: "id",
  properties: {
    id: "string",
    nome: "string",
    preco: "double",
    categoria: "string?",
  },
};
