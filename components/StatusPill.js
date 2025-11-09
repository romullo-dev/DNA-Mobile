import { StyleSheet, Text, View } from "react-native";
import { dnaColors } from "../config/theme";

const statusColors = {
  "Em trânsito": dnaColors.success,
  Finalizado: dnaColors.info,
  Ocorrência: dnaColors.danger,
  "Aguardando liberação": dnaColors.warning,
  Cancelado: dnaColors.danger,
};

export default function StatusPill({ status }) {
  const color = statusColors[status] ?? dnaColors.textMuted;
  return (
    <View style={[styles.pill, { backgroundColor: `${color}33` }]}>
      <Text style={[styles.text, { color }]}>{status ?? "Sem status"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  text: {
    fontWeight: "600",
    fontSize: 13,
    letterSpacing: 0.4,
  },
});
