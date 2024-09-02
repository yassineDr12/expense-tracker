import Scractch from "./Scratch";
import "react-native-gesture-handler";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import RecentScreen from "./screens/RecentScreen";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import AllExpensesScreen from "./screens/AllExpensesScreen";
import { HomeTabParamList, RootStackParamList } from "./navigation/types";
import { ExpensesContextProvider } from "./contexts/ExpensesContext";
import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContextProvider, useAuth } from "./contexts/AuthContext";

const HomeTab = createBottomTabNavigator<HomeTabParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

const tabScreensOptions: (props: { route: { name: keyof HomeTabParamList } }) => BottomTabNavigationOptions = ({
  route,
}) => ({
  tabBarIcon: ({ focused, color, size }) => {
    if (route.name === "Recent") {
      return <Ionicons name={focused ? "hourglass-outline" : "hourglass"} size={size} color={color} />;
    } else if (route.name === "AllExpenses") {
      return <Ionicons name={focused ? "list" : "list-outline"} size={size} color={color} />;
    }
  },
  tabBarActiveTintColor: "#647AA1",
  tabBarInactiveTintColor: "gray",
});

const Home = () => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <></>;
  return (
    <HomeTab.Navigator screenOptions={tabScreensOptions} initialRouteName="AllExpenses">
      <HomeTab.Screen
        name="AllExpenses"
        options={{
          title: "All Expenses",
        }}
        component={AllExpensesScreen}
      />
      <HomeTab.Screen name="Recent" component={RecentScreen} />
    </HomeTab.Navigator>
  );
};

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <AuthContextProvider>
        <ExpensesContextProvider>
          <StatusBar style="auto" />
          {/* <Scractch /> */}
          <NavigationContainer>
            <RootStack.Navigator initialRouteName="Login">
              <RootStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
              <RootStack.Screen
                name="Login"
                component={LoginScreen}
                options={{
                  headerShown: false,
                }}
              />
              <RootStack.Screen
                name="Signup"
                component={SignupScreen}
                options={{
                  headerShown: false,
                }}
              />
            </RootStack.Navigator>
          </NavigationContainer>
        </ExpensesContextProvider>
      </AuthContextProvider>
    </GluestackUIProvider>
  );
}
