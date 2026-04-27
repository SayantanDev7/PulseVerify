import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
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
    let unsubscribe;
    let isMounted = true;

    const checkSessionAndListen = async () => {
      try {
        // 1. Check Backend Session (For Google OAuth users)
        const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "https://pulseverify.onrender.com";
        const sessionRes = await fetch(`${BACKEND_URL}/auth/me`, { credentials: 'include' });
        
        if (sessionRes.ok) {
          const data = await sessionRes.json();
          if (data.isAuthenticated && isMounted) {
            setUser(data.user);
            setLoading(false);
            return; // Use backend session
          }
        }
      } catch (err) {
        console.warn("Backend session check failed:", err);
      }

      try {
        // 2. Check Firebase Redirect (Fallback)
        const result = await getRedirectResult(auth);
        
        if (result && result.user && isMounted) {
          const idToken = await result.user.getIdToken();
          localStorage.setItem("token", idToken);
          setToken(idToken);
          setUser(result.user);
        }
      } catch (error) {
        console.error("Firebase redirect result error:", error);
      }

      // 3. Listen to Firebase Auth state
      if (isMounted) {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const idToken = await firebaseUser.getIdToken();
            localStorage.setItem("token", idToken);
            setToken(idToken);
            // Only overwrite user if we don't already have a backend session user
            setUser((prev) => prev || firebaseUser);
          } else {
            // Keep backend session if it exists
            setUser((prev) => {
              if (prev && !prev.uid) return prev; // It's a backend user (no firebase uid property directly on the object root usually)
              localStorage.removeItem("token");
              setToken(null);
              return null;
            });
          }
          setLoading(false);
        });
      }
    };

    checkSessionAndListen();

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
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
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signout error:", e);
    }
    try {
      const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "https://pulseverify.onrender.com";
      await fetch(`${BACKEND_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.warn("Backend logout error:", e);
    }
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
