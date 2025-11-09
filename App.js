import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ IMPORTANTE!
import Login from "./Login";
import Home from "./app/home";
import RotaDetalhes from "./app/RotaDetalhes";
import EditarRota from "./app/EditarRota";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { dnaColors } from "./config/theme";

const Stack = createNativeStackNavigator();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: dnaColors.accent,
    background: dnaColors.background,
    card: dnaColors.background,
    text: dnaColors.textPrimary,
    border: dnaColors.border,
  },
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="RotaDetalhes" component={RotaDetalhes} />
          <Stack.Screen name="EditarRota" component={EditarRota} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="light" />
          <AppRoutes />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
