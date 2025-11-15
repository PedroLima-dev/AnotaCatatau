import { Stack } from "expo-router";
import { OfflineProvider } from "../context/offlineContext";

export default function RootLayout() {
  return (
    <OfflineProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="tabs" />
      </Stack>
    </OfflineProvider>
  );
}
