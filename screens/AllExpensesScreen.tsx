import ExpenseItemComponent from "@/components/ExpenseItemComponent";
import { useExpenses } from "@/contexts/ExpensesContext";
import { AllExpensesScreenProps } from "@/navigation/types";
import { View } from "react-native";

const AllExpensesScreen: React.FC<AllExpensesScreenProps> = ({ route, navigation }) => {
  const { expenses } = useExpenses();
  const expense1 = expenses[0];

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ExpenseItemComponent expense={expense1} />
    </View>
  );
};

export default AllExpensesScreen;
