import Scractch from "./Scratch";
import { GluestackUIProvider, StatusBar } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config";
import { BottomTabNavigationOptions, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import RecentScreen from "./screens/RecentScreen";
import AllExpensesScreen from "./screens/AllExpensesScreen";
import { BottomTabParamList } from "./navigation/types";
import { ExpensesContextProvider } from "./contexts/ExpensesContext";
import AddExpenseButton from "./components/AddExpenseButton";

const Tab = createBottomTabNavigator<BottomTabParamList>();

const screenOptions: (props: { route: { name: keyof BottomTabParamList } }) => BottomTabNavigationOptions = ({
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

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <ExpensesContextProvider>
        <StatusBar />
        {/* <Scractch /> */}
        <NavigationContainer>
          <Tab.Navigator screenOptions={screenOptions} initialRouteName="AllExpenses">
            <Tab.Screen
              name="AllExpenses"
              options={{
                title: "All Expenses",
                headerRight: () => <AddExpenseButton />,
              }}
              component={AllExpensesScreen}
            />
            <Tab.Screen name="Recent" component={RecentScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </ExpensesContextProvider>
    </GluestackUIProvider>
  );
}
