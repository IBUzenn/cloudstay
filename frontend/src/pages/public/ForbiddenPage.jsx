import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="page-wrapper flex items-center justify-between">
      <div className="container" style={{ maxWidth: 540 }}>
        <div className="card empty-state fade-in" style={{ padding: '3.5rem 2rem' }}>
          <div className="error-badge-403">403 ACCESS DENIED</div>
          <ShieldAlert size={48} className="error-icon-403" />
          <h2>Unauthorized Access</h2>
          <p style={{ color: 'var(--slate-400)', fontSize: '0.925rem' }}>
            You do not have permission to view this resource. Please sign in with an authorized user account.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Link to="/" className="btn btn-primary btn-sm">
              <Home size={15} /> Back to Safety
            </Link>
            <Link to="/login" className="btn btn-outline btn-sm">
              Switch Account
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .error-badge-403 {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.75rem;
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: var(--radius-full);
          color: var(--error-400);
        }
        .error-icon-403 {
          color: var(--error-400);
          opacity: 0.8 !important;
        }
      `}</style>
    </div>
  );
}
