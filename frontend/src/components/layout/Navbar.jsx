import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  User,
  Shield,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import Logo from '../common/Logo';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [menuOpen, setMenuOpen]           = useState(false);
  const [userDropdown, setUserDropdown]   = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    setUserDropdown(false);
    setMenuOpen(false);
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `nav-item${isActive ? ' active' : ''}`;

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">

          {/* LEFT — Brand Logo */}
          <Link to="/" className="navbar-brand">
            <Logo size={32} variant="light" showText={true} subtitle={true} />
          </Link>

          {/* CENTER — Navigation links */}
          <div className="navbar-links hide-mobile">
            <NavLink to="/hostels" className={navLinkClass}>
              Hostels Directory
            </NavLink>

            {user?.role === 'student' && (
              <NavLink to="/dashboard" className={navLinkClass}>
                My Bookings
              </NavLink>
            )}

            {(user?.role === 'admin' || user?.role === 'manager') && (
              <>
                <NavLink to="/admin/bookings" className={navLinkClass}>
                  Manage Bookings
                </NavLink>
                {user?.role === 'admin' && (
                  <NavLink to="/admin/users" className={navLinkClass}>
                    User Accounts
                  </NavLink>
                )}
              </>
            )}
          </div>

          {/* RIGHT — User area */}
          <div className="navbar-auth hide-mobile">
            {user ? (
              <div className="user-menu-container" ref={dropdownRef}>
                <button
                  className="user-profile-trigger"
                  onClick={() => setUserDropdown(!userDropdown)}
                  aria-expanded={userDropdown}
                  aria-label="User menu"
                >
                  <div className="user-avatar">
                    {getInitials(user.name)}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user.name.split(' ')[0]}</span>
                    <span className="user-role-badge">{user.role}</span>
                  </div>
                  <ChevronDown size={14} className={`arrow-icon ${userDropdown ? 'open' : ''}`} />
                </button>

                {userDropdown && (
                  <div className="user-dropdown-menu" onClick={() => setUserDropdown(false)}>
                    <div className="dropdown-header">
                      <p className="dropdown-user-name">{user.name}</p>
                      <p className="dropdown-user-email">{user.email}</p>
                    </div>

                    <div className="dropdown-divider" />

                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item">
                        <Shield size={14} /> Admin Console
                      </Link>
                    )}
                    {user.role === 'manager' && (
                      <Link to="/manager" className="dropdown-item">
                        <Shield size={14} /> Manager Console
                      </Link>
                    )}
                    {user.role === 'student' && (
                      <Link to="/dashboard" className="dropdown-item">
                        <LayoutDashboard size={14} /> Student Dashboard
                      </Link>
                    )}

                    <Link to="/profile" className="dropdown-item">
                      <User size={14} /> Account Profile
                    </Link>

                    <div className="dropdown-divider" />

                    <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline btn-sm nav-btn-login">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm nav-btn-register">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            className="mobile-menu-btn hide-desktop"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="mobile-drawer">
            <div className="mobile-drawer-inner">
              <NavLink
                to="/hostels"
                className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                Hostels Directory
              </NavLink>

              {user?.role === 'student' && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  My Bookings
                </NavLink>
              )}

              {(user?.role === 'admin' || user?.role === 'manager') && (
                <NavLink
                  to="/admin/bookings"
                  className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
                  onClick={() => setMenuOpen(false)}
                >
                  Manage Bookings
                </NavLink>
              )}

              {user?.role === 'admin' && (
                <>
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    User Accounts
                  </NavLink>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Console
                  </NavLink>
                </>
              )}

              <div className="mobile-divider" />

              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Account Settings
                  </NavLink>
                  <button className="mobile-nav-item mobile-logout" onClick={handleLogout}>
                    Sign Out ({user.name.split(' ')[0]})
                  </button>
                </>
              ) : (
                <div className="mobile-auth-actions">
                  <Link to="/login" className="btn btn-outline btn-full" onClick={() => setMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        /* ── Deep Navy Navbar ────────────────────────────────────── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #0B1F33;
          border-bottom: 1px solid #1E3A5F;
          height: 64px;
          box-shadow: 0 2px 8px rgba(11, 31, 51, 0.25);
        }

        /* 3-Column Grid Layout: Brand (Left) | Links (Centre) | Auth (Right) */
        .navbar-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 64px;
          gap: 1rem;
        }

        /* Brand (Left) */
        .navbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          justify-self: start;
        }

        /* Nav Links (Centre) */
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          justify-self: center;
        }

        .nav-item {
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #9FB3C8;
          transition: all 140ms ease-in-out;
          white-space: nowrap;
          position: relative;
        }

        .nav-item:hover {
          color: #F8FAFC;
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-item.active {
          color: #FFFFFF;
          font-weight: 600;
          background: rgba(37, 99, 235, 0.18);
          box-shadow: inset 0 -2px 0 #38BDF8;
        }

        /* Auth Section (Right) */
        .navbar-auth {
          justify-self: end;
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-btn-login {
          border-color: #243B53;
          color: #9FB3C8;
          background: transparent;
        }
        .nav-btn-login:hover {
          border-color: #486581;
          color: #F8FAFC;
          background: #102A43;
        }

        .nav-btn-register {
          background: #2563EB;
          color: #ffffff;
          border-color: #1D4ED8;
        }
        .nav-btn-register:hover {
          background: #3B82F6;
        }

        /* User Profile Trigger */
        .user-menu-container {
          position: relative;
        }

        .user-profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.35rem 0.65rem 0.35rem 0.35rem;
          background: #102A43;
          border: 1px solid #243B53;
          border-radius: 8px;
          transition: background 140ms, border-color 140ms;
        }

        .user-profile-trigger:hover {
          background: #183756;
          border-color: #486581;
        }

        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #2563EB;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #FFFFFF;
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
          color: #F8FAFC;
        }

        .user-role-badge {
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #38BDF8;
          letter-spacing: 0.05em;
        }

        .arrow-icon {
          color: #829AB1;
          transition: transform 140ms ease-in-out;
          flex-shrink: 0;
        }
        .arrow-icon.open { transform: rotate(180deg); }

        /* User Dropdown Menu */
        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 220px;
          padding: 0.45rem;
          z-index: 200;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(16, 42, 67, 0.15), 0 2px 6px rgba(16, 42, 67, 0.08);
        }

        .dropdown-header {
          padding: 0.5rem 0.65rem 0.4rem;
        }

        .dropdown-user-name {
          font-size: 0.875rem;
          font-weight: 700;
          color: #102A43;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-user-email {
          font-size: 0.775rem;
          color: #486581;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-divider {
          height: 1px;
          background: #E2E8F0;
          margin: 0.35rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.5rem 0.65rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: #243B53;
          border-radius: 6px;
          transition: background 140ms;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .dropdown-item:hover {
          color: #102A43;
          background: #E8F1FA;
        }

        .dropdown-logout {
          color: #DC2626;
        }
        .dropdown-logout:hover {
          color: #DC2626;
          background: #FEF2F2;
        }

        /* Mobile controls */
        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 6px;
          color: #9FB3C8;
          background: #102A43;
          border: 1px solid #243B53;
          justify-self: end;
        }
        .mobile-menu-btn:hover { color: #F8FAFC; background: #183756; }

        /* Mobile Drawer */
        .mobile-drawer {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0B1F33;
          z-index: 99;
          padding: 1.25rem;
          overflow-y: auto;
          border-top: 1px solid #1E3A5F;
        }

        .mobile-drawer-inner {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .mobile-nav-item {
          display: block;
          padding: 0.8rem 1rem;
          font-size: 0.925rem;
          font-weight: 500;
          color: #9FB3C8;
          border-radius: 6px;
          background: #102A43;
          border: 1px solid #243B53;
          text-align: left;
          cursor: pointer;
          text-decoration: none;
        }
        .mobile-nav-item:hover,
        .mobile-nav-item.active {
          color: #FFFFFF;
          border-color: #38BDF8;
          background: rgba(37, 99, 235, 0.2);
        }

        .mobile-divider {
          height: 1px;
          background: #1E3A5F;
          margin: 0.5rem 0;
        }

        .mobile-logout {
          color: #F87171;
          background: rgba(220, 38, 38, 0.12);
          border-color: rgba(220, 38, 38, 0.3);
          width: 100%;
        }

        .mobile-auth-actions {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 0.5rem;
        }

        @media (min-width: 769px) {
          .hide-desktop { display: none !important; }
        }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .mobile-menu-btn { display: flex; }
          .navbar-inner {
            grid-template-columns: 1fr auto;
          }
        }
      `}</style>
    </>
  );
}
