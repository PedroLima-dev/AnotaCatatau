import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native'; // Alterado de 'react-native' para 'react-native-web'

// --- Ícones Simples (Substitua por ícones reais mais tarde) ---
// Estamos usando SVGs inline como placeholders de ícones
const IconeMesa = () => (
  <View style={styles.iconPlaceholder}>
    <Text style={styles.iconText}>M</Text>
  </View>
);
const IconeCardapio = () => (
  <View style={styles.iconPlaceholder}>
    <Text style={styles.iconText}>C</Text>
  </View>
);
const IconeCozinha = () => (
  <View style={styles.iconPlaceholder}>
    <Text style={styles.iconText}>P</Text>
  </View>
);

// --- Dados Mock (Substitua pelo Realm DB na Semana 5-6) ---
const DADOS_MESAS = [
  { id: '1', nome: 'Mesa 01', status: 'Livre' },
  { id: '2', nome: 'Mesa 02', status: 'Ocupada' },
  { id: '3', nome: 'Mesa 03', status: 'Pagando' },
  { id: '4', nome: 'Mesa 04', status: 'Livre' },
];

const DADOS_CARDAPIO = [
  {
    title: 'Porções',
    data: [
      { id: 'p1', nome: 'Tilápia Frita', preco: 'R$ 45,00' },
      { id: 'p2', nome: 'Batata Frita', preco: 'R$ 25,00' },
      { id: 'p3', nome: 'Mandioca Frita', preco: 'R$ 22,00' },
    ],
  },
  {
    title: 'Bebidas',
    data: [
      { id: 'b1', nome: 'Coca-Cola Lata', preco: 'R$ 6,00' },
      { id: 'b2', nome: 'Suco de Laranja', preco: 'R$ 8,00' },
      { id: 'b3', nome: 'Água com Gás', preco: 'R$ 4,00' },
    ],
  },
];

// --- Telas do Aplicativo ---

/**
 * Tela 1: Visão de Mesas
 * Onde o garçom verá o status de todas as mesas.
 */
const MesasScreen = ({ onSelecionarMesa }) => (
  <View style={styles.telaContainer}>
    <Text style={styles.tituloTela}>Mesas</Text>
    <FlatList
      data={DADOS_MESAS}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [
            styles.mesaCard,
            item.status === 'Ocupada' && styles.mesaOcupada,
            item.status === 'Pagando' && styles.mesaPagando,
            pressed && styles.botaoPressionado,
          ]}
          onPress={() => onSelecionarMesa(item.id)}>
          <Text style={styles.mesaNome}>{item.nome}</Text>
          <Text style={styles.mesaStatus}>{item.status}</Text>
        </Pressable>
      )}
    />
  </View>
);

/**
 * Tela 2: Visão do Cardápio
 * Onde o garçom adiciona itens a uma comanda.
 * Usamos SectionList aqui, mas FlatList com seções é mais simples para este exemplo.
 */
const CardapioScreen = () => (
  <View style={styles.telaContainer}>
    <Text style={styles.tituloTela}>Cardápio</Text>
    {/* Aqui usaremos o SectionList, mas um FlatList simples 
      com cabeçalhos já demonstra o conceito da Semana 3-4.
 * (Seu plano menciona FlatList nos componentes de UI)
    */}
    <FlatList
      data={DADOS_CARDAPIO}
      keyExtractor={(item) => item.title}
      renderItem={({ item: secao }) => (
        <View style={styles.secaoContainer}>
          <Text style={styles.tituloSecao}>{secao.title}</Text>
          {secao.data.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.itemCardapio,
                pressed && styles.botaoPressionado,
              ]}>
              <View>
                <Text style={styles.itemNome}>{item.nome}</Text>
                <Text style={styles.itemPreco}>{item.preco}</Text>
              </View>
              <Pressable style={styles.botaoAdicionar}>
                <Text style={styles.botaoAdicionarTexto}>+</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}
    />
  </View>
);

/**
 * Tela 3: Cozinha / Pedidos Pendentes
 * Onde Waldin e Weila podem ver os pedidos pendentes.
 */
const CozinhaScreen = () => (
  <View style={styles.telaContainer}>
    <Text style={styles.tituloTela}>Pedidos Pendentes (Cozinha)</Text>
    <View style={styles.itemCardapio}>
      <View>
        <Text style={styles.itemNome}>Mesa 02: 1x Tilápia Frita</Text>
        <Text style={styles.itemPreco}>Enviado: 13:15</Text>
      </View>
      <Pressable style={[styles.botaoAdicionar, { backgroundColor: '#4CAF50' }]}>
        <Text style={styles.botaoAdicionarTexto}>✓</Text>
      </Pressable>
    </View>
    <View style={styles.itemCardapio}>
      <View>
        <Text style={styles.itemNome}>Mesa 02: 2x Coca-Cola Lata</Text>
        <Text style={styles.itemPreco}>Enviado: 13:15</Text>
      </View>
      <Pressable style={[styles.botaoAdicionar, { backgroundColor: '#4CAF50' }]}>
        <Text style={styles.botaoAdicionarTexto}>✓</Text>
      </Pressable>
    </View>
  </View>
);

// --- Navegação Principal (Semana 3-4) ---
// Usamos um sistema de navegação baseado em estado (useState) para manter
// tudo em um único arquivo, sem depender do setup do React Navigation ainda.

const BottomTabBar = ({ telaAtiva, onMudarTela }) => {
  const telas = [
    { nome: 'Mesas', icone: IconeMesa },
    { nome: 'Cardapio', icone: IconeCardapio },
    { nome: 'Cozinha', icone: IconeCozinha },
  ];

  return (
    <View style={styles.tabBarContainer}>
      {telas.map((tela) => {
        const estaAtiva = tela.nome === telaAtiva;
        return (
          <Pressable
            key={tela.nome}
            style={styles.tabItem}
            onPress={() => onMudarTela(tela.nome)}>
            <tela.icone />
            <Text
              style={[
                styles.tabLabel,
                estaAtiva ? styles.tabLabelAtiva : styles.tabLabelInativa,
              ]}>
              {tela.nome}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

/**
 * Componente Principal
 */
export default function App() {
  const [telaAtiva, setTelaAtiva] = useState('Mesas');

  // Função para renderizar a tela correta baseada no estado
  const renderizarTela = () => {
    switch (telaAtiva) {
      case 'Mesas':
        // A tela de mesas pode precisar mudar para a tela de cardápio
        // Aqui simulamos a navegação de "Mesa" -> "Cardápio"
        return <MesasScreen onSelecionarMesa={() => setTelaAtiva('Cardapio')} />;
      case 'Cardapio':
        return <CardapioScreen />;
      case 'Cozinha':
        return <CozinhaScreen />;
      default:
        return <MesasScreen onSelecionarMesa={() => setTelaAtiva('Cardapio')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <View style={styles.header}>
        <Text style={styles.tituloHeader}>Pesque Pague do Catatau</Text>
        <Text style={styles.subtituloHeader}>
          Prop. Waldin e Weila (Modo Offline ✈️)
        </Text>
      </View>

      {/* Área de conteúdo principal */}
      <View style={styles.conteudoPrincipal}>{renderizarTela()}</View>

      {/* Barra de Navegação Inferior */}
      <BottomTabBar telaAtiva={telaAtiva} onMudarTela={setTelaAtiva} />
    </SafeAreaView>
  );
}

// --- Estilização (Tailwind-like) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // bg-gray-100
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF', // bg-white
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // border-gray-200
  },
  tituloHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937', // text-gray-800
  },
  subtituloHeader: {
    fontSize: 14,
    color: '#6B7280', // text-gray-500
  },
  conteudoPrincipal: {
    flex: 1, // Ocupa todo o espaço disponível
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', // bg-white
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB', // border-gray-200
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontWeight: 'bold',
    color: '#4B5563',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  tabLabelAtiva: {
    color: '#3B82F6', // text-blue-500
    fontWeight: '600',
  },
  tabLabelInativa: {
    color: '#6B7280', // text-gray-500
  },
  // Estilos das Telas
  telaContainer: {
    flex: 1,
    padding: 16,
  },
  tituloTela: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937', // text-gray-800
    marginBottom: 16,
  },
  // Estilos Mesas
  mesaCard: {
    flex: 1,
    margin: 8,
    padding: 24,
    backgroundColor: '#FFFFFF', // bg-white
    borderRadius: 12, // rounded-xl
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra (iOS e Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mesaOcupada: {
    backgroundColor: '#FEE2E2', // bg-red-100
  },
  mesaPagando: {
    backgroundColor: '#FEF9C3', // bg-yellow-100
  },
  mesaNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  mesaStatus: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  // Estilos Cardápio
  secaoContainer: {
    marginBottom: 16,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151', // text-gray-700
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginBottom: 8,
  },
  itemCardapio: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  itemPreco: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  botaoAdicionar: {
    width: 32,
    height: 32,
    backgroundColor: '#3B82F6', // bg-blue-500
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoAdicionarTexto: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  botaoPressionado: {
    opacity: 0.7,
  },
});