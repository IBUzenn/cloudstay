import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  BedDouble,
  Users,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
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
    const loadHostelData = async () => {
      setLoading(true);
      try {
        const [hRes, rRes] = await Promise.all([
          hostelApi.getById(id),
          roomApi.getByHostel(id, { status: 'available' }),
        ]);
        setHostel(hRes.data.data);
        setRooms(rRes.data.data || []);
      } catch (err) {
        navigate('/hostels');
      } finally {
        setLoading(false);
      }
    };
    loadHostelData();
  }, [id, navigate]);

  const handleFilterChange = async (newFilter) => {
    const f = { ...filter, ...newFilter };
    setFilter(f);
    try {
      const res = await roomApi.getByHostel(id, {
        status: f.status || undefined,
        roomType: f.roomType || undefined,
      });
      setRooms(res.data.data || []);
    } catch (err) {
      setRooms([]);
    }
  };

  if (loading) return <Spinner fullScreen label="Loading hostel details…" />;
  if (!hostel) return null;

  const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Back navigation */}
        <button
          className="btn btn-outline btn-sm back-btn"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={15} /> Back to Directory
        </button>

        {/* Hostel header */}
        <div className="hostel-header card">
          <div className="hostel-header-body">
            <div className="hostel-icon-lg">
              <Building2 size={26} />
            </div>

            <div className="hostel-meta">
              <div className="hostel-title-row">
                <h1>{hostel.name}</h1>
                <span className="verified-chip">
                  <CheckCircle2 size={12} /> Campus Verified
                </span>
              </div>

              <p className="hostel-location">
                <MapPin size={13} /> {hostel.location}
              </p>

              {amenities.length > 0 && (
                <div className="amenity-row">
                  {amenities.map((a) => (
                    <span key={a} className="amenity-chip">{a}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {hostel.description && (
            <p className="hostel-description">{hostel.description}</p>
          )}

          {(hostel.contact_email || hostel.contact_phone) && (
            <div className="hostel-contact">
              {hostel.contact_email && (
                <span className="contact-item">
                  <Mail size={13} /> {hostel.contact_email}
                </span>
              )}
              {hostel.contact_phone && (
                <span className="contact-item">
                  <Phone size={13} /> {hostel.contact_phone}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Rooms section */}
        <section className="rooms-section">
          <div className="rooms-section-top">
            <div>
              <h2>Available Rooms</h2>
              <p className="subtext">Select a room to view rates and submit a booking application</p>
            </div>

            <div className="room-filter-group">
              <select
                className="form-input room-filter-select"
                value={filter.roomType}
                onChange={(e) => handleFilterChange({ roomType: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="triple">Triple</option>
                <option value="suite">Suite</option>
              </select>

              <select
                className="form-input room-filter-select"
                value={filter.status}
                onChange={(e) => handleFilterChange({ status: e.target.value })}
              >
                <option value="available">Available Only</option>
                <option value="">All Statuses</option>
                <option value="booked">Booked</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {rooms.length === 0 ? (
            <div className="empty-state card">
              <BedDouble size={36} />
              <h3>No Rooms Match</h3>
              <p>Try adjusting your filters to see more options.</p>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => handleFilterChange({ status: '', roomType: '' })}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {rooms.map((room) => (
                <div key={room.id} className="room-card card card-hover">
                  <div className="room-card-top">
                    <div>
                      <span className="room-number">Room {room.room_number}</span>
                      <span className="room-type-label">
                        {ROOM_TYPE_LABELS[room.room_type] || room.room_type}
                      </span>
                    </div>
                    <StatusBadge status={room.status} />
                  </div>

                  <div className="room-capacity">
                    <Users size={13} /> Capacity: {room.capacity} student{room.capacity > 1 ? 's' : ''}
                  </div>

                  {room.description && (
                    <p className="room-desc">{room.description}</p>
                  )}

                  <div className="room-card-footer">
                    <div className="room-price-group">
                      <span className="room-price">{formatCurrency(room.price_per_semester)}</span>
                      <span className="room-price-sub">/ semester</span>
                    </div>

                    {user?.role === 'student' && room.status === 'available' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/book/${room.id}`, { state: { room, hostel } })}
                      >
                        Reserve
                      </button>
                    )}

                    {!user && room.status === 'available' && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => navigate('/login')}
                      >
                        Sign In to Book
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      <style>{`
        .back-btn { margin-bottom: 1.25rem; }

        /* ── Hostel header ──────────────────────────────────── */
        .hostel-header {
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .hostel-header-body {
          display: flex;
          gap: 1.1rem;
          align-items: flex-start;
        }

        .hostel-icon-lg {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background: var(--blue-50);
          border: 1px solid var(--blue-100);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--blue-600);
          flex-shrink: 0;
        }

        .hostel-meta {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .hostel-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .hostel-title-row h1 { font-size: 1.5rem; }

        .verified-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.2rem 0.55rem;
          font-size: 0.72rem;
          font-weight: 600;
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          border-radius: 999px;
          color: var(--success-text);
        }

        .hostel-location {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .amenity-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }

        .amenity-chip {
          font-size: 0.72rem;
          padding: 0.15rem 0.55rem;
          background: var(--surface-subtle);
          border: 1px solid var(--border-medium);
          border-radius: 999px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .hostel-description {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.65;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .hostel-contact {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.825rem;
          color: var(--text-muted);
        }

        /* ── Rooms section ──────────────────────────────────── */
        .rooms-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .rooms-section-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .room-filter-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .room-filter-select {
          padding: 0.4rem 0.7rem;
          font-size: 0.825rem;
          width: auto;
          min-width: 130px;
          background: var(--surface-card);
        }

        /* ── Room card ──────────────────────────────────────── */
        .room-card {
          padding: 1.15rem;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .room-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .room-number {
          display: block;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .room-type-label {
          display: block;
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 0.1rem;
        }

        .room-capacity {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.825rem;
          color: var(--text-secondary);
        }

        .room-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .room-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-subtle);
          padding-top: 0.7rem;
          margin-top: auto;
        }

        .room-price-group { display: flex; align-items: baseline; gap: 0.2rem; }
        .room-price { font-size: 1.05rem; font-weight: 700; color: var(--emerald-600); }
        .room-price-sub { font-size: 0.75rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
