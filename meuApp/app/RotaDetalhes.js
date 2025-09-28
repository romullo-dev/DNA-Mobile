import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importando ícones do FontAwesome5

// Função para formatar a data no formato brasileiro (DD/MM/YYYY)
const formatarDataBrasil = (data) => {
  const date = new Date(data);
  return new Intl.DateTimeFormat('pt-BR').format(date);
};

export default function RotaDetalhes({ route, navigation }) {
  const { rota } = route.params; // Recebe a rota como parâmetro

  const handleAlterar = () => {
    // Exemplo de alerta de confirmação
    Alert.alert(
      "Alterar Rota",
      "Você deseja alterar esta rota?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Alterar",
          onPress: () => navigation.navigate('EditarRota', { rota }) // Navega para a tela de edição
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Detalhes da Rota</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.infoBox}>
          <FontAwesome5 name="route" size={24} color="#2980b9" />
          <Text style={[styles.text, styles.typeText]}>Tipo: {rota.tipo}</Text>
        </View>

        <View style={styles.infoBox}>
          <FontAwesome5 name="check-circle" size={24} color="#27ae60" />
          <Text style={[styles.text, styles.statusText]}>Status: {rota.pedidos[0]?.status}</Text>
        </View>

        <View style={styles.infoBox}>
          <FontAwesome5 name="map-marker-alt" size={24} color="#e74c3c" />
          <Text style={[styles.text, styles.destinationText]}>Destino: {rota.destino.nome}</Text>
        </View>

        <View style={styles.infoBox}>
          <FontAwesome5 name="calendar-alt" size={24} color="#8e44ad" />
          <Text style={[styles.text, styles.dateText]}>Data de Início: {formatarDataBrasil(rota.data_inicio)}</Text>
        </View>

        <View style={styles.infoBox}>
          <FontAwesome5 name="clock" size={24} color="#f39c12" />
          <Text style={[styles.text, styles.dateText]}>Previsão: {formatarDataBrasil(rota.previsao)}</Text>
        </View>

        <View style={styles.infoBox}>
          <FontAwesome5 name="tachometer-alt" size={24} color="#16a085" />
          <Text style={[styles.text, styles.distanceText]}>Distância: {rota.distancia} Km</Text>
        </View>

        <View style={styles.infoBox}>
          <FontAwesome5 name="sticky-note" size={24} color="#f1c40f" />
          <Text style={[styles.text, styles.obsText]}>Observações: {rota.observacoes || 'Nenhuma observação'}</Text>
        </View>

        {/* Exibindo o Destino */}
        <View style={styles.infoBox}>
          <FontAwesome5 name="flag-checkered" size={24} color="#e67e22" />
          <Text style={[styles.text, styles.destinationText]}>Destino: {rota.destino.nome}</Text>
        </View>
        <Text style={styles.text}>Endereço Destino: {rota.destino.logradouro}, {rota.destino.bairro}, {rota.destino.cidade} - {rota.destino.uf}</Text>
      </View>

      {/* Botões de Voltar e Alterar Rota */}
      <View style={styles.buttonsContainer}>
        {/* Botão Voltar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        {/* Botão Alterar Rota */}
        <TouchableOpacity onPress={handleAlterar} style={styles.button}>
          <Text style={styles.buttonText}>Alterar Rota</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 10,
    marginLeft: 10,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  typeText: {
    fontWeight: 'bold',
  },
  statusText: {
    color: '#27ae60',
  },
  destinationText: {
    color: '#e74c3c',
  },
  dateText: {
    color: '#8e44ad',
  },
  distanceText: {
    color: '#16a085',
  },
  obsText: {
    color: '#f39c12',
  },
  originText: {
    color: '#2ecc71',
  },
  buttonsContainer: {
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 30, // Espaçamento inferior
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#2980b9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
