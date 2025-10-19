import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { formatDateTime } from "../utils/format";

function getUltimoHistorico(historicos = []) {
  if (!historicos.length) return undefined;
  return [...historicos].sort((a, b) => (a.data < b.data ? 1 : -1))[0];
}

function RouteCard({ rota, onPress }) {
  const ultimoHistorico = getUltimoHistorico(rota.historicos);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.headerRow}>
        <FontAwesome5 name="route" size={18} color="#08DF74" />
        <Text style={styles.cardTitle}>{rota.tipo}</Text>
        <View style={[styles.badge, styles.statusBadge]}>
          <Text style={styles.badgeText}>{ultimoHistorico?.status ?? "Sem status"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <FontAwesome5 name="warehouse" size={16} color="#B7C1FF" />
        <Text style={styles.rowText}>Origem: {rota.origem?.nome ?? "-"}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="map-marker-alt" size={16} color="#FFC857" />
        <Text style={styles.rowText}>Destino: {rota.destino?.nome ?? "-"}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="clock" size={16} color="#9DA5D1" />
        <Text style={styles.rowText}>Previsão: {formatDateTime(rota.previsao)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#10194E",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },
  cardTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  statusBadge: {
    backgroundColor: "rgba(8, 223, 116, 0.12)",
  },
  badgeText: {
    color: "#08DF74",
    fontWeight: "600",
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  rowText: {
    color: "#E2E6FF",
    fontSize: 15,
    flex: 1,
  },
});

export default memo(RouteCard);
