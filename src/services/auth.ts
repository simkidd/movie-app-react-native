import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  User,
  UserCredential,
  GoogleAuthProvider,
  signInWithCredential,
  AuthError,
  AuthErrorCodes,
} from "firebase/auth";
import { auth } from "./firebase";

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
    default:
      throw new Error(
        error.message || "An unexpected authentication error occurred."
      );
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
    // Update profile and send verification email
    // await Promise.all([
    //   updateProfile(userCredential.user, { displayName }),
    //   sendEmailVerification(userCredential.user)
    // ]);

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

    // Check if email is verified
    // if (!userCredential.user.emailVerified) {
    //   await sendEmailVerification(userCredential.user);
    //   throw new Error('Please verify your email address. A new verification email has been sent.');
    // }

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

export const googleSignIn = async (
  idToken: string
): Promise<UserCredential> => {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    return await signInWithCredential(auth, credential);
  } catch (error) {
    handleAuthError(error as AuthError);
    throw error;
  }
};
