import { Pressable, Text } from "react-native";
import colors from "../theme/colors";

export default function Button({ label, onPress, color = "blue" }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 14,
        borderRadius: 10,
        backgroundColor: colors[color] || colors.blue,
      }}
    >
      <Text style={{ textAlign: "center", color: "#fff", fontSize: 18 }}>
        {label}
      </Text>
    </Pressable>
  );
}
