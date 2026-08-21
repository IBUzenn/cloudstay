import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../../api';
import { formatDate, formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import { BookOpen, Filter, Eye, CheckCircle2, Search } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await bookingApi.getAll(statusFilter ? { status: statusFilter } : {});
        setBookings(res.data.data || []);
      } catch (err) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [statusFilter]);

  const filteredBookings = bookings.filter((b) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (b.student_name && b.student_name.toLowerCase().includes(term)) ||
      (b.hostel_name && b.hostel_name.toLowerCase().includes(term)) ||
      (b.id && b.id.toString().includes(term))
    );
  });

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header Bar */}
        <div className="bookings-header-bar fade-in">
          <div>
            <h1>Manage Student Bookings</h1>
            <p className="subtext">
              Inspect student room applications, verify uploaded receipts, and issue approvals
            </p>
          </div>

          <div className="filters-group">
            {/* Search Input */}
            <div className="search-input-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search student or hostel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input search-field"
              />
            </div>

            {/* Status Select */}
            <select
              className="form-input status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Spinner label="Loading master bookings list..." />
        ) : filteredBookings.length === 0 ? (
          <div className="card empty-state fade-in">
            <BookOpen size={52} />
            <h3>No Bookings Found</h3>
            <p>No student bookings match your current filter settings.</p>
            {(statusFilter || search) && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => { setStatusFilter(''); setSearch(''); }}
              >
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper fade-in">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Student Info</th>
                  <th>Hostel Residence</th>
                  <th>Allocated Room</th>
                  <th>Semester Dates</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td className="id-cell">#{b.id}</td>
                    <td>
                      <div className="student-cell">
                        <span className="student-name">{b.student_name}</span>
                        <span className="student-id">{b.student_id || 'STU-OFFICIAL'}</span>
                      </div>
                    </td>
                    <td className="hostel-cell">{b.hostel_name}</td>
                    <td>
                      <div className="room-cell">
                        <span>Room {b.room_number}</span>
                        <span className="type-sub">{b.room_type}</span>
                      </div>
                    </td>
                    <td className="dates-cell">
                      {formatDate(b.check_in_date)} – {formatDate(b.check_out_date)}
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                      {b.receipt_url ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem', color: 'var(--emerald-600)', background: 'var(--emerald-50)', padding: '0.1rem 0.45rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                          <CheckCircle2 size={11} /> Receipt Uploaded
                        </span>
                      ) : (
                        <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '0.15rem' }}>
                          No receipt yet
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="action-cell">
                        <Link to={`/admin/bookings/${b.id}`} className="btn btn-primary btn-sm">
                          <Eye size={14} /> Review
                        </Link>
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
        .bookings-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .subtext {
          color: var(--slate-400);
          font-size: 0.9rem;
          margin-top: 0.2rem;
        }

        .filters-group {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--slate-400);
          pointer-events: none;
        }

        .search-field {
          padding-left: 2.4rem;
          font-size: 0.85rem;
          width: 220px;
        }

        .status-select {
          font-size: 0.85rem;
          padding: 0.5rem 0.85rem;
          width: auto;
          min-width: 160px;
        }

        .id-cell {
          font-family: monospace;
          font-weight: 700;
          color: var(--blue-600);
        }

        .student-cell {
          display: flex;
          flex-direction: column;
        }

        .student-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .student-id {
          font-size: 0.75rem;
          font-family: monospace;
          color: var(--slate-400);
        }

        .hostel-cell {
          font-weight: 500;
          color: var(--text-primary);
        }

        .room-cell {
          display: flex;
          flex-direction: column;
        }

        .type-sub {
          font-size: 0.75rem;
          color: var(--slate-400);
          text-transform: capitalize;
        }

        .dates-cell {
          font-size: 0.825rem;
          color: var(--text-muted);
        }

        .action-cell {
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
