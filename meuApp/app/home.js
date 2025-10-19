import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Usando ícones do FontAwesome5

export default function Home({ navigation }) {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRotas = async () => {
      try {
        const response = await fetch('http://192.168.1.32:8000/api/rotas'); // A URL da sua API
        const data = await response.json();
        setRotas(data.data);
      } catch (error) {
        console.error("Erro ao buscar rotas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRotas();
  }, []);

 const renderRota = ({ item }) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() => {
      // Navega para a tela de detalhes e passa a rota como parâmetro
      navigation.navigate('RotaDetalhes', { rota: item });
    }}
  >
    <View style={styles.infoRow}>
      <FontAwesome5 name="route" size={20} color="#2980b9" />
      <Text style={styles.rotaText}>Tipo: {item.tipo}</Text>
    </View>
    <View style={styles.infoRow}>
      <FontAwesome5 name="check-circle" size={20} color="#27ae60" />
      <Text style={styles.rotaText}>Status: {item.historicos[0]?.status}</Text> {/* Corrigido para acessar o status dentro de historicos */}
    </View>
    <View style={styles.infoRow}>
      <FontAwesome5 name="map-marker-alt" size={20} color="#e74c3c" />
      <Text style={styles.rotaText}>Destino: {item.destino.nome}</Text>
    </View>
  </TouchableOpacity>
);



  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rotas Disponíveis</Text>

      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={rotas}
          keyExtractor={(item) => item.id_rotas.toString()}
          renderItem={renderRota}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingTop: 70,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2980b9', // Cor azul DNA Transportes
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginTop: 20,
  },
  flatListContainer: {
    width: '85%',
    paddingHorizontal: 15,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rotaText: {
    fontSize: 18,
    color: '#34495e',
    marginLeft: 10,
  },

  
});
