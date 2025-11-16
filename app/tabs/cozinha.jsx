import React from 'react';
import { useQuery, useRealm } from '../../lib/realmContext'; // Use shared context instead of @realm/react
import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import colors from '../../theme/colors'; // Assumindo que você tem um arquivo de cores
import { Comanda } from '../../lib/realmConfig'; // Caminho correto (../../ é a raiz)

/**
 * Tela da Cozinha
 * (Leitura - R do CRUD) e (Atualização - U do CRUD)
 * Lista todos os itens de pedidos com status 'Pendente' de todas as comandas abertas.
 */
export default function CozinhaScreen() {
  const realm = useRealm();
  // Query reativa para todas as comandas abertas
  const comandasAbertas = useQuery(
    Comanda,
    (collection) => collection.filtered("status == 'Aberta'"),
    []
  );

  // Formata os dados para a lista de pedidos pendentes na cozinha
  const pedidosPendentes = useMemo(() => {
    const todosOsItens = [];
    comandasAbertas.forEach((comanda) => {
      // Busca o nome da mesa para mostrar na cozinha
      const mesa = realm.objectForPrimaryKey('Mesa', comanda.mesaId);
      
      comanda.items.forEach((item, index) => {
        if (item.status === 'Pendente') {
          todosOsItens.push({
            id: `${comanda._id.toHexString()}_${index}`, // ID único
            mesaNome: mesa ? mesa.nome : 'Mesa Desconhecida',
            itemNome: item.nome,
            quantidade: item.quantidade,
            _itemRef: item, // Referência ao PedidoItem embutido
            _comandaId: comanda._id,
          });
        }
      });
    });
    // Mostra os pedidos mais antigos primeiro (por ID de comanda ou tempo)
    return todosOsItens;
  }, [comandasAbertas, realm]);

  const marcarEntregue = (itemRef, comandaId) => {
      // (Update - U do CRUD)
      try {
        realm.write(() => {
            // 1. Modifica o status do item
            if (itemRef && !itemRef.isInvalidated) {
              itemRef.status = 'Entregue';
              
              // 2. Atualiza o timestamp da comanda mãe (CRUCIAL PARA SYNC)
              const comandaMae = realm.objectForPrimaryKey(Comanda, comandaId);
              if (comandaMae) {
                  comandaMae.ultimaAtualizacao = Date.now();
                  comandaMae.sincronizada = false; // Marca para o SyncService
              }
            }
        });
      } catch (e) {
        console.error("Erro ao marcar como entregue:", e);
      }
  }

  return (
    <View style={styles.telaContainer}>
      <Text style={styles.tituloTela}>Pedidos Pendentes</Text>
      <FlatList
        data={pedidosPendentes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
            <Text style={styles.textoVazio}>Nenhum pedido pendente. Cozinha livre!</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemCozinha}>
            <View>
              <Text style={styles.itemCozinhaMesa}>{item.mesaNome}</Text>
              <Text style={styles.itemCozinhaItem}>({item.quantidade}x) {item.itemNome}</Text>
            </View>
            <Pressable 
                style={styles.botaoEntregue} 
                onPress={() => marcarEntregue(item._itemRef, item._comandaId)} 
            >
                <Text style={styles.botaoEntregueTexto}>✓</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  telaContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  tituloTela: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e0e0e0',
    marginBottom: 20,
  },
  itemCozinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: colors.yellow || '#FFD700', // Padrão 'Pendente'
  },
  itemCozinhaMesa: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.red || '#FF7070',
  },
  itemCozinhaItem: {
      fontSize: 16,
      color: '#e0e0e0',
      marginTop: 4,
  },
  botaoEntregue: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.green || '#4CAF50',
      justifyContent: 'center',
      alignItems: 'center',
  },
  botaoEntregueTexto: {
      color: '#fff',
      fontSize: 24,
      fontWeight: 'bold',
  },
  textoVazio: {
      color: '#a0a0a0',
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
  }
});