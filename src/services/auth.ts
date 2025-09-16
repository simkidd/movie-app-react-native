import {
  AuthError,
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { IUser } from "@/interfaces/user.interface";

// Helper function to handle auth errors
const handleAuthError = (error: AuthError) => {
  switch (error.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      throw new Error(
        "This email is already registered. Please use a different email or login."
      );
    case AuthErrorCodes.INVALID_EMAIL:
      throw new Error("Please enter a valid email address.");
    case AuthErrorCodes.WEAK_PASSWORD:
      throw new Error("Password should be at least 6 characters long.");
    case AuthErrorCodes.USER_DELETED:
      throw new Error(
        "No account found with this email. Please register first."
      );
    case AuthErrorCodes.INVALID_PASSWORD:
      throw new Error("Incorrect password. Please try again.");
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      throw new Error(
        "Too many attempts. Please try again later or reset your password."
      );
    case AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN:
      throw new Error("Session expired. Please login again.");
    case AuthErrorCodes.NETWORK_REQUEST_FAILED:
      throw new Error("Check your internet connection and try again.");
    default:
      throw new Error(
        error.message || "An unexpected authentication error occurred."
      );
  }
};

// User management in Firestore
const manageUserDocument = async (user: User, displayName?: string) => {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      displayName: displayName || user.displayName,
      photoURL: user.photoURL,
    };
    await setDoc(userRef, userData);
  } else {
    await updateDoc(userRef, {
      lastLogin: new Date().toISOString(),
      ...(displayName && { displayName }),
    });
  }
};

export const register = async (
  email: string,
  password: string,
  displayName: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, { displayName });

    await updateProfile(userCredential.user, { displayName });
    await manageUserDocument(userCredential.user, displayName);

    return userCredential;
  } catch (error) {
    handleAuthError(error as AuthError);
    throw error; // This line will only be reached if handleAuthError doesn't throw
  }
};

export const login = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    await manageUserDocument(userCredential.user);

    return userCredential;
  } catch (error) {
    handleAuthError(error as AuthError);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error("Failed to sign out");
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    handleAuthError(error as AuthError);
    throw error;
  }
};

export const updateUserEmail = async (newEmail: string): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error("No user is currently signed in");
  }

  try {
    await updateEmail(auth.currentUser, newEmail);
  } catch (error) {
    handleAuthError(error as AuthError);
    throw error;
  }
};

export const updateUserPassword = async (
  newPassword: string
): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error("No user is currently signed in");
  }

  try {
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    handleAuthError(error as AuthError);
    throw error;
  }
};

export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  if (!auth.currentUser) {
    throw new Error("No user is currently signed in");
  }

  try {
    await updateProfile(auth.currentUser, updates);
  } catch (error) {
    throw new Error("Failed to update profile");
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const getIdToken = async (
  forceRefresh = false
): Promise<string | null> => {
  if (!auth.currentUser) {
    return null;
  }
  return auth.currentUser.getIdToken(forceRefresh);
};

export const getUserData = async (uid: string): Promise<IUser | null> => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as IUser) : null;
};
