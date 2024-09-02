import { useCustomToast } from "@/hooks/useCustomToast";
import { authenticateUser, createUser } from "@/util/authAPI";
import { createContext, FC, ReactNode, useContext, useState } from "react";

type AuthContextType =
  | {
      userToken: string | undefined;
      userId: string | undefined;
      isAuthLoading: boolean;
      isAuthenticated: boolean;
      login: (email: string, password: string) => void;
      signUp: (email: string, password: string) => void;
      logout: () => void;
    }
  | undefined;

const AuthContext = createContext<AuthContextType>(undefined);

const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const { displayToast } = useCustomToast();

  const isAuthenticated = userToken !== undefined;

  const signUp = async (email: string, password: string) => {
    setIsAuthLoading(true);

    try {
      const { idToken, localId } = await createUser(email, password);
      setUserToken(idToken);
      setUserId(localId);
    } catch (error) {
      displayToast("Account creation failed, make sure you enter valid credentials", "error");
    }

    setIsAuthLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsAuthLoading(true);

    try {
      const { idToken, localId } = await authenticateUser(email, password);
      setUserToken(idToken);
      setUserId(localId);
      setIsAuthLoading(false);
      displayToast("Welcome!", "success");
    } catch (error) {
      displayToast("Login failed, make sure you enter valid credentials", "error");
      setIsAuthLoading(false);
    }
  };

  const logout = () => {
    setIsAuthLoading(true);
    setUserToken(undefined);
    setUserId(undefined);
    setIsAuthLoading(false);
    displayToast("Logged out", "success");
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userId,
        isAuthLoading,
        isAuthenticated,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthContextProvider");
  return context;
};

export { AuthContextProvider, useAuth };
