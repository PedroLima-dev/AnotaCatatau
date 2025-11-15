import { View, Text, FlatList, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  buscarPedido,
  removerItem,
  fecharPedido,
} from "../../../services/realm/realmService";

export default function Comanda() {
  const { id } = useLocalSearchParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => {
    const p = buscarPedido(id);
    if (p) {
      setPedido({ ...p });
      p.addListener(() => setPedido({ ...p }));
    }
  }, [id]);

  if (!pedido) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>{pedido.mesa}</Text>

      <FlatList
        data={pedido.itens}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <Pressable
            style={{
              padding: 12,
              marginVertical: 6,
              backgroundColor: "#eee",
              borderRadius: 8,
            }}
            onLongPress={() => removerItem(item.id)}
          >
            <Text>Produto: {item.produtoId}</Text>
            <Text>Qtd: {item.quantidade}</Text>
            <Text>Obs: {item.observacao || "-"}</Text>
          </Pressable>
        )}
      />

      <Pressable
        style={{
          marginTop: 20,
          padding: 14,
          backgroundColor: "#3498db",
          borderRadius: 10,
        }}
        onPress={() => fecharPedido(id)}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          Fechar Comanda
        </Text>
      </Pressable>
    </View>
  );
}
