import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  CalendarDays,
  Building2,
  BedDouble,
  DollarSign,
  ChevronLeft,
  ShieldCheck,
  Info,
  Sparkles
} from 'lucide-react';
import { bookingApi } from '../../api';
import { formatCurrency, ROOM_TYPE_LABELS } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function BookingForm() {
  const { roomId } = useParams();
  const { state }  = useLocation();
  const navigate   = useNavigate();

  const room   = state?.room;
  const hostel = state?.hostel;

  const today = new Date().toISOString().split('T')[0];
  const [form, setForm]       = useState({ checkInDate: '', checkOutDate: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.checkInDate)  errs.checkInDate  = 'Check-in date is required.';
    if (!form.checkOutDate) errs.checkOutDate = 'Check-out date is required.';
    else if (new Date(form.checkOutDate) <= new Date(form.checkInDate))
      errs.checkOutDate = 'Check-out must be after check-in date.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await bookingApi.create({
        roomId: parseInt(roomId, 10),
        checkInDate:  form.checkInDate,
        checkOutDate: form.checkOutDate,
      });
      toast.success('Booking initialized! Upload your payment receipt to complete application.');
      navigate(`/bookings/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking allocation failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!room || !hostel) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: 520 }}>
          <div className="card empty-state">
            <Info size={44} />
            <h3>Missing Room Details</h3>
            <p>Please select a room from the hostels directory to initialize your booking.</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/hostels')}>
              Browse Hostels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 900 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '1.75rem' }}
        >
          <ChevronLeft size={16} /> Return to Hostel Details
        </button>

        <div className="booking-header">
          <h1>Confirm Room Reservation</h1>
          <p className="subtext">
            Review room specifications and select your check-in dates for semester allocation
          </p>
        </div>

        <div className="grid-2 booking-grid">
          {/* Left Column: Room & Hostel Summary Card */}
          <div className="card summary-card fade-in">
            <div className="card-badge-row">
              <span className="room-type-badge">
                <BedDouble size={14} /> {ROOM_TYPE_LABELS[room.room_type] || room.room_type}
              </span>
              <span className="verified-tag">
                <ShieldCheck size={13} /> Official Allocation
              </span>
            </div>

            <div className="room-title-group">
              <h2>Room {room.room_number}</h2>
              <p className="hostel-name-location">
                <Building2 size={15} /> {hostel.name} · {hostel.location}
              </p>
            </div>

            <div className="pricing-box">
              <span className="price-label">Semester Rate</span>
              <div className="price-value-group">
                <span className="price-amount">{formatCurrency(room.price_per_semester)}</span>
                <span className="price-sub">/ semester</span>
              </div>
            </div>

            <div className="specs-list">
              <div className="spec-row">
                <span>Room Capacity</span>
                <strong>{room.capacity} Student{room.capacity > 1 ? 's' : ''}</strong>
              </div>
              <div className="spec-row">
                <span>Status</span>
                <strong style={{ color: 'var(--accent-400)' }}>Available for Booking</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Date Form */}
          <div className="card form-card fade-in">
            <h3 style={{ marginBottom: '1.25rem' }}>Select Semester Duration</h3>

            <form onSubmit={handleSubmit} noValidate className="form-stack">
              <div className="form-group">
                <label className="form-label" htmlFor="checkInDate">Check-in Date</label>
                <div className="input-icon-wrapper">
                  <CalendarDays size={16} className="input-icon" />
                  <input
                    id="checkInDate"
                    type="date"
                    min={today}
                    className={`form-input input-with-icon ${errors.checkInDate ? 'error' : ''}`}
                    value={form.checkInDate}
                    onChange={(e) => setForm({ ...form, checkInDate: e.target.value })}
                  />
                </div>
                {errors.checkInDate && <p className="form-error">{errors.checkInDate}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="checkOutDate">Check-out Date</label>
                <div className="input-icon-wrapper">
                  <CalendarDays size={16} className="input-icon" />
                  <input
                    id="checkOutDate"
                    type="date"
                    min={form.checkInDate || today}
                    className={`form-input input-with-icon ${errors.checkOutDate ? 'error' : ''}`}
                    value={form.checkOutDate}
                    onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })}
                  />
                </div>
                {errors.checkOutDate && <p className="form-error">{errors.checkOutDate}</p>}
              </div>

              <div className="alert alert-info">
                <Info size={18} style={{ flexShrink: 0 }} />
                <span>
                  After submitting your dates, you will be prompted to upload proof of bank payment/receipt.
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                disabled={loading}
                style={{ marginTop: '0.5rem' }}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16 }} />
                    Initializing Reservation...
                  </>
                ) : (
                  'Confirm & Reserve Room'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .booking-header {
          margin-bottom: 2rem;
        }

        .booking-header h1 {
          font-size: 1.85rem;
          margin-bottom: 0.35rem;
        }

        .subtext {
          color: var(--slate-400);
          font-size: 0.925rem;
        }

        .booking-grid {
          align-items: start;
        }

        .summary-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .room-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.75rem;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.28);
          border-radius: var(--radius-full);
          color: var(--brand-300);
          font-size: 0.775rem;
          font-weight: 600;
        }

        .verified-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--accent-400);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .room-title-group h2 {
          font-size: 1.6rem;
          margin-bottom: 0.35rem;
        }

        .hostel-name-location {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--slate-300);
          font-size: 0.9rem;
        }

        .pricing-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .price-label {
          font-size: 0.775rem;
          color: var(--slate-400);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .price-amount {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--accent-400);
        }

        .price-sub {
          font-size: 0.8rem;
          color: var(--slate-400);
          margin-left: 0.35rem;
        }

        .specs-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.25rem;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: var(--slate-300);
        }

        .form-card {
          padding: 2rem;
        }

        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.9rem;
          color: var(--slate-400);
          pointer-events: none;
        }

        .input-with-icon {
          padding-left: 2.6rem;
        }
      `}</style>
    </div>
  );
}
