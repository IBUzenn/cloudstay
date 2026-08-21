import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  MapPin,
  Users,
  BedDouble,
  Building2,
  CheckCircle2,
  Calendar,
  Shield,
  Wifi,
  Zap,
  BookOpen,
  Archive,
  Sun,
  Bath,
  Wind,
  Shirt,
  Video,
  Utensils,
  Car,
  Dumbbell,
  Maximize2,
  X,
  ChevronRight,
  ArrowRight,
  Info,
  Clock
} from 'lucide-react';
import { roomApi, hostelApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, ROOM_TYPE_LABELS } from '../../utils/helpers';
import { getRoomGallery, getRoomFacilities, getCampusProximity } from '../../utils/roomData';
import StatusBadge from '../../components/common/StatusBadge';
import Spinner from '../../components/common/Spinner';

export default function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [room,         setRoom]         = useState(null);
  const [hostel,       setHostel]       = useState(null);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // Gallery state
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const loadRoomData = async () => {
      setLoading(true);
      setError(null);
      try {
        const rRes = await roomApi.getById(roomId);
        const roomData = rRes.data.data;
        setRoom(roomData);

        if (roomData?.hostel_id) {
          const [hRes, simRes] = await Promise.all([
            hostelApi.getById(roomData.hostel_id),
            roomApi.getByHostel(roomData.hostel_id, { status: 'available' })
          ]);
          setHostel(hRes.data.data);
          
          // Filter out current room from similar list
          const others = (simRes.data.data || []).filter(r => r.id !== Number(roomId));
          setSimilarRooms(others.slice(0, 3));
        }
      } catch (err) {
        setError('Room details could not be loaded. Please check the URL.');
      } finally {
        setLoading(false);
      }
    };

    loadRoomData();
    window.scrollTo(0, 0);
  }, [roomId]);

  const photos = getRoomGallery(room, hostel);
  const roomFacilities = getRoomFacilities(room);
  const proximityPoints = getCampusProximity(hostel);

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e) => {
    if (!isLightboxOpen) return;
    if (e.key === 'Escape') setIsLightboxOpen(false);
    if (e.key === 'ArrowRight') setActivePhotoIdx((prev) => (prev + 1) % photos.length);
    if (e.key === 'ArrowLeft')  setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
  }, [isLightboxOpen, photos.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) return <Spinner fullScreen label="Loading room accommodation details…" />;

  if (error || !room) {
    return (
      <div className="page-wrapper container">
        <div className="card text-center error-card">
          <Info size={40} className="text-muted" />
          <h2>Room Not Found</h2>
          <p>{error || 'The requested room accommodation could not be located.'}</p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/hostels')}>
            Browse Hostel Directory
          </button>
        </div>
      </div>
    );
  }

  const hostelAmenities = Array.isArray(hostel?.amenities) ? hostel.amenities : [];
  const isAvailable = room.status === 'available';

  return (
    <div className="page-wrapper room-detail-wrapper">
      <div className="container">

        {/* Top Breadcrumb / Back Button */}
        <div className="breadcrumb-bar">
          <button className="btn btn-outline btn-sm back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={15} /> Back
          </button>
          <div className="breadcrumb-trail">
            <Link to="/hostels">Hostels</Link>
            <span className="sep">/</span>
            <Link to={`/hostels/${hostel?.id || room.hostel_id}`}>{hostel?.name || room.hostel_name}</Link>
            <span className="sep">/</span>
            <span className="current">Room {room.room_number}</span>
          </div>
        </div>

        {/* MAIN GRID LAYOUT */}
        <div className="room-layout-grid">
          
          {/* LEFT COLUMN — Main Content */}
          <div className="room-main-content">
            
            {/* SECTION A — Image Gallery */}
            <div className="gallery-card card">
              <div className="gallery-hero-container" onClick={() => setIsLightboxOpen(true)}>
                <img
                  src={photos[activePhotoIdx]}
                  alt={`Room ${room.room_number} interior photo ${activePhotoIdx + 1}`}
                  className="gallery-hero-img"
                />
                <button className="gallery-expand-btn" title="View Fullscreen">
                  <Maximize2 size={16} /> View Gallery ({photos.length} Photos)
                </button>
                <div className="gallery-photo-badge">
                  Photo {activePhotoIdx + 1} of {photos.length}
                </div>
              </div>

              {/* Thumbnails row */}
              <div className="gallery-thumbnails-row">
                {photos.map((photo, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${activePhotoIdx === idx ? 'active' : ''}`}
                    onClick={() => setActivePhotoIdx(idx)}
                  >
                    <img src={photo} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION B — Room Title & Overview Header */}
            <div className="room-header-card card">
              <div className="room-header-top">
                <div>
                  <div className="room-type-badge">
                    <Building2 size={13} /> {hostel?.name || room.hostel_name}
                  </div>
                  <h1 className="room-title">Room {room.room_number}</h1>
                  <p className="room-subtitle">
                    <MapPin size={14} /> {hostel?.location || room.hostel_location}
                  </p>
                </div>
                <div className="room-header-status">
                  <StatusBadge status={room.status} />
                  <span className="price-tag">{formatCurrency(room.price_per_semester)}<small>/sem</small></span>
                </div>
              </div>

              {/* Quick Spec Pills */}
              <div className="spec-pills-grid">
                <div className="spec-pill">
                  <BedDouble size={16} className="pill-icon" />
                  <div>
                    <span className="spec-label">Room Type</span>
                    <span className="spec-val">{ROOM_TYPE_LABELS[room.room_type] || room.room_type}</span>
                  </div>
                </div>

                <div className="spec-pill">
                  <Users size={16} className="pill-icon" />
                  <div>
                    <span className="spec-label">Capacity</span>
                    <span className="spec-val">{room.capacity} Student{room.capacity > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="spec-pill">
                  <Shield size={16} className="pill-icon" />
                  <div>
                    <span className="spec-label">Verification</span>
                    <span className="spec-val text-success">Campus Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION C — "What's Inside the Room?" */}
            <section className="detail-section card">
              <h2 className="section-title">
                <BedDouble size={20} className="title-icon" /> What's Inside the Room?
              </h2>
              <p className="section-sub">Personal amenities and workstation setup provided for each occupant.</p>

              <div className="facilities-grid">
                {roomFacilities.map((fac) => (
                  <div key={fac.id} className="facility-card">
                    <div className="facility-icon-box">
                      {fac.id === 'bed' && <BedDouble size={20} />}
                      {fac.id === 'desk' && <BookOpen size={20} />}
                      {fac.id === 'storage' && <Archive size={20} />}
                      {fac.id === 'power' && <Zap size={20} />}
                      {fac.id === 'wifi' && <Wifi size={20} />}
                      {fac.id === 'window' && <Sun size={20} />}
                      {fac.id === 'ensuite' && <Bath size={20} />}
                      {fac.id === 'ac' && <Wind size={20} />}
                    </div>
                    <div className="facility-info">
                      <span className="facility-name">{fac.name}</span>
                      <span className="facility-desc">{fac.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION D — Hostel & Block Facilities */}
            {hostelAmenities.length > 0 && (
              <section className="detail-section card">
                <h2 className="section-title">
                  <Building2 size={20} className="title-icon" /> Hostel & Block Amenities
                </h2>
                <p className="section-sub">Shared infrastructure provided across {hostel?.name || 'the hostel block'}.</p>

                <div className="hostel-amenities-list">
                  {hostelAmenities.map((amenity) => (
                    <div key={amenity} className="hostel-amenity-item">
                      <CheckCircle2 size={16} className="amenity-check-icon" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION E — Room Description & Accommodation Specs */}
            <section className="detail-section card">
              <h2 className="section-title">About Room {room.room_number}</h2>
              <div className="description-body">
                <p>
                  {room.description ||
                    `Room ${room.room_number} at ${hostel?.name || 'CloudStay Hostel'} is a well-appointed ${
                      ROOM_TYPE_LABELS[room.room_type] || room.room_type
                    } designed specifically for university students seeking a quiet, productive academic environment. The space balances dedicated personal study areas with comfortable sleeping quarters.`}
                </p>
                <p className="muted-text">
                  Occupants benefit from high-speed campus Wi-Fi, 24/7 security oversight, and direct access to shared hostel facilities including laundry and common study lounges.
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="specs-table">
                <div className="spec-row">
                  <span className="spec-key">Block / Hostel</span>
                  <span className="spec-value">{hostel?.name || room.hostel_name}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Room Number</span>
                  <span className="spec-value">{room.room_number}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Room Category</span>
                  <span className="spec-value">{ROOM_TYPE_LABELS[room.room_type] || room.room_type}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Occupancy Limit</span>
                  <span className="spec-value">{room.capacity} Student{room.capacity > 1 ? 's' : ''}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Semester Rate</span>
                  <span className="spec-value highlight">{formatCurrency(room.price_per_semester)}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-key">Utilities Included</span>
                  <span className="spec-value text-success">Water, Wi-Fi & Generator Power</span>
                </div>
              </div>
            </section>

            {/* SECTION F — Campus Location & Proximity */}
            <section className="detail-section card">
              <h2 className="section-title">
                <MapPin size={20} className="title-icon" /> Location & Campus Access
              </h2>
              <p className="section-sub">Conveniently situated near major academic departments and university services.</p>

              <div className="location-info-box">
                <div className="location-address">
                  <Building2 size={24} className="addr-icon" />
                  <div>
                    <h4>{hostel?.name}</h4>
                    <p>{hostel?.location}</p>
                  </div>
                </div>

                <div className="proximity-grid">
                  {proximityPoints.map((pt, i) => (
                    <div key={i} className="proximity-chip">
                      <Clock size={14} className="prox-icon" />
                      <div>
                        <span className="prox-label">{pt.label}</span>
                        <span className="prox-time">{pt.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT COLUMN — Sticky Booking Callout */}
          <div className="room-sidebar">
            <div className="booking-card card sticky-card">
              <div className="booking-card-header">
                <span className="rate-title">Semester Rate</span>
                <div className="rate-amount-row">
                  <span className="rate-amount">{formatCurrency(room.price_per_semester)}</span>
                  <span className="rate-period">/ semester</span>
                </div>
                <p className="rate-hint">Includes Wi-Fi, water supply & backup power</p>
              </div>

              <div className="booking-status-banner">
                <div className="status-indicator-row">
                  <span className={`status-dot ${isAvailable ? 'available' : 'unavailable'}`} />
                  <span className="status-text">
                    {isAvailable ? 'Available for Semester Reservation' : `Status: ${room.status}`}
                  </span>
                </div>
                <span className="capacity-meta">
                  <Users size={13} /> {room.capacity} Bed{room.capacity > 1 ? 's' : ''} Capacity
                </span>
              </div>

              {/* Action Button */}
              {isAvailable && user?.role === 'student' && (
                <button
                  className="btn btn-primary btn-lg w-full book-cta-btn"
                  onClick={() => navigate(`/book/${room.id}`, { state: { room, hostel } })}
                >
                  Reserve This Room <ArrowRight size={16} />
                </button>
              )}

              {isAvailable && !user && (
                <button
                  className="btn btn-primary btn-lg w-full book-cta-btn"
                  onClick={() => navigate('/login')}
                >
                  Sign In to Reserve <ArrowRight size={16} />
                </button>
              )}

              {!isAvailable && (
                <div className="unavailable-notice">
                  <p>This room is currently reserved or under maintenance.</p>
                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => navigate(`/hostels/${room.hostel_id}`)}
                  >
                    View Other Rooms in {hostel?.name || 'Hostel'}
                  </button>
                </div>
              )}

              <div className="booking-guarantees">
                <div className="guarantee-item">
                  <Shield size={14} className="g-icon" /> Official University Allocated Unit
                </div>
                <div className="guarantee-item">
                  <CheckCircle2 size={14} className="g-icon" /> Direct S3 Receipt Processing
                </div>
              </div>

              {/* Host contact */}
              {(hostel?.contact_email || hostel?.contact_phone) && (
                <div className="hostel-contact-box">
                  <span className="contact-head">Hostel Management Contact</span>
                  {hostel.contact_email && <p className="contact-line">{hostel.contact_email}</p>}
                  {hostel.contact_phone && <p className="contact-line">{hostel.contact_phone}</p>}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* SECTION H — Recommended / Similar Rooms */}
        {similarRooms.length > 0 && (
          <section className="similar-rooms-section">
            <div className="similar-header">
              <h2>You May Also Like</h2>
              <p>Explore other available accommodation in {hostel?.name}</p>
            </div>

            <div className="grid-3">
              {similarRooms.map((sRoom) => (
                <div
                  key={sRoom.id}
                  className="room-card card card-hover"
                  onClick={() => navigate(`/rooms/${sRoom.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="similar-img-thumb">
                    <img
                      src={getRoomGallery(sRoom, hostel)[0]}
                      alt={`Room ${sRoom.room_number}`}
                    />
                    <span className="thumb-status-badge">Available</span>
                  </div>

                  <div className="room-card-body">
                    <div className="room-card-top">
                      <div>
                        <span className="room-number">Room {sRoom.room_number}</span>
                        <span className="room-type-label">
                          {ROOM_TYPE_LABELS[sRoom.room_type] || sRoom.room_type}
                        </span>
                      </div>
                      <span className="room-price-sm">{formatCurrency(sRoom.price_per_semester)}</span>
                    </div>

                    <div className="room-capacity mt-2">
                      <Users size={13} /> {sRoom.capacity} Student{sRoom.capacity > 1 ? 's' : ''}
                    </div>

                    <div className="room-card-footer">
                      <span className="view-link">View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>
              <X size={24} />
            </button>

            <button
              className="lightbox-arrow left"
              onClick={() => setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length)}
            >
              <ChevronLeft size={28} />
            </button>

            <img
              src={photos[activePhotoIdx]}
              alt={`Room photo ${activePhotoIdx + 1}`}
              className="lightbox-img"
            />

            <button
              className="lightbox-arrow right"
              onClick={() => setActivePhotoIdx((prev) => (prev + 1) % photos.length)}
            >
              <ChevronRight size={28} />
            </button>

            <div className="lightbox-counter">
              Photo {activePhotoIdx + 1} of {photos.length} — Room {room.room_number}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM ACTION BAR */}
      {isAvailable && (
        <div className="mobile-sticky-bottom-bar hide-desktop">
          <div className="sticky-bar-info">
            <span className="sticky-price">{formatCurrency(room.price_per_semester)}</span>
            <span className="sticky-sub">Room {room.room_number} · Available</span>
          </div>
          {user?.role === 'student' ? (
            <button
              className="btn btn-primary btn-md sticky-cta-btn"
              onClick={() => navigate(`/book/${room.id}`, { state: { room, hostel } })}
            >
              Reserve This Room
            </button>
          ) : !user ? (
            <button
              className="btn btn-primary btn-md sticky-cta-btn"
              onClick={() => navigate('/login')}
            >
              Sign In to Reserve
            </button>
          ) : null}
        </div>
      )}

      {/* COMPONENT STYLES */}
      <style>{`
        .room-detail-wrapper {
          padding-bottom: 5rem;
        }

        .mobile-sticky-bottom-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #0B1F33;
          border-top: 1px solid #1E3A5F;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 90;
          box-shadow: 0 -4px 12px rgba(11, 31, 51, 0.3);
        }

        .sticky-bar-info {
          display: flex;
          flex-direction: column;
        }

        .sticky-price {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--emerald-400, #34D399);
        }

        .sticky-sub {
          font-size: 0.75rem;
          color: #9FB3C8;
        }

        .sticky-cta-btn {
          font-weight: 700;
          padding: 0.6rem 1.25rem;
          border-radius: var(--radius-sm);
        }

        .breadcrumb-bar {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .breadcrumb-trail {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .breadcrumb-trail a {
          color: var(--blue-600);
          font-weight: 500;
          text-decoration: none;
        }

        .breadcrumb-trail a:hover { text-decoration: underline; }
        .breadcrumb-trail .sep { color: var(--border-medium); }
        .breadcrumb-trail .current { font-weight: 600; color: var(--text-primary); }

        /* Grid layout */
        .room-layout-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.75rem;
          align-items: start;
        }

        @media (max-width: 992px) {
          .room-layout-grid {
            grid-template-columns: 1fr;
          }
        }

        .room-main-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Gallery Card */
        .gallery-card {
          overflow: hidden;
          padding: 0;
        }

        .gallery-hero-container {
          position: relative;
          width: 100%;
          height: 380px;
          background: var(--navy-900);
          cursor: pointer;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .gallery-hero-container { height: 260px; }
        }

        .gallery-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .gallery-hero-container:hover .gallery-hero-img {
          transform: scale(1.02);
        }

        .gallery-expand-btn {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: rgba(11, 31, 51, 0.85);
          backdrop-filter: blur(4px);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          cursor: pointer;
        }

        .gallery-photo-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(11, 31, 51, 0.8);
          color: #ffffff;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .gallery-thumbnails-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--surface-card);
        }

        .thumb-btn {
          height: 75px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          padding: 0;
          cursor: pointer;
          background: var(--navy-900);
        }

        .thumb-btn.active {
          border-color: var(--blue-600);
        }

        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Room Header Card */
        .room-header-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .room-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .room-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.825rem;
          font-weight: 600;
          color: var(--blue-600);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .room-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-top: 0.1rem;
        }

        .room-subtitle {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        .room-header-status {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
        }

        .price-tag {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--emerald-600);
        }

        .price-tag small {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        /* Spec Pills */
        .spec-pills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-subtle);
        }

        @media (max-width: 600px) {
          .spec-pills-grid { grid-template-columns: 1fr; }
        }

        .spec-pill {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0.9rem;
          background: var(--surface-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .pill-icon { color: var(--blue-600); flex-shrink: 0; }
        .spec-label { display: block; font-size: 0.75rem; color: var(--text-muted); }
        .spec-val { display: block; font-size: 0.875rem; font-weight: 700; color: var(--text-primary); }

        /* Detail Section */
        .detail-section {
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.2rem;
        }

        .title-icon { color: var(--blue-600); }
        .section-sub { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem; }

        /* Facilities Grid */
        .facilities-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .facilities-grid { grid-template-columns: 1fr; }
        }

        .facility-card {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 0.9rem;
          background: var(--surface-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
        }

        .facility-icon-box {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-sm);
          background: var(--blue-50);
          border: 1px solid var(--blue-100);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--blue-600);
          flex-shrink: 0;
        }

        .facility-name { display: block; font-size: 0.9rem; font-weight: 700; color: var(--text-primary); }
        .facility-desc { display: block; font-size: 0.775rem; color: var(--text-muted); margin-top: 0.15rem; }

        /* Hostel Amenities List */
        .hostel-amenities-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .hostel-amenity-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 0.85rem;
          background: var(--surface-subtle);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .amenity-check-icon { color: var(--teal-500); }

        /* Description & Specs */
        .description-body {
          font-size: 0.925rem;
          color: var(--text-secondary);
          line-height: 1.7;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .muted-text { color: var(--text-muted); font-size: 0.875rem; }

        .specs-table {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .spec-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-subtle);
          font-size: 0.875rem;
        }

        .spec-row:last-child { border-bottom: none; }
        .spec-row:nth-child(even) { background: var(--surface-subtle); }
        .spec-key { color: var(--text-muted); font-weight: 500; }
        .spec-value { color: var(--text-primary); font-weight: 600; }
        .spec-value.highlight { color: var(--emerald-600); font-weight: 700; }

        /* Location Box */
        .location-info-box {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .location-address {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .addr-icon { color: var(--blue-600); }
        .location-address h4 { font-size: 1.05rem; font-weight: 700; }
        .location-address p { font-size: 0.875rem; color: var(--text-muted); }

        .proximity-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .proximity-chip {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.65rem 0.85rem;
          background: var(--surface-subtle);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
        }

        .prox-icon { color: var(--blue-600); }
        .prox-label { display: block; font-size: 0.825rem; font-weight: 600; color: var(--text-primary); }
        .prox-time { display: block; font-size: 0.75rem; color: var(--text-muted); }

        /* Sidebar Booking Card */
        .sticky-card {
          position: sticky;
          top: 5rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .booking-card-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .rate-title { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); font-weight: 600; }
        .rate-amount-row { display: flex; align-items: baseline; gap: 0.3rem; margin-top: 0.2rem; }
        .rate-amount { font-size: 1.85rem; font-weight: 800; color: var(--emerald-600); }
        .rate-period { font-size: 0.85rem; color: var(--text-muted); }
        .rate-hint { font-size: 0.775rem; color: var(--text-muted); margin-top: 0.25rem; }

        .booking-status-banner {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          padding: 0.85rem;
          background: var(--surface-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .status-indicator-row { display: flex; align-items: center; gap: 0.5rem; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .status-dot.available { background: var(--emerald-500); box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2); }
        .status-dot.unavailable { background: var(--coral-500); }
        .status-text { font-size: 0.825rem; font-weight: 600; color: var(--text-primary); }
        .capacity-meta { font-size: 0.775rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.35rem; }

        .book-cta-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 700;
        }

        .booking-guarantees {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
        }

        .guarantee-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.775rem;
          color: var(--text-muted);
        }

        .g-icon { color: var(--teal-500); }

        .hostel-contact-box {
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.775rem;
        }

        .contact-head { display: block; font-weight: 600; color: var(--text-primary); margin-bottom: 0.2rem; }
        .contact-line { color: var(--text-muted); margin: 0; }

        /* Similar Rooms Section */
        .similar-rooms-section {
          margin-top: 3.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-subtle);
        }

        .similar-header { margin-bottom: 1.25rem; }
        .similar-header h2 { font-size: 1.35rem; font-weight: 800; }
        .similar-header p { font-size: 0.875rem; color: var(--text-muted); }

        .similar-img-thumb {
          position: relative;
          height: 140px;
          width: 100%;
          overflow: hidden;
          background: var(--navy-900);
        }

        .similar-img-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .thumb-status-badge {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(16, 185, 129, 0.9);
          color: #fff;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
        }

        .room-card-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .room-price-sm { font-size: 0.95rem; font-weight: 700; color: var(--emerald-600); }
        .view-link { font-size: 0.8rem; font-weight: 600; color: var(--blue-600); }

        /* Lightbox Modal */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(11, 31, 51, 0.94);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: var(--radius-md);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .lightbox-close {
          position: absolute;
          top: -3rem;
          right: 0;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }

        .lightbox-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .lightbox-arrow.left { left: -3.5rem; }
        .lightbox-arrow.right { right: -3.5rem; }

        @media (max-width: 768px) {
          .lightbox-arrow.left { left: 0.5rem; }
          .lightbox-arrow.right { right: 0.5rem; }
        }

        .lightbox-counter {
          color: #ffffff;
          font-size: 0.85rem;
          margin-top: 1rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
