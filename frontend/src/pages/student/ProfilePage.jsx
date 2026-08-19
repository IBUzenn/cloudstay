import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { User, Mail, CreditCard, Shield, Save, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm]      = useState({ name: user?.name || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Name cannot be empty.');
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 400));
      updateUser({ name: form.name });
      toast.success('Account profile updated successfully.');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 style={{ marginBottom: '2rem' }}>Account Settings</h1>

        <div className="card fade-in" style={{ padding: '2.5rem' }}>
          {/* User Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="profile-info">
              <h2>{user?.name}</h2>
              <div className="role-chip">
                <Shield size={13} /> Role: {user?.role?.toUpperCase()}
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="form-stack">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <div className="input-icon-wrapper">
                <User size={16} className="input-icon" />
                <input
                  id="profile-name"
                  type="text"
                  className="form-input input-with-icon"
                  value={form.name}
                  onChange={(e) => setForm({ name: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">Email Address (Managed by System)</label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="profile-email"
                  type="email"
                  className="form-input input-with-icon disabled-input"
                  value={user?.email || ''}
                  disabled
                />
              </div>
            </div>

            {user?.role === 'student' && (
              <div className="form-group">
                <label className="form-label" htmlFor="profile-studentid">Student Identification ID</label>
                <div className="input-icon-wrapper">
                  <CreditCard size={16} className="input-icon" />
                  <input
                    id="profile-studentid"
                    type="text"
                    className="form-input input-with-icon disabled-input"
                    value={user?.student_id || 'STU-OFFICIAL'}
                    disabled
                  />
                </div>
              </div>
            )}

            <div className="actions-row">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || form.name === user?.name}
              >
                {loading ? (
                  <>
                    <span className="spinner" style={{ width: 16, height: 16 }} />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .profile-avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand-500), var(--accent-500));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 800;
          color: #ffffff;
          box-shadow: 0 0 24px rgba(99, 102, 241, 0.4);
          flex-shrink: 0;
        }

        .profile-info h2 {
          font-size: 1.4rem;
          margin-bottom: 0.35rem;
        }

        .role-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--brand-300);
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.28);
          padding: 0.2rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 0.9rem;
          color: var(--slate-400);
          pointer-events: none;
        }

        .input-with-icon {
          padding-left: 2.6rem;
        }

        .disabled-input {
          opacity: 0.65;
          cursor: not-allowed;
          background: rgba(15, 23, 42, 0.4);
        }

        .actions-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
