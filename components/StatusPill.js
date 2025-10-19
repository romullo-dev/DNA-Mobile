import { StyleSheet, Text, View } from "react-native";

const statusColors = {
  "Em trânsito": "#08DF74",
  Finalizado: "#4AA3FF",
  Ocorrência: "#FF6B6B",
  "Aguardando liberação": "#FFC857",
  Cancelado: "#B8336A",
};

export default function StatusPill({ status }) {
  const color = statusColors[status] ?? "#7D89C6";
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
