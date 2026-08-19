import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { Users, Building2, BookOpen, DollarSign, ArrowUpRight, Shield, Layers } from 'lucide-react';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats()
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullScreen label="Loading system dashboard statistics..." />;
  if (!stats) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="card empty-state">
            <p>Failed to load system dashboard analytics.</p>
            <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Admin Header */}
        <div className="admin-header-bar fade-in">
          <div>
            <div className="admin-badge-tag">
              <Shield size={13} /> Executive Control Panel
            </div>
            <h1>System Overview & Metrics</h1>
            <p className="subtext">
              Real-time hostel capacity, student booking allocations, and system status
            </p>
          </div>
          <Link to="/admin/bookings" className="btn btn-primary">
            <BookOpen size={16} /> Manage All Bookings
          </Link>
        </div>

        {/* KPI Grid */}
        <div className="grid-4 stats-grid">
          {[
            {
              label: 'Total Registered Students',
              value: stats.students?.total ?? stats.users ?? stats.students ?? 0,
              color: 'var(--brand-400)',
              icon: <Users size={20} />,
              detail: `${stats.students?.active || stats.students?.total || 0} active student accounts`,
            },
            {
              label: 'Managed Hostels',
              value: stats.hostels?.total ?? stats.hostels ?? 4,
              color: 'var(--accent-400)',
              icon: <Building2 size={20} />,
              detail: 'Verified campus residences',
            },
            {
              label: 'Total Rooms',
              value: stats.rooms?.total ?? stats.rooms ?? 0,
              color: '#38bdf8',
              icon: <BookOpen size={20} />,
              detail: `${stats.rooms?.available || 0} available for allocation`,
            },
            {
              label: 'Total Bookings',
              value: stats.bookings?.total ?? stats.bookings ?? 0,
              color: '#a78bfa',
              icon: <DollarSign size={20} />,
              detail: `${stats.bookings?.pending || 0} pending review`,
            },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-header">
                <span className="stat-label">{s.label}</span>
                <div className="stat-icon" style={{ color: s.color }}>
                  {s.icon}
                </div>
              </div>
              <div className="stat-value" style={{ color: s.color }}>
                {s.value}
              </div>
              <p className="stat-detail-text">{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Action Shortcuts Grid */}
        <div className="dashboard-shortcuts-section">
          <h2>Administrative Tools</h2>
          <div className="grid-3 shortcuts-grid">
            <Link to="/admin/bookings" className="card shortcut-card card-hover">
              <div className="shortcut-icon" style={{ background: 'var(--info-bg)', color: 'var(--brand-400)' }}>
                <BookOpen size={24} />
              </div>
              <div className="shortcut-info">
                <h3>Review Bookings</h3>
                <p>Approve or reject student hostel room allocations</p>
              </div>
              <ArrowUpRight size={18} className="shortcut-arrow" />
            </Link>

            <Link to="/admin/users" className="card shortcut-card card-hover">
              <div className="shortcut-icon" style={{ background: 'var(--success-bg)', color: 'var(--accent-400)' }}>
                <Users size={24} />
              </div>
              <div className="shortcut-info">
                <h3>User Accounts</h3>
                <p>Manage student and staff roles & account access</p>
              </div>
              <ArrowUpRight size={18} className="shortcut-arrow" />
            </Link>

            <Link to="/admin/hostels" className="card shortcut-card card-hover">
              <div className="shortcut-icon" style={{ background: 'var(--warn-bg)', color: 'var(--warn-400)' }}>
                <Building2 size={24} />
              </div>
              <div className="shortcut-info">
                <h3>Hostel Inventory</h3>
                <p>View hostel properties, rooms and availability</p>
              </div>
              <ArrowUpRight size={18} className="shortcut-arrow" />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .admin-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.7rem;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.28);
          border-radius: var(--radius-full);
          color: var(--brand-300);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .subtext {
          color: var(--slate-400);
          font-size: 0.9rem;
        }

        .stats-grid {
          margin-bottom: 3rem;
        }

        .stat-detail-text {
          font-size: 0.775rem;
          color: var(--slate-400);
          margin-top: 0.65rem;
        }

        .dashboard-shortcuts-section h2 {
          font-size: 1.25rem;
          margin-bottom: 1.25rem;
        }

        .shortcuts-grid {
          align-items: stretch;
        }

        .shortcut-card {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          text-decoration: none;
          position: relative;
        }

        .shortcut-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .shortcut-info h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.2rem;
        }

        .shortcut-info p {
          font-size: 0.825rem;
          color: var(--slate-400);
        }

        .shortcut-arrow {
          margin-left: auto;
          color: var(--slate-500);
          transition: transform var(--duration-fast);
        }

        .shortcut-card:hover .shortcut-arrow {
          transform: translate(2px, -2px);
          color: var(--brand-400);
        }
      `}</style>
    </div>
  );
}
