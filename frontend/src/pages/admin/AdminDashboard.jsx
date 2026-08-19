import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { Users, Building2, BookOpen, DollarSign } from 'lucide-react';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getStats().then(res => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats) return <div className="page-wrapper"><div className="container"><p>Failed to load statistics.</p></div></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
        
        <div className="grid-4" style={{ marginBottom: '2rem' }}>
          {[
            { label: 'Total Students', value: stats.students?.total ?? stats.users ?? stats.students, color: 'var(--brand-400)',  icon: <Users size={20}/> },
            { label: 'Total Hostels',  value: stats.hostels?.total  ?? stats.hostels  ?? '—',         color: 'var(--accent-400)', icon: <Building2 size={20}/> },
            { label: 'Total Rooms',    value: stats.rooms?.total    ?? stats.rooms,                   color: '#38bdf8',           icon: <BookOpen size={20}/> },
            { label: 'Total Bookings', value: stats.bookings?.total ?? stats.bookings,                color: '#a78bfa',           icon: <DollarSign size={20}/> },
          ].map(s => (
            <div key={s.label} className="stat-card fade-in">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                <div className="stat-label">{s.label}</div>
                <div style={{ color: s.color, opacity: 0.7 }}>{s.icon}</div>
              </div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* You can add more dashboard widgets here later, like recent bookings or charts */}
      </div>
    </div>
  );
}
