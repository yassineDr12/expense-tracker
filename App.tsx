import Scractch from "./Scratch";
import { StatusBar } from "expo-status-bar";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import RecentScreen from "./screens/RecentScreen";
import AllExpensesScreen from "./screens/AllExpensesScreen";
import { BottomTabParamList } from "./navigation/types";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const screenOptions: (props: { route: { name: keyof BottomTabParamList } }) => BottomTabNavigationOptions = ({
  route,
}) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === "Recent") {
      iconName = focused ? "hourglass-outline" : "hourglass";
    } else if (route.name === "AllExpenses") {
      iconName = focused ? "list" : "list-outline";
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: "#647AA1",
  tabBarInactiveTintColor: "gray",
});

export default function App() {
  return (
    <>
      {/* <Scractch /> */}
      <NavigationContainer>
        <Tab.Navigator screenOptions={screenOptions}>
          <Tab.Screen name="Recent" component={RecentScreen} />
          <Tab.Screen name="AllExpenses" options={{ title: "All Expenses" }} component={AllExpensesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}
