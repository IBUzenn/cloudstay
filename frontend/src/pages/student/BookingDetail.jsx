import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  CalendarDays,
  Upload,
  Ban,
  ChevronLeft,
  FileText,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { bookingApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency, ROOM_TYPE_LABELS } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function BookingDetail() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking,  setBooking]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const location = useLocation();
  const justCreated = location.state?.justCreated;
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    bookingApi.getById(id)
      .then((res) => setBooking(res.data.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await bookingApi.cancel(id);
      setBooking(res.data.data);
      toast.success('Booking cancelled successfully.');
      setShowConfirm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Spinner fullScreen label="Fetching booking details..." />;
  if (!booking) return null;

  const canCancel = user?.role === 'student' && ['pending', 'approved'].includes(booking.status);
  const canUpload = user?.role === 'student' && ['pending', 'rejected'].includes(booking.status);

  // Stepper progress state calculation
  // 1: Reservation Created, 2: Payment Receipt, 3: Management Review, 4: Reservation Confirmed
  const getStepStatus = (stepIndex) => {
    if (booking.status === 'cancelled') return 'cancelled';

    if (stepIndex === 1) return 'complete'; // Reservation Created is always complete

    if (stepIndex === 2) { // Payment Receipt
      if (booking.receipt_url) return 'complete';
      return 'current';
    }

    if (stepIndex === 3) { // Management Review
      if (booking.status === 'approved') return 'complete';
      if (booking.status === 'rejected') return 'failed';
      if (booking.receipt_url && booking.status === 'pending') return 'current';
      return 'pending';
    }

    if (stepIndex === 4) { // Reservation Confirmed
      if (booking.status === 'approved') return 'complete';
      return 'pending';
    }

    return 'pending';
  };

  const receiptUrl = bookingApi.getReceiptUrl(booking.id);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 740 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate('/dashboard')}
          style={{ marginBottom: '1.25rem' }}
        >
          <ChevronLeft size={16} /> Return to Dashboard
        </button>

        {/* 1. Immediate Post-Reservation Welcome Callout */}
        {(justCreated || (booking.status === 'pending' && !booking.receipt_url)) && (
          <div className="alert alert-warn action-callout-banner fade-in">
            <AlertCircle size={24} style={{ flexShrink: 0, color: 'var(--amber-600)' }} />
            <div className="callout-body">
              <strong style={{ fontSize: '1.05rem', color: 'var(--navy-primary)' }}>
                Reservation Created — Booking #{booking.id}
              </strong>
              <p style={{ margin: '0.35rem 0 0.85rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                Your room has been reserved temporarily for <strong>Room {booking.room_number} ({booking.hostel_name})</strong>.<br />
                <span style={{ fontWeight: 600, color: 'var(--amber-700)' }}>Next step: Pay your hostel fee and upload your payment receipt below.</span>
              </p>
              <Link to={`/bookings/${booking.id}/upload`} className="btn btn-primary btn-sm">
                <Upload size={14} /> Upload Payment Receipt Now
              </Link>
            </div>
          </div>
        )}

        {/* 2. Rejected Receipt Needs Attention Banner */}
        {booking.status === 'rejected' && (
          <div className="alert alert-danger action-callout-banner fade-in">
            <AlertCircle size={24} style={{ flexShrink: 0, color: 'var(--red-600)' }} />
            <div className="callout-body">
              <strong style={{ fontSize: '1.05rem', color: 'var(--red-700)' }}>
                Payment Receipt Needs Attention
              </strong>
              <p style={{ margin: '0.35rem 0 0.85rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                Your receipt could not be approved by management.<br />
                {booking.review_note && (
                  <span className="rejection-note-block" style={{ display: 'block', marginTop: '0.35rem', padding: '0.4rem 0.65rem', background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '4px', fontStyle: 'italic' }}>
                    Reason: "{booking.review_note}"
                  </span>
                )}
                <span style={{ display: 'block', marginTop: '0.35rem', fontWeight: 500 }}>
                  Please upload a clearer/correct receipt to re-submit your reservation.
                </span>
              </p>
              <Link to={`/bookings/${booking.id}/upload`} className="btn btn-danger btn-sm">
                <Upload size={14} /> Upload New Receipt
              </Link>
            </div>
          </div>
        )}

        {/* 3. Approved Booking Banner */}
        {booking.status === 'approved' && (
          <div className="alert alert-success action-callout-banner fade-in">
            <CheckCircle2 size={24} style={{ flexShrink: 0, color: 'var(--emerald-600)' }} />
            <div className="callout-body">
              <strong style={{ fontSize: '1.05rem', color: 'var(--emerald-800)' }}>
                ✓ Reservation Confirmed
              </strong>
              <p style={{ margin: '0.25rem 0 0.15rem', color: 'var(--text-primary)' }}>
                Your payment has been verified by hostel management. Your room allocation for <strong>Room {booking.room_number} ({booking.hostel_name})</strong> is fully approved and confirmed!
              </p>
            </div>
          </div>
        )}

        {/* Header Title Bar */}
        <div className="booking-title-bar card fade-in">
          <div>
            <div className="id-tag">BOOKING #{booking.id}</div>
            <h1>{booking.hostel_name}</h1>
            <p className="location-sub">
              Room {booking.room_number} ({ROOM_TYPE_LABELS[booking.room_type] || booking.room_type}) · {booking.hostel_location}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Visual 4-Step Progress Stepper */}
        <div className="card stepper-card fade-in">
          <h3 className="stepper-title">Reservation & Verification Progress</h3>
          <div className="stepper-track">
            <div className={`step-item ${getStepStatus(1)}`}>
              <div className="step-circle"><CheckCircle2 size={16} /></div>
              <span className="step-label">1. Reservation Created</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${getStepStatus(2)}`}>
              <div className="step-circle"><Upload size={16} /></div>
              <span className="step-label">2. Payment Receipt</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${getStepStatus(3)}`}>
              <div className="step-circle"><ShieldCheck size={16} /></div>
              <span className="step-label">3. Management Review</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${getStepStatus(4)}`}>
              <div className="step-circle"><CheckCircle2 size={16} /></div>
              <span className="step-label">4. Confirmed</span>
            </div>
          </div>
        </div>

        <div className="details-stack">
          {/* Room Summary Card */}
          <div className="card detail-card">
            <h3><Building2 size={18} /> Room & Hostel Overview</h3>
            <div className="detail-row">
              <span>Hostel</span>
              <strong>{booking.hostel_name}</strong>
            </div>
            <div className="detail-row">
              <span>Location</span>
              <span>{booking.hostel_location}</span>
            </div>
            <div className="detail-row">
              <span>Room Number</span>
              <strong>Room {booking.room_number} ({ROOM_TYPE_LABELS[booking.room_type] || booking.room_type})</strong>
            </div>
            <div className="detail-row">
              <span>Semester Price</span>
              <strong style={{ color: 'var(--emerald-600)', fontSize: '1.05rem' }}>
                {formatCurrency(booking.price_per_semester)}
              </strong>
            </div>
          </div>

          {/* Booking Dates */}
          <div className="card detail-card">
            <h3><CalendarDays size={18} /> Allocation Dates</h3>
            <div className="detail-row">
              <span>Check-in Date</span>
              <strong>{formatDate(booking.check_in_date)}</strong>
            </div>
            <div className="detail-row">
              <span>Check-out Date</span>
              <strong>{formatDate(booking.check_out_date)}</strong>
            </div>
            <div className="detail-row">
              <span>Submitted On</span>
              <span>{formatDate(booking.created_at)}</span>
            </div>
          </div>

          {/* Payment Receipt */}
          <div className="card detail-card">
            <h3><FileText size={18} /> Payment Proof</h3>
            {booking.receipt_url ? (
              <div className="receipt-box">
                <div className="receipt-info">
                  <CheckCircle2 size={18} color="var(--emerald-600)" />
                  <div>
                    <strong>Payment Receipt Submitted</strong>
                    <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)', margin: 0 }}>
                      Status: {booking.status === 'approved' ? 'Verified & Approved' : 'Under Management Review'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowReceiptModal(true)}
                  >
                    <ExternalLink size={14} /> View Receipt
                  </button>
                  {canUpload && (
                    <Link to={`/bookings/${booking.id}/upload`} className="btn btn-primary btn-sm">
                      <Upload size={14} /> Replace
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-receipt-box">
                <p className="no-receipt-text">
                  No payment receipt has been submitted yet for this reservation.
                </p>
                {canUpload && (
                  <Link to={`/bookings/${booking.id}/upload`} className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
                    <Upload size={14} /> Upload Payment Receipt
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Admin Review Note */}
          {booking.review_note && booking.status !== 'rejected' && (
            <div className="alert alert-info">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Admin Review Note:</strong>
                <p style={{ marginTop: '0.2rem' }}>{booking.review_note}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="actions-bar">
            {canUpload && !booking.receipt_url && (
              <Link to={`/bookings/${booking.id}/upload`} className="btn btn-primary">
                <Upload size={16} /> Upload Payment Receipt
              </Link>
            )}
            {canCancel && (
              <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
                <Ban size={16} /> Cancel Reservation
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Receipt Viewing Modal */}
      {showReceiptModal && (
        <div className="modal-backdrop" onClick={() => setShowReceiptModal(false)}>
          <div className="modal-card receipt-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <h3>Payment Receipt — Booking #{booking.id}</h3>
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
                <ExternalLink size={14} /> Open in New Tab
              </a>
              <button className="btn btn-primary btn-sm" onClick={() => setShowReceiptModal(false)}>
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          title="Cancel Booking"
          message="Are you sure you want to cancel this room reservation? This action cannot be undone."
          confirmText="Yes, Cancel Booking"
          onConfirm={handleCancel}
          onCancel={() => setShowConfirm(false)}
          loading={cancelling}
        />
      )}

      <style>{`
        .booking-title-bar {
          padding: 1.25rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .id-tag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--blue-600);
          text-transform: uppercase;
          margin-bottom: 0.2rem;
        }

        .location-sub {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 0.15rem;
        }

        .stepper-card {
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.25rem;
        }

        .stepper-title {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 1.1rem;
        }

        .stepper-track {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
        }

        .step-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: var(--surface-subtle);
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-label {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .step-item.complete {
          color: var(--success-text);
        }
        .step-item.complete .step-circle {
          background: var(--success-bg);
          border-color: var(--success-border);
        }

        .step-item.current {
          color: var(--blue-600);
        }
        .step-item.current .step-circle {
          background: var(--blue-50);
          border-color: var(--blue-400);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .step-line {
          flex: 1;
          height: 1px;
          background: var(--border-subtle);
          margin: 0 0.875rem 1.1rem;
        }

        .details-stack {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .detail-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }

        .detail-card h3 {
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

        .receipt-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          border-radius: var(--radius-sm);
          padding: 0.875rem 1.1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .receipt-info {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.875rem;
          color: var(--success-text);
          font-weight: 500;
        }

        .no-receipt-text {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .action-callout-banner {
          margin-bottom: 1.25rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-md);
        }

        .callout-body {
          flex: 1;
        }

        .rejection-note-inline {
          font-style: italic;
          font-weight: 500;
        }

        .no-receipt-box {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
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
          max-width: 720px;
          width: 100%;
          height: 80vh;
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
          .action-callout-banner {
            flex-direction: column;
          }
          .receipt-box {
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
