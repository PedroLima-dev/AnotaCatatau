import { View, Text, FlatList } from "react-native";
import { listarPedidos } from "../../services/realm/realmService";
import { useEffect, useState } from "react";

export default function Cozinha() {
  const [itens, setItens] = useState([]);

  useEffect(() => {
    const pedidos = listarPedidos();

    function carregar() {
      const pendentes = [];
      pedidos.forEach(p => {
        p.itens.forEach(i => {
          pendentes.push({
            mesa: p.mesa,
            ...i,
          });
        });
      });
      setItens(pendentes);
    }

    carregar();
    pedidos.addListener(carregar);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Cozinha</Text>

      <FlatList
        data={itens}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 8,
              padding: 14,
              backgroundColor: "#eee",
              borderRadius: 8,
            }}
          >
            <Text>Mesa: {item.mesa}</Text>
            <Text>Produto: {item.produtoId}</Text>
            <Text>Qtd: {item.quantidade}</Text>
          </View>
        )}
      />
    </View>
  );
}
