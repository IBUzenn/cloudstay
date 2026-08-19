import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, Building2, BedDouble, Users, DollarSign, ChevronLeft, Filter } from 'lucide-react';
import { hostelApi, roomApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, ROOM_TYPE_LABELS } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

export default function HostelDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();
  const [hostel, setHostel] = useState(null);
  const [rooms,  setRooms]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState({ status: 'available', roomType: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [hRes, rRes] = await Promise.all([
          hostelApi.getById(id),
          roomApi.getByHostel(id, { status: 'available' }),
        ]);
        setHostel(hRes.data.data);
        setRooms(rRes.data.data || []);
      } catch { navigate('/hostels'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleFilterChange = async (newFilter) => {
    const f = { ...filter, ...newFilter };
    setFilter(f);
    try {
      const res = await roomApi.getByHostel(id, { status: f.status || undefined, roomType: f.roomType || undefined });
      setRooms(res.data.data || []);
    } catch { setRooms([]); }
  };

  if (loading) return <Spinner />;
  if (!hostel) return null;

  const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];

  return (
    <div className="page-wrapper">
      <div className="container">
        <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
          <ChevronLeft size={16} /> Back
        </button>

        {/* Hostel header */}
        <div className="detail-header card fade-in">
          <div className="detail-header-inner">
            <div className="detail-avatar"><Building2 size={40} /></div>
            <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0.375rem' }}>{hostel.name}</h1>
              <p style={{ display:'flex', alignItems:'center', gap:'0.375rem', color:'var(--text-secondary)', marginBottom:'0.75rem' }}>
                <MapPin size={14} /> {hostel.location}
              </p>
              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                {amenities.map((a) => (
                  <span key={a} className="amenity-chip">{a}</span>
                ))}
              </div>
            </div>
          </div>

          {hostel.description && <p className="detail-desc">{hostel.description}</p>}

          <div className="detail-meta">
            {hostel.contact_email && <span><Mail size={14}/> {hostel.contact_email}</span>}
            {hostel.contact_phone && <span><Phone size={14}/> {hostel.contact_phone}</span>}
          </div>
        </div>

        {/* Rooms */}
        <div className="rooms-section">
          <div className="rooms-header">
            <h2>Available Rooms</h2>
            <div className="room-filters">
              <select className="form-input" style={{ width:'auto', padding:'0.4rem 0.75rem', fontSize:'0.85rem' }}
                value={filter.roomType} onChange={(e) => handleFilterChange({ roomType: e.target.value })}>
                <option value="">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
                <option value="suite">Suite</option>
              </select>
              <select className="form-input" style={{ width:'auto', padding:'0.4rem 0.75rem', fontSize:'0.85rem' }}
                value={filter.status} onChange={(e) => handleFilterChange({ status: e.target.value })}>
                <option value="available">Available</option>
                <option value="">All Status</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className="empty-state"><BedDouble size={48}/><p>No rooms match your filters.</p></div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.id} className="room-card card">
                  <div className="room-card-top">
                    <div>
                      <div className="room-number">Room {room.room_number}</div>
                      <div className="room-type">{ROOM_TYPE_LABELS[room.room_type] || room.room_type}</div>
                    </div>
                    <StatusBadge status={room.status} />
                  </div>
                  <div className="room-details">
                    <span><Users size={13}/> Capacity: {room.capacity}</span>
                  </div>
                  {room.description && <p className="room-desc">{room.description}</p>}
                  <div className="room-footer">
                    <div className="room-price">
                      <span className="price-amount">{formatCurrency(room.price_per_semester)}</span>
                      <span className="price-label">/ semester</span>
                    </div>
                    {user?.role === 'student' && room.status === 'available' && (
                      <button className="btn btn-primary btn-sm" onClick={() => navigate(`/book/${room.id}`, { state: { room, hostel } })}>
                        Book Now
                      </button>
                    )}
                    {!user && room.status === 'available' && (
                      <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>
                        Login to Book
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .detail-header { padding: 2rem; margin-bottom: 2rem; }
        .detail-header-inner { display: flex; gap: 1.5rem; align-items: flex-start; margin-bottom: 1.25rem; }
        .detail-avatar { width: 72px; height: 72px; border-radius: var(--radius-lg); background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.1)); display: flex; align-items: center; justify-content: center; color: var(--brand-400); flex-shrink: 0; }
        .amenity-chip { font-size: 0.75rem; padding: 0.25rem 0.75rem; background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2); border-radius: var(--radius-full); color: var(--brand-400); }
        .detail-desc { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1rem; }
        .detail-meta { display: flex; gap: 1.5rem; font-size: 0.85rem; color: var(--text-secondary); flex-wrap: wrap; }
        .detail-meta span { display: flex; align-items: center; gap: 0.375rem; }
        .rooms-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem; }
        .room-filters { display: flex; gap: 0.5rem; }
        .rooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; }
        .room-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.875rem; }
        .room-card-top { display: flex; justify-content: space-between; align-items: flex-start; }
        .room-number { font-size: 1rem; font-weight: 700; margin-bottom: 0.125rem; }
        .room-type { font-size: 0.8rem; color: var(--text-secondary); }
        .room-details { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-secondary); }
        .room-details span { display: flex; align-items: center; gap: 0.25rem; }
        .room-desc { font-size: 0.8rem; color: var(--text-muted); }
        .room-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 0.875rem; margin-top: 0.25rem; }
        .room-price { display: flex; align-items: baseline; gap: 0.25rem; }
        .price-amount { font-size: 1.15rem; font-weight: 800; color: var(--accent-400); }
        .price-label { font-size: 0.75rem; color: var(--text-muted); }
        .rooms-section { padding-bottom: 2rem; }
      `}</style>
    </div>
  );
}
