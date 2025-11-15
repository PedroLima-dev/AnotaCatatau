import { View, Text, FlatList, Pressable } from "react-native";
import { listarProdutos, adicionarItem } from "../../services/realm/realmService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function Cardapio() {
  const produtos = listarProdutos();
  const [lista, setLista] = useState([]);
  const { pedidoId } = useLocalSearchParams();

  useEffect(() => {
    setLista([...produtos]);
    produtos.addListener(() => setLista([...produtos]));
  }, []);

  function add(produto) {
    adicionarItem(pedidoId, produto, 1);
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Cardápio</Text>

      <FlatList
        data={lista}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => add(item)}
            style={{
              padding: 14,
              marginVertical: 6,
              backgroundColor: "#eee",
              borderRadius: 10,
            }}
          >
            <Text>{item.nome}</Text>
            <Text>R$ {item.preco.toFixed(2)}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
