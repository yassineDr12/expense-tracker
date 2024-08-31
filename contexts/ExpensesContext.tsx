import { Expense } from "@/types/data";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { deleteExpense, fetchExpenses, storeExpense, updateExpense } from "@/util/http";

type ExpensesContextType =
  | {
      expenses: Expense[];
      addExpense: (expenseToAdd: Expense) => void;
      modifyExpense: (expenseToModify: Expense) => void;
      removeExpense: (expenseToRemove: Expense) => void;
    }
  | undefined;

const ExpensesContext = createContext<ExpensesContextType>(undefined);

const ExpensesContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    async function fetchData() {
      const expenses = await fetchExpenses();
      setExpenses(expenses.reverse());
    }

    fetchData();
  }, []);

  const addExpense = async (expenseToAdd: Expense) => {
    const newExpense = await storeExpense(expenseToAdd);
    setExpenses([newExpense, ...expenses]);
  };

  const modifyExpense = async (expenseToModify: Expense) => {
    await updateExpense(expenseToModify);
    const updatedExpenses = await fetchExpenses();
    setExpenses(updatedExpenses);
  };

  const removeExpense = (expenseToRemove: Expense) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense !== expenseToRemove));
    deleteExpense(expenseToRemove.id);
  };

  return (
    <ExpensesContext.Provider
      value={{ expenses, addExpense: addExpense, modifyExpense: modifyExpense, removeExpense: removeExpense }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (context === undefined) throw new Error("useExpenses must be used within ExpensesContextProvider");
  return context;
};

export { ExpensesContextProvider, useExpenses };
