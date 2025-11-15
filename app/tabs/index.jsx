import { View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { listarPedidos, criarPedido } from "../../services/realm/realmService";
import { useRouter } from "expo-router";
import colors from "../../theme/colors";

export default function Mesas() {
  const [pedidos, setPedidos] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const data = listarPedidos();

    setPedidos([...data]);

    data.addListener(() => setPedidos([...data]));
  }, []);

  function abrirMesa(mesa) {
    criarPedido(mesa);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Mesas</Text>

      <FlatList
        data={[...Array(10)].map((_, i) => ({
          mesa: `Mesa ${i + 1}`,
          id: `${i + 1}`,
        }))}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => abrirMesa(item.mesa)}
            style={{
              flex: 1,
              padding: 18,
              height: 120,
              justifyContent: "center",
              borderRadius: 12,
              margin: 8,
              backgroundColor: colors.green,
            }}
          >
            <Text style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}>
              {item.mesa}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
