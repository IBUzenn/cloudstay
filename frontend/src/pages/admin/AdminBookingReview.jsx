import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '../../api';
import { formatDate, formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import { ChevronLeft, Check, X, FileText } from 'lucide-react';
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
      toast.error('Review note is required when rejecting a booking.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await bookingApi.updateStatus(id, { 
        status: actionType === 'approve' ? 'approved' : 'rejected',
        reviewNote: reviewNote.trim()
      });
      setBooking(res.data.data);
      toast.success(`Booking ${actionType}d successfully.`);
      setActionType(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!booking) return null;

  const showActions = booking.status === 'pending';

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 800 }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom:'1.5rem' }}>
          <ChevronLeft size={16}/> Back to Bookings
        </button>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <h1>Review Booking #{booking.id}</h1>
          <StatusBadge status={booking.status} />
        </div>

        <div className="grid-2">
          {/* Student Info */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Student Details</h3>
            <div className="detail-row"><span>Name</span><strong>{booking.student_name}</strong></div>
            <div className="detail-row"><span>Student ID</span><strong>{booking.student_id}</strong></div>
            <div className="detail-row"><span>Email</span><span>{booking.student_email}</span></div>
          </div>

          {/* Booking Info */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Booking Details</h3>
            <div className="detail-row"><span>Hostel</span><strong>{booking.hostel_name}</strong></div>
            <div className="detail-row"><span>Room</span><strong>Room {booking.room_number} ({booking.room_type})</strong></div>
            <div className="detail-row"><span>Price</span><strong style={{ color: 'var(--accent-400)' }}>{formatCurrency(booking.price_per_semester)}</strong></div>
            <div className="detail-row"><span>Dates</span><span>{formatDate(booking.check_in_date)} to {formatDate(booking.check_out_date)}</span></div>
          </div>
        </div>

        {/* Receipt section */}
        <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Payment Receipt</h3>
          {booking.receipt_url ? (
             <a href={booking.receipt_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
               <FileText size={16}/> View Receipt Document
             </a>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No receipt uploaded yet.</p>
          )}
        </div>

        {/* Admin Review Note (if exists) */}
        {booking.review_note && (
          <div className="alert alert-info" style={{ marginTop: '1.5rem' }}>
            <strong>Admin Note:</strong> {booking.review_note}
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Review Action</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" onClick={() => setActionType('approve')}>
                <Check size={16}/> Approve Booking
              </button>
              <button className="btn btn-danger" onClick={() => setActionType('reject')}>
                <X size={16}/> Reject Booking
              </button>
            </div>
          </div>
        )}

        {/* Action Modal */}
        {actionType && (
          <ConfirmModal
            title={actionType === 'approve' ? 'Approve Booking' : 'Reject Booking'}
            message={`Are you sure you want to ${actionType} this booking?`}
            confirmLabel={`Yes, ${actionType}`}
            confirmClass={actionType === 'approve' ? 'btn-primary' : 'btn-danger'}
            loading={submitting}
            onCancel={() => setActionType(null)}
            onConfirm={handleAction}
          />
        )}
      </div>

      <style>{`
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; font-size: 0.875rem; }
        .detail-row > span:first-child { color: var(--text-secondary); }
        @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
