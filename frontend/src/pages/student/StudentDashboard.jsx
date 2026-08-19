import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, Clock, CheckCircle2, XCircle, Plus } from 'lucide-react';
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
    bookingApi.getMyBookings().then((res) => {
      setBookings(res.data.data || []);
    }).catch(() => setBookings([])).finally(() => setLoading(false));
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
        {/* Welcome */}
        <div className="dash-welcome fade-in">
          <div className="welcome-avatar">{getInitials(user?.name)}</div>
          <div>
            <h1>Welcome back, <span className="text-gradient">{user?.name.split(' ')[0]}</span></h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {user?.email} · Student ID: {user?.student_id || '—'}
            </p>
          </div>
          <Link to="/hostels" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
            <Plus size={14}/> Book a Room
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Total Bookings',  value: stats.total,    color: 'var(--brand-400)',  icon: <BookOpen size={20}/> },
            { label: 'Pending Review',  value: stats.pending,  color: 'var(--warn-400)',   icon: <Clock size={20}/> },
            { label: 'Approved',        value: stats.approved, color: 'var(--accent-400)', icon: <CheckCircle2 size={20}/> },
            { label: 'Rejected',        value: stats.rejected, color: 'var(--error-400)',  icon: <XCircle size={20}/> },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                <div className="stat-label">{s.label}</div>
                <div style={{ color: s.color, opacity: 0.7 }}>{s.icon}</div>
              </div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Bookings list */}
        <h2 style={{ marginBottom: '1rem' }}>My Bookings</h2>
        {loading ? <Spinner /> : bookings.length === 0 ? (
          <div className="empty-state card">
            <BookOpen size={48} />
            <h3>No bookings yet</h3>
            <p>Browse hostels and book your room.</p>
            <Link to="/hostels" className="btn btn-primary">Browse Hostels</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Hostel</th>
                  <th>Room</th>
                  <th>Check-In</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ color:'var(--text-muted)', fontFamily:'monospace' }}>#{b.id}</td>
                    <td style={{ fontWeight: 500 }}>{b.hostel_name}</td>
                    <td>{b.room_number} <span style={{ color:'var(--text-muted)', fontSize:'0.75rem' }}>({b.room_type})</span></td>
                    <td style={{ color:'var(--text-secondary)' }}>{formatDate(b.check_in_date)}</td>
                    <td style={{ color:'var(--accent-400)', fontWeight:600 }}>{formatCurrency(b.price_per_semester)}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      <div style={{ display:'flex', gap:'0.5rem' }}>
                        <Link to={`/bookings/${b.id}`} className="btn btn-outline btn-sm">View</Link>
                        {b.status === 'approved' && !b.receipt_url && (
                          <Link to={`/bookings/${b.id}/upload`} className="btn btn-primary btn-sm">
                            <Upload size={12}/> Receipt
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
        .dash-welcome { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .welcome-avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, var(--brand-500), #a78bfa); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700; color: #fff; flex-shrink: 0; }
      `}</style>
    </div>
  );
}
