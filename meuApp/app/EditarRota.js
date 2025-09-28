import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';  // Usando SafeAreaView do react-native-safe-area-context
import DropDownPicker from 'react-native-dropdown-picker'; // Usando DropDownPicker para o select
import * as ImagePicker from 'expo-image-picker'; // Usando expo-image-picker para pegar foto

export default function EditarRotaModal({ route, navigation }) {
  const { rota } = route.params;

  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState(rota.pedidos[0]?.status || '');
  const [statusItems, setStatusItems] = useState([
    { label: 'Em trânsito', value: 'Em trânsito' },
    { label: 'Finalizado', value: 'Finalizado' },
    { label: 'Aguardando liberação', value: 'Aguardando liberação' },
    { label: 'Cancelado', value: 'Cancelado' },
  ]);

  const [data, setData] = useState('');
  const [observacoes, setObservacoes] = useState(rota.observacoes || '');
  const [foto, setFoto] = useState(null);

  const handleEscolherFoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  };

  const handleSalvar = async () => {
    Alert.alert('Salvar Alterações', 'Deseja salvar as alterações?', [
        { text: 'Cancelar', style: 'cancel' },
        {
            text: 'Salvar',
            onPress: async () => {
                try {
                    let formData = new FormData();
                    formData.append("rotas_id_rotas", rota.id_rotas);
                    formData.append("pedido_id_pedido", rota.pedidos[0]?.id_pedido);
                    formData.append("tipo", rota.tipo); // precisa vir do backend junto com rota
                    formData.append("status", status);
                    formData.append("data", data || new Date().toISOString().slice(0, 19).replace("T", " "));
                    formData.append("observacoes", observacoes);

                    // Logando os dados de formData
                    console.log("Dados enviados para a API:");
                    formData.forEach((value, key) => {
                        console.log(key, value);  // Exibe cada chave e valor do FormData
                    });

                    // Se houver foto, adicionar ao FormData
                    if (foto) {
                        const filename = foto.split("/").pop();
                        const match = /\.(\w+)$/.exec(filename);
                        const type = match ? `image/${match[1]}` : "image";
                        formData.append("foto", { uri: foto, name: filename, type });
                    }

                    // Envio para a API
                    const response = await fetch("http://192.168.1.4:8000/api/historico", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "multipart/form-data",
                        },
                        body: formData,
                    });

                    const dataRes = await response.json();
                    console.log(dataRes); // Exibe o retorno da API

                    if (response.ok) {
                        Alert.alert("Sucesso", "Rota alterada com sucesso!");
                        navigation.goBack();
                    } else {
                        Alert.alert("Erro", dataRes.error || "Erro ao salvar rota");
                    }
                } catch (error) {
                    console.error("Erro ao salvar rota:", error);
                    Alert.alert("Erro", "Falha na conexão com servidor");
                }
            },
        },
    ]);
};


  return (
    <SafeAreaView style={styles.container}>
      <View contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.header}>Atualizar Status da Rota #{rota.id_rotas}</Text>

        {/* Botão Cancelar */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        {/* Status */}
        <Text style={styles.label}>Novo Status:</Text>
        <DropDownPicker
          open={statusOpen}
          value={status}
          items={statusItems}
          setOpen={setStatusOpen}
          setValue={setStatus}
          setItems={setStatusItems}
          placeholder="Selecione o status"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />

        {/* Data */}
        <Text style={styles.label}>Data:</Text>
        <TextInput
          style={styles.input}
          value={data}
          onChangeText={setData}
          placeholder={Platform.OS === 'ios' ? 'AAAA-MM-DD HH:MM' : 'AAAA-MM-DD HH:MM'}
        />

        {/* Observações */}
        <Text style={styles.label}>Observações:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={observacoes}
          onChangeText={setObservacoes}
          placeholder="Observações (opcional)"
          multiline
        />

        {/* Foto */}
        <Text style={styles.label}>Foto (opcional):</Text>
        {foto && <Image source={{ uri: foto }} style={styles.fotoPreview} />}
        <TouchableOpacity onPress={handleEscolherFoto} style={styles.button}>
          <Text style={styles.buttonText}>Selecionar Foto</Text>
        </TouchableOpacity>

        {/* Botão Salvar */}
        <TouchableOpacity onPress={handleSalvar} style={styles.button}>
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f4',
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#34495e',
    marginTop: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    marginBottom: 15,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  fotoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});
