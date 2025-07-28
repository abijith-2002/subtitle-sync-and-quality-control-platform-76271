import React, { createContext, useContext, useState, useEffect } from "react";

// Context object for authentication state and actions
const AuthContext = createContext();

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("authToken") || "");
  const [user, setUser] = useState(() => localStorage.getItem("authUser") || "");

  useEffect(() => {
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("authUser", user);
    else localStorage.removeItem("authUser");
  }, [user]);

  // PUBLIC_INTERFACE
  const login = (accessToken, email) => {
    setToken(accessToken);
    setUser(email);
  };

  // PUBLIC_INTERFACE
  const signup = async (email, password) => {
    // Calls backend /api/auth/signup endpoint for a new user
    const resp = await fetch("http://localhost:3001/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!resp.ok) throw new Error("Unable to sign up. Try again or use a different email.");
    const data = await resp.json();
    login(data.access_token, email);
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    setToken("");
    setUser("");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  // Values provided to consumers
  const value = {
    token,
    user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}
