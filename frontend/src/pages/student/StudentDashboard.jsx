import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, Clock, CheckCircle2, XCircle, Plus, ChevronRight, Eye } from 'lucide-react';
import { bookingApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency, getInitials } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

export default function StudentDashboard() {
  const { user }   = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    bookingApi.getMyBookings()
      .then((res) => setBookings(res.data.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total:    bookings.length,
    pending:  bookings.filter((b) => b.status === 'pending').length,
    approved: bookings.filter((b) => b.status === 'approved').length,
    rejected: bookings.filter((b) => b.status === 'rejected').length,
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Student Profile Hero */}
        <div className="dash-welcome card fade-in">
          <div className="welcome-avatar-container">
            <div className="welcome-avatar">
              {getInitials(user?.name)}
            </div>
          </div>

          <div className="welcome-text-group">
            <h1>
              Welcome back, <span className="text-gradient">{user?.name.split(' ')[0]}</span>
            </h1>
            <p className="welcome-meta">
              <span>{user?.email}</span>
              <span className="meta-dot">•</span>
              <span className="student-id-tag">Student ID: {user?.student_id || 'STU-OFFICIAL'}</span>
            </p>
          </div>

          <Link to="/hostels" className="btn btn-primary btn-md book-cta-btn">
            <Plus size={16} /> Book a Room
          </Link>
        </div>

        {/* KPI Grid */}
        <div className="grid-4 stats-grid">
          {[
            { label: 'Total Bookings',  value: stats.total,    color: 'var(--brand-400)',  icon: <BookOpen size={20} /> },
            { label: 'Pending Review',  value: stats.pending,  color: 'var(--warn-400)',   icon: <Clock size={20} /> },
            { label: 'Approved',        value: stats.approved, color: 'var(--accent-400)', icon: <CheckCircle2 size={20} /> },
            { label: 'Rejected',        value: stats.rejected, color: 'var(--error-400)',  icon: <XCircle size={20} /> },
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
            </div>
          ))}
        </div>

        {/* Bookings Section */}
        <div className="dashboard-section-header">
          <div>
            <h2>My Hostel Bookings</h2>
            <p className="section-subtext">Review allocation status, payment receipts, and booking details</p>
          </div>
        </div>

        {loading ? (
          <Spinner label="Loading your booking history..." />
        ) : bookings.length === 0 ? (
          <div className="empty-state card fade-in">
            <BookOpen size={56} />
            <h3>No Active Bookings</h3>
            <p>You haven't reserved any hostel rooms for the upcoming semester yet.</p>
            <Link to="/hostels" className="btn btn-primary">
              <Plus size={16} /> Browse Available Hostels
            </Link>
          </div>
        ) : (
          <div className="table-wrapper fade-in">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Hostel</th>
                  <th>Room Type</th>
                  <th>Check-In</th>
                  <th>Semester Price</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="booking-id-cell">#{b.id}</td>
                    <td className="hostel-name-cell">{b.hostel_name}</td>
                    <td>
                      <div className="room-info-cell">
                        <span>Room {b.room_number}</span>
                        <span className="room-subtag">{b.room_type}</span>
                      </div>
                    </td>
                    <td className="date-cell">{formatDate(b.check_in_date)}</td>
                    <td className="price-cell">{formatCurrency(b.price_per_semester)}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <Link to={`/bookings/${b.id}`} className="btn btn-outline btn-sm">
                          <Eye size={14} /> Details
                        </Link>
                        {b.status === 'approved' && !b.receipt_url && (
                          <Link to={`/bookings/${b.id}/upload`} className="btn btn-primary btn-sm">
                            <Upload size={14} /> Upload Receipt
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .dash-welcome {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          margin-bottom: 2.5rem;
          position: relative;
          overflow: hidden;
        }

        .welcome-avatar-container {
          flex-shrink: 0;
        }

        .welcome-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-500), var(--accent-500));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }

        .welcome-text-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .welcome-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--slate-400);
          flex-wrap: wrap;
        }

        .meta-dot { color: var(--slate-600); }

        .student-id-tag {
          font-family: monospace;
          color: var(--brand-300);
          background: rgba(99, 102, 241, 0.1);
          padding: 0.1rem 0.4rem;
          border-radius: var(--radius-xs);
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .book-cta-btn {
          margin-left: auto;
          flex-shrink: 0;
        }

        .stats-grid {
          margin-bottom: 3rem;
        }

        .dashboard-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.25rem;
        }

        .section-subtext {
          font-size: 0.875rem;
          color: var(--slate-400);
          margin-top: 0.2rem;
        }

        .booking-id-cell {
          font-family: monospace;
          font-weight: 600;
          color: var(--brand-400);
        }

        .hostel-name-cell {
          font-weight: 600;
          color: var(--text-primary);
        }

        .room-info-cell {
          display: flex;
          flex-direction: column;
        }

        .room-subtag {
          font-size: 0.75rem;
          color: var(--slate-400);
          text-transform: capitalize;
        }

        .date-cell {
          color: var(--slate-300);
        }

        .price-cell {
          font-weight: 700;
          color: var(--accent-400);
        }

        .action-buttons-group {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .dash-welcome {
            flex-direction: column;
            align-items: flex-start;
          }
          .book-cta-btn {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
