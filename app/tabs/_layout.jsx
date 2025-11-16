import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../theme/colors'; // Assumindo que você tem um arquivo de cores

// --- Ícones (Simples) ---
// Estes componentes são usados para renderizar os ícones nas abas
const IconeMesa = ({ focused }) => (
  <View style={[styles.iconPlaceholder, focused && styles.iconPlaceholderAtivo]}>
    <Text style={styles.iconText}>M</Text>
  </View>
);
const IconeCozinha = ({ focused }) => (
  <View style={[styles.iconPlaceholder, focused && styles.iconPlaceholderAtivo]}>
    <Text style={styles.iconText}>P</Text>
  </View>
);

// Este componente define a navegação por abas
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // O cabeçalho é gerenciado pelo Root Layout pai
        tabBarStyle: styles.tabBarContainer,
        tabBarActiveTintColor: colors.green, // Cor ativa (verde do Catatau)
        tabBarInactiveTintColor: '#888',
      }}>
      <Tabs.Screen
        name="index" // Corresponde à tela Mesas (app/(tabs)/index.jsx)
        options={{
          title: 'Mesas',
          tabBarIcon: ({ focused }) => <IconeMesa focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cozinha" // Corresponde à tela Cozinha (app/(tabs)/cozinha.jsx)
        options={{
          title: 'Cozinha',
          tabBarIcon: ({ focused }) => <IconeCozinha focused={focused} />,
        }}
      />
    </Tabs>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  tabBarContainer: {
    height: 70,
    backgroundColor: '#2c2c2c',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  iconPlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholderAtivo: {
    backgroundColor: colors.green,
  },
  iconText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});