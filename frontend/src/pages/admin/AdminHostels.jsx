import React from 'react';
import { Building2, Plus, Info, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminHostels() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="admin-hostels-header fade-in">
          <div>
            <h1>Manage Campus Hostels</h1>
            <p className="subtext">
              View registered hostels, room counts, and property details
            </p>
          </div>

          <button className="btn btn-primary" disabled>
            <Plus size={16} /> Add New Hostel (Phase 2)
          </button>
        </div>

        <div className="card empty-state fade-in" style={{ padding: '4rem 2rem' }}>
          <div className="empty-icon-badge">
            <Building2 size={44} />
          </div>
          <h3>Hostel Property Management</h3>
          <p style={{ color: 'var(--slate-400)', maxWidth: 480 }}>
            Full CRUD operations for adding new hostel blocks and room allocations are scheduled for Phase 2 system updates. Existing hostels are active and available in public listings.
          </p>

          <div style={{ marginTop: '1.25rem' }}>
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
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .subtext {
          color: var(--slate-400);
          font-size: 0.9rem;
          margin-top: 0.2rem;
        }

        .empty-icon-badge {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--brand-400);
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
