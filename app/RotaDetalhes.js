import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // ✅ Importação correta
import StatusPill from "../components/StatusPill";
import { formatDate, formatDateTime } from "../utils/format";

export default function RotaDetalhes({ route, navigation }) {
  const { rota } = route.params;
  const insets = useSafeAreaInsets(); // ✅ Calcula margens seguras

  const historicosOrdenados = useMemo(
    () => [...(rota.historicos ?? [])].sort((a, b) => (a.data < b.data ? 1 : -1)),
    [rota.historicos]
  );

  const pedidoPrincipal = rota.pedidos?.[0];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8, // 👈 respeita notch e adiciona espaço extra
          paddingBottom: insets.bottom + 24, // 👈 ajusta botão inferior
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔙 Botão Voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#FFFFFF" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        {/* 🏷 Cabeçalho */}
        <View style={styles.headerCard}>
          <View>
            <Text style={styles.headerLabel}>Rota #{rota.id_rotas}</Text>
            <Text style={styles.headerTitle}>{rota.tipo}</Text>
          </View>
          <StatusPill status={pedidoPrincipal?.status ?? historicosOrdenados[0]?.status} />
        </View>

        {/* 🧭 Informações */}
        <View style={styles.infoGrid}>
          <InfoItem icon="calendar-alt" label="Início" value={formatDate(rota.data_inicio)} />
          <InfoItem icon="clock" label="Previsão" value={formatDate(rota.previsao)} />
          <InfoItem icon="tachometer-alt" label="Distância" value={`${rota.distancia ?? "-"} km`} />
          <InfoItem icon="truck" label="Veículo" value={rota.veiculo?.placa ?? "Não informado"} />
        </View>

        {/* 🏢 Paradas */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Paradas</Text>
          <View style={styles.listRow}>
            <FontAwesome5 name="warehouse" size={16} color="#08DF74" />
            <Text style={styles.listText}>Origem: {rota.origem?.nome ?? "-"}</Text>
          </View>
          <View style={styles.listRow}>
            <FontAwesome5 name="map-marker-alt" size={16} color="#FFC857" />
            <Text style={styles.listText}>Destino: {rota.destino?.nome ?? "-"}</Text>
          </View>
          <View style={styles.listRow}>
            <FontAwesome5 name="file-alt" size={16} color="#7D89C6" />
            <Text style={styles.listText}>{rota.observacoes || "Sem observações adicionais."}</Text>
          </View>
        </View>

        {/* 🕓 Histórico */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Histórico</Text>
          {historicosOrdenados.length === 0 ? (
            <Text style={styles.emptyHistory}>Ainda não há atualizações registradas.</Text>
          ) : (
            historicosOrdenados.map((hist) => (
              <View key={`${hist.id_historico}-${hist.data}`} style={styles.timelineRow}>
                <View style={styles.timelineIcon}>
                  <FontAwesome5 name="dot-circle" size={18} color="#08DF74" />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>{hist.status}</Text>
                  <Text style={styles.timelineDate}>{formatDateTime(hist.data)}</Text>
                  {hist.observacao ? (
                    <Text style={styles.timelineObs}>{hist.observacao}</Text>
                  ) : null}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* ✏️ Botão principal fixo */}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          { bottom: insets.bottom + 16 }, // 👈 ajusta altura no iPhone
        ]}
        onPress={() => navigation.navigate("EditarRota", { rota })}
      >
        <FontAwesome5 name="pen" size={16} color="#050B2E" />
        <Text style={styles.primaryButtonText}>Atualizar rota</Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <View style={styles.infoItem}>
      <FontAwesome5 name={icon} size={16} color="#7D89C6" />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050B2E",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  headerCard: {
    backgroundColor: "#0C1540",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLabel: {
    color: "#7D89C6",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  infoItem: {
    width: "47%",
    backgroundColor: "#0C1540",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  infoLabel: {
    color: "#7D89C6",
    fontSize: 13,
    marginTop: 12,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#0C1540",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 24,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  listText: {
    color: "#C6CCF7",
    flex: 1,
  },
  emptyHistory: {
    color: "#7D89C6",
    fontStyle: "italic",
  },
  timelineRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 20,
  },
  timelineIcon: {
    paddingTop: 2,
  },
  timelineContent: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255, 255, 255, 0.1)",
    paddingLeft: 16,
  },
  timelineTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  timelineDate: {
    color: "#7D89C6",
    fontSize: 13,
    marginTop: 4,
  },
  timelineObs: {
    color: "#C6CCF7",
    fontSize: 14,
    marginTop: 6,
  },
  primaryButton: {
    position: "absolute",
    left: 24,
    right: 24,
    backgroundColor: "#08DF74",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#08DF74",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#050B2E",
    fontWeight: "700",
    fontSize: 16,
  },
});
