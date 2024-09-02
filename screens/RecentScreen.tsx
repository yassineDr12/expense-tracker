import AddExpenseButton from "@/components/AddExpenseButton";
import ExpenseItemComponent from "@/components/ExpenseItemComponent";
import { useExpenses } from "@/contexts/ExpensesContext";
import { HomeTabScreenProps } from "@/navigation/types";
import { Expense } from "@/types/data";
import { View, Text, Card, HStack, Menu, MenuItem, MenuItemLabel, Spinner } from "@gluestack-ui/themed";
import { useMemo, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

// a filter type for the expenses date
type FilterType = "Today" | "Yesterday" | "Last 7 Days" | "Last 30 Days" | "Last 60 Days";

// create a function to filter the expenses by date based on the selected filter type
const filterExpensesByDate = (expenses: Expense[], filter: FilterType): Expense[] => {
  const now = new Date();
  const startOfDay = (date: Date) => new Date(date.setHours(0, 0, 0, 0));
  const endOfDay = (date: Date) => new Date(date.setHours(23, 59, 59, 999));

  switch (filter) {
    case "Today":
      const todayStart = startOfDay(new Date(now));
      const todayEnd = endOfDay(new Date(now));
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= todayStart && expenseDate <= todayEnd;
      });

    case "Yesterday":
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const yesterdayStart = startOfDay(yesterday);
      const yesterdayEnd = endOfDay(yesterday);
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= yesterdayStart && expenseDate <= yesterdayEnd;
      });

    case "Last 7 Days":
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= sevenDaysAgo && expenseDate <= now;
      });

    case "Last 30 Days":
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= thirtyDaysAgo && expenseDate <= now;
      });

    case "Last 60 Days":
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= sixtyDaysAgo && expenseDate <= now;
      });

    default:
      return expenses;
  }
};

const RecentScreen: React.FC<HomeTabScreenProps<"Recent">> = () => {
  const { expenses, isLoading } = useExpenses();
  const [filter, setFilter] = useState<FilterType>("Today");
  const recentExpenses = useMemo(() => filterExpensesByDate(expenses, filter), [expenses, filter]);
  const totalExpenses = useMemo(() => {
    return recentExpenses.reduce((total, item) => total + item.amount, 0).toFixed(2);
  }, [recentExpenses]);

  const ListEmptyComponent = () => {
    return (
      <View sx={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, marginLeft: -13 }}>
        <Text>No expenses for the selected filter</Text>
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
          <Menu
            placement="bottom"
            offset={5}
            marginLeft={25}
            trigger={({ ...triggerProps }) => {
              return (
                <TouchableOpacity
                  {...triggerProps}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 0.8,
                    borderColor: "#647AA1",
                    borderRadius: 5,
                    padding: 3,
                    marginVertical: -2,
                  }}
                >
                  <Ionicons name="calendar-outline" size={20} color="#647AA1" />
                  <Text size="xs" style={{ marginHorizontal: 5 }}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            }}
          >
            <MenuItem key="Today" textValue="Today" onPress={() => setFilter("Today")}>
              <MenuItemLabel size="sm">Today</MenuItemLabel>
            </MenuItem>
            <MenuItem key="Yesterday" textValue="Yesterday" onPress={() => setFilter("Yesterday")}>
              <MenuItemLabel size="sm">Yesterday</MenuItemLabel>
            </MenuItem>
            <MenuItem key="Last 7 Days" textValue="Last 7 Days" onPress={() => setFilter("Last 7 Days")}>
              <MenuItemLabel size="sm">Last 7 Days</MenuItemLabel>
            </MenuItem>
            <MenuItem key="Last 30 Days" textValue="Last 30 Days" onPress={() => setFilter("Last 30 Days")}>
              <MenuItemLabel size="sm">Last 30 Days</MenuItemLabel>
            </MenuItem>
            <MenuItem key="Last 60 Days" textValue="Last 60 Days" onPress={() => setFilter("Last 60 Days")}>
              <MenuItemLabel size="sm">Last 60 Days</MenuItemLabel>
            </MenuItem>
          </Menu>

          <Text color="black" bold>
            {totalExpenses}
          </Text>
        </HStack>
      </Card>
      <FlatList
        data={recentExpenses}
        keyExtractor={(item) => (item.id ? item.id : item.name)}
        renderItem={({ item }) => <ExpenseItemComponent expense={item} />}
        style={{ width: "100%" }}
        ListEmptyComponent={ListEmptyComponent}
      />
      <AddExpenseButton />
    </>
  );
};
export default RecentScreen;
