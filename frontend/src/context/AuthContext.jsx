import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

/**
 * Simple auth context:
 * - Saves token in localStorage
 * - Applies Authorization header to axios
 * - Exposes { user, loading, signup, login, logout }
 */

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// helper lives outside component so linter is happy
function applyAuthHeader(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // restore token on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) applyAuthHeader(token);
    // If you add /auth/me later, you can fetch the user here.
    setLoading(false);
  }, []);

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    const { token, user: u } = res.data || {};
    if (token) {
      localStorage.setItem("token", token);
      applyAuthHeader(token);
    }
    if (u) setUser(u);
    return res.data;
  };

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: u } = res.data || {};
    if (token) {
      localStorage.setItem("token", token);
      applyAuthHeader(token);
    }
    if (u) setUser(u);
    return res.data;
  };

  const logout = async () => {
    try { await api.post("/auth/logout"); } catch { /* ignore */ }
    localStorage.removeItem("token");
    applyAuthHeader(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, signup, login, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
