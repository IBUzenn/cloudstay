import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, CalendarDays, Upload, Ban, ChevronLeft, FileText } from 'lucide-react';
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
    bookingApi.getById(id).then((res) => setBooking(res.data.data))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await bookingApi.cancel(id);
      setBooking(res.data.data);
      toast.success('Booking cancelled.');
      setShowConfirm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed.');
    } finally { setCancelling(false); }
  };

  if (loading) return <Spinner />;
  if (!booking) return null;

  const canCancel = user?.role === 'student' && ['pending', 'approved'].includes(booking.status);
  const canUpload = user?.role === 'student' && booking.status === 'approved' && !booking.receipt_url;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 680 }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom:'1.5rem' }}>
          <ChevronLeft size={16}/> Back
        </button>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', flexWrap:'wrap', gap:'0.75rem' }}>
          <h1>Booking #{booking.id}</h1>
          <StatusBadge status={booking.status} />
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          {/* Room + Hostel */}
          <div className="card" style={{ padding:'1.5rem' }}>
            <h3 style={{ marginBottom:'1rem' }}>Room Details</h3>
            <div className="detail-row"><span>Hostel</span><strong>{booking.hostel_name}</strong></div>
            <div className="detail-row"><span>Location</span><span>{booking.hostel_location}</span></div>
            <div className="detail-row"><span>Room</span><strong>Room {booking.room_number} — {ROOM_TYPE_LABELS[booking.room_type] || booking.room_type}</strong></div>
            <div className="detail-row"><span>Price</span><span style={{ color:'var(--accent-400)', fontWeight:700 }}>{formatCurrency(booking.price_per_semester)} / semester</span></div>
          </div>

          {/* Dates */}
          <div className="card" style={{ padding:'1.5rem' }}>
            <h3 style={{ marginBottom:'1rem' }}>Booking Dates</h3>
            <div className="detail-row"><span>Check-in</span><strong>{formatDate(booking.check_in_date)}</strong></div>
            <div className="detail-row"><span>Check-out</span><strong>{formatDate(booking.check_out_date)}</strong></div>
            <div className="detail-row"><span>Booked On</span><span>{formatDate(booking.created_at)}</span></div>
          </div>

          {/* Payment */}
          <div className="card" style={{ padding:'1.5rem' }}>
            <h3 style={{ marginBottom:'1rem' }}>Payment Receipt</h3>
            {booking.receipt_url ? (
              <a href={booking.receipt_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                <FileText size={14}/> View Receipt
              </a>
            ) : (
              <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>
                {booking.status === 'approved'
                  ? 'Receipt not yet uploaded. Please upload your payment receipt.'
                  : 'No receipt uploaded.'}
              </p>
            )}
          </div>

          {/* Admin review note */}
          {booking.review_note && (
            <div className="alert alert-warn">
              <strong>Review Note:</strong> {booking.review_note}
            </div>
          )}

          {/* Actions */}
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
            {canUpload && (
              <Link to={`/bookings/${booking.id}/upload`} className="btn btn-primary">
                <Upload size={14}/> Upload Receipt
              </Link>
            )}
            {canCancel && (
              <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
                <Ban size={14}/> Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>

      {showConfirm && (
        <ConfirmModal
          title="Cancel Booking"
          message="Are you sure you want to cancel this booking? This action cannot be undone."
          confirmLabel="Yes, Cancel"
          onConfirm={handleCancel}
          onCancel={() => setShowConfirm(false)}
          loading={cancelling}
        />
      )}

      <style>{`
        .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 0.625rem 0; border-bottom: 1px solid var(--glass-border); font-size: 0.875rem; }
        .detail-row:last-child { border-bottom: none; }
        .detail-row > span:first-child { color: var(--text-secondary); }
      `}</style>
    </div>
  );
}
