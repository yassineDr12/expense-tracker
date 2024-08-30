import ExpenseItemComponent from "@/components/ExpenseItemComponent";
import { useExpenses } from "@/contexts/ExpensesContext";
import { AllExpensesScreenProps } from "@/navigation/types";
import { Box, Card, HStack, Text } from "@gluestack-ui/themed";
import { useMemo } from "react";
import { FlatList, View } from "react-native";

const AllExpensesScreen: React.FC<AllExpensesScreenProps> = ({ route, navigation }) => {
  const { expenses } = useExpenses();

  const totalExpenses = useMemo(() => {
    return expenses.reduce((total, item) => total + item.amount, 0).toFixed(2);
  }, [expenses]);

  return (
    <>
      <View style={{ flex: 1, marginLeft: 13 }}>
        <Card width="95%" p={10} m={3} mt={5}>
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseItemComponent expense={item} />}
          style={{ width: "100%" }}
        />
      </View>
    </>
  );
};

export default AllExpensesScreen;
