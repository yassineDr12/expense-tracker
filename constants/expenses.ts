import { Expense } from "@/types/data";

// fake expenses
export const expenses: Expense[] = [
  {
    id: "1",
    name: "Rent",
    amount: 200,
    date: new Date("2021-05-01"),
  },
  {
    id: "2",
    name: "Groceries",
    amount: 300,
    date: new Date("2021-05-02"),
  },
  {
    id: "3",
    name: "Utilities",
    amount: 150,
    date: new Date("2021-05-05"),
  },
  {
    id: "4",
    name: "Internet",
    amount: 80,
    date: new Date("2021-05-10"),
  },
  {
    id: "5",
    name: "Phone Bill",
    amount: 60,
    date: new Date("2021-05-15"),
  },
  {
    id: "6",
    name: "Car Insurance",
    amount: 120,
    date: new Date("2021-05-20"),
  },
  {
    id: "7",
    name: "Dining Out",
    amount: 75,
    date: new Date("2021-05-25"),
  },
];
