import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { User, Mail, CreditCard, Shield, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm]      = useState({ name: user?.name || '' });
  const [loading, setLoading] = useState(false);

  // We are omitting API update route for simplicity; we'll simulate it via context.
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name cannot be empty.');
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(res => setTimeout(res, 500));
      updateUser({ name: form.name });
      toast.success('Profile updated successfully.');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 600 }}>
        <h1 style={{ marginBottom: '2rem' }}>My Profile</h1>

        <div className="card fade-in" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-500), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {getInitials(user?.name)}
            </div>
            <div>
              <h2 style={{ marginBottom: '0.25rem' }}>{user?.name}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="text" className="form-input" style={{ paddingLeft: '2.5rem' }} value={form.name} onChange={(e) => setForm({ name: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input type="email" className="form-input" style={{ paddingLeft: '2.5rem' }} value={user?.email} disabled />
              </div>
            </div>

            {user?.role === 'student' && (
              <div className="form-group">
                <label className="form-label">Student ID</label>
                <div style={{ position: 'relative' }}>
                  <CreditCard size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" className="form-input" style={{ paddingLeft: '2.5rem' }} value={user?.student_id || ''} disabled />
                </div>
              </div>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={loading || form.name === user?.name}>
                {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <Save size={16} />} Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
