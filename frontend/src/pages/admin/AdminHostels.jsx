import { Building2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminHostels() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1>Manage Hostels</h1>
          <button className="btn btn-primary" disabled>
            <Plus size={16} /> Add Hostel (Coming Soon)
          </button>
        </div>

        <div className="card empty-state">
          <Building2 size={48} color="var(--text-muted)" />
          <h3>Hostel Management</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Full CRUD operations for hostels and rooms will be available in Phase 2.</p>
          <Link to="/hostels" className="btn btn-outline" style={{ marginTop: '1rem' }}>View Public Listings</Link>
        </div>
      </div>
    </div>
  );
}
