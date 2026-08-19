import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="empty-state">
        <ShieldAlert size={64} style={{ color: 'var(--error-400)', opacity: 0.8 }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>403</h1>
        <h2 style={{ marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 400 }}>
          You do not have permission to view this page. If you believe this is an error, please contact support.
        </p>
        <Link to="/" className="btn btn-primary">Return Home</Link>
      </div>
    </div>
  );
}
