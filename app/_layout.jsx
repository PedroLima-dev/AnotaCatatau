// O POLYFILL É SEMPRE A PRIMEIRA COISA IMPORTADA PARA RESOLVER ERROS DE SEGURANÇA/CRYPTO
import '../lib/pollyfill.js';

import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import Realm from 'realm';

// Importa a configuração do Realm e os Schemas (agora da pasta lib/)
import { realmConfig } from '../lib/realmConfig.js';
import { RealmProvider, useRealm, useQuery } from '../lib/realmContext.js'; // Import from shared context

// --- 1. CONFIGURAÇÃO DO REALM ---
// RealmProvider and hooks are now imported from shared realmContext.js

// --- 2. DADOS MOCK (Para popular o banco na primeira vez - Lógica "Offline First") ---
const DADOS_MESAS_MOCK = [
  { _id: '1', nome: 'Mesa 01', status: 'Livre', ultimaAtualizacao: Date.now() },
  { _id: '2', nome: 'Mesa 02', status: 'Livre', ultimaAtualizacao: Date.now() },
  { _id: '3', nome: 'Mesa 03', status: 'Livre', ultimaAtualizacao: Date.now() },
  { _id: '4', nome: 'Mesa 04', status: 'Livre', ultimaAtualizacao: Date.now() },
];

const DADOS_CARDAPIO_MOCK = [
  {
    _id: 'cat1',
    nome: 'Porções',
    items: [
      { _id: 'p1', nome: 'Tilápia Frita', preco: 'R$ 55,00' },
      { _id: 'p2', nome: 'Batata Frita', preco: 'R$ 25,00' },
      { _id : 'p3', nome: 'Mandioca Frita', preco: 'R$ 25,00' },
    ],
  },
  {
    _id: 'cat2',
    nome: 'Bebidas',
    items: [
      { _id: 'b1', nome: 'Coca-Cola 2L', preco: 'R$ 10,00' },
      { _id: 'b2', nome: 'Cerveja (Lata)', preco: 'R$ 5,00' },
      { _id: 'b3', nome: 'Água com Gás', preco: 'R$ 4,00' },
    ],
  },
];

// --- 3. APP INITIALIZATION (MOVED INTO RootLayoutContent) ---

// --- 4. TELA DE CARREGAMENTO (Fallback) ---
// Isso resolve o erro "Realm context not found"
const LoadingFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4CAF50" />
    <Text style={styles.loadingText}>Carregando banco de dados local...</Text>
  </View>
);

// --- 4B. DATABASE INITIALIZER COMPONENT ---
// Runs after RootLayoutContent renders to populate Realm without blocking Stack
const DatabaseInitializer = () => {
  const realm = useRealm();
  
  useEffect(() => {
    try {
      realm.write(() => {
        if (realm.objects('Mesa').length === 0) {
          DADOS_MESAS_MOCK.forEach((mesa) => {
            realm.create('Mesa', mesa);
          });
          console.log('Populated Mesas');
        }
        if (realm.objects('CategoriaCardapio').length === 0) {
          DADOS_CARDAPIO_MOCK.forEach((categoria) => {
            realm.create('CategoriaCardapio', categoria);
          });
          console.log('Populated Cardápio');
        }
      });
    } catch (err) {
      console.warn('DatabaseInitializer: error populating DB', err);
    }
  }, [realm]);
  
  return null; // invisible
};

// --- 5. LAYOUT RAIZ (STACK) ---
function RootLayoutContent() {
  const router = useRouter();
  const [stackReady, setStackReady] = useState(false);

  // Wait longer for Realm context to fully initialize
  // The problem: expo-router evaluates screen descriptors synchronously
  // But Realm context is async. We need to delay long enough for context to be ready.
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('RootLayoutContent: Allowing Stack to render after delay');
      setStackReady(true);
    }, 500); // Increased delay to 500ms to ensure Realm context is ready
    return () => clearTimeout(timer);
  }, []);
  
  if (!stackReady) {
    return <LoadingFallback />;
  }
  
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack
        screenOptions={{
          headerStyle: styles.header,
          headerTitleStyle: styles.tituloHeader,
          headerTintColor: '#4CAF50', // Cor verde do Catatau
        }}>
        <Stack.Screen
          name="(tabs)" // Pasta que contém as abas (index.jsx e cozinha.jsx)
          options={{
            headerTitle: () => (
              <View>
                <Text style={styles.tituloHeader}>Pesque Pague do Catatau</Text>
                <Text style={styles.subtituloHeader}>
                  Proprietários: Waldin e Weila
                </Text>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="cardapio" // Tela fora das abas (app/cardapio.jsx)
          options={({ route }) => ({
            // O título é setado dinamicamente
            title: `Mesa: ${route.params?.mesaNome || 'Cardápio'}`, 
            presentation: 'modal', 
            headerLeft: () => (
              <Pressable onPress={() => router.back()}>
                <Text style={styles.botaoVoltarTexto}>Voltar</Text>
              </Pressable>
            )
          })}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <RealmProvider 
      schema={realmConfig.schema}
      schemaVersion={realmConfig.schemaVersion}
      fallback={<LoadingFallback />}
    >
      <DatabaseInitializer />
      <RootLayoutContent />
    </RealmProvider>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    marginTop: 10,
    color: '#e0e0e0',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#2c2c2c',
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e0e0e0',
    textAlign: 'center',
  },
  subtituloHeader: {
    fontSize: 12,
    color: '#a0a0a0',
    textAlign: 'center',
  },
  botaoVoltarTexto: {
      fontSize: 16,
      color: '#4CAF50',
      fontWeight: '500',
  },
});