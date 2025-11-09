import { memo, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { dnaColors } from "../config/theme";
import { formatDateTime } from "../utils/format";

function getUltimoHistorico(historicos = []) {
  if (!historicos.length) return undefined;
  return [...historicos].sort((a, b) => (a.data < b.data ? 1 : -1))[0];
}

function RouteCard({ rota, onPress }) {
  const ultimoHistorico = getUltimoHistorico(rota.historicos);
  const tituloRota = useMemo(() => {
    const texto = rota.tipo ?? "Rota";
    if (!texto) return "Rota";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }, [rota.tipo]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.headerRow}>
        <FontAwesome5 name="route" size={18} color={dnaColors.accent} />
        <Text style={styles.cardTitle}>{tituloRota}</Text>
        <View style={[styles.badge, styles.statusBadge]}>
          <Text style={styles.badgeText}>{ultimoHistorico?.status ?? "Sem status"}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <FontAwesome5 name="warehouse" size={16} color={dnaColors.iconHighlight} />
        <Text style={styles.rowText}>Origem: {rota.origem?.nome ?? "-"}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="map-marker-alt" size={16} color={dnaColors.warning} />
        <Text style={styles.rowText}>Destino: {rota.destino?.nome ?? "-"}</Text>
      </View>
      <View style={styles.row}>
        <FontAwesome5 name="clock" size={16} color={dnaColors.textMuted} />
        <Text style={styles.rowText}>Previsão: {formatDateTime(rota.previsao)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: dnaColors.card,
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: dnaColors.border,
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
    color: dnaColors.textPrimary,
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
    backgroundColor: dnaColors.accentMuted,
  },
  badgeText: {
    color: dnaColors.accent,
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
    color: dnaColors.textSecondary,
    fontSize: 15,
    flex: 1,
  },
});

export default memo(RouteCard);
