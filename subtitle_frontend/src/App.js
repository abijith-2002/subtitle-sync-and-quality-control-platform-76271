import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import "./App.css";

// Page imports
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import ReportPage from "./pages/ReportPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Sidebar import
import Sidebar from "./components/Sidebar";

// Assume AuthContext is in auth/AuthContext.js (create it if missing)
import { AuthProvider, useAuth } from "./auth/AuthContext";

// Layout for main app area (with Sidebar)
function MainLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
// RequireAuth component: redirects to login if user is not authenticated.
function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}

// Theme manager
function ThemeManager() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Place ThemeManager globally so all pages have access */}
        <ThemeManager />
        <Routes>
          {/* Auth pages (no sidebar) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Main app area, sidebar always visible while authenticated */}
          <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results/:syncId" element={<Results />} />
            <Route path="/report/:syncId" element={<ReportPage />} />
          </Route>
          {/* Fallback: redirect unknown routes to dashboard or login */}
          <Route
            path="*"
            element={
              <RequireAuth>
                <Navigate to="/" replace />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
