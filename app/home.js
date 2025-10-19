import { useCallback, useEffect, useMemo, useState } from "react";
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
import { FontAwesome5 } from "@expo/vector-icons";
import { apiFetch, endpoints } from "../config/api";
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
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        const data = await apiFetch(`${endpoints.rotas}?page=${page}`);
        setRotas((prev) => (shouldReplace || page === 1 ? data.data : [...prev, ...data.data]));
        setMeta(data.meta ?? { current_page: page, last_page: page });
      } catch (error) {
        console.error("Erro ao carregar rotas", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchRotas();
  }, [fetchRotas]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRotas(1, true).finally(() => setRefreshing(false));
  }, [fetchRotas]);

  const loadMore = useCallback(() => {
    if (loadingMore || loading) return;
    if (meta.current_page >= meta.last_page) return;
    const nextPage = meta.current_page + 1;
    fetchRotas(nextPage);
  }, [fetchRotas, loading, loadingMore, meta.current_page, meta.last_page]);

  const headerSubtitle = useMemo(() => {
    if (!user) return "";
    return `Olá, ${user.nome?.split(" ")[0] ?? user.user}!`;
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#08DF74" />}
        onMomentumScrollEnd={({ nativeEvent }) => {
          const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
          const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
          if (distanceFromBottom < 200) {
            loadMore();
          }
        }}
      >
        <DnaHeader title="Minhas Rotas" subtitle={headerSubtitle} />

        <View style={styles.toolbar}>
          <View style={styles.infoPill}>
            <FontAwesome5 name="clock" size={14} color="#7D89C6" />
            <Text style={styles.infoText}>{rotas.length} rotas em andamento</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <FontAwesome5 name="sign-out-alt" size={16} color="#FF6B6B" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color="#08DF74" size="large" />
            <Text style={styles.loaderText}>Carregando rotas...</Text>
          </View>
        ) : rotas.length === 0 ? (
          <EmptyState message="Nenhuma rota encontrada. Puxe para atualizar." />
        ) : (
          rotas.map((rota) => (
            <RouteCard
              key={rota.id_rotas}
              rota={rota}
              onPress={() => navigation.navigate("RotaDetalhes", { rota })}
            />
          ))
        )}

        {loadingMore && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator color="#7D89C6" />
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
    backgroundColor: "#050B2E",
  },
  scrollContent: {
    padding: 24,
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
    gap: 8,
    backgroundColor: "#0C1540",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  infoText: {
    color: "#C6CCF7",
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    borderRadius: 999,
  },
  logoutText: {
    color: "#FF6B6B",
    fontWeight: "600",
  },
  loaderContainer: {
    paddingVertical: 48,
    alignItems: "center",
    gap: 12,
  },
  loaderText: {
    color: "#C6CCF7",
  },
  loadingMoreContainer: {
    marginTop: 12,
    alignItems: "center",
    gap: 8,
    paddingBottom: 32,
  },
  loadingMoreText: {
    color: "#7D89C6",
  },
});
