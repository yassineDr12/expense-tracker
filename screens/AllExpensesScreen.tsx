import AddExpenseButton from "@/components/AddExpenseButton";
import ExpenseItemComponent from "@/components/ExpenseItemComponent";
import { useExpenses } from "@/contexts/ExpensesContext";
import { HomeTabScreenProps } from "@/navigation/types";
import { View, Card, HStack, Spinner, Text } from "@gluestack-ui/themed";
import { useEffect, useMemo } from "react";
import { FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

const AllExpensesScreen: React.FC<HomeTabScreenProps<"AllExpenses">> = ({ route, navigation }) => {
  const { expenses, isLoading } = useExpenses();
  const { isAuthLoading, isAuthenticated, logout } = useAuth();

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, item) => total + item.amount, 0).toFixed(2);
  }, [expenses]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.navigate("Login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={34} color="#647AA1" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const ListEmptyComponent = () => {
    return (
      <View sx={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, marginLeft: -13 }}>
        <Text>No expenses</Text>
      </View>
    );
  };

  if (isLoading || isAuthLoading) {
    return <Spinner size="large" color="#647AA1" sx={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }

  return (
    <>
      <Card p={10} m={5} mt={10}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text color="black" size="sm">
            Total
          </Text>
          <Text color="black" bold>
            {totalExpenses}
          </Text>
        </HStack>
      </Card>
      <FlatList
        data={expenses}
        keyExtractor={(item) => (item.id ? item.id : item.name)}
        renderItem={({ item }) => <ExpenseItemComponent expense={item} />}
        ListEmptyComponent={ListEmptyComponent}
      />
      <AddExpenseButton />
    </>
  );
};

export default AllExpensesScreen;
