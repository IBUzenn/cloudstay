import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  ChevronRight,
  Wifi,
  Coffee,
  Car,
  Wind,
  Shield,
  BedDouble,
  X
} from 'lucide-react';
import { hostelApi } from '../../api';
import Spinner, { SkeletonCard } from '../../components/common/Spinner';

const AMENITY_ICONS = {
  WiFi: <Wifi size={13} />,
  Parking: <Car size={13} />,
  Cafeteria: <Coffee size={13} />,
  'Air Conditioning': <Wind size={13} />,
  Security: <Shield size={13} />,
};

export default function HostelListingPage() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [query,   setQuery]   = useState('');
  const [selectedAmenity, setSelectedAmenity] = useState('');

  useEffect(() => {
    const fetchHostels = async () => {
      setLoading(true);
      try {
        const res = await hostelApi.getAll({ location: query || undefined });
        setHostels(res.data.data || []);
      } catch (err) {
        setHostels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search.trim());
  };

  const clearSearch = () => {
    setSearch('');
    setQuery('');
    setSelectedAmenity('');
  };

  const filteredHostels = hostels.filter(h => {
    if (!selectedAmenity) return true;
    const list = Array.isArray(h.amenities) ? h.amenities : [];
    return list.includes(selectedAmenity);
  });

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* Header Hero Banner — Tinted Navy/Blue Surface */}
        <div className="dir-hero-banner">
          <div className="dir-hero-text">
            <h1>Campus Hostels Directory</h1>
            <p>Browse available student accommodation blocks, view room counts, and submit allocation requests</p>
          </div>
          {!loading && (
            <div className="dir-count-pill">
              <Building2 size={15} />
              <span>{filteredHostels.length} {filteredHostels.length === 1 ? 'Hostel' : 'Hostels'} Listed</span>
            </div>
          )}
        </div>

        {/* Filter Toolbar — Soft Tinted Panel */}
        <div className="filter-toolbar-panel">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search hostel name or campus location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input search-field"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="clear-btn" aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary search-submit">
              Search
            </button>
          </form>

          <div className="filter-chips-row">
            <span className="filter-label-text">Facilities:</span>
            {['WiFi', 'Air Conditioning', 'Cafeteria', 'Parking', 'Security'].map(amenity => (
              <button
                key={amenity}
                type="button"
                className={`filter-chip${selectedAmenity === amenity ? ' chip-active' : ''}`}
                onClick={() => setSelectedAmenity(selectedAmenity === amenity ? '' : amenity)}
              >
                {AMENITY_ICONS[amenity]} {amenity}
              </button>
            ))}
            {selectedAmenity && (
              <button type="button" onClick={() => setSelectedAmenity('')} className="chip-clear-btn">
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Hostel Cards Grid */}
        {loading ? (
          <div className="grid-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredHostels.length === 0 ? (
          <div className="empty-state card">
            <Building2 size={44} />
            <h3>No Hostels Match Your Criteria</h3>
            <p>We couldn't find any campus hostels matching your search query or facility filter.</p>
            {(query || selectedAmenity) && (
              <button className="btn btn-outline btn-sm" onClick={clearSearch}>
                Clear Filters & Show All
              </button>
            )}
          </div>
        ) : (
          <div className="grid-3 hostel-grid">
            {filteredHostels.map((h) => (
              <HostelCard key={h.id} hostel={h} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* ── Hero Banner Header ────────────────────────────────── */
        .dir-hero-banner {
          background: #102A43;
          border: 1px solid #243B53;
          border-radius: var(--radius-md);
          padding: 1.75rem 2rem;
          margin-bottom: 1.5rem;
          color: #F8FAFC;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.25rem;
          box-shadow: var(--shadow-sm);
        }

        .dir-hero-text h1 {
          font-size: 1.65rem;
          color: #FFFFFF;
          margin-bottom: 0.25rem;
        }

        .dir-hero-text p {
          color: #9FB3C8;
          font-size: 0.925rem;
          max-width: 640px;
        }

        .dir-count-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.85rem;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 999px;
          color: #38BDF8;
          font-size: 0.8rem;
          font-weight: 700;
          white-space: nowrap;
        }

        /* ── Filter Toolbar Panel ──────────────────────────────── */
        .filter-toolbar-panel {
          background: var(--surface-blue);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.1rem 1.25rem;
          margin-bottom: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          box-shadow: var(--shadow-sm);
        }

        .search-form {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .search-input-wrap {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .search-field {
          padding-left: 2.5rem;
          padding-right: 2.2rem;
          background: #FFFFFF;
          border-color: var(--border-subtle);
          box-shadow: inset 0 1px 2px rgba(16, 42, 67, 0.04);
        }

        .clear-btn {
          position: absolute;
          right: 0.75rem;
          color: var(--text-muted);
          padding: 0.2rem;
          display: flex;
        }
        .clear-btn:hover { color: var(--navy-primary); }

        .search-submit { flex-shrink: 0; }

        /* ── Filter Chips Row ──────────────────────────────────── */
        .filter-chips-row {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          flex-wrap: wrap;
          padding-top: 0.65rem;
          border-top: 1px solid var(--border-medium);
        }

        .filter-label-text {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--navy-primary);
          margin-right: 0.25rem;
          white-space: nowrap;
        }

        .filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.7rem;
          font-size: 0.775rem;
          font-weight: 600;
          background: #FFFFFF;
          border: 1px solid var(--border-subtle);
          border-radius: 999px;
          color: var(--text-secondary);
          transition: all 140ms ease-in-out;
          white-space: nowrap;
        }

        .filter-chip:hover {
          border-color: var(--blue-primary);
          color: var(--blue-primary);
          background: #FFFFFF;
        }

        .filter-chip.chip-active {
          background: var(--navy-primary);
          border-color: var(--navy-primary);
          color: #FFFFFF;
        }

        .chip-clear-btn {
          font-size: 0.775rem;
          color: var(--blue-primary);
          font-weight: 600;
          text-decoration: underline;
          padding: 0.15rem 0.4rem;
        }
        .chip-clear-btn:hover { color: var(--navy-primary); }

        /* ── Hostel Cards Grid ─────────────────────────────────── */
        .hostel-grid { align-items: stretch; }
      `}</style>
    </div>
  );
}

function HostelCard({ hostel }) {
  const amenities   = Array.isArray(hostel.amenities) ? hostel.amenities : [];
  const isAvailable = hostel.available_rooms > 0;

  return (
    <Link to={`/hostels/${hostel.id}`} className="hostel-card card card-hover">

      <div className="hc-header">
        <div className="hc-icon-box">
          <Building2 size={20} />
        </div>
        <span className={`avail-badge ${isAvailable ? 'avail-yes' : 'avail-no'}`}>
          <span className="status-dot" />
          {isAvailable ? `${hostel.available_rooms} Rooms Available` : 'Fully Booked'}
        </span>
      </div>

      <div className="hc-content">
        <h3 className="hc-name">{hostel.name}</h3>
        <p className="hc-location">
          <MapPin size={13} /> {hostel.location}
        </p>

        {hostel.description && (
          <p className="hc-desc">
            {hostel.description.length > 95
              ? `${hostel.description.substring(0, 95)}…`
              : hostel.description}
          </p>
        )}

        <div className="hc-rooms-panel">
          <div className="hc-room-stat">
            <span className="stat-num">{hostel.available_rooms}</span>
            <span className="stat-lbl">Available</span>
          </div>
          <div className="hc-stat-divider" />
          <div className="hc-room-stat">
            <span className="stat-num">{hostel.total_rooms}</span>
            <span className="stat-lbl">Total Rooms</span>
          </div>
        </div>

        {amenities.length > 0 && (
          <div className="hc-amenities">
            {amenities.slice(0, 4).map((a) => (
              <span key={a} className="amenity-tag">
                {AMENITY_ICONS[a] || <BedDouble size={11} />} {a}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="amenity-tag">+{amenities.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      <div className="hc-footer">
        <span>View Rooms & Rates</span>
        <ChevronRight size={15} className="hc-arrow" />
      </div>

      <style>{`
        .hostel-card {
          padding: 1.35rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-decoration: none;
          border-top: 3px solid var(--navy-primary);
        }

        .hc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .hc-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          background: var(--surface-blue);
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--navy-primary);
          flex-shrink: 0;
        }

        .avail-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
          font-size: 0.725rem;
          font-weight: 700;
        }

        .avail-yes {
          background: var(--success-bg);
          color: var(--success-text);
          border: 1px solid var(--success-border);
        }
        .avail-yes .status-dot { background: var(--success-text); }

        .avail-no {
          background: var(--error-bg);
          color: var(--error-text);
          border: 1px solid var(--error-border);
        }
        .avail-no .status-dot { background: var(--error-text); }

        .hc-content {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          flex: 1;
        }

        .hc-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy-primary);
          line-height: 1.3;
        }

        .hc-location {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.825rem;
          color: var(--text-secondary);
        }

        .hc-desc {
          font-size: 0.825rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .hc-rooms-panel {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: var(--surface-blue);
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          margin-top: 0.2rem;
        }

        .hc-room-stat {
          display: flex;
          flex-direction: column;
        }

        .stat-num {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--navy-primary);
          line-height: 1;
        }

        .stat-lbl {
          font-size: 0.65rem;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-top: 0.15rem;
        }

        .hc-stat-divider {
          width: 1px;
          height: 24px;
          background: var(--border-medium);
          flex-shrink: 0;
        }

        .hc-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-top: 0.2rem;
        }

        .amenity-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.725rem;
          padding: 0.15rem 0.5rem;
          background: var(--surface-warm);
          border: 1px solid var(--border-subtle);
          border-radius: 999px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .hc-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-subtle);
          padding-top: 0.75rem;
          margin-top: auto;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--blue-primary);
        }

        .hc-arrow { transition: transform 140ms; }
        .hostel-card:hover .hc-arrow { transform: translateX(3px); }
      `}</style>
    </Link>
  );
}
