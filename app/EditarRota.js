import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { endpoints } from "../config/api";

// 🔹 Mapa de status por tipo de rota
const STATUS_MAP = {
  Coleta: ["Em trânsito", "Finalizado", "Ocorrência"],
  Transferencia: ["Em trânsito", "Finalizado", "Ocorrência"],
  Entrega: ["Em trânsito", "Finalizado", "Ocorrência"],
};

export default function EditarRota({ route, navigation }) {
  const { rota, onUpdate } = route.params;
  const [statusOpen, setStatusOpen] = useState(false);

  // 🔤 Normaliza o tipo para evitar erro de case (coleta, Coleta, etc.)
  const tipoNormalizado =
    rota.tipo?.charAt(0).toUpperCase() + rota.tipo?.slice(1).toLowerCase();

  const statusOptions = useMemo(
    () => STATUS_MAP[tipoNormalizado] ?? STATUS_MAP.Entrega,
    [tipoNormalizado]
  );

  const statusInicial = useMemo(() => {
    const atual = rota.pedidos?.[0]?.status ?? rota.historicos?.[0]?.status;
    if (atual && statusOptions.includes(atual)) return atual;
    return statusOptions[0];
  }, [rota.historicos, rota.pedidos, statusOptions]);

  const [status, setStatus] = useState(statusInicial);
  const [observacao, setObservacao] = useState(
    rota.historicos?.[0]?.observacao ?? ""
  );
  const [foto, setFoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setStatus(statusInicial), [statusInicial]);

  // 📸 Selecionar imagem
  const pickImage = async (fromCamera = false) => {
    try {
      const permission = await (fromCamera
        ? ImagePicker.requestCameraPermissionsAsync()
        : ImagePicker.requestMediaLibraryPermissionsAsync());

      if (!permission.granted) {
        Alert.alert(
          "Permissão necessária",
          "Conceda acesso à câmera ou galeria para anexar imagens."
        );
        return;
      }

      const result = await (fromCamera
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ["images"], // novo formato compatível
            quality: 0.7,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.7,
          }));

      if (!result.canceled) setFoto(result.assets[0]);
    } catch (error) {
      console.error("Erro ao selecionar imagem", error);
      Alert.alert("Erro", "Não foi possível acessar as imagens.");
    }
  };

  // 💾 Enviar formulário
  const handleSalvar = async () => {
    Alert.alert("Confirmar atualização", "Deseja salvar as alterações da rota?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salvar",
        onPress: async () => {
          try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append("rotas_id_rotas", String(rota.id_rotas));
            formData.append(
              "pedido_id_pedido",
              String(rota.pedidos?.[0]?.id_pedido ?? "")
            );
            formData.append("tipo", tipoNormalizado ?? "Entrega");
            formData.append("status", status);
            formData.append("observacao", observacao);

            if (foto) {
              const uri = foto.uri;
              const name = uri.split("/").pop();
              const match = /\.(\w+)$/.exec(name ?? "");
              const type = match ? `image/${match[1]}` : "image/jpeg";

              formData.append("foto", {
                uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                name: name ?? "evidencia.jpg",
                type,
              });
            }

            console.log("📤 Enviando dados:", {
              pedido_id_pedido: rota.pedidos?.[0]?.id_pedido,
              rotas_id_rotas: rota.id_rotas,
              tipo: tipoNormalizado,
              status,
              observacao,
              foto: !!foto,
            });

            const response = await fetch(endpoints.historico, {
              method: "POST",
              headers: { Accept: "application/json" },
              body: formData,
            });

            const text = await response.text();
            let data;
            try {
              data = text ? JSON.parse(text) : null;
            } catch {
              throw new Error("Resposta inválida do servidor");
            }

            if (!response.ok || !data?.success) {
              throw new Error(data?.message ?? "Não foi possível atualizar a rota");
            }

            console.log("✅ Resposta da API:", data);

            // 🔄 Atualiza a rota no retorno da tela anterior
            if (onUpdate) {
              const novoHistorico = {
                id_historico: Date.now(),
                data: new Date().toISOString(),
                status,
                observacao,
                foto: foto ? foto.uri.split("/").pop() : null,
              };

              const novaRota = {
                ...rota,
                historicos: [...(rota.historicos || []), novoHistorico],
              };

              onUpdate(novaRota);
            }

            Alert.alert(
              "✅ Sucesso",
              data.message ?? "Rota atualizada com sucesso!"
            );
            navigation.goBack();
          } catch (error) {
            console.error("❌ Erro ao salvar rota:", error);
            Alert.alert("Erro", error.message ?? "Falha ao salvar alterações.");
          } finally {
            setSubmitting(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome5 name="times" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.title}>Atualizar Rota #{rota.id_rotas}</Text>
            <Text style={styles.subtitle}>
              Informe o novo status e adicione evidências, se necessário.
            </Text>

            <Text style={styles.label}>Status</Text>
            <DropDownPicker
              open={statusOpen}
              value={status}
              items={statusOptions.map((option) => ({
                label: option,
                value: option,
              }))}
              setOpen={setStatusOpen}
              setValue={(callback) => {
                const nextValue =
                  typeof callback === "function" ? callback(status) : callback;
                setStatus(nextValue);
              }}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              textStyle={styles.dropdownText}
              placeholder="Selecione o status"
              zIndex={9999}
            />

            <Text style={styles.label}>Observação</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={observacao}
              onChangeText={setObservacao}
              placeholder="Descreva detalhes importantes da ocorrência"
              placeholderTextColor="#7D89C6"
              multiline
            />

            <Text style={styles.label}>Foto</Text>
            {foto ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: foto.uri }} style={styles.preview} />
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setFoto(null)}
                >
                  <FontAwesome5 name="trash" size={14} color="#FF6B6B" />
                  <Text style={styles.clearButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.helperText}>
                Adicione uma foto como comprovante (opcional).
              </Text>
            )}

            <View style={styles.photoActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => pickImage(false)}
              >
                <FontAwesome5 name="images" size={16} color="#08DF74" />
                <Text style={styles.secondaryButtonText}>Galeria</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => pickImage(true)}
              >
                <FontAwesome5 name="camera" size={16} color="#08DF74" />
                <Text style={styles.secondaryButtonText}>Câmera</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                submitting && styles.primaryButtonDisabled,
              ]}
              onPress={handleSalvar}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? "Enviando..." : "Salvar atualizações"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#050B2E" },
  scrollContent: { padding: 24, paddingBottom: 48, paddingTop: 40 },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.08)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: { color: "#FFFFFF", fontSize: 24, fontWeight: "700" },
  subtitle: { color: "#7D89C6", marginTop: 6, marginBottom: 24 },
  label: { color: "#C6CCF7", fontWeight: "600", marginBottom: 12 },
  input: {
    backgroundColor: "#0C1540",
    color: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 24,
  },
  textArea: { minHeight: 120, textAlignVertical: "top" },
  dropdown: {
    backgroundColor: "#0C1540",
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    marginBottom: 24,
  },
  dropdownContainer: {
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#0C1540",
  },
  dropdownText: { color: "#FFFFFF" },
  previewContainer: { marginBottom: 16 },
  preview: { width: "100%", height: 220, borderRadius: 16 },
  helperText: { color: "#7D89C6", marginBottom: 12 },
  clearButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clearButtonText: { color: "#FF6B6B", fontWeight: "600" },
  photoActions: { flexDirection: "row", gap: 12, marginBottom: 32 },
  secondaryButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(8,223,116,0.4)",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "rgba(8,223,116,0.08)",
  },
  secondaryButtonText: { color: "#08DF74", fontWeight: "600" },
  primaryButton: {
    backgroundColor: "#08DF74",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: {
    color: "#050B2E",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.6,
  },
  innerContainer: { flexGrow: 1, justifyContent: "flex-start", paddingBottom: 60 },
});
