import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card empty-state" style={{ padding: '3rem 1.5rem' }}>
          <div className="error-badge-403">403 ACCESS DENIED</div>
          <ShieldAlert size={44} className="error-icon-403" />
          <h2>Unauthorized Access</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            You do not have permission to view this resource. Please sign in with an authorized user account.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
            <Link to="/" className="btn btn-primary btn-sm">
              <Home size={14} /> Back to Safety
            </Link>
            <Link to="/login" className="btn btn-outline btn-sm">
              Switch Account
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .error-badge-403 {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 0.2rem 0.6rem;
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: 999px;
          color: var(--error-text);
        }
        .error-icon-403 {
          color: var(--error-text);
        }
      `}</style>
    </div>
  );
}
