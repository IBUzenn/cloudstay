import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  CalendarDays,
  Building2,
  BedDouble,
  ChevronLeft,
  ShieldCheck,
  Info
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
  const [form, setForm]             = useState({ checkInDate: '', checkOutDate: '' });
  const [errors, setErrors]         = useState({});
  const [loading, setLoading]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.checkInDate)  errs.checkInDate  = 'Check-in date is required.';
    if (!form.checkOutDate) errs.checkOutDate = 'Check-out date is required.';
    else if (new Date(form.checkOutDate) <= new Date(form.checkInDate))
      errs.checkOutDate = 'Check-out must be after check-in date.';
    return errs;
  };

  const handleOpenConfirm = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setShowConfirm(true);
  };

  const handleConfirmReservation = async () => {
    setLoading(true);
    try {
      const res = await bookingApi.create({
        roomId: parseInt(roomId, 10),
        checkInDate:  form.checkInDate,
        checkOutDate: form.checkOutDate,
      });
      toast.success('Reservation initialized! Please upload your payment receipt.');
      navigate(`/bookings/${res.data.data.id}`, { state: { justCreated: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking allocation failed.');
      setShowConfirm(false);
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
      <div className="container" style={{ maxWidth: 860 }}>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate(-1)}
          style={{ marginBottom: '1.25rem' }}
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
          <div className="card summary-card">
            <div className="card-badge-row">
              <span className="room-type-badge">
                <BedDouble size={13} /> {ROOM_TYPE_LABELS[room.room_type] || room.room_type}
              </span>
              <span className="verified-tag">
                <ShieldCheck size={13} /> Official Allocation
              </span>
            </div>

            <div className="room-title-group">
              <h2>Room {room.room_number}</h2>
              <p className="hostel-name-location">
                <Building2 size={14} /> {hostel.name} · {hostel.location}
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
                <strong style={{ color: 'var(--emerald-600)' }}>Available for Booking</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Date Form */}
          <div className="card form-card">
            <h3 style={{ marginBottom: '1rem' }}>Select Semester Duration</h3>

            <form onSubmit={handleOpenConfirm} noValidate className="form-stack">
              <div className="form-group">
                <label className="form-label" htmlFor="checkInDate">Check-in Date</label>
                <div className="input-icon-wrapper">
                  <CalendarDays size={15} className="input-icon" />
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
                  <CalendarDays size={15} className="input-icon" />
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
                <Info size={16} style={{ flexShrink: 0 }} />
                <span>
                  After submitting your dates, you will be prompted to upload proof of bank payment/receipt.
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full btn-lg"
                style={{ marginTop: '0.25rem' }}
              >
                Review & Reserve Room
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Reservation Confirmation Modal */}
      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header-icon">
              <Building2 size={24} color="var(--blue-600)" />
            </div>
            <h2>Reserve Room {room.room_number}</h2>
            <p className="modal-sub">
              <strong>{hostel.name}</strong> · {ROOM_TYPE_LABELS[room.room_type] || room.room_type}
            </p>

            <div className="modal-checklist">
              <div className="checklist-item">
                <ShieldCheck size={16} color="var(--emerald-600)" />
                <span>Confirm that you want to reserve Room {room.room_number}</span>
              </div>
              <div className="checklist-item">
                <ShieldCheck size={16} color="var(--emerald-600)" />
                <span>Payment of <strong>{formatCurrency(room.price_per_semester)}</strong> must be completed according to hostel requirements</span>
              </div>
              <div className="checklist-item">
                <ShieldCheck size={16} color="var(--emerald-600)" />
                <span>You will need to upload your official bank payment receipt</span>
              </div>
              <div className="checklist-item">
                <ShieldCheck size={16} color="var(--emerald-600)" />
                <span>Your booking will remain pending until verified by hostel management</span>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmReservation}
                disabled={loading}
              >
                {loading ? 'Reserving Room...' : 'Continue & Initialize Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(16, 42, 67, 0.7);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 1rem;
        }

        .modal-card {
          background: #ffffff;
          border-radius: var(--radius-md);
          max-width: 480px;
          width: 100%;
          padding: 1.75rem;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .modal-header-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--blue-50);
          border: 1px solid var(--blue-200);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.875rem;
        }

        .modal-card h2 {
          font-size: 1.35rem;
          color: var(--navy-primary);
        }

        .modal-sub {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
          margin-bottom: 1.25rem;
        }

        .modal-checklist {
          background: var(--surface-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          text-align: left;
          width: 100%;
          margin-bottom: 1.5rem;
        }

        .checklist-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: var(--text-primary);
          line-height: 1.35;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          width: 100%;
          justify-content: flex-end;
        }

        .modal-actions .btn {
          flex: 1;
        }

        .booking-header {
          margin-bottom: 1.5rem;
        }

        .booking-grid {
          align-items: start;
        }

        .summary-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .card-badge-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .room-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.2rem 0.6rem;
          background: var(--blue-50);
          border: 1px solid var(--blue-200);
          border-radius: 999px;
          color: var(--blue-700);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .verified-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: var(--emerald-600);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .room-title-group h2 {
          font-size: 1.35rem;
          margin-bottom: 0.2rem;
        }

        .hostel-name-location {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        .pricing-box {
          background: var(--surface-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .price-label {
          font-size: 0.72rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .price-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--emerald-600);
        }

        .price-sub {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-left: 0.25rem;
        }

        .specs-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          border-top: 1px solid var(--border-subtle);
          padding-top: 1rem;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .form-card {
          padding: 1.5rem;
        }

        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .input-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .input-with-icon {
          padding-left: 2.35rem;
        }
      `}</style>
    </div>
  );
}
