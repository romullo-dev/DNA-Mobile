import { StyleSheet, Text, View } from "react-native";
import { dnaColors } from "../config/theme";

export default function DnaHeader({ title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  subtitle: {
    color: dnaColors.textMuted,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    color: dnaColors.textPrimary,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },
});
