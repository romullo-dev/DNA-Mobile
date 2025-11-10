import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { apiFetch, endpoints } from "../config/api";
import { dnaColors } from "../config/theme";
import { useAuth } from "../contexts/AuthContext";
import RouteCard from "../components/RouteCard";
import EmptyState from "../components/EmptyState";
import DnaHeader from "../components/DnaHeader";

export default function Home({ navigation }) {
  const { user, logout } = useAuth();
  const [rotas, setRotas] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const fetchRotas = useCallback(
    async (page = 1, shouldReplace = false) => {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const data = await apiFetch(`${endpoints.rotas}?page=${page}`);

        setRotas((prev) =>
          shouldReplace || page === 1 ? data.data : [...prev, ...data.data]
        );
        setMeta(data.meta ?? { current_page: page, last_page: page });
      } catch (error) {
        console.error("❌ Erro ao carregar rotas:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      fetchRotas(1, true);
    }, [fetchRotas])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRotas(1, true).finally(() => setRefreshing(false));
  }, [fetchRotas]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading) return;
    if (meta.current_page >= meta.last_page) return;
    fetchRotas(meta.current_page + 1);
  }, [fetchRotas, loading, loadingMore, meta]);

  const headerSubtitle = useMemo(() => {
    if (!user) return "";
    return `Olá, ${user.nome?.split(" ")[0] ?? user.user}!`;
  }, [user]);

  const handleRotaAtualizada = useCallback((rotaAtualizada) => {
    if (!rotaAtualizada?.id_rotas) return;
    setRotas((prev) =>
      prev.map((r) =>
        r.id_rotas === rotaAtualizada.id_rotas ? { ...r, ...rotaAtualizada } : r
      )
    );
  }, []);

  const statusPermitidos = [
    "Aguardando coleta",
    "Em processo de coleta",
    "Aguardando transferência",
    "Em processo de transferência",
    "Em processo de separação no destino",
    "Em rota de entrega",
  ];

  const rotasFiltradas = useMemo(() => {
    if (!user || !rotas?.length) return [];

    return rotas.filter((rota) => {
      const motoristaId = rota.motorista?.usuario?.id_usuario;
      const usuarioId = Number(user.id_usuario);
      if (motoristaId !== usuarioId) return false;

      const historicos = rota.historicos ?? [];
      if (historicos.length === 0) return false;

      const ultimoStatus = [...historicos]
        .sort((a, b) => new Date(b.data) - new Date(a.data))[0]?.status?.trim();

      return statusPermitidos.includes(ultimoStatus);
    });
  }, [rotas, user]);

  useEffect(() => {
    const ids = rotas.map((r) => r.motorista?.usuario?.id_usuario);
    console.log("👤 Usuário logado:", user?.id_usuario);
    console.log("🧭 IDs das rotas:", ids);
    console.log("✅ Rotas filtradas:", rotasFiltradas.length);
  }, [rotas, user, rotasFiltradas]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={dnaColors.accent}
          />
        }
        onMomentumScrollEnd={({ nativeEvent }) => {
          const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
          const distanceFromBottom =
            contentSize.height - (contentOffset.y + layoutMeasurement.height);
          if (distanceFromBottom < 200) loadMore();
        }}
      >
        <DnaHeader
          title="Minhas Rotas"
          subtitle={headerSubtitle}
          titleStyle={styles.headerTitle}
          subtitleStyle={styles.headerSubtitle}
        />

        <View style={styles.toolbar}>
          <View style={styles.infoPill}>
            <FontAwesome5 name="clock" size={16} color={dnaColors.accent} />
            <Text style={styles.infoText}>
              {rotasFiltradas.length} rotas em andamento
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <FontAwesome5 name="sign-out-alt" size={16} color={dnaColors.danger} />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={dnaColors.accent} size="large" />
            <Text style={styles.loaderText}>Carregando rotas...</Text>
          </View>
        ) : rotasFiltradas.length === 0 ? (
          <EmptyState message="Nenhuma rota em andamento no momento." />
        ) : (
          rotasFiltradas.map((rota) => (
            <RouteCard
              key={rota.id_rotas}
              rota={rota}
              onPress={() =>
                navigation.navigate("RotaDetalhes", {
                  rota,
                  onRotaUpdate: handleRotaAtualizada,
                })
              }
            />
          ))
        )}

        {loadingMore && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator color={dnaColors.textMuted} />
            <Text style={styles.loadingMoreText}>Carregando mais rotas...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: dnaColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: dnaColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 18,
    color: dnaColors.textSecondary,
    marginBottom: 10,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: dnaColors.backgroundElevated,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  infoText: {
    color: dnaColors.textSecondary,
    fontSize: 15,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "rgba(255, 99, 99, 0.15)",
    borderRadius: 30,
  },
  logoutText: {
    color: dnaColors.danger,
    fontWeight: "600",
    fontSize: 15,
  },
  loaderContainer: {
    paddingVertical: 50,
    alignItems: "center",
    gap: 12,
  },
  loaderText: {
    color: dnaColors.textSecondary,
    fontSize: 16,
  },
  loadingMoreContainer: {
    marginTop: 20,
    alignItems: "center",
    gap: 8,
    paddingBottom: 32,
  },
  loadingMoreText: {
    color: dnaColors.textMuted,
    fontSize: 14,
  },
});
