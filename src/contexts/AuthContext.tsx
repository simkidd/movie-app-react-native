import { IUser } from "@/interfaces/user.interface";
import { logout } from "@/services/auth";
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

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  error: AuthError | null;
  clearError: () => void;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  clearError: () => {},
  logoutUser: async () => {},
});

const STORAGE_KEY = "@auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

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

  useEffect(() => {
    let unsubscribe: () => void;

    const initializeAuth = async () => {
      await restoreUser();

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

  const logoutUser = async () => {
    try {
      await logout();
      await persistUser(null);
      setUser(null);
    } catch (e) {
      const authError = e as AuthError;
      setError(authError);
      throw new Error("Failed to log out");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, clearError, logoutUser }}
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
