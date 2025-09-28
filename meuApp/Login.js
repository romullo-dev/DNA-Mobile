import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Ícones do FontAwesome

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.4:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Bem-vindo ${data.user.nome}`);
        navigation.replace("Home");
      } else {
        alert("Usuário ou senha inválidos");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro de conexão com servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DNA Transportes</Text>
      <View style={styles.form}>
        {/* Campo de E-mail */}
        <View style={styles.inputContainer}>
          <FontAwesome5 name="envelope" size={20} color="#2980b9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            autoCapitalize="none"
            value={user}
            onChangeText={setUser}
          />
        </View>

        {/* Campo de Senha */}
        <View style={styles.inputContainer}>
          <FontAwesome5 name="lock" size={20} color="#2980b9" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Botão de Login */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F2C", // Cor de fundo DNA Transportes
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffc107",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E2749",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#2980b9", // Cor da sombra
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Elevação da sombra
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#08df74ff", // Cor do botão (verde DNA)
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
    shadowColor: "#dfaf20ff", // Sombra verde para o botão
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#2ECC71",
    textAlign: "center",
  },
});
