import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

 const handleLogin = async () => {
  try {
    // Faz a requisição GET para a sua API
    const response = await fetch("http://127.0.0.1:8000/api/usuarios");
    const data = await response.json();

    console.log("Usuários recebidos:", data);

    // Exemplo: mostrar no alert só o primeiro usuário
    if (data.length > 0) {
      alert(`Primeiro usuário: ${data[0].nome} - ${data[0].email}`);
    }
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DNA Transportes</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          keyboardType="visible-password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F2C", // fundo azul escuro profissional
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
  input: {
    backgroundColor: "#1E2749",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    color: "#fff",
  },
  button: {
    backgroundColor: "#2ECC71", // verde pra dar destaque
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#2ECC71",
    textAlign: "center",
  },
});

