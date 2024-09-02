import { Expense } from "@/types/data";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { deleteExpense, fetchExpenses, storeExpense, updateExpense } from "@/util/dataAPI";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useAuth } from "./AuthContext";

type ExpensesContextType =
  | {
      expenses: Expense[];
      isLoading: boolean;
      addExpense: (expenseToAdd: Expense) => void;
      modifyExpense: (expenseToModify: Expense) => void;
      removeExpense: (expenseToRemove: Expense) => void;
    }
  | undefined;

const ExpensesContext = createContext<ExpensesContextType>(undefined);

const ExpensesContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { userToken, userId, isAuthLoading, isAuthenticated } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { displayToast } = useCustomToast();

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const fetchedExpenses: Expense[] = await fetchExpenses(userToken, userId);
      setExpenses(fetchedExpenses);
      setIsLoading(false);
    } catch (error) {
      displayToast("Error loading expenses", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      loadExpenses();
    }
    if (!isAuthenticated && expenses.length > 0) {
      setExpenses([]);
    }
  }, [isAuthenticated, isAuthLoading]);

  const addExpense = async (expenseToAdd: Expense) => {
    setIsLoading(true);
    try {
      const newExpense = await storeExpense(expenseToAdd, userToken, userId);
      setExpenses([newExpense, ...expenses]);
      displayToast(`${newExpense.name} expense added!`, "success");
    } catch (error) {
      displayToast(String(error), "error");
    }
    setIsLoading(false);
  };

  const modifyExpense = async (expenseToModify: Expense) => {
    setIsLoading(true);

    try {
      await updateExpense(expenseToModify, userToken, userId);
      const updatedExpenses = await fetchExpenses(userToken, userId);
      setExpenses(updatedExpenses);
      displayToast(`${expenseToModify.name} expense details updated!`, "success");
    } catch (error) {
      displayToast(String(error), "error");
    }

    setIsLoading(false);
  };

  const removeExpense = async (expenseToRemove: Expense) => {
    setIsLoading(true);

    try {
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense !== expenseToRemove));
      await deleteExpense(expenseToRemove.id, userToken, userId);
      displayToast(`${expenseToRemove.name} expense has been removed!`, "success");
    } catch (error) {
      displayToast(String(error), "error");
    }

    setIsLoading(false);
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        isLoading,
        addExpense,
        modifyExpense,
        removeExpense,
      }}
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
