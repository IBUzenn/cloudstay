import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="page-wrapper flex items-center justify-between">
      <div className="container" style={{ maxWidth: 540 }}>
        <div className="card empty-state fade-in" style={{ padding: '3.5rem 2rem' }}>
          <div className="error-badge">404</div>
          <HelpCircle size={48} className="error-icon" />
          <h2>Page Not Found</h2>
          <p style={{ color: 'var(--slate-400)', fontSize: '0.925rem' }}>
            The page you are looking for does not exist or has been moved.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Link to="/" className="btn btn-primary btn-sm">
              <Home size={15} /> Return Home
            </Link>
            <Link to="/hostels" className="btn btn-outline btn-sm">
              Browse Hostels
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        .error-badge {
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 0.25rem 0.75rem;
          background: rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-full);
          color: var(--brand-300);
        }
        .error-icon {
          color: var(--brand-400);
          opacity: 0.8 !important;
        }
      `}</style>
    </div>
  );
}
