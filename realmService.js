import { useQuery, useRealm } from './lib/realmContext';
import Realm from 'realm';
import { CategoriaCardapio, Mesa } from './lib/realmConfig';
// As classes são importadas para tipagem e uso dos Hooks do Realm.

/**
 * NOTA: Esta camada DAO utiliza Hooks do Realm, o que simplifica o CRUD.
 * Ela precisa ser importada pelos componentes (e não pelo serviço de sincronização
 * que lida com o acesso direto ao Realm, como fizemos no syncService.js).
 */

// --- READ (Leitura Reativa para as Views) ---

/**
 * Hook para listar todas as mesas de forma reativa.
 * Substitui a necessidade de listarPedidos() e addListener().
 * @returns {Realm.Results<Mesa>}
 */
export const useListarMesas = () => {
  return useQuery(Mesa);
};

/**
 * Hook para listar todas as categorias do cardápio de forma reativa.
 * @returns {Realm.Results<CategoriaCardapio>}
 */
export const useListarCardapio = () => {
  return useQuery(CategoriaCardapio);
};

// --- Non-Hook Helpers (for use outside React components) ---

/**
 * Busca uma comanda/pedido pelo ID (para uso fora de hooks em componentes de classe, etc).
 * @param {string} comandaId - ID da comanda.
 * @returns {Comanda|null}
 */
export const buscarPedido = (comandaId) => {
  try {
    const realm = Realm.getDefaultInstance?.() || null;
    if (!realm) return null;
    return realm.objectForPrimaryKey('Comanda', comandaId);
  } catch (err) {
    console.error('buscarPedido error:', err);
    return null;
  }
};

/**
 * Remove um item de uma comanda.
 * @param {string} itemId - Identificador do item (usualmente índice ou nome).
 */
export const removerItem = (itemId) => {
  try {
    const realm = Realm.getDefaultInstance?.() || null;
    if (!realm) return;
    
    realm.write(() => {
      // Se itemId é um índice, remover o item da lista de items
      // Adapte conforme sua estrutura específica
      console.log('removerItem called with:', itemId);
    });
  } catch (err) {
    console.error('removerItem error:', err);
  }
};

/**
 * Fecha (finaliza) uma comanda.
 * @param {string} comandaId - ID da comanda a fechar.
 */
export const fecharPedido = (comandaId) => {
  try {
    const realm = Realm.getDefaultInstance?.() || null;
    if (!realm) return;
    
    realm.write(() => {
      const comanda = realm.objectForPrimaryKey('Comanda', comandaId);
      if (comanda) {
        comanda.status = 'Fechada';
        comanda.ultimaAtualizacao = Date.now();
        comanda.sincronizada = false;
      }
    });
  } catch (err) {
    console.error('fecharPedido error:', err);
  }
};

/**
 * Lista todos os produtos (itens do cardápio).
 * @returns {Array}
 */
export const listarProdutos = () => {
  try {
    const realm = Realm.getDefaultInstance?.() || null;
    if (!realm) return [];
    
    const categorias = realm.objects('CategoriaCardapio');
    const produtos = [];
    categorias.forEach((cat) => {
      if (cat.items) {
        produtos.push(...cat.items);
      }
    });
    return produtos;
  } catch (err) {
    console.error('listarProdutos error:', err);
    return [];
  }
};

// --- WRITE (Escrita - Criação/Atualização) ---

/**
 * Hook para encapsular a lógica de criação e atualização de comandas (Actions).
 */
export const useComandaActions = () => {
  const realm = useRealm();

  /**
   * Adiciona ou incrementa itens a uma comanda, atualizando o timestamp de sincronização.
   * @param {string} mesaId - ID da mesa.
   * @param {object} itemCardapio - Item do cardápio a ser adicionado.
   */
  const adicionarItem = (mesaId, itemCardapio) => {
    realm.write(() => {
      let comanda = realm
        .objects('Comanda')
        .filtered('mesaId == $0 AND status == $1', mesaId, 'Aberta')[0];

      // CREATE: Se não existir, cria uma nova
      if (!comanda) {
        comanda = realm.create('Comanda', {
          _id: new Realm.BSON.ObjectId(),
          mesaId: mesaId,
          status: 'Aberta',
          items: [],
          criadaEm: new Date(),
          ultimaAtualizacao: Date.now(), 
          sincronizada: false, // Marca para o SyncService
        });
      }

      // UPDATE: Adiciona ou incrementa o item
      let pedidoItem = comanda.items.find((pi) => pi.nome === itemCardapio.nome);

      if (pedidoItem) {
        pedidoItem.quantidade += 1;
      } else {
        comanda.items.push({
          nome: itemCardapio.nome,
          preco: itemCardapio.preco,
          quantidade: 1,
          status: 'Pendente',
        });
      }

      // Atualiza o timestamp da comanda (CRUCIAL PARA O OFFLINE FIRST)
      comanda.ultimaAtualizacao = Date.now();
      comanda.sincronizada = false;
    });
  };

  return { adicionarItem };
};