import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../../api';
import { formatDate, formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await bookingApi.getAll(statusFilter ? { status: statusFilter } : {});
        setBookings(res.data.data || []);
      } catch { setBookings([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [statusFilter]);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1>Manage Bookings</h1>
          <select className="form-input" style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? <Spinner /> : bookings.length === 0 ? (
          <div className="card empty-state">
            <p>No bookings found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Hostel</th>
                  <th>Room</th>
                  <th>Dates</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>#{b.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{b.student_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{b.student_id}</div>
                    </td>
                    <td>{b.hostel_name}</td>
                    <td>Room {b.room_number}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {formatDate(b.check_in_date)} - {formatDate(b.check_out_date)}
                    </td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      <Link to={`/admin/bookings/${b.id}`} className="btn btn-primary btn-sm">Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
