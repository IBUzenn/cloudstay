import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { User, Mail, CreditCard, Save, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm]       = useState({ name: user?.name || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Full name cannot be empty.');
    setLoading(true);
    try {
      await new Promise(res => setTimeout(res, 300));
      updateUser({ name: form.name });
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);

  return (
    <div className="page-wrapper">
      <div className="container profile-container">

        <div className="profile-page-header">
          <h1>Account Profile & Settings</h1>
          <p className="subtext">Manage your personal identification details and account preferences</p>
        </div>

        <div className="profile-layout">

          {/* Identity Card (Left Sidebar — Deep Navy Panel) */}
          <aside className="identity-sidebar">
            <div className="identity-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="identity-info">
              <p className="identity-name">{user?.name}</p>
              <p className="identity-email">{user?.email}</p>
              <span className="identity-role-badge">
                <ShieldCheck size={12} /> {roleLabel} Account
              </span>
            </div>
          </aside>

          {/* Edit Form (Right Main Panel — White Card) */}
          <div className="profile-form-card card">
            <div className="form-card-header">
              <h2>Personal Information</h2>
              <p className="subtext">Update your registered display name for hostel applications</p>
            </div>

            <form onSubmit={handleSave} className="profile-form">
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <div className="input-with-icon">
                  <User size={16} className="field-icon" />
                  <input
                    id="profile-name"
                    type="text"
                    className="form-input has-icon"
                    value={form.name}
                    onChange={(e) => setForm({ name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="field-icon" />
                  <input
                    id="profile-email"
                    type="email"
                    className="form-input has-icon"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
                <p className="field-note">Email address is locked to your university account</p>
              </div>

              {user?.role === 'student' && (
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-studentid">Student ID</label>
                  <div className="input-with-icon">
                    <CreditCard size={16} className="field-icon" />
                    <input
                      id="profile-studentid"
                      type="text"
                      className="form-input has-icon"
                      value={user?.student_id || 'STU-OFFICIAL'}
                      disabled
                    />
                  </div>
                  <p className="field-note">Student ID is assigned by university administration</p>
                </div>
              )}

              <div className="form-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || form.name.trim() === user?.name}
                >
                  <Save size={15} /> {loading ? 'Saving Changes…' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      <style>{`
        .profile-container { max-width: 900px; }

        .profile-page-header { margin-bottom: 1.75rem; }

        .profile-layout {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 1.75rem;
          align-items: start;
        }

        /* ── Identity Sidebar (Deep Navy Panel) ───────────────── */
        .identity-sidebar {
          background: #102A43;
          border: 1px solid #243B53;
          border-radius: var(--radius-md);
          padding: 2rem 1.25rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
          color: #F8FAFC;
          box-shadow: var(--shadow-sm);
        }

        .identity-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #2563EB;
          border: 3px solid #38BDF8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .identity-info {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          align-items: center;
        }

        .identity-name {
          font-size: 1.05rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .identity-email {
          font-size: 0.8rem;
          color: #9FB3C8;
          word-break: break-all;
        }

        .identity-role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.4rem;
          font-size: 0.725rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #38BDF8;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.3);
          padding: 0.2rem 0.65rem;
          border-radius: 999px;
        }

        /* ── Form Card (Main Right Panel) ─────────────────────── */
        .profile-form-card { padding: 1.75rem; }

        .form-card-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 1.35rem;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .field-icon {
          position: absolute;
          left: 0.85rem;
          color: var(--text-muted);
          pointer-events: none;
        }

        .has-icon { padding-left: 2.4rem; }

        .field-note {
          font-size: 0.775rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }

        .form-footer {
          display: flex;
          justify-content: flex-end;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          margin-top: 0.5rem;
        }

        @media (max-width: 680px) {
          .profile-layout { grid-template-columns: 1fr; }
          .identity-sidebar { flex-direction: row; text-align: left; justify-content: flex-start; }
          .identity-info { align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
