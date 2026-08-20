import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: 480 }}>
        <div className="card empty-state" style={{ padding: '3rem 1.5rem' }}>
          <div className="error-badge">404 NOT FOUND</div>
          <HelpCircle size={44} className="error-icon" />
          <h2>Page Not Found</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            The page you are looking for does not exist or has been moved.
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
            <Link to="/" className="btn btn-primary btn-sm">
              <Home size={14} /> Return Home
            </Link>
            <Link to="/hostels" className="btn btn-outline btn-sm">
              Browse Hostels
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .error-badge {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 0.2rem 0.6rem;
          background: var(--blue-50);
          border: 1px solid var(--blue-200);
          border-radius: 999px;
          color: var(--blue-700);
        }
        .error-icon {
          color: var(--blue-600);
        }
      `}</style>
    </div>
  );
}
