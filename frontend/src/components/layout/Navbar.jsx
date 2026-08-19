import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  BookOpen,
  Users,
  Shield,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleLogout = async () => {
    setUserDropdown(false);
    setMenuOpen(false);
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `nav-item${isActive ? ' active' : ''}`;

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            <div className="brand-logo-badge">
              <Building2 size={20} />
            </div>
            <span className="brand-text">
              Cloud<span className="text-gradient">Stay</span>
            </span>
            <span className="brand-tag">PORTAL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links hide-mobile">
            <NavLink to="/hostels" className={navLinkClass}>
              <BookOpen size={15} /> Hostels
            </NavLink>

            {user?.role === 'student' && (
              <NavLink to="/dashboard" className={navLinkClass}>
                <LayoutDashboard size={15} /> My Bookings
              </NavLink>
            )}

            {(user?.role === 'admin' || user?.role === 'manager') && (
              <>
                <NavLink to="/admin/bookings" className={navLinkClass}>
                  <BookOpen size={15} /> Bookings
                </NavLink>

                {user?.role === 'admin' && (
                  <>
                    <NavLink to="/admin/hostels" className={navLinkClass}>
                      <Building2 size={15} /> Hostels
                    </NavLink>
                    <NavLink to="/admin/users" className={navLinkClass}>
                      <Users size={15} /> Users
                    </NavLink>
                  </>
                )}
              </>
            )}
          </div>

          {/* User Auth Section */}
          <div className="navbar-auth hide-mobile">
            {user ? (
              <div className="user-menu-container">
                <button
                  className="user-profile-trigger"
                  onClick={() => setUserDropdown(!userDropdown)}
                >
                  <div className="avatar">
                    {getInitials(user.name)}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user.name.split(' ')[0]}</span>
                    <span className="user-role-badge">{user.role}</span>
                  </div>
                  <ChevronDown size={14} className={`arrow-icon ${userDropdown ? 'open' : ''}`} />
                </button>

                {userDropdown && (
                  <div className="user-dropdown-menu card fade-in" onClick={() => setUserDropdown(false)}>
                    <div className="dropdown-header">
                      <p className="dropdown-user-name">{user.name}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>

                    <div className="dropdown-divider" />

                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item">
                        <Shield size={16} /> Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'manager' && (
                      <Link to="/manager" className="dropdown-item">
                        <Shield size={16} /> Manager Dashboard
                      </Link>
                    )}
                    {user.role === 'student' && (
                      <Link to="/dashboard" className="dropdown-item">
                        <LayoutDashboard size={16} /> Student Dashboard
                      </Link>
                    )}

                    <Link to="/profile" className="dropdown-item">
                      <User size={16} /> My Account
                    </Link>

                    <div className="dropdown-divider" />

                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {menuOpen && (
          <div className="mobile-drawer fade-in">
            <div className="mobile-drawer-inner">
              <NavLink to="/hostels" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                <BookOpen size={18} /> Browse Hostels
              </NavLink>

              {user?.role === 'student' && (
                <NavLink to="/dashboard" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                  <LayoutDashboard size={18} /> My Bookings
                </NavLink>
              )}

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <NavLink to="/admin/bookings" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                  <BookOpen size={18} /> Manage Bookings
                </NavLink>
              )}

              {user?.role === 'admin' && (
                <>
                  <NavLink to="/admin/hostels" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                    <Building2 size={18} /> Hostels Management
                  </NavLink>
                  <NavLink to="/admin/users" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                    <Users size={18} /> User Accounts
                  </NavLink>
                  <NavLink to="/admin" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                    <Shield size={18} /> Admin Console
                  </NavLink>
                </>
              )}

              <div className="dropdown-divider" style={{ margin: '0.75rem 0' }} />

              {user ? (
                <>
                  <NavLink to="/profile" className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                    <User size={18} /> Profile Settings
                  </NavLink>
                  <button className="mobile-nav-item mobile-logout" onClick={handleLogout}>
                    <LogOut size={18} /> Sign Out ({user.name.split(' ')[0]})
                  </button>
                </>
              ) : (
                <div className="mobile-auth-actions">
                  <Link to="/login" className="btn btn-outline btn-full" onClick={() => setMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>
                    Register Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(11, 15, 23, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-subtle);
          height: 70px;
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .brand-logo-badge {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-sm);
          background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.4);
        }

        .brand-text {
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .brand-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 0.15rem 0.45rem;
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-xs);
          color: var(--brand-300);
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.03);
          padding: 0.3rem 0.5rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.45rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--slate-300);
          transition: all var(--duration-fast) var(--ease-smooth);
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-item.active {
          color: #ffffff;
          background: var(--brand-600);
          box-shadow: 0 2px 10px rgba(99, 102, 241, 0.3);
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-menu-container {
          position: relative;
        }

        .user-profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.35rem 0.75rem 0.35rem 0.35rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-full);
          transition: all var(--duration-fast);
        }

        .user-profile-trigger:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--brand-500);
        }

        .avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-500), var(--accent-500));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: #ffffff;
          flex-shrink: 0;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.15;
        }

        .user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-role-badge {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--brand-400);
          letter-spacing: 0.04em;
        }

        .arrow-icon {
          color: var(--slate-400);
          transition: transform var(--duration-fast);
        }

        .arrow-icon.open {
          transform: rotate(180deg);
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          width: 220px;
          padding: 0.6rem;
          z-index: 200;
          background: var(--surface-1);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-lg);
        }

        .dropdown-header {
          padding: 0.5rem 0.6rem;
        }

        .dropdown-user-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .dropdown-user-email {
          font-size: 0.75rem;
          color: var(--slate-400);
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 0.4rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--slate-300);
          border-radius: var(--radius-sm);
          transition: all var(--duration-fast);
          width: 100%;
          text-align: left;
        }

        .dropdown-item:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .dropdown-logout {
          color: var(--error-400);
        }

        .dropdown-logout:hover {
          background: var(--error-bg);
          color: var(--error-400);
        }

        .mobile-menu-btn {
          display: none;
          padding: 0.5rem;
          color: var(--slate-300);
          border-radius: var(--radius-sm);
        }

        .mobile-drawer {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(11, 15, 23, 0.95);
          backdrop-filter: blur(20px);
          z-index: 99;
          padding: 1.5rem;
        }

        .mobile-drawer-inner {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--slate-300);
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
        }

        .mobile-logout {
          color: var(--error-400);
          background: var(--error-bg);
          border-color: var(--error-border);
        }

        .mobile-auth-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
