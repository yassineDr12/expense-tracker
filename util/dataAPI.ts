import { Expense } from "@/types/data";
import axios from "axios";

const DATA_BACKEND_URL = "https://expense-tracker-app-45a2f-default-rtdb.europe-west1.firebasedatabase.app/";

export async function storeExpense(
  expense: Expense,
  userToken: string | undefined,
  userId: string | undefined
): Promise<Expense> {
  if (!userToken || !userId) throw new Error("No token or user ID provided");

  const response = await axios.post(`${DATA_BACKEND_URL}/expenses/${userId}.json?auth=${userToken}`, expense);
  const id = await response.data.name;
  return { ...expense, id };
}

export async function fetchExpenses(userToken: string | undefined, userId: string | undefined): Promise<Expense[]> {
  if (!userToken || !userId) throw new Error("No token or user ID provided");

  const response = await axios.get(`${DATA_BACKEND_URL}/expenses/${userId}.json?auth=${userToken}`);
  const data = await response.data;

  const expenses: Expense[] = [];

  for (const key in data)
    expenses.push({
      ...data[key],
      date: new Date(data[key].date),
      id: key,
    });

  return expenses;
}

export async function updateExpense(
  expense: Expense,
  userToken: string | undefined,
  userId: string | undefined
): Promise<void> {
  if (!userToken || !userId) throw new Error("No token or user ID provided");

  const newData = {
    name: expense.name,
    amount: expense.amount,
    date: expense.date,
  };
  await axios.put(`${DATA_BACKEND_URL}/expenses/${userId}/${expense.id}.json?auth=${userToken}`, newData);
}

export async function deleteExpense(id: string | undefined, userToken: string | undefined, userId: string | undefined) {
  if (!userToken || !userId) throw new Error("No token or user ID provided");

  await axios.delete(`${DATA_BACKEND_URL}/expenses/${userId}/${id}.json?auth=${userToken}`);
}
