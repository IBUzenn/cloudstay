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
  Sparkles,
  BedDouble,
  X,
  SlidersHorizontal
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

// Generates a reproducible visual gradient header for each hostel
const HOSTEL_GRADIENTS = [
  'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(30, 27, 75, 0.8) 100%)',
  'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(6, 78, 59, 0.8) 100%)',
  'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(88, 28, 135, 0.8) 100%)',
  'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(120, 53, 15, 0.8) 100%)',
];

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

  // Filter hostels locally by selected amenity tag if present
  const filteredHostels = hostels.filter(h => {
    if (!selectedAmenity) return true;
    const list = Array.isArray(h.amenities) ? h.amenities : [];
    return list.includes(selectedAmenity);
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="listing-hero">
        <div className="container hero-container fade-in">
          <div className="hero-badge">
            <Sparkles size={14} /> Official Student Housing Portal
          </div>
          <h1>
            Find & Reserve Your <br />
            <span className="text-gradient">Ideal University Hostel</span>
          </h1>
          <p className="hero-subtitle">
            Browse verified campus accommodations with real-time room availability and instant booking confirmation.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="search-box">
            <div className="search-input-group">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search hostel name or campus location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-field"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="clear-btn">
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-primary btn-lg">
              Search Hostels
            </button>
          </form>

          {/* Quick amenity filters */}
          <div className="quick-filter-tags">
            <span className="filter-label"><SlidersHorizontal size={13} /> Filter by:</span>
            {['WiFi', 'Air Conditioning', 'Cafeteria', 'Parking'].map(amenity => (
              <button
                key={amenity}
                type="button"
                className={`tag-filter-btn ${selectedAmenity === amenity ? 'active' : ''}`}
                onClick={() => setSelectedAmenity(selectedAmenity === amenity ? '' : amenity)}
              >
                {AMENITY_ICONS[amenity]} {amenity}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Listing Section */}
      <main className="container listing-body">
        <div className="listing-header">
          <div>
            <h2>
              {query ? `Search results for "${query}"` : 'All Hostels'}
            </h2>
            <p className="listing-subtext">
              Showing verified university residences for current semester allocation
            </p>
          </div>
          <span className="results-badge">
            {filteredHostels.length} Hostel{filteredHostels.length !== 1 ? 's' : ''} Available
          </span>
        </div>

        {loading ? (
          <div className="grid-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredHostels.length === 0 ? (
          <div className="empty-state card">
            <Building2 size={56} />
            <h3>No Hostels Found</h3>
            <p>We couldn't find any hostels matching your criteria.</p>
            {(query || selectedAmenity) && (
              <button className="btn btn-outline btn-sm" onClick={clearSearch}>
                Clear Search & Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid-3">
            {filteredHostels.map((h, idx) => (
              <HostelCard key={h.id} hostel={h} gradientIndex={idx} />
            ))}
          </div>
        )}
      </main>

      <style>{`
        .listing-hero {
          padding: 4.5rem 0 3.5rem;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.15), transparent 70%);
          border-bottom: 1px solid var(--border-subtle);
        }

        .hero-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 720px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.35rem 0.9rem;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.28);
          border-radius: var(--radius-full);
          color: var(--brand-300);
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }

        .hero-subtitle {
          color: var(--slate-300);
          font-size: 1.1rem;
          margin: 1rem 0 2rem;
          max-width: 580px;
        }

        .search-box {
          display: flex;
          gap: 0.75rem;
          width: 100%;
          max-width: 620px;
          background: var(--surface-card);
          padding: 0.5rem;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
        }

        .search-input-group {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--slate-400);
          pointer-events: none;
        }

        .search-field {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 2.75rem;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .clear-btn {
          position: absolute;
          right: 0.75rem;
          color: var(--slate-400);
          padding: 0.25rem;
        }
        .clear-btn:hover { color: var(--text-primary); }

        .quick-filter-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
        }

        .filter-label {
          color: var(--slate-400);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-weight: 500;
        }

        .tag-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          color: var(--slate-300);
          font-size: 0.775rem;
          transition: all var(--duration-fast);
        }
        .tag-filter-btn:hover, .tag-filter-btn.active {
          background: rgba(99, 102, 241, 0.15);
          border-color: var(--brand-500);
          color: var(--brand-300);
        }

        .listing-body {
          padding-top: 3rem;
          padding-bottom: 4rem;
        }

        .listing-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .listing-subtext {
          font-size: 0.875rem;
          color: var(--slate-400);
          margin-top: 0.25rem;
        }

        .results-badge {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.35rem 0.85rem;
          background: var(--surface-2);
          border-radius: var(--radius-full);
          color: var(--brand-300);
          border: 1px solid var(--border-subtle);
        }

        @media (max-width: 640px) {
          .search-box {
            flex-direction: column;
          }
          .search-box .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

function HostelCard({ hostel, gradientIndex }) {
  const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];
  const gradient = HOSTEL_GRADIENTS[gradientIndex % HOSTEL_GRADIENTS.length];
  const isAvailable = hostel.available_rooms > 0;
  const occupancyPercent = hostel.total_rooms > 0 
    ? Math.round(((hostel.total_rooms - hostel.available_rooms) / hostel.total_rooms) * 100)
    : 0;

  return (
    <Link to={`/hostels/${hostel.id}`} className="hostel-card card card-hover">
      {/* Card Header Visual Placeholder */}
      <div className="card-visual" style={{ background: gradient }}>
        <div className="visual-badge">
          <Building2 size={24} />
        </div>
        <div className="availability-chip" style={{ background: isAvailable ? 'var(--success-bg)' : 'var(--error-bg)', color: isAvailable ? 'var(--accent-400)' : 'var(--error-400)', borderColor: isAvailable ? 'var(--success-border)' : 'var(--error-border)' }}>
          <span className="status-dot" style={{ background: isAvailable ? 'var(--accent-400)' : 'var(--error-400)' }} />
          {isAvailable ? `${hostel.available_rooms} Rooms Free` : 'Fully Booked'}
        </div>
      </div>

      {/* Card Details */}
      <div className="card-content">
        <div className="hostel-title-row">
          <h3 className="hostel-name">{hostel.name}</h3>
          <span className="hostel-location">
            <MapPin size={13} /> {hostel.location}
          </span>
        </div>

        {hostel.description && (
          <p className="hostel-desc">
            {hostel.description.length > 90 ? `${hostel.description.substring(0, 90)}...` : hostel.description}
          </p>
        )}

        {/* Occupancy bar */}
        <div className="occupancy-bar-container">
          <div className="occupancy-label">
            <span>Occupancy Rate</span>
            <span>{occupancyPercent}% Booked</span>
          </div>
          <div className="occupancy-track">
            <div className="occupancy-fill" style={{ width: `${occupancyPercent}%` }} />
          </div>
        </div>

        {/* Amenities List */}
        {amenities.length > 0 && (
          <div className="hostel-amenity-list">
            {amenities.slice(0, 4).map((a) => (
              <span key={a} className="amenity-badge">
                {AMENITY_ICONS[a] || <BedDouble size={12} />} {a}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="amenity-badge count-tag">+{amenities.length - 4} more</span>
            )}
          </div>
        )}

        {/* Card Footer CTA */}
        <div className="card-footer">
          <span className="cta-text">Explore Rooms & Rates</span>
          <ChevronRight size={16} className="cta-icon" />
        </div>
      </div>

      <style>{`
        .hostel-card {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          text-decoration: none;
        }

        .card-visual {
          height: 110px;
          position: relative;
          padding: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-subtle);
        }

        .visual-badge {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: rgba(11, 15, 23, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .availability-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.7rem;
          border-radius: var(--radius-full);
          font-size: 0.725rem;
          font-weight: 600;
          border: 1px solid;
          backdrop-filter: blur(8px);
        }

        .card-content {
          padding: 1.35rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          flex: 1;
        }

        .hostel-title-row {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .hostel-name {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .hostel-location {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.825rem;
          color: var(--slate-400);
        }

        .hostel-desc {
          font-size: 0.85rem;
          color: var(--slate-400);
          line-height: 1.5;
        }

        .occupancy-bar-container {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .occupancy-label {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--slate-400);
          font-weight: 500;
        }

        .occupancy-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 3px;
          overflow: hidden;
        }

        .occupancy-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--brand-500), var(--accent-500));
          border-radius: 3px;
        }

        .hostel-amenity-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .amenity-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.725rem;
          padding: 0.2rem 0.6rem;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--slate-300);
        }

        .count-tag {
          color: var(--brand-300);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-subtle);
          padding-top: 0.85rem;
          margin-top: auto;
          color: var(--brand-400);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .hostel-card:hover .cta-icon {
          transform: translateX(4px);
        }
        .cta-icon {
          transition: transform var(--duration-fast);
        }
      `}</style>
    </Link>
  );
}
