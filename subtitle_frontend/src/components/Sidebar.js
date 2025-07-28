import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useAuth } from "../auth/AuthContext";

/**
 * Sidebar component for main app navigation.
 *
 * Shows navigation links to Dashboard, Upload, and a Logout button.
 */
// PUBLIC_INTERFACE
function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar open">
      <div className="sidebar-header">
        <span className="brand-title">Subtitle QC</span>
      </div>
      <ul className="sidebar-links">
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/upload" className={({ isActive }) => (isActive ? "active" : "")}>
            Upload
          </NavLink>
        </li>
      </ul>
      <button className="sidebar-btn" onClick={handleLogout}>Logout</button>
      <div style={{ padding: "10px 18px 0", fontSize: "0.98em", color: "#888" }}>
        {user ? `Logged in as: ${user}` : ""}
      </div>
    </aside>
  );
}

export default Sidebar;
