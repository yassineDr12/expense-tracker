import { Expense } from "@/types/data";
import axios from "axios";

const BACKEND_URL = "https://expense-tracker-app-45a2f-default-rtdb.europe-west1.firebasedatabase.app/";

export async function storeExpense(expense: Expense): Promise<Expense> {
  const response = await axios.post(`${BACKEND_URL}/expenses.json`, expense);
  const id = await response.data.name;
  return { ...expense, id };
}

export async function fetchExpenses(): Promise<Expense[]> {
  const response = await axios.get(`${BACKEND_URL}/expenses.json`);
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

export async function updateExpense(expense: Expense): Promise<void> {
  const newData = {
    name: expense.name,
    amount: expense.amount,
    date: expense.date,
  };
  await axios.put(`${BACKEND_URL}/expenses/${expense.id}.json`, newData);
}

export function deleteExpense(id: string | undefined) {
  axios.delete(`${BACKEND_URL}/expenses/${id}.json`);
}
