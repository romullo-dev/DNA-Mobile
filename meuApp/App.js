import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./Login";
import Home from "./app/home";
import RotaDetalhes from "./app/RotaDetalhes";
import EditarRota from "./app/EditarRota";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="RotaDetalhes" component={RotaDetalhes} />
        <Stack.Screen name="EditarRota" component={EditarRota} />

      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
