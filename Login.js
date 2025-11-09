import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { apiFetch, endpoints } from "./config/api";
import { dnaColors } from "./config/theme";
import { useAuth } from "./contexts/AuthContext";

export default function Login() {
  const navigation = useNavigation();
  const { setUser } = useAuth();
  const [user, setUserField] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!user || !password) {
      Alert.alert("Campos obrigatórios", "Informe usuário e senha para continuar.");
      return;
    }

    try {
      setSubmitting(true);
      const data = await apiFetch(endpoints.login, {
        method: "POST",
        body: JSON.stringify({ user, password }),
      });

      if (data.success) {
        setUser(data.user);
      } else {
        Alert.alert("Acesso negado", data.message ?? "Usuário ou senha inválidos");
      }
    } catch (error) {
      Alert.alert("Erro ao conectar", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.brandContainer}>
        <View style={styles.logoWrapper}>
          <FontAwesome5 name="truck" size={36} color={dnaColors.accent} />
        </View>
        <Text style={styles.brandTitle}>DNA Transportes</Text>
        <Text style={styles.brandSubtitle}>Painel do Motorista</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <FontAwesome5
            name="user"
            size={18}
            color={dnaColors.accent}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Usuário"
            placeholderTextColor="#7D89C6"
            autoCapitalize="none"
            value={user}
            onChangeText={setUserField}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome5
            name="lock"
            size={18}
            color={dnaColors.accent}
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#7D89C6"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#050B2E" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dnaColors.background,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: dnaColors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 26,
    color: dnaColors.textPrimary,
    fontWeight: "700",
  },
  brandSubtitle: {
    fontSize: 15,
    color: dnaColors.textMuted,
    marginTop: 6,
  },
  form: {
    backgroundColor: dnaColors.backgroundElevated,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: dnaColors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: dnaColors.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: dnaColors.accentBorder,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: dnaColors.textPrimary,
    fontSize: 16,
  },
  button: {
    backgroundColor: dnaColors.accent,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: dnaColors.textInverse,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.6,
  },
});
