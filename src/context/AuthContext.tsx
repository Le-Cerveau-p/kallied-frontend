import { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Logout ----
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("last_activity");

    setUser(null);
    window.location.href = "/";
  };

  // ---- On app load ----
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiry = localStorage.getItem("token_expiry");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (token && expiry) {
      const expiresAt = parseInt(expiry);

      if (Date.now() >= expiresAt) {
        logout();
      } else {
        setUser({ token, role, email });
      }

    }

    if (!localStorage.getItem("last_activity")) {
      localStorage.setItem("last_activity", Date.now().toString());
    }

    setLoading(false);
  }, []);

  // ---- Track inactivity ----
  useEffect(() => {
    const updateActivity = () => {
      localStorage.setItem("last_activity", Date.now().toString());
    };

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
    };
  }, []);

  // ---- Inactivity + token expiry timer ----
  useEffect(() => {
    const checkSession = () => {
      const expiry = localStorage.getItem("token_expiry");
      const lastActivity = localStorage.getItem("last_activity");

      if (!expiry || !lastActivity) return ;

      const expiresAt = parseInt(expiry);
      const lastActive = parseInt(lastActivity);

      // If JWT expired → logout
      if (Date.now() >= expiresAt) return logout();

      // If inactive 30 mins → logout
      const THIRTY_MIN = 30 * 60 * 1000;
      if (Date.now() - lastActive >= THIRTY_MIN) return logout();
    };

    const interval = setInterval(checkSession, 10_000); // check every 10s
    return () => clearInterval(interval); 
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}