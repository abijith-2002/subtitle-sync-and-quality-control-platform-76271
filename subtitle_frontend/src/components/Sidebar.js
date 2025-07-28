import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

/**
 * Sidebar component for main app navigation.
 *
 * Shows navigation links to Dashboard and Upload.
 */
// PUBLIC_INTERFACE
function Sidebar() {
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
    </aside>
  );
}

export default Sidebar;
