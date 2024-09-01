import ExpenseItemComponent from "@/components/ExpenseItemComponent";
import { useExpenses } from "@/contexts/ExpensesContext";
import { AllExpensesScreenProps } from "@/navigation/types";
import { View, Card, HStack, Spinner, Text } from "@gluestack-ui/themed";
import { useMemo } from "react";
import { StyleSheet, FlatList, StatusBar } from "react-native";

const AllExpensesScreen: React.FC<AllExpensesScreenProps> = ({ route, navigation }) => {
  const { expenses, isLoading } = useExpenses();

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, item) => total + item.amount, 0).toFixed(2);
  }, [expenses]);

  if (isLoading) {
    return <Spinner size="large" color="#647AA1" sx={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }

  const ListEmptyComponent = () => {
    return (
      <View sx={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, marginLeft: -13 }}>
        <Text>No expenses</Text>
      </View>
    );
  };

  return (
    <>
      <Card p={10} m={5} mt={10}>
        <HStack justifyContent="space-between" alignItems="center">
          <Text color="black" size="sm">
            Total
          </Text>
          <Text color="black" bold>
            {totalExpenses} $
          </Text>
        </HStack>
      </Card>
      <FlatList
        data={expenses}
        keyExtractor={(item) => (item.id ? item.id : item.name)}
        renderItem={({ item }) => <ExpenseItemComponent expense={item} />}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};

export default AllExpensesScreen;
