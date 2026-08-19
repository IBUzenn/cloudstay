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
  const canUpload = user?.role === 'student' && booking.status === 'approved' && !booking.receipt_url;

  // Visual status stepper helper
  const getStepState = (stepIndex) => {
    if (booking.status === 'rejected' || booking.status === 'cancelled') return 'cancelled';
    if (booking.status === 'approved' && booking.receipt_url) return 'complete';
    if (stepIndex === 1) return 'complete'; // Created
    if (stepIndex === 2 && booking.receipt_url) return 'complete';
    if (stepIndex === 2 && booking.status === 'approved') return 'current';
    if (stepIndex === 3 && booking.status === 'approved' && booking.receipt_url) return 'complete';
    return 'pending';
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 720 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '1.5rem' }}
        >
          <ChevronLeft size={16} /> Back
        </button>

        {/* Header Title */}
        <div className="booking-title-bar card fade-in">
          <div>
            <div className="id-tag">RESERVATION #{booking.id}</div>
            <h1>{booking.hostel_name}</h1>
            <p className="location-sub">
              Room {booking.room_number} ({ROOM_TYPE_LABELS[booking.room_type] || booking.room_type})
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Visual Progress Stepper */}
        <div className="card stepper-card fade-in">
          <h3 className="stepper-title">Booking Progress</h3>
          <div className="stepper-track">
            <div className={`step-item ${getStepState(1)}`}>
              <div className="step-circle"><CheckCircle2 size={16} /></div>
              <span className="step-label">Created</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${getStepState(2)}`}>
              <div className="step-circle"><Upload size={16} /></div>
              <span className="step-label">Receipt</span>
            </div>
            <div className="step-line" />
            <div className={`step-item ${getStepState(3)}`}>
              <div className="step-circle"><ShieldCheck size={16} /></div>
              <span className="step-label">Approval</span>
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
              <strong style={{ color: 'var(--accent-400)', fontSize: '1.05rem' }}>
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
                  <CheckCircle2 size={18} color="var(--accent-400)" />
                  <span>Payment receipt has been uploaded</span>
                </div>
                <a
                  href={booking.receipt_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <ExternalLink size={14} /> View Receipt Document
                </a>
              </div>
            ) : (
              <p className="no-receipt-text">
                {booking.status === 'approved'
                  ? 'Your booking is approved! Please upload your payment receipt to complete allocation.'
                  : 'No payment receipt uploaded yet.'}
              </p>
            )}
          </div>

          {/* Admin Review Note */}
          {booking.review_note && (
            <div className="alert alert-warn">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <div>
                <strong>Admin Review Note:</strong>
                <p style={{ marginTop: '0.2rem' }}>{booking.review_note}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="actions-bar">
            {canUpload && (
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
          padding: 1.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .id-tag {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--brand-300);
          margin-bottom: 0.25rem;
        }

        .location-sub {
          font-size: 0.9rem;
          color: var(--slate-400);
        }

        .stepper-card {
          padding: 1.5rem 2rem;
          margin-bottom: 1.5rem;
        }

        .stepper-title {
          font-size: 0.9rem;
          color: var(--slate-400);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1.25rem;
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
          gap: 0.4rem;
          color: var(--slate-500);
        }

        .step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-label {
          font-size: 0.775rem;
          font-weight: 500;
        }

        .step-item.complete {
          color: var(--accent-400);
        }
        .step-item.complete .step-circle {
          background: var(--success-bg);
          border-color: var(--success-border);
        }

        .step-item.current {
          color: var(--brand-400);
        }
        .step-item.current .step-circle {
          background: var(--info-bg);
          border-color: var(--brand-500);
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
        }

        .step-line {
          flex: 1;
          height: 2px;
          background: var(--border-subtle);
          margin: 0 1rem 1.25rem;
        }

        .details-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .detail-card {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-card h3 {
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
          font-size: 0.9rem;
        }
        .detail-row span:first-child {
          color: var(--slate-400);
        }

        .receipt-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(16, 185, 129, 0.06);
          border: 1px solid var(--success-border);
          border-radius: var(--radius-md);
          padding: 1rem 1.25rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .receipt-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--accent-400);
          font-weight: 500;
        }

        .no-receipt-text {
          font-size: 0.875rem;
          color: var(--slate-400);
        }

        .actions-bar {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
