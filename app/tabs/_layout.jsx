import { Tabs } from "expo-router";
import colors from "../../theme/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 0,
          paddingVertical: 6,
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mesas",
        }}
      />

      <Tabs.Screen
        name="cozinha"
        options={{
          title: "Cozinha",
        }}
      />

      <Tabs.Screen
        name="cardapio"
        options={{
          title: "Cardápio",
        }}
      />
    </Tabs>
  );
}
