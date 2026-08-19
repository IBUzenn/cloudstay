import { Link } from 'react-router-dom';
import { BookOpen, AlertCircle } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Manager Dashboard</h1>

        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle size={32} color="var(--brand-400)" />
            <div>
              <h3 style={{ marginBottom: '0.25rem' }}>Welcome to the Manager Portal</h3>
              <p style={{ color: 'var(--text-secondary)' }}>You have permission to view and review bookings.</p>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
            <Link to="/admin/bookings" className="btn btn-primary">
              <BookOpen size={16} /> Manage Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
