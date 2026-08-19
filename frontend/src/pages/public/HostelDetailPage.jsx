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
  Filter,
  CheckCircle2,
  Sparkles,
  Info
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

  if (loading) return <Spinner fullScreen label="Loading hostel details..." />;
  if (!hostel) return null;

  const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Navigation Breadcrumb */}
        <button
          className="btn btn-outline btn-sm back-button"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} /> Back to Hostels
        </button>

        {/* Hostel Header Banner */}
        <div className="hostel-detail-banner card fade-in">
          <div className="banner-top">
            <div className="hostel-badge-avatar">
              <Building2 size={36} />
            </div>

            <div className="hostel-meta-main">
              <div className="meta-header-row">
                <h1>{hostel.name}</h1>
                <span className="verified-chip">
                  <CheckCircle2 size={13} /> Verified Campus Residence
                </span>
              </div>

              <p className="location-text">
                <MapPin size={15} /> {hostel.location}
              </p>

              {/* Amenity Pills */}
              {amenities.length > 0 && (
                <div className="amenity-chip-container">
                  {amenities.map((a) => (
                    <span key={a} className="amenity-pill">
                      <Sparkles size={12} /> {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {hostel.description && (
            <p className="hostel-full-desc">{hostel.description}</p>
          )}

          {/* Contact Bar */}
          <div className="hostel-contact-bar">
            {hostel.contact_email && (
              <span className="contact-item">
                <Mail size={15} /> {hostel.contact_email}
              </span>
            )}
            {hostel.contact_phone && (
              <span className="contact-item">
                <Phone size={15} /> {hostel.contact_phone}
              </span>
            )}
          </div>
        </div>

        {/* Rooms Listing Section */}
        <section className="rooms-section">
          <div className="rooms-section-header">
            <div>
              <h2>Room Allocations & Rates</h2>
              <p className="section-subtext">
                Select a room type to review capacity and reserve for the upcoming semester
              </p>
            </div>

            {/* Filter Bar */}
            <div className="room-filters">
              <div className="filter-select-wrapper">
                <select
                  className="form-input filter-select"
                  value={filter.roomType}
                  onChange={(e) => handleFilterChange({ roomType: e.target.value })}
                >
                  <option value="">All Room Types</option>
                  <option value="single">Single Room</option>
                  <option value="double">Double Room</option>
                  <option value="triple">Triple Room</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div className="filter-select-wrapper">
                <select
                  className="form-input filter-select"
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
          </div>

          {/* Rooms Grid */}
          {rooms.length === 0 ? (
            <div className="empty-state card">
              <BedDouble size={48} />
              <h3>No Rooms Match Your Criteria</h3>
              <p>Try clearing your status or room type filters to view more options.</p>
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
                  <div className="room-card-header">
                    <div>
                      <span className="room-number">Room {room.room_number}</span>
                      <span className="room-type-tag">
                        {ROOM_TYPE_LABELS[room.room_type] || room.room_type}
                      </span>
                    </div>
                    <StatusBadge status={room.status} />
                  </div>

                  <div className="room-specs">
                    <span className="spec-item">
                      <Users size={14} /> Capacity: {room.capacity} Student{room.capacity > 1 ? 's' : ''}
                    </span>
                  </div>

                  {room.description && (
                    <p className="room-description">{room.description}</p>
                  )}

                  <div className="room-pricing-row">
                    <div>
                      <span className="price-tag">
                        {formatCurrency(room.price_per_semester)}
                      </span>
                      <span className="price-period">/ semester</span>
                    </div>

                    {user?.role === 'student' && room.status === 'available' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => navigate(`/book/${room.id}`, { state: { room, hostel } })}
                      >
                        Reserve Room
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
        .back-button {
          margin-bottom: 1.5rem;
        }

        .hostel-detail-banner {
          padding: 2.25rem;
          margin-bottom: 3rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .banner-top {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .hostel-badge-avatar {
          width: 68px;
          height: 68px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 24px rgba(99, 102, 241, 0.35);
          flex-shrink: 0;
        }

        .hostel-meta-main {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .meta-header-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .verified-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.7rem;
          background: var(--success-bg);
          border: 1px solid var(--success-border);
          border-radius: var(--radius-full);
          color: var(--accent-400);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .location-text {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--slate-300);
          font-size: 0.925rem;
        }

        .amenity-chip-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.25rem;
        }

        .amenity-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          padding: 0.25rem 0.65rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: var(--radius-full);
          color: var(--brand-300);
        }

        .hostel-full-desc {
          color: var(--slate-300);
          font-size: 0.95rem;
          line-height: 1.7;
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.25rem;
        }

        .hostel-contact-bar {
          display: flex;
          gap: 2rem;
          font-size: 0.875rem;
          color: var(--slate-400);
          border-top: 1px solid var(--border-subtle);
          padding-top: 1rem;
          flex-wrap: wrap;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .rooms-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .rooms-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 1.25rem;
        }

        .section-subtext {
          font-size: 0.875rem;
          color: var(--slate-400);
          margin-top: 0.25rem;
        }

        .room-filters {
          display: flex;
          gap: 0.75rem;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
          width: auto;
          min-width: 150px;
        }

        .room-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .room-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .room-number {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          display: block;
        }

        .room-type-tag {
          font-size: 0.8rem;
          color: var(--slate-400);
        }

        .room-specs {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: var(--slate-300);
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .room-description {
          font-size: 0.85rem;
          color: var(--slate-400);
          line-height: 1.5;
        }

        .room-pricing-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-subtle);
          padding-top: 1rem;
          margin-top: auto;
        }

        .price-tag {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--accent-400);
        }

        .price-period {
          font-size: 0.75rem;
          color: var(--slate-400);
          margin-left: 0.25rem;
        }
      `}</style>
    </div>
  );
}
