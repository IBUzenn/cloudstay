import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, UserCheck, ShieldCheck, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/common/Logo';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const fillDemo = (email, password) => {
    setForm({ email, password });
    setErrors({});
    toast.success('Demo credentials filled.');
  };

  const validate = () => {
    const errs = {};
    if (!form.email)    errs.email    = 'Email is required.';
    if (!form.password) errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      if (user.role === 'admin')        navigate('/admin');
      else if (user.role === 'manager') navigate('/manager');
      else                              navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <Logo size={36} variant="dark" showText={true} subtitle={true} />
          <h2 className="auth-title">Sign In to Account</h2>
          <p className="subtext">Enter your credentials to access your hostel reservation portal</p>
        </div>

        {/* Demo Login Helper Panel */}
        <div className="demo-panel">
          <span className="demo-label">Quick Demo Access:</span>
          <div className="demo-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo('abena.mensah@student.edu', 'Student@1234')}
            >
              <UserCheck size={13} /> Student
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo('admin@cloudstay.edu', 'Admin@1234')}
            >
              <KeyRound size={13} /> Admin
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => fillDemo('manager.blueblock@cloudstay.edu', 'Admin@1234')}
            >
              <ShieldCheck size={13} /> Manager
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="field-wrap">
              <Mail size={16} className="field-icon" />
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input has-icon${errors.email ? ' error' : ''}`}
                placeholder="you@student.edu"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="field-wrap">
              <Lock size={16} className="field-icon" />
              <input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className={`form-input has-icon has-right-btn${errors.password ? ' error' : ''}`}
                placeholder="••••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPwd(!showPwd)}
                aria-label="Toggle password visibility"
              >
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '0.25rem' }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer-note">
          Don't have a student account? <Link to="/register">Register here</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 64px - 180px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
        }

        .auth-card {
          padding: 2.25rem;
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 1.35rem;
          border-top: 4px solid var(--navy-primary);
        }

        .auth-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
        }

        .auth-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--navy-primary);
          margin-top: 0.25rem;
        }

        .demo-panel {
          background: var(--surface-blue);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 0.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .demo-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--navy-primary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .demo-actions {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .field-wrap {
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
        .has-right-btn { padding-right: 2.5rem; }

        .toggle-pwd-btn {
          position: absolute;
          right: 0.75rem;
          color: var(--text-muted);
          display: flex;
          padding: 0.2rem;
        }
        .toggle-pwd-btn:hover { color: var(--navy-primary); }

        .auth-footer-note {
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
          border-top: 1px solid var(--border-subtle);
          padding-top: 1rem;
        }

        .auth-footer-note a {
          color: var(--blue-primary);
          font-weight: 700;
        }
        .auth-footer-note a:hover { text-decoration: underline; }
      `}</style>
    </main>
  );
}
