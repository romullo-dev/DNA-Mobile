import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from "react-native";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.27:8000/api/login", {
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
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={user}
          onChangeText={setUser}
        />
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0F2C", alignItems: "center", justifyContent: "center", padding: 20 },
  logo: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 40 },
  form: { width: "100%" },
  input: { backgroundColor: "#1E2749", padding: 15, borderRadius: 10, marginBottom: 15, color: "#fff" },
  button: { backgroundColor: "#2ECC71", padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 15, color: "#2ECC71", textAlign: "center" },
});
