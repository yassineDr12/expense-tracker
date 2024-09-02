import AddExpenseButton from "@/components/AddExpenseButton";
import ExpenseItemComponent from "@/components/ExpenseItemComponent";
import { useExpenses } from "@/contexts/ExpensesContext";
import { HomeTabScreenProps } from "@/navigation/types";
import { View, Card, HStack, Spinner, Text } from "@gluestack-ui/themed";
import { useEffect, useMemo } from "react";
import { FlatList } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/LogoutButton";

const AllExpensesScreen: React.FC<HomeTabScreenProps<"AllExpenses">> = ({ route, navigation }) => {
  const { expenses, isLoading } = useExpenses();
  const { logout } = useAuth();

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, item) => total + item.amount, 0).toFixed(2);
  }, [expenses]);

  const ListEmptyComponent = () => {
    return (
      <View sx={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, marginLeft: -13 }}>
        <Text>No expenses</Text>
      </View>
    );
  };

  if (isLoading) {
    return <Spinner size="large" color="#647AA1" sx={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }

  return (
    <>
      <Card p={10} m={5} mt={10}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text size="sm">Total</Text>
          <Text bold>{totalExpenses}</Text>
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
