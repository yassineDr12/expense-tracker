import { useCustomToast } from "@/hooks/useCustomToast";
import { authenticateUser, createUser, refreshToken } from "@/util/authAPI";
import { createContext, FC, ReactNode, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  userToken: string | undefined;
  userId: string | undefined;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | undefined>(undefined);
  const [expirationTime, setExpirationTime] = useState<number | undefined>(undefined);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { displayToast } = useCustomToast();

  const isAuthenticated = userToken !== undefined;

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (expirationTime) {
      const timeUntilExpiry = expirationTime - Date.now();

      if (timeUntilExpiry <= 0) {
        refreshAuthToken(); // Token has already expired, refresh immediately
      } else {
        const refreshTimer = setTimeout(refreshAuthToken, Math.max(timeUntilExpiry - 60000, 0)); // Refresh 1 minute before expiry
        return () => clearTimeout(refreshTimer);
      }
    }
  }, [expirationTime]);

  const loadStoredAuth = async () => {
    try {
      const storedAuth = await AsyncStorage.getItem("auth");
      if (storedAuth) {
        const { userToken, userId, refreshToken, expirationTime } = JSON.parse(storedAuth);
        // Early token expiry check
        if (expirationTime <= Date.now()) {
          await refreshAuthToken();
        } else {
          setUserToken(userToken);
          setUserId(userId);
          setRefreshTokenValue(refreshToken);
          setExpirationTime(expirationTime);
        }
      }
    } catch (error) {
      console.error("Failed to load authentication state", error);
    }
    setIsAuthLoading(false);
  };

  const storeAuth = async (token: string, id: string, refreshToken: string, expiresIn: string) => {
    const expirationTime = Date.now() + parseInt(expiresIn) * 1000;
    const authData = { userToken: token, userId: id, refreshToken, expirationTime };

    await AsyncStorage.setItem("auth", JSON.stringify(authData));

    setUserToken(token);
    setUserId(id);
    setRefreshTokenValue(refreshToken);
    setExpirationTime(expirationTime);
  };

  const refreshAuthToken = async (retryCount = 0) => {
    if (!refreshTokenValue) {
      console.warn("No refresh token available");
      await logout();
      return;
    }

    try {
      const { idToken, localId, expiresIn, refreshToken: newRefreshToken } = await refreshToken(refreshTokenValue);
      await storeAuth(idToken, localId, newRefreshToken, expiresIn);
    } catch (error: unknown) {
      console.error("Failed to refresh token", error);

      if (error instanceof Error && error.message.includes("network") && retryCount < 3) {
        // Retry refresh token after 5 seconds, up to 3 times
        setTimeout(() => refreshAuthToken(retryCount + 1), 5000);
      } else {
        await logout(); // Automatic logout on failure after retries
        displayToast("Session expired, please log in again.", "error"); // Notify user
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsAuthLoading(true);
    try {
      const { idToken, localId, expiresIn, refreshToken } = await createUser(email, password);
      await storeAuth(idToken, localId, refreshToken, expiresIn);
      displayToast("Account created successfully", "success");
    } catch (error) {
      displayToast("Account creation failed, make sure you enter valid credentials", "error");
    }
    setIsAuthLoading(false);
  };

  const login = async (email: string, password: string) => {
    setIsAuthLoading(true);
    try {
      const { idToken, localId, expiresIn, refreshToken } = await authenticateUser(email, password);
      await storeAuth(idToken, localId, refreshToken, expiresIn);
      displayToast("Welcome!", "success");
    } catch (error) {
      displayToast("Login failed, make sure you enter valid credentials", "error");
    }
    setIsAuthLoading(false);
  };

  const logout = async () => {
    setIsAuthLoading(true);
    await AsyncStorage.removeItem("auth");
    setUserToken(undefined);
    setUserId(undefined);
    setRefreshTokenValue(undefined);
    setExpirationTime(undefined);
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
