import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../../api';
import { formatDate, formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import {
  ChevronLeft,
  Check,
  X,
  FileText,
  User,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminBookingReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [actionType, setActionType] = useState(null); // 'approve' | 'reject'
  const [reviewNote, setReviewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    bookingApi.getById(id)
      .then(res => setBooking(res.data.data))
      .catch(() => navigate('/admin/bookings'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAction = async () => {
    if (actionType === 'reject' && !reviewNote.trim()) {
      toast.error('A review note is required when rejecting a booking request.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await bookingApi.updateStatus(id, { 
        status: actionType === 'approve' ? 'approved' : 'rejected',
        reviewNote: reviewNote.trim()
      });
      setBooking(res.data.data);
      toast.success(`Booking ${actionType === 'approve' ? 'approved' : 'rejected'} successfully.`);
      setActionType(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update booking status.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner fullScreen label="Loading booking application details..." />;
  if (!booking) return null;

  const showActions = booking.status === 'pending';

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 840 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '1.5rem' }}
        >
          <ChevronLeft size={16} /> Back to Bookings
        </button>

        {/* Review Header Banner */}
        <div className="review-title-bar card fade-in">
          <div>
            <div className="id-sub">RESERVATION #{booking.id}</div>
            <h1>Application Review</h1>
            <p className="subtext">Verify applicant details and issue room allocation approval</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="grid-2 review-grid">
          {/* Left: Applicant Details */}
          <div className="card review-card">
            <h3><User size={18} /> Student Applicant Details</h3>
            <div className="detail-row">
              <span>Full Name</span>
              <strong>{booking.student_name}</strong>
            </div>
            <div className="detail-row">
              <span>Student ID</span>
              <strong className="mono">{booking.student_id || 'STU-OFFICIAL'}</strong>
            </div>
            <div className="detail-row">
              <span>Email Address</span>
              <span>{booking.student_email}</span>
            </div>
          </div>

          {/* Right: Booking Specs */}
          <div className="card review-card">
            <h3><Building2 size={18} /> Room & Rate Specifications</h3>
            <div className="detail-row">
              <span>Hostel Property</span>
              <strong>{booking.hostel_name}</strong>
            </div>
            <div className="detail-row">
              <span>Allocated Room</span>
              <strong>Room {booking.room_number} ({booking.room_type})</strong>
            </div>
            <div className="detail-row">
              <span>Semester Rate</span>
              <strong style={{ color: 'var(--accent-400)' }}>
                {formatCurrency(booking.price_per_semester)}
              </strong>
            </div>
            <div className="detail-row">
              <span>Semester Duration</span>
              <span>{formatDate(booking.check_in_date)} to {formatDate(booking.check_out_date)}</span>
            </div>
          </div>
        </div>

        {/* Receipt Verification Box */}
        <div className="card receipt-card fade-in" style={{ marginTop: '1.5rem' }}>
          <h3><FileText size={18} /> Bank Payment Receipt Document</h3>
          {booking.receipt_url ? (
            <div className="receipt-viewer-box">
              <div className="receipt-status-text">
                <ShieldCheck size={18} color="var(--accent-400)" />
                <span>Uploaded Payment Document Verified</span>
              </div>
              <a
                href={booking.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
              >
                <ExternalLink size={14} /> Open Receipt Document
              </a>
            </div>
          ) : (
            <p className="no-receipt-note">
              No payment receipt uploaded by applicant yet.
            </p>
          )}
        </div>

        {/* Admin Review Note (if already reviewed) */}
        {booking.review_note && (
          <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Recorded Admin Note:</strong>
              <p style={{ marginTop: '0.2rem' }}>{booking.review_note}</p>
            </div>
          </div>
        )}

        {/* Interactive Action Control Section */}
        {showActions && (
          <div className="card action-control-card fade-in" style={{ marginTop: '1.5rem' }}>
            <h3>Decision Action</h3>
            <p className="action-subtext">Review the application and receipt, then issue your decision:</p>

            <div className="form-group" style={{ margin: '1rem 0' }}>
              <label className="form-label" htmlFor="review-note">Admin Review Note (Optional for Approval, Required for Rejection)</label>
              <textarea
                id="review-note"
                rows={3}
                className="form-input"
                placeholder="Enter feedback or explanation for the applicant..."
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
              />
            </div>

            <div className="decision-buttons-row">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => setActionType('approve')}
              >
                <Check size={16} /> Approve Booking
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setActionType('reject')}
              >
                <X size={16} /> Reject Application
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {actionType && (
          <ConfirmModal
            isOpen={!!actionType}
            title={actionType === 'approve' ? 'Approve Student Booking' : 'Reject Booking Application'}
            message={`Are you sure you want to ${actionType} Booking #${booking.id} for ${booking.student_name}?`}
            confirmText={`Yes, ${actionType === 'approve' ? 'Approve' : 'Reject'}`}
            variant={actionType === 'approve' ? 'success' : 'danger'}
            loading={submitting}
            onCancel={() => setActionType(null)}
            onConfirm={handleAction}
          />
        )}
      </div>

      <style>{`
        .review-title-bar {
          padding: 1.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .id-sub {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--brand-300);
          margin-bottom: 0.25rem;
        }

        .subtext {
          color: var(--slate-400);
          font-size: 0.9rem;
        }

        .review-grid {
          align-items: stretch;
        }

        .review-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .review-card h3, .receipt-card h3, .action-control-card h3 {
          font-size: 1rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .detail-row span:first-child {
          color: var(--slate-400);
        }

        .mono {
          font-family: monospace;
        }

        .receipt-card, .action-control-card {
          padding: 1.75rem;
        }

        .receipt-viewer-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid var(--success-border);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          margin-top: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .receipt-status-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--accent-400);
          font-weight: 500;
        }

        .no-receipt-note {
          font-size: 0.875rem;
          color: var(--slate-400);
          margin-top: 0.75rem;
        }

        .action-subtext {
          font-size: 0.875rem;
          color: var(--slate-400);
          margin-top: 0.5rem;
        }

        .decision-buttons-row {
          display: flex;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}
