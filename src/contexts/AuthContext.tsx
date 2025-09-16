import { IUser } from "@/interfaces/user.interface";
import { login, logout } from "@/services/auth";
import { auth } from "@/services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthError, onAuthStateChanged, User } from "firebase/auth";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner-native";

interface AuthContextType {
  isAuthenticated: boolean;
  user: IUser | null;
  loading: boolean;
  error: AuthError | null;
  clearError: () => void;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  showWelcome: boolean;
  completeWelcome: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  clearError: () => {},
  loginUser: async () => {},
  logoutUser: async () => {},
  showWelcome: false,
  completeWelcome: () => {},
});

const STORAGE_KEY = "@auth_user";
const WELCOME_KEY = "@has_seen_welcome";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const serializeUser = (firebaseUser: User): IUser => ({
    uid: firebaseUser.uid,
    email: firebaseUser.email || null,
    displayName: firebaseUser.displayName || null,
    photoURL: firebaseUser.photoURL || null,
  });

  const clearError = useCallback(() => setError(null), []);

  const persistUser = useCallback(async (userData: IUser | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to persist user data", e);
    }
  }, []);

  // Restore user from AsyncStorage
  const restoreUser = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEY);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser?.uid) {
          setUser(parsedUser);
        }
      }
    } catch (e) {
      console.error("Failed to restore user from storage", e);
    }
  }, []);

  // 👇 Welcome screen logic
  const checkWelcome = useCallback(async () => {
    const hasSeen = await AsyncStorage.getItem(WELCOME_KEY);
    if (!hasSeen) {
      setShowWelcome(true);
    }
  }, []);

  const completeWelcome = useCallback(async () => {
    await AsyncStorage.setItem(WELCOME_KEY, "true");
    setShowWelcome(false);
  }, []);

  useEffect(() => {
    let unsubscribe: () => void;

    const initializeAuth = async () => {
      await restoreUser();
      await checkWelcome();

      unsubscribe = onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          try {
            if (firebaseUser) {
              const cleanUser = serializeUser(firebaseUser);
              await persistUser(cleanUser);
              setUser(cleanUser);
            } else {
              await persistUser(null);
              setUser(null);
            }
          } catch (e) {
            const authError = e as AuthError;
            setError(authError);
          } finally {
            setLoading(false);
          }
        },
        (authError) => {
          if ("code" in authError) {
            setError(authError as AuthError);
          } else {
            console.error("Non-auth error:", authError);
          }
          setLoading(false);
        }
      );
    };

    initializeAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [persistUser, restoreUser]);

  const loginUser = async (email: string, password: string) => {
    clearError();
    try {
      const userCredential = await login(email, password);
      toast.success("Logged in successfully!");
      const cleanUser = serializeUser(userCredential.user);
      setUser(cleanUser);
      await persistUser(cleanUser);
    } catch (e) {
      const authError = e as AuthError;
      setError(authError);
      toast.error(authError.message)
      throw authError;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      await persistUser(null);
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (e) {
      const authError = e as AuthError;
      setError(authError);
      toast.error(authError.message)
      throw new Error("Failed to log out");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        error,
        clearError,
        loginUser,
        logoutUser,
        showWelcome,
        completeWelcome,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
