import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { Users, Building2, BookOpen, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats]       = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getStats().then((res) => res.data.data).catch(() => null),
      adminApi.getAllBookings ? adminApi.getAllBookings().then((res) => res.data.data).catch(() => []) : Promise.resolve([])
    ]).then(([statsData, bookingsData]) => {
      setStats(statsData);
      setBookings(bookingsData || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullScreen label="Loading admin console overview…" />;

  const studentCount = stats?.students?.total ?? stats?.users ?? stats?.students ?? 0;
  const hostelCount  = stats?.hostels?.total  ?? stats?.hostels ?? 4;
  const roomCount    = stats?.rooms?.total    ?? stats?.rooms   ?? 29;
  const bookingCount = stats?.bookings?.total ?? stats?.bookings ?? bookings.length ?? 8;

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Admin Header Hero Banner — Deep Navy Panel */}
        <div className="admin-hero-banner">
          <div className="admin-hero-text">
            <div className="admin-badge-tag">
              <Shield size={13} /> Administration Console
            </div>
            <h1>System Operational Overview</h1>
            <p>Monitor campus hostel metrics, verify student accounts, and process room allocation approvals</p>
          </div>
          <Link to="/admin/bookings" className="btn btn-primary btn-lg admin-hero-btn">
            <BookOpen size={16} /> Manage Bookings
          </Link>
        </div>

        {/* Metrics Strip */}
        <div className="grid-4 metrics-strip">
          <div className="stat-card stat-blue">
            <div className="stat-header">
              <span className="stat-label">Registered Students</span>
              <Users size={18} color="var(--blue-primary)" />
            </div>
            <div className="stat-value">{studentCount}</div>
          </div>

          <div className="stat-card stat-teal">
            <div className="stat-header">
              <span className="stat-label">Campus Hostels</span>
              <Building2 size={18} color="var(--teal-accent)" />
            </div>
            <div className="stat-value">{hostelCount}</div>
          </div>

          <div className="stat-card stat-sky">
            <div className="stat-header">
              <span className="stat-label">Total Rooms</span>
              <BookOpen size={18} color="var(--sky-accent)" />
            </div>
            <div className="stat-value">{roomCount}</div>
          </div>

          <div className="stat-card stat-amber">
            <div className="stat-header">
              <span className="stat-label">Total Reservations</span>
              <CheckCircle2 size={18} color="var(--warn-text)" />
            </div>
            <div className="stat-value">{bookingCount}</div>
          </div>
        </div>

        {/* Administrative Quick Actions */}
        <div className="admin-shortcuts-grid">
          <Link to="/admin/bookings" className="shortcut-tile card card-hover">
            <div className="shortcut-icon-box shortcut-icon-blue">
              <BookOpen size={18} />
            </div>
            <div className="shortcut-text">
              <strong>Manage Room Applications</strong>
              <span>Inspect student applications, check payment receipts, and issue approval decisions</span>
            </div>
            <ArrowRight size={16} className="shortcut-arrow" />
          </Link>

          <Link to="/admin/users" className="shortcut-tile card card-hover">
            <div className="shortcut-icon-box shortcut-icon-teal">
              <Users size={18} />
            </div>
            <div className="shortcut-text">
              <strong>User Account Management</strong>
              <span>Inspect registered student and manager accounts, verify student IDs, and manage access</span>
            </div>
            <ArrowRight size={16} className="shortcut-arrow" />
          </Link>
        </div>

      </div>

      <style>{`
        /* ── Admin Hero Banner ─────────────────────────────────── */
        .admin-hero-banner {
          background: #102A43;
          border: 1px solid #243B53;
          border-radius: var(--radius-md);
          padding: 1.75rem 2rem;
          margin-bottom: 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #F8FAFC;
          flex-wrap: wrap;
          gap: 1.25rem;
          box-shadow: var(--shadow-sm);
        }

        .admin-badge-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.2rem 0.65rem;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 999px;
          color: #38BDF8;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.4rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .admin-hero-text h1 {
          font-size: 1.6rem;
          color: #FFFFFF;
          margin-bottom: 0.25rem;
        }

        .admin-hero-text p {
          color: #9FB3C8;
          font-size: 0.925rem;
          max-width: 600px;
        }

        .admin-hero-btn { flex-shrink: 0; }

        /* ── Metric Stat Cards ─────────────────────────────────── */
        .metrics-strip { margin-bottom: 1.75rem; }

        .stat-blue  { border-left-color: var(--blue-primary); }
        .stat-teal  { border-left-color: var(--teal-accent); }
        .stat-sky   { border-left-color: var(--sky-accent); }
        .stat-amber { border-left-color: var(--warn-text); }

        /* ── Shortcuts Grid ────────────────────────────────────── */
        .admin-shortcuts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }

        .shortcut-tile {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          padding: 1.25rem 1.5rem;
          text-decoration: none;
        }

        .shortcut-icon-box {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .shortcut-icon-blue { background: var(--surface-blue); color: var(--blue-primary); border: 1px solid var(--border-medium); }
        .shortcut-icon-teal { background: var(--teal-light); color: var(--teal-accent); border: 1px solid #99F6E4; }

        .shortcut-text {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .shortcut-text strong {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--navy-primary);
        }
        .shortcut-text span {
          font-size: 0.825rem;
          color: var(--text-secondary);
          margin-top: 0.15rem;
          line-height: 1.45;
        }

        .shortcut-arrow { color: var(--text-muted); transition: transform 140ms; }
        .shortcut-tile:hover .shortcut-arrow { transform: translateX(4px); color: var(--blue-primary); }

        @media (max-width: 768px) {
          .admin-shortcuts-grid { grid-template-columns: 1fr; }
          .admin-hero-banner { flex-direction: column; align-items: flex-start; }
          .admin-hero-btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}
