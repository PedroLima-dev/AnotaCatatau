import React from 'react';
import { useQuery, useRealm } from '../../lib/realmContext'; // Use shared context instead of @realm/react
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Mesa } from '../../lib/realmConfig'; // Importa o Schema da raiz (AnotaCatatau/)

/**
 * Tela de Mesas
 * O ponto de entrada da aba principal.
 * Usa useQuery para ler os dados de forma reativa (R do CRUD).
 */
export default function MesasScreen() {
  const router = useRouter();
  // useQuery lê do Realm. É reativo!
  const mesas = useQuery(Mesa); 
  const realm = useRealm();

  const handlePressMesa = (mesa) => {
    // 1. Lógica para 'ocupar' a mesa (Update - U do CRUD)
    realm.write(() => {
      // Encontra a mesa mais recente e atualiza
      const mesaParaAtualizar = realm.objectForPrimaryKey('Mesa', mesa._id);
      if (mesaParaAtualizar) {
        mesaParaAtualizar.status = 'Ocupada';
        mesaParaAtualizar.ultimaAtualizacao = Date.now(); // Marca para sincronização
        mesaParaAtualizar.sincronizada = false; // Garante que o SyncService envie a mudança
      }
    });
    
    // 2. Navega para a tela do cardápio, passando os parâmetros necessários
    router.push({ 
      pathname: "/cardapio", 
      params: { mesaId: mesa._id, mesaNome: mesa.nome } 
    });
  };

  return (
    <View style={styles.telaContainer}>
      {/* Exibe o status do banco de dados na primeira execução */}
      {mesas.length === 0 && (
          <Text style={styles.textoVazio}>Carregando mesas ou banco de dados vazio.</Text>
      )}

      <FlatList
        data={mesas} // Usa o resultado do useQuery diretamente
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handlePressMesa(item)}
            style={[
              styles.itemMesa,
              item.status === 'Ocupada'
                ? styles.mesaOcupada
                : styles.mesaLivre,
            ]}
          >
            <Text style={styles.itemMesaTexto}>
              {item.nome}
            </Text>
            <Text style={styles.itemMesaStatus}>
              Status: {item.status}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  telaContainer: {
    flex: 1,
    padding: 8,
    backgroundColor: '#1a1a1a', // Fundo escuro
  },
  textoVazio: {
    color: '#aaa',
    textAlign: 'center',
    padding: 20,
  },
  itemMesa: {
    flex: 1,
    padding: 18,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    margin: 8,
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mesaLivre: {
    backgroundColor: '#4CAF50', // Verde Catatau para mesas livres
  },
  mesaOcupada: {
    backgroundColor: '#9a3a3a', // Vermelho/Marrom para mesas ocupadas
    borderColor: '#FF7070',
    borderWidth: 1,
  },
  itemMesaTexto: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  itemMesaStatus: {
    fontSize: 14,
    color: '#eee',
    marginTop: 4,
  },
});