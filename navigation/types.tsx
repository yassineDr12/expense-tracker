import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

export type BottomTabParamList = {
  Recent: undefined;
  AllExpenses: undefined;
};

export type AllExpensesScreenProps = BottomTabScreenProps<BottomTabParamList, "AllExpenses">;

export type RecentScreenProps = BottomTabScreenProps<BottomTabParamList, "Recent">;
