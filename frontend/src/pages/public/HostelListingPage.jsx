import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Building2, ChevronRight, Users, Wifi, Coffee, Car, Wind, Star } from 'lucide-react';
import { hostelApi } from '../../api';
import Spinner from '../../components/common/Spinner';

const AMENITY_ICONS = { WiFi: <Wifi size={14}/>, Parking: <Car size={14}/>, Cafeteria: <Coffee size={14}/>, 'Air Conditioning': <Wind size={14}/> };

export default function HostelListingPage() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [query,   setQuery]   = useState('');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await hostelApi.getAll({ location: query || undefined });
        setHostels(res.data.data || []);
      } catch { setHostels([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search.trim());
  };

  return (
    <div>
      {/* Hero */}
      <section className="listing-hero">
        <div className="container">
          <div className="hero-content fade-in">
            <h1>Find Your Perfect<br /><span className="text-gradient">University Hostel</span></h1>
            <p>Browse and book verified student accommodation in seconds.</p>
            <form onSubmit={handleSearch} className="search-bar">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search by name or location…"
                value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="container" style={{ paddingBottom: '4rem' }}>
        <div className="listing-header">
          <h2>{query ? `Results for "${query}"` : 'All Hostels'}</h2>
          <span className="hostel-count">{hostels.length} hostel{hostels.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? <Spinner /> : hostels.length === 0 ? (
          <div className="empty-state">
            <Building2 size={56} />
            <h3>No hostels found</h3>
            <p>{query ? 'Try a different search.' : 'No hostels are available at this time.'}</p>
            {query && <button className="btn btn-outline" onClick={() => { setSearch(''); setQuery(''); }}>Clear search</button>}
          </div>
        ) : (
          <div className="hostel-grid">
            {hostels.map((h) => <HostelCard key={h.id} hostel={h} />)}
          </div>
        )}
      </section>

      <style>{`
        .listing-hero { padding: 5rem 0 3rem; background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15), transparent); border-bottom: 1px solid var(--glass-border); }
        .hero-content { max-width: 620px; }
        .hero-content h1 { margin-bottom: 0.75rem; }
        .hero-content p  { color: var(--text-secondary); margin-bottom: 2rem; font-size: 1.05rem; }
        .search-bar  { display: flex; align-items: center; gap: 0.75rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 0.5rem 0.5rem 0.5rem 1rem; max-width: 520px; backdrop-filter: blur(12px); }
        .search-icon { color: var(--text-muted); flex-shrink: 0; }
        .search-input { flex: 1; background: none; border: none; outline: none; color: var(--text-primary); font-size: 0.95rem; }
        .search-input::placeholder { color: var(--text-muted); }
        .listing-header { display: flex; align-items: center; justify-content: space-between; padding: 2rem 0 1.25rem; }
        .hostel-count  { font-size: 0.875rem; color: var(--text-secondary); background: var(--surface-2); padding: 0.25rem 0.75rem; border-radius: var(--radius-full); }
        .hostel-grid   { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
      `}</style>
    </div>
  );
}

function HostelCard({ hostel }) {
  const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];
  return (
    <Link to={`/hostels/${hostel.id}`} className="hostel-card card">
      <div className="hostel-card-top">
        <div className="hostel-avatar"><Building2 size={28} /></div>
        <div>
          <h3 className="hostel-name">{hostel.name}</h3>
          <span className="hostel-location"><MapPin size={12} />{hostel.location}</span>
        </div>
      </div>

      <div className="hostel-stats">
        <div className="hostel-stat">
          <span className="stat-num" style={{ color: hostel.available_rooms > 0 ? 'var(--accent-400)' : 'var(--error-400)' }}>
            {hostel.available_rooms}
          </span>
          <span>Available</span>
        </div>
        <div className="hostel-stat">
          <span className="stat-num">{hostel.total_rooms}</span>
          <span>Total Rooms</span>
        </div>
      </div>

      {amenities.length > 0 && (
        <div className="hostel-amenities">
          {amenities.slice(0, 4).map((a) => (
            <span key={a} className="amenity-tag">{AMENITY_ICONS[a] || <Star size={11}/>} {a}</span>
          ))}
          {amenities.length > 4 && <span className="amenity-tag">+{amenities.length - 4}</span>}
        </div>
      )}

      <div className="hostel-cta">
        <span>{hostel.available_rooms > 0 ? 'View rooms' : 'Fully booked'}</span>
        <ChevronRight size={16} />
      </div>

      <style>{`
        .hostel-card { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; text-decoration: none; cursor: pointer; }
        .hostel-card-top { display: flex; gap: 1rem; align-items: flex-start; }
        .hostel-avatar { width: 48px; height: 48px; border-radius: var(--radius-md); background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(167,139,250,0.1)); display: flex; align-items: center; justify-content: center; color: var(--brand-400); flex-shrink: 0; }
        .hostel-name { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; color: var(--text-primary); }
        .hostel-location { display: flex; align-items: center; gap: 0.25rem; font-size: 0.8rem; color: var(--text-secondary); }
        .hostel-stats { display: flex; gap: 2rem; }
        .hostel-stat { display: flex; flex-direction: column; gap: 0.1rem; }
        .hostel-stat span:last-child { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
        .stat-num { font-size: 1.5rem; font-weight: 800; line-height: 1; }
        .hostel-amenities { display: flex; flex-wrap: wrap; gap: 0.375rem; }
        .amenity-tag { display: flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; padding: 0.2rem 0.6rem; background: rgba(255,255,255,0.04); border: 1px solid var(--glass-border); border-radius: var(--radius-full); color: var(--text-secondary); }
        .hostel-cta { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-weight: 500; color: var(--brand-400); border-top: 1px solid var(--glass-border); padding-top: 0.75rem; margin-top: 0.25rem; }
      `}</style>
    </Link>
  );
}
