import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context"; 
import StatusPill from "../components/StatusPill";
import { dnaColors } from "../config/theme";
import { formatDate, formatDateTime } from "../utils/format";

export default function RotaDetalhes({ route, navigation }) {
  const { rota: rotaInicial, onRotaUpdate } = route.params;
  const [rotaAtual, setRotaAtual] = useState(rotaInicial);
  const insets = useSafeAreaInsets(); 

  const historicosOrdenados = useMemo(
    () => [...(rotaAtual.historicos ?? [])].sort((a, b) => (a.data < b.data ? 1 : -1)),
    [rotaAtual.historicos]
  );

  const tituloRota = useMemo(() => {
    const texto = rotaAtual.tipo ?? "Rota";
    if (!texto) return "Rota";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }, [rotaAtual.tipo]);

  const pedidoPrincipal = rotaAtual.pedidos?.[0];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8, 
          paddingBottom: insets.bottom + 24, 
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
    
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color={dnaColors.textPrimary} />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>

        
        <View style={styles.headerCard}>
          <View>
            <Text style={styles.headerLabel}>Rota #{rotaAtual.id_rotas}</Text>
            <Text style={styles.headerTitle}>{tituloRota}</Text>
          </View>
          <StatusPill status={pedidoPrincipal?.status ?? historicosOrdenados[0]?.status} />
        </View>

        
        <View style={styles.infoGrid}>
          <InfoItem icon="calendar-alt" label="Início" value={formatDate(rotaAtual.data_inicio)} />
          <InfoItem icon="clock" label="Previsão" value={formatDate(rotaAtual.previsao)} />
          <InfoItem icon="tachometer-alt" label="Distância" value={`${rotaAtual.distancia ?? "-"} km`} />
          <InfoItem icon="truck" label="Veículo" value={rotaAtual.veiculo?.placa ?? "Não informado"} />
        </View>

        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Paradas</Text>
          <View style={styles.listRow}>
            <FontAwesome5 name="warehouse" size={16} color={dnaColors.accent} />
            <Text style={styles.listText}>Origem: {rotaAtual.origem?.nome ?? "-"}</Text>
          </View>
          <View style={styles.listRow}>
            <FontAwesome5 name="map-marker-alt" size={16} color={dnaColors.warning} />
            <Text style={styles.listText}>Destino: {rotaAtual.destino?.nome ?? "-"}</Text>
          </View>
          <View style={styles.listRow}>
            <FontAwesome5 name="file-alt" size={16} color={dnaColors.textMuted} />
            <Text style={styles.listText}>{rotaAtual.observacoes || "Sem observações adicionais."}</Text>
          </View>
        </View>

        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Histórico</Text>
          {historicosOrdenados.length === 0 ? (
            <Text style={styles.emptyHistory}>Ainda não há atualizações registradas.</Text>
          ) : (
            historicosOrdenados.map((hist) => (
              <View key={`${hist.id_historico}-${hist.data}`} style={styles.timelineRow}>
                <View style={styles.timelineIcon}>
                  <FontAwesome5 name="dot-circle" size={18} color={dnaColors.accent} />
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

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { bottom: insets.bottom + 16 }, 
        ]}
        onPress={() =>
          navigation.navigate("EditarRota", {
            rota: rotaAtual,
            onUpdate: (atualizada) => {
              setRotaAtual(atualizada);
              if (onRotaUpdate) {
                onRotaUpdate(atualizada);
              }
            },
          })
        }
      >
        <FontAwesome5 name="pen" size={16} color={dnaColors.textInverse} />
        <Text style={styles.primaryButtonText}>Atualizar rota</Text>
      </TouchableOpacity>
    </View>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <View style={styles.infoItem}>
      <FontAwesome5 name={icon} size={16} color={dnaColors.textMuted} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dnaColors.background,
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
    color: dnaColors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  headerCard: {
    backgroundColor: dnaColors.backgroundElevated,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: dnaColors.border,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLabel: {
    color: dnaColors.textMuted,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    color: dnaColors.textPrimary,
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
    backgroundColor: dnaColors.backgroundElevated,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: dnaColors.border,
  },
  infoLabel: {
    color: dnaColors.textMuted,
    fontSize: 13,
    marginTop: 12,
  },
  infoValue: {
    color: dnaColors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  card: {
    backgroundColor: dnaColors.backgroundElevated,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: dnaColors.border,
    marginBottom: 24,
  },
  cardTitle: {
    color: dnaColors.textPrimary,
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
    color: dnaColors.textSecondary,
    flex: 1,
  },
  emptyHistory: {
    color: dnaColors.textMuted,
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
    borderLeftColor: dnaColors.border,
    paddingLeft: 16,
  },
  timelineTitle: {
    color: dnaColors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  timelineDate: {
    color: dnaColors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  timelineObs: {
    color: dnaColors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },
  primaryButton: {
    position: "absolute",
    left: 24,
    right: 24,
    backgroundColor: dnaColors.accent,
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: dnaColors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    color: dnaColors.textInverse,
    fontWeight: "700",
    fontSize: 16,
  },
});
