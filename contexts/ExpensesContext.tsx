import { Expense } from "@/types/data";
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { deleteExpense, fetchExpenses, storeExpense, updateExpense } from "@/util/http";
import { useCustomToast } from "@/hooks/useCustomToast";

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
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { displayToast } = useCustomToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const expenses = await fetchExpenses();
        setExpenses(expenses.reverse());
      } catch (error) {
        displayToast(String(error), "error");
      }
    }

    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, []);

  const addExpense = async (expenseToAdd: Expense) => {
    setIsLoading(true);
    try {
      const newExpense = await storeExpense(expenseToAdd);
      setExpenses([newExpense, ...expenses]);
      displayToast("Your new expense has been added!", "success");
    } catch (error) {
      displayToast(String(error), "error");
    }
    setIsLoading(false);
  };

  const modifyExpense = async (expenseToModify: Expense) => {
    setIsLoading(true);

    try {
      await updateExpense(expenseToModify);
      const updatedExpenses = await fetchExpenses();
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
      await deleteExpense(expenseToRemove.id);
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
