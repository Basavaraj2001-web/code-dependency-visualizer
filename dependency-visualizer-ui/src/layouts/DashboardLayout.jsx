import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, FolderSearch, LogOut, ChevronDown, User, Network, GitGraph } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <GitGraph size={18} />
          </div>
          <div>
            <h1 className="sidebar-title">DepViz</h1>
            <p className="sidebar-subtitle">Dependency Analyzer</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <p className="sidebar-nav-group">Navigation</p>
          {[
            { to: '/', icon: <LayoutDashboard size={16} />, label: 'Dashboard', end: true },
            { to: '/projects', icon: <FolderSearch size={16} />, label: 'All Projects' },
            { to: '/upload', icon: <Upload size={16} />, label: 'Upload Project' },
          ].map(({ to, icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-nav-item${isActive ? ' sidebar-nav-item--active' : ''}`
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="sidebar-user">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="sidebar-user-btn"
            aria-label="User menu"
          >
            <div className="sidebar-avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-username">{user?.username}</p>
              <p className="sidebar-role">{user?.role}</p>
            </div>
            <ChevronDown size={14} className={`sidebar-chevron${showUserMenu ? ' sidebar-chevron--open' : ''}`} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="user-dropdown"
              >
                <div className="user-dropdown-header">
                  <p className="user-dropdown-name">{user?.username}</p>
                  <p className="user-dropdown-email">{user?.email}</p>
                </div>
                <div className="user-dropdown-divider" />
                <button
                  onClick={handleLogout}
                  className="user-dropdown-item user-dropdown-item--danger"
                  id="logout-btn"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────── */}
      <main className="main-content">
        <header className="topbar">
          <span className="topbar-title">Workspace</span>
          <div className="topbar-user-badge">
            <User size={13} />
            <span>{user?.username}</span>
          </div>
        </header>

        <div className="page-content">
          <div className="page-content-inner">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
