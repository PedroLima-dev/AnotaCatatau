import Realm from 'realm';

// --- DEFINIÇÃO DOS SCHEMAS (Modelos do Banco de Dados) ---

export class PedidoItem extends Realm.Object {
  static schema = {
    name: 'PedidoItem',
    embedded: true,
    properties: {
      nome: 'string',
      preco: 'string',
      quantidade: 'int',
      status: 'string', 
    },
  };
}

export class Mesa extends Realm.Object {
  static schema = {
    name: 'Mesa',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      nome: 'string',
      status: 'string', 
      ultimaAtualizacao: 'int', // Para sincronização
    },
  };
}

// CORREÇÃO: Adicionando os schemas que faltavam
export class ItemCardapio extends Realm.Object {
  static schema = {
    name: 'ItemCardapio',
    embedded: true,
    properties: {
      _id: 'string',
      nome: 'string',
      preco: 'string',
    },
  };
}

export class CategoriaCardapio extends Realm.Object {
  static schema = {
    name: 'CategoriaCardapio',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      nome: 'string',
      items: 'ItemCardapio[]',
    },
  };
}
// Fim da Correção

export class Comanda extends Realm.Object {
  static schema = {
    name: 'Comanda',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      mesaId: 'string',
      status: 'string', 
      items: 'PedidoItem[]', 
      criadaEm: { type: 'date', default: () => new Date() },
      ultimaAtualizacao: 'int', 
      sincronizada: 'bool', // Chave para o SyncService
    },
  };
}

// --- CONFIGURAÇÃO DO REALM CONTEXT ---
export const realmConfig = {
  // CORREÇÃO: Adicionando TODOS os schemas
  schema: [Mesa, Comanda, PedidoItem, ItemCardapio, CategoriaCardapio],
  schemaVersion: 1, // Incremente se você mudar os schemas
};
