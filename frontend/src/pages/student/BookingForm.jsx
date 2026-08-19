import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, Building2, BedDouble, DollarSign, ChevronLeft } from 'lucide-react';
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
      errs.checkOutDate = 'Check-out must be after check-in.';
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
      toast.success('Booking created! Please upload your payment receipt.');
      navigate(`/bookings/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (!room || !hostel) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <p>Room information missing. <button className="btn btn-outline btn-sm" onClick={() => navigate('/hostels')}>Browse Hostels</button></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 640 }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
          <ChevronLeft size={16}/> Back
        </button>

        <h1 style={{ marginBottom: '1.5rem' }}>Confirm Booking</h1>

        {/* Room Summary */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start' }}>
            <div style={{ width:48, height:48, borderRadius:'var(--radius-md)', background:'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.1))', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--brand-400)', flexShrink:0 }}>
              <BedDouble size={22}/>
            </div>
            <div style={{ flex:1 }}>
              <h3 style={{ marginBottom:'0.25rem' }}>Room {room.room_number} — {ROOM_TYPE_LABELS[room.room_type]}</h3>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem', display:'flex', gap:'0.5rem', alignItems:'center' }}>
                <Building2 size={13}/> {hostel.name} · {hostel.location}
              </p>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:'1.25rem', fontWeight:800, color:'var(--accent-400)' }}>{formatCurrency(room.price_per_semester)}</div>
              <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>per semester</div>
            </div>
          </div>
        </div>

        {/* Date Form */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ marginBottom: '1.25rem' }}>Select Dates</h3>
          <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="form-group">
              <label className="form-label">Check-in Date</label>
              <div style={{ position:'relative' }}>
                <CalendarDays size={16} style={{ position:'absolute', left:'0.875rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
                <input type="date" min={today} className={`form-input ${errors.checkInDate ? 'error' : ''}`}
                  style={{ paddingLeft:'2.5rem' }}
                  value={form.checkInDate} onChange={(e) => setForm({ ...form, checkInDate: e.target.value })} />
              </div>
              {errors.checkInDate && <p className="form-error">{errors.checkInDate}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Check-out Date</label>
              <div style={{ position:'relative' }}>
                <CalendarDays size={16} style={{ position:'absolute', left:'0.875rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', pointerEvents:'none' }}/>
                <input type="date" min={form.checkInDate || today} className={`form-input ${errors.checkOutDate ? 'error' : ''}`}
                  style={{ paddingLeft:'2.5rem' }}
                  value={form.checkOutDate} onChange={(e) => setForm({ ...form, checkOutDate: e.target.value })} />
              </div>
              {errors.checkOutDate && <p className="form-error">{errors.checkOutDate}</p>}
            </div>

            <div className="alert alert-info" style={{ marginTop:'0.5rem' }}>
              After booking, you must upload your payment receipt for admin approval.
            </div>

            <button type="submit" className="btn btn-primary btn-full" style={{ marginTop:'0.5rem' }} disabled={loading}>
              {loading ? <><span className="spinner" style={{ width:16, height:16 }}/> Creating booking…</> : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
