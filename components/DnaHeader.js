import { StyleSheet, Text, View } from "react-native";

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
    color: "#7D89C6",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 8,
  },
});
