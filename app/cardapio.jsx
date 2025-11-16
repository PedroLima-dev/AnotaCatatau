import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRealm, useQuery } from '../lib/realmContext'; // Use shared Realm context
import { CategoriaCardapio, Comanda } from '../lib/realmConfig';

export default function CardapioScreen() {
  const router = useRouter();
  const realm = useRealm();
  const { mesaId, mesaNome } = useLocalSearchParams();
  
  // Get categories reactively
  const categorias = useQuery(CategoriaCardapio);

  const adicionarItem = (categoria, item) => {
    try {
      realm.write(() => {
        // Find or create comanda for this table
        const filtro = realm.objects('Comanda').filtered("mesaId == $0 AND status == $1", mesaId, 'Aberta');
        let comanda = filtro.length > 0 ? filtro[0] : null;

        if (!comanda) {
          // Create new comanda
          comanda = realm.create('Comanda', {
            _id: new realm.BSON.ObjectId(),
            mesaId: mesaId,
            status: 'Aberta',
            items: [],
            dataCriacao: Date.now(),
            ultimaAtualizacao: Date.now(),
            sincronizada: false,
          });
        }

        // Add or update item
        const itemExistente = comanda.items.find(i => i.nome === item.nome);
        if (itemExistente) {
          itemExistente.quantidade += 1;
          itemExistente.ultimaAtualizacao = Date.now();
        } else {
          comanda.items.push({
            nome: item.nome,
            preco: item.preco,
            quantidade: 1,
            status: 'Pendente',
            dataCriacao: Date.now(),
            ultimaAtualizacao: Date.now(),
          });
        }

        // Mark for sync
        comanda.ultimaAtualizacao = Date.now();
        comanda.sincronizada = false;
      });
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      alert('Erro ao adicionar item ao pedido');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.mesaNome}>Mesa: {mesaNome}</Text>

        {categorias.length === 0 ? (
          <Text style={styles.vazio}>Carregando cardápio...</Text>
        ) : (
          categorias.map((categoria) => (
            <View key={categoria._id} style={styles.categoriaContainer}>
              <Text style={styles.categoriaNome}>{categoria.nome}</Text>
              
              <FlatList
                scrollEnabled={false}
                data={categoria.items}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => adicionarItem(categoria, item)}
                    style={styles.itemContainer}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemNome}>{item.nome}</Text>
                      <Text style={styles.itemPreco}>R$ {parseFloat(item.preco).toFixed(2)}</Text>
                    </View>
                    <Text style={styles.botaoAdicionar}>+</Text>
                  </Pressable>
                )}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  mesaNome: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  categoriaContainer: {
    marginBottom: 24,
  },
  categoriaNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e0e0e0',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 14,
    marginBottom: 10,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  itemPreco: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 4,
  },
  botaoAdicionar: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    width: 40,
    height: 40,
    borderRadius: 20,
    textAlign: 'center',
    lineHeight: 40,
  },
  vazio: {
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 30,
  },
});
