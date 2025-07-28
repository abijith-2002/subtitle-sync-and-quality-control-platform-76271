import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

// Page imports
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import ReportPage from "./pages/ReportPage";

// Sidebar import
import Sidebar from "./components/Sidebar";

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
      <Router>
        {/* Place ThemeManager globally so all pages have access */}
        <ThemeManager />
        <Routes>
          {/* Main app area, sidebar always visible, all pages accessible */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/results/:syncId" element={<Results />} />
            <Route path="/report/:syncId" element={<ReportPage />} />
          </Route>
          {/* Fallback: redirect unknown routes to dashboard */}
          <Route
            path="*"
            element={
              <Dashboard />
            }
          />
        </Routes>
      </Router>
  );
}

export default App;
