import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut, getRedirectResult } from "firebase/auth";
import { auth } from "../firebase";
import axios from "../utils/axios";

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

    const checkRedirectAndListen = async () => {
      try {
        // 1. Check if we have a session on the backend (Passport)
        try {
          const response = await axios.get("/api/auth/me");
          if (response.data.success && response.data.user && isMounted) {
            setUser(response.data.user);
            setLoading(false);
            // If we have a backend session, we might not need Firebase state,
            // but we'll let the listener below run too for compatibility.
          }
        } catch (err) {
          // No backend session, expected for logged-out users
          console.log("No active backend session found.");
        }

        // 2. Process any pending redirect from Google Sign-In (Firebase fallback)
        const result = await getRedirectResult(auth);
        
        if (result && result.user && isMounted) {
          const idToken = await result.user.getIdToken();
          localStorage.setItem("token", idToken);
          setToken(idToken);
          setUser(result.user);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      }

      // 3. Listen to Firebase steady-state changes.
      if (isMounted) {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const idToken = await firebaseUser.getIdToken();
            localStorage.setItem("token", idToken);
            setToken(idToken);
            setUser(firebaseUser);
          } else {
            // Only clear if we don't already have a backend user set
            setUser(prev => {
              if (prev && !prev.firebaseUid && !prev.uid) return prev; 
              return null;
            });
          }
          setLoading(false);
        });
      }
    };

    checkRedirectAndListen();

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
      await axios.get("/api/auth/logout");
    } catch (err) {
      console.warn("Logout sync failed:", err);
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
