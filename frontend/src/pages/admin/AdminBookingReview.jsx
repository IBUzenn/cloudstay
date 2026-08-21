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
  const [submitting, setSubmitting] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [reviewNote, setReviewNote] = useState('');
  const [selectedReason, setSelectedReason] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    bookingApi.getById(id)
      .then(res => setBooking(res.data.data))
      .catch(() => navigate('/admin/bookings'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const REJECTION_REASONS = [
    'Receipt is unclear or illegible',
    'Receipt does not match payment details',
    'Incorrect payment amount',
    'Other (specify below)'
  ];

  const handleReasonClick = (reason) => {
    setSelectedReason(reason);
    if (reason !== 'Other (specify below)') {
      setReviewNote(reason);
    } else {
      setReviewNote('');
    }
  };

  const handleAction = async () => {
    const finalNote = reviewNote.trim() || selectedReason;
    if (actionType === 'reject' && !finalNote) {
      toast.error('Please select or enter a rejection reason.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await bookingApi.updateStatus(id, { 
        status: actionType === 'approve' ? 'approved' : 'rejected',
        reviewNote: finalNote
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
  const receiptUrl = bookingApi.getReceiptUrl(booking.id);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 840 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '1.25rem' }}
        >
          <ChevronLeft size={16} /> Back to Bookings
        </button>

        {/* Review Header Banner */}
        <div className="review-title-bar card">
          <div>
            <div className="id-sub">RESERVATION #{booking.id}</div>
            <h1>Application Review</h1>
            <p className="subtext">Verify student details, payment receipt, and issue room allocation approval</p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="grid-2 review-grid">
          {/* Left: Applicant Details */}
          <div className="card review-card">
            <h3><User size={16} /> Student Applicant Details</h3>
            <div className="detail-row">
              <span>Full Name</span>
              <strong>{booking.student_name}</strong>
            </div>
            <div className="detail-row">
              <span>Student ID</span>
              <strong className="mono">{booking.student_number || booking.student_id || 'STU-OFFICIAL'}</strong>
            </div>
            <div className="detail-row">
              <span>Email Address</span>
              <span>{booking.student_email}</span>
            </div>
          </div>

          {/* Right: Booking Specs */}
          <div className="card review-card">
            <h3><Building2 size={16} /> Room & Rate Specifications</h3>
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
              <strong style={{ color: 'var(--emerald-600)' }}>
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
        <div className="card receipt-card" style={{ marginTop: '1.25rem' }}>
          <h3><FileText size={16} /> Bank Payment Receipt Document</h3>
          {booking.receipt_url ? (
            <div className="receipt-viewer-box">
              <div className="receipt-status-text">
                <ShieldCheck size={18} color="var(--emerald-600)" />
                <div>
                  <strong>Uploaded Payment Receipt Document</strong>
                  <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
                    Submitted by applicant for management verification
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowReceiptModal(true)}
              >
                <ExternalLink size={14} /> Open Receipt Document
              </button>
            </div>
          ) : (
            <div className="no-receipt-alert alert alert-warn" style={{ marginTop: '0.875rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>No Payment Receipt Submitted Yet</strong>
                <p style={{ fontSize: '0.825rem', marginTop: '0.15rem' }}>
                  The student has initialized this reservation but has not uploaded proof of bank payment.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Review Note (if already reviewed) */}
        {booking.review_note && (
          <div className="alert alert-info" style={{ marginTop: '1.25rem' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <div>
              <strong>Recorded Admin Review Note:</strong>
              <p style={{ marginTop: '0.2rem' }}>{booking.review_note}</p>
            </div>
          </div>
        )}

        {/* Interactive Action Control Section */}
        {showActions && (
          <div className="card action-control-card" style={{ marginTop: '1.25rem' }}>
            <h3>Management Review Decision</h3>
            <p className="action-subtext">Inspect student details and payment receipt above, then select your decision:</p>

            <div className="decision-buttons-row" style={{ margin: '1.25rem 0' }}>
              <button
                type="button"
                className="btn btn-success btn-lg"
                style={{ flex: 1 }}
                onClick={() => setActionType('approve')}
              >
                <Check size={18} /> Approve Booking
              </button>
              <button
                type="button"
                className="btn btn-danger btn-lg"
                style={{ flex: 1 }}
                onClick={() => setActionType('reject')}
              >
                <X size={18} /> Reject Application
              </button>
            </div>
          </div>
        )}

        {/* Rejection Modal with Structured Reasons */}
        {actionType === 'reject' && (
          <div className="modal-backdrop" onClick={() => setActionType(null)}>
            <div className="modal-card rejection-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header-icon" style={{ background: '#FEF2F2', borderColor: '#FCA5A5' }}>
                <X size={24} color="var(--red-600)" />
              </div>
              <h2>Reject Booking Application</h2>
              <p className="modal-sub">
                Please select the reason for rejecting <strong>Booking #{booking.id} ({booking.student_name})</strong>
              </p>

              <div className="rejection-reasons-list">
                <span className="reason-label-title">Why are you rejecting this receipt?</span>
                {REJECTION_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    className={`reason-chip ${selectedReason === reason ? 'active' : ''}`}
                    onClick={() => handleReasonClick(reason)}
                  >
                    <span className="radio-dot" /> {reason}
                  </button>
                ))}
              </div>

              <div className="form-group" style={{ width: '100%', marginTop: '1rem', textAlign: 'left' }}>
                <label className="form-label" htmlFor="review-note">Review Note (Visible to Student)</label>
                <textarea
                  id="review-note"
                  rows={3}
                  className="form-input"
                  placeholder="Provide additional details or guidance for the student..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                />
              </div>

              <div className="modal-actions" style={{ marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setActionType(null)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleAction}
                  disabled={submitting || (!reviewNote.trim() && !selectedReason)}
                >
                  {submitting ? 'Rejecting...' : 'Reject Booking'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {actionType === 'approve' && (
          <ConfirmModal
            isOpen={true}
            title="Approve Student Booking"
            message={`Are you sure you want to approve Booking #${booking.id} for ${booking.student_name}? This will confirm their room reservation.`}
            confirmText="Yes, Approve Booking"
            variant="success"
            loading={submitting}
            onCancel={() => setActionType(null)}
            onConfirm={handleAction}
          />
        )}

        {/* Embedded Receipt Viewing Modal */}
        {showReceiptModal && (
          <div className="modal-backdrop" onClick={() => setShowReceiptModal(false)}>
            <div className="modal-card receipt-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-top-bar">
                <h3>Payment Receipt — Booking #{booking.id} ({booking.student_name})</h3>
                <button className="btn-close" onClick={() => setShowReceiptModal(false)}>✕</button>
              </div>
              <div className="receipt-preview-container">
                <iframe
                  src={receiptUrl}
                  title={`Receipt for Booking #${booking.id}`}
                  className="receipt-iframe"
                />
              </div>
              <div className="modal-footer-bar">
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <ExternalLink size={14} /> Open in New Window
                </a>
                <button className="btn btn-primary btn-sm" onClick={() => setShowReceiptModal(false)}>
                  Close Viewer
                </button>
              </div>
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
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .id-sub {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--blue-600);
          text-transform: uppercase;
          margin-bottom: 0.15rem;
        }

        .review-grid {
          align-items: stretch;
        }

        .review-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .review-card h3, .receipt-card h3, .action-control-card h3 {
          font-size: 0.95rem;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.45rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.65rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .detail-row span:first-child {
          color: var(--text-muted);
        }

        .mono {
          font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
        }

        .receipt-card, .action-control-card {
          padding: 1.25rem 1.5rem;
        }

        .receipt-viewer-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          border-radius: var(--radius-sm);
          padding: 0.875rem 1.1rem;
          margin-top: 0.875rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .receipt-status-text {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.875rem;
          color: var(--success-text);
          font-weight: 500;
        }

        .no-receipt-note {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 0.65rem;
        }

        .action-subtext {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 0.35rem;
        }

        .rejection-reasons-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          text-align: left;
        }

        .reason-label-title {
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--navy-primary);
          margin-bottom: 0.2rem;
        }

        .reason-chip {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.85rem;
          background: var(--surface-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 140ms ease;
          text-align: left;
        }

        .reason-chip:hover {
          border-color: var(--red-300);
          background: #FEF2F2;
        }

        .reason-chip.active {
          border-color: var(--red-500);
          background: #FEF2F2;
          font-weight: 600;
          color: var(--red-700);
        }

        .radio-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid var(--border-medium);
          display: inline-block;
          flex-shrink: 0;
        }

        .reason-chip.active .radio-dot {
          border-color: var(--red-600);
          background: var(--red-600);
          box-shadow: inset 0 0 0 2px #ffffff;
        }

        .decision-buttons-row {
          display: flex;
          gap: 0.875rem;
        }

        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(16, 42, 67, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1rem;
        }

        .receipt-modal-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          max-width: 800px;
          width: 100%;
          height: 82vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .modal-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          background: var(--surface-subtle);
        }

        .modal-top-bar h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--navy-primary);
        }

        .btn-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: var(--text-muted);
          padding: 0.2rem 0.5rem;
        }

        .receipt-preview-container {
          flex: 1;
          background: #f1f5f9;
          position: relative;
        }

        .receipt-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .modal-footer-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1.25rem;
          border-top: 1px solid var(--border-subtle);
          background: #ffffff;
        }

        @media (max-width: 640px) {
          .receipt-viewer-box {
            flex-direction: column;
            align-items: flex-start;
          }
          .receipt-modal-card {
            height: 90vh;
          }
        }
      `}</style>
    </div>
  );
}
