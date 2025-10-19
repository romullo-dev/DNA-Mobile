import { StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function EmptyState({ message = "Nenhuma informação disponível." }) {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="inbox" size={36} color="#4F5FA3" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#C6CCF7",
    textAlign: "center",
  },
});
