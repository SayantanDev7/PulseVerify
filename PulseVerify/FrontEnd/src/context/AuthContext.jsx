import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides:
 *   user          – Firebase User object (or null)
 *   token         – current JWT string  (or null)
 *   loading       – true while Firebase resolves auth state
 *   isAuthenticated – convenience boolean
 *   logout()      – signs out and clears token
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase listener — fires immediately with cached state, then on
    // every sign-in / sign-out / token-refresh.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const idToken = await firebaseUser.getIdToken();
        localStorage.setItem("token", idToken);
        setToken(idToken);
        setUser(firebaseUser);
      } else {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Proactively refresh the token every 50 minutes (Firebase tokens expire
  // at 60 min). This keeps API calls working in long-lived sessions.
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        const freshToken = await user.getIdToken(true);
        localStorage.setItem("token", freshToken);
        setToken(freshToken);
      } catch (err) {
        console.warn("Token refresh failed:", err);
      }
    }, 50 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook to consume auth state from any component. */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export default AuthContext;
