import { Expense } from "@/types/data";
import { createContext, FC, ReactNode, useContext, useState } from "react";
import { expenses as data } from "@/constants/expenses";

type ExpensesContextType =
  | {
      expenses: Expense[];
      addExpense: (expenseToAdd: Expense) => void;
      removeExpense: (expenseToRemove: Expense) => void;
    }
  | undefined;

const ExpensesContext = createContext<ExpensesContextType>(undefined);

const ExpensesContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(data);

  const addExpense = (expenseToAdd: Expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expenseToAdd]);
  };

  const removeExpense = (expenseToRemove: Expense) => {
    setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense !== expenseToRemove));
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense: addExpense, removeExpense: removeExpense }}>
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
