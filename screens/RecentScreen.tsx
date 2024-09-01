import AddExpenseButton from "@/components/AddExpenseButton";
import ExpenseItemComponent from "@/components/ExpenseItemComponent";
import { useExpenses } from "@/contexts/ExpensesContext";
import { HomeTabScreenProps } from "@/navigation/types";
import { Expense } from "@/types/data";
import {
  View,
  Text,
  Card,
  HStack,
  Menu,
  Button,
  ButtonText,
  MenuItem,
  MenuItemLabel,
  Spinner,
} from "@gluestack-ui/themed";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";

// a filter type for the expenses date
type FilterType = "Today" | "Yesterday" | "Last 7 Days" | "Last 30 Days" | "Last 60 Days";

// create a function to filter the expenses by date based on the selected filter type
const filterExpensesByDate = (expenses: Expense[], filter: FilterType): Expense[] => {
  switch (filter) {
    case "Today":
      return expenses.filter((expense) => new Date(expense.date).toDateString() === new Date().toDateString());
    case "Yesterday":
      return expenses.filter(
        (expense) =>
          new Date(expense.date).toDateString() === new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toDateString()
      );
    case "Last 7 Days":
      return expenses.filter(
        (expense) =>
          new Date(expense.date).toDateString() >=
          new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toDateString()
      );
    case "Last 30 Days":
      return expenses.filter(
        (expense) =>
          new Date(expense.date).toDateString() >=
          new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).toDateString()
      );
    case "Last 60 Days":
      return expenses.filter(
        (expense) =>
          new Date(expense.date).toDateString() >=
          new Date(new Date().getTime() - 60 * 24 * 60 * 60 * 1000).toDateString()
      );
  }
};

const RecentScreen: React.FC<HomeTabScreenProps<"Recent">> = ({ route, navigation }) => {
  const { expenses, isLoading, logout } = useExpenses();
  const [filter, setFilter] = useState<FilterType>("Today");
  const recentExpenses = useMemo(() => filterExpensesByDate(expenses, filter), [expenses, filter]);
  const totalExpenses = useMemo(() => {
    return recentExpenses.reduce((total, item) => total + item.amount, 0).toFixed(2);
  }, [recentExpenses]);

  if (isLoading) {
    return <Spinner size="large" color="#647AA1" sx={{ flex: 1, justifyContent: "center", alignItems: "center" }} />;
  }
  const logoutHandler = () => {
    logout();
    navigation.replace("Login");
  };

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
          onPress={logoutHandler}
        >
          <Ionicons name="log-out-outline" size={34} color="#647AA1" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const ListEmptyComponent = () => {
    return (
      <View sx={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, marginLeft: -13 }}>
        <Text>No expenses for the selected filter</Text>
      </View>
    );
  };

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
                <Button {...triggerProps} bgColor="#647AA1">
                  <ButtonText>{filter}</ButtonText>
                </Button>
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
