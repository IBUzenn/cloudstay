import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, Plus, Eye, AlertTriangle } from 'lucide-react';
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

  const actionRequiredBooking = bookings.find(
    (b) => (b.status === 'pending' && !b.receipt_url) || b.status === 'rejected'
  );

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Student Identity Header — Deep Navy Panel */}
        <div className="student-hero-card">
          <div className="student-id-group">
            <div className="student-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="student-info">
              <h1>{user?.name}</h1>
              <p className="student-meta">
                <span>{user?.email}</span>
                {user?.student_id && (
                  <span className="student-id-pill">{user.student_id}</span>
                )}
              </p>
            </div>
          </div>
          <Link to="/hostels" className="btn btn-primary btn-lg hero-cta">
            <Plus size={16} /> Find a Room & Book
          </Link>
        </div>

        {/* Action Required Alert Banner */}
        {actionRequiredBooking && (
          <div className={`alert ${actionRequiredBooking.status === 'rejected' ? 'alert-danger' : 'alert-warn'} action-banner`}>
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div className="action-banner-content">
              <strong>
                {actionRequiredBooking.status === 'rejected' 
                  ? 'Payment Receipt Rejected — Action Required'
                  : 'Payment Verification Pending — Action Required'}
              </strong>
              <p>
                {actionRequiredBooking.status === 'rejected'
                  ? `Your payment receipt for Room ${actionRequiredBooking.room_number} (${actionRequiredBooking.hostel_name}) was not approved${actionRequiredBooking.review_note ? `: "${actionRequiredBooking.review_note}"` : ''}. Please upload a replacement receipt.`
                  : `Your room reservation for Room ${actionRequiredBooking.room_number} (${actionRequiredBooking.hostel_name}) is created. Please upload your payment receipt to complete verification.`}
              </p>
            </div>
            <Link to={`/bookings/${actionRequiredBooking.id}/upload`} className="btn btn-sm action-upload-btn">
              <Upload size={14} /> {actionRequiredBooking.status === 'rejected' ? 'Upload Replacement' : 'Upload Receipt'}
            </Link>
          </div>
        )}

        {/* Bookings Section */}
        <div className="section-header">
          <h2>My Accommodation Bookings</h2>
          <p className="subtext">Track your semester room applications and payment verification status</p>
        </div>

        {loading ? (
          <Spinner label="Fetching your hostel reservations…" />
        ) : bookings.length === 0 ? (
          <div className="empty-state card">
            <BookOpen size={44} />
            <h3>No Hostel Reservations Yet</h3>
            <p>You haven't submitted any room booking applications. Browse available hostels to reserve a room for the semester.</p>
            <Link to="/hostels" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
              Browse Hostels Directory
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Ref #</th>
                  <th>Hostel Property</th>
                  <th>Allocated Room</th>
                  <th>Check-In Date</th>
                  <th>Semester Rate</th>
                  <th>Booking Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="ref-cell">#{b.id}</td>
                    <td className="hostel-cell">{b.hostel_name}</td>
                    <td>
                      <span className="room-num">Room {b.room_number}</span>
                      <span className="room-type-sub"> ({b.room_type})</span>
                    </td>
                    <td className="date-cell">{formatDate(b.check_in_date)}</td>
                    <td className="price-cell">{formatCurrency(b.price_per_semester)}</td>
                    <td>
                      <StatusBadge status={b.status} />
                      {b.status === 'pending' && b.receipt_url && (
                        <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--amber-700)', marginTop: '0.15rem' }}>
                          ✓ Receipt Under Review
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link to={`/bookings/${b.id}`} className="btn btn-outline btn-sm">
                          <Eye size={14} /> Details
                        </Link>
                        {['pending', 'rejected'].includes(b.status) && (
                          <Link to={`/bookings/${b.id}/upload`} className="btn btn-primary btn-sm">
                            <Upload size={14} /> {b.receipt_url ? 'Replace' : 'Upload Receipt'}
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
        /* ── Student Hero Identity Card ───────────────────────── */
        .student-hero-card {
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

        .student-id-group {
          display: flex;
          align-items: center;
          gap: 1.1rem;
        }

        .student-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #2563EB;
          border: 2px solid #38BDF8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: 700;
          color: #FFFFFF;
          flex-shrink: 0;
        }

        .student-info h1 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .student-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: #9FB3C8;
          margin-top: 0.2rem;
          flex-wrap: wrap;
        }

        .student-id-pill {
          font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
          color: #38BDF8;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 0.1rem 0.5rem;
          border-radius: 999px;
          font-size: 0.775rem;
          font-weight: 600;
        }

        .hero-cta { flex-shrink: 0; }

        /* ── Action Banner ────────────────────────────────────── */
        .action-banner {
          margin-bottom: 1.75rem;
          background: #FEF3C7;
          border: 1px solid #FCD34D;
          color: #92400E;
          border-radius: var(--radius-md);
          padding: 1.1rem 1.35rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .action-banner-content { flex: 1; min-width: 220px; }
        .action-banner-content strong { font-size: 0.925rem; }
        .action-banner-content p { font-size: 0.85rem; margin-top: 0.2rem; }

        .action-upload-btn {
          background: #D97706;
          color: #FFFFFF;
          border: 1px solid #B45309;
          white-space: nowrap;
        }
        .action-upload-btn:hover { background: #B45309; }

        /* ── Section Header ────────────────────────────────────── */
        .section-header {
          margin-bottom: 1rem;
        }

        /* ── Table Cell Customization ──────────────────────────── */
        .ref-cell {
          font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
          font-weight: 700;
          color: var(--blue-primary);
        }

        .hostel-cell {
          font-weight: 700;
          color: var(--navy-primary);
        }

        .room-num {
          font-weight: 600;
          color: var(--navy-primary);
        }

        .room-type-sub {
          font-size: 0.775rem;
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .date-cell {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .price-cell {
          font-weight: 700;
          color: var(--success-text);
        }

        .row-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .student-hero-card {
            flex-direction: column;
            align-items: flex-start;
          }
          .hero-cta { width: 100%; }
        }
      `}</style>
    </div>
  );
}
