import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Building2, LayoutDashboard, LogOut, Menu, X, User, BookOpen, Users, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) =>
    `nav-link${isActive ? ' active' : ''}`;

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          {/* Brand */}
          <Link to="/" className="navbar-brand">
            <Building2 size={22} />
            <span>Cloud<span className="text-gradient">Stay</span></span>
          </Link>

          {/* Desktop nav */}
          <div className="navbar-links hide-mobile">
            <NavLink to="/hostels" className={navLinkClass}>Hostels</NavLink>
            {user?.role === 'student' && (
              <NavLink to="/dashboard" className={navLinkClass}>My Bookings</NavLink>
            )}
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <>
                <NavLink to="/admin/bookings" className={navLinkClass}>Bookings</NavLink>
                {user?.role === 'admin' && (
                  <>
                    <NavLink to="/admin/hostels" className={navLinkClass}>Hostels</NavLink>
                    <NavLink to="/admin/users"   className={navLinkClass}>Users</NavLink>
                  </>
                )}
              </>
            )}
          </div>

          {/* Auth area */}
          <div className="navbar-auth hide-mobile">
            {user ? (
              <div className="navbar-user">
                <Link to="/profile" className="avatar" title={user.name}>
                  {getInitials(user.name)}
                </Link>
                <div className="navbar-user-info">
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="mobile-nav" onClick={() => setMenuOpen(false)}>
            <NavLink to="/hostels" className="mobile-nav-link"><BookOpen size={16}/> Hostels</NavLink>
            {user?.role === 'student' && (
              <NavLink to="/dashboard" className="mobile-nav-link"><LayoutDashboard size={16}/> My Bookings</NavLink>
            )}
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <NavLink to="/admin/bookings" className="mobile-nav-link"><BookOpen size={16}/> Bookings</NavLink>
            )}
            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin/hostels" className="mobile-nav-link"><Building2 size={16}/> Hostels</NavLink>
                <NavLink to="/admin/users"   className="mobile-nav-link"><Users size={16}/> Users</NavLink>
                <NavLink to="/admin"         className="mobile-nav-link"><Shield size={16}/> Dashboard</NavLink>
              </>
            )}
            {user ? (
              <>
                <NavLink to="/profile" className="mobile-nav-link"><User size={16}/> Profile</NavLink>
                <button className="mobile-nav-link" onClick={handleLogout} style={{ color: '#f87171' }}>
                  <LogOut size={16}/> Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login"    className="mobile-nav-link">Login</NavLink>
                <NavLink to="/register" className="mobile-nav-link btn btn-primary" style={{ margin: '0.5rem 1rem' }}>Register</NavLink>
              </>
            )}
          </div>
        )}
      </nav>

      <style>{`
        .navbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(13,17,23,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--glass-border);
          height: 64px;
        }
        .navbar-inner { display: flex; align-items: center; justify-content: space-between; height: 64px; }
        .navbar-brand { display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; }
        .navbar-links { display: flex; align-items: center; gap: 0.25rem; }
        .nav-link { padding: 0.4rem 0.875rem; border-radius: var(--radius-md); font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); transition: all var(--duration-fast); }
        .nav-link:hover, .nav-link.active { color: var(--text-primary); background: rgba(255,255,255,0.06); }
        .nav-link.active { color: var(--brand-400); }
        .navbar-auth { display: flex; align-items: center; }
        .navbar-user { display: flex; align-items: center; gap: 0.75rem; }
        .navbar-user-info { display: flex; flex-direction: column; line-height: 1.2; }
        .user-name { font-size: 0.85rem; font-weight: 600; }
        .user-role { font-size: 0.7rem; color: var(--brand-400); text-transform: uppercase; letter-spacing: 0.05em; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--brand-500), #a78bfa); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .mobile-menu-btn { display: none; padding: 0.5rem; color: var(--text-secondary); border-radius: var(--radius-sm); }
        .mobile-nav { display: none; flex-direction: column; padding: 0.5rem 0 1rem; border-top: 1px solid var(--glass-border); background: var(--surface-1); }
        .mobile-nav-link { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; font-size: 0.9rem; color: var(--text-secondary); transition: color var(--duration-fast); background: none; border: none; width: 100%; text-align: left; cursor: pointer; }
        .mobile-nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex; }
          .mobile-nav { display: flex; }
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
