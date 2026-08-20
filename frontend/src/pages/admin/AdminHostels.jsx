import React from 'react';
import { Building2, Plus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminHostels() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-hostels-header">
          <div>
            <h1>Manage Campus Hostels</h1>
            <p className="subtext">
              View registered hostels, room counts, and property details
            </p>
          </div>

          <button className="btn btn-primary" disabled>
            <Plus size={15} /> Add New Hostel (Phase 2)
          </button>
        </div>

        <div className="card empty-state" style={{ padding: '3.5rem 1.5rem' }}>
          <div className="empty-icon-badge">
            <Building2 size={36} />
          </div>
          <h3>Hostel Property Management</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: 460 }}>
            Full CRUD operations for adding new hostel blocks and room allocations are scheduled for Phase 2 system updates. Existing hostels are active and available in public listings.
          </p>

          <div style={{ marginTop: '1rem' }}>
            <Link to="/hostels" className="btn btn-outline btn-sm">
              <ExternalLink size={14} /> View Live Public Hostel Directory
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .admin-hostels-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .empty-icon-badge {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--blue-50);
          border: 1px solid var(--blue-200);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--blue-600);
          margin-bottom: 0.75rem;
        }
      `}</style>
    </div>
  );
}
