import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, Eye, EyeOff, ShieldCheck, UserCheck, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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
    toast.success(`Demo credentials filled! Click 'Sign In' to proceed.`);
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
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      if (user.role === 'admin')   navigate('/admin');
      else if (user.role === 'manager') navigate('/manager');
      else navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page-wrapper">
      <div className="auth-card-container card fade-in">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Building2 size={26} />
          </div>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your CloudStay account</p>
        </div>

        {/* Quick Fill Chips */}
        <div className="demo-fill-bar">
          <span className="demo-fill-title"><Sparkles size={13} /> Quick Fill Demo Account:</span>
          <div className="demo-chip-group">
            <button
              type="button"
              className="demo-chip"
              onClick={() => fillDemo('abena.mensah@student.edu', 'Student@1234')}
            >
              <UserCheck size={13} /> Student
            </button>
            <button
              type="button"
              className="demo-chip"
              onClick={() => fillDemo('admin@cloudstay.edu', 'Admin@1234')}
            >
              <KeyRound size={13} /> Admin
            </button>
            <button
              type="button"
              className="demo-chip"
              onClick={() => fillDemo('manager.blueblock@cloudstay.edu', 'Admin@1234')}
            >
              <ShieldCheck size={13} /> Manager
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={16} className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
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
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                name="password"
                type={showPwd ? 'text' : 'password'}
                className={`form-input input-with-icon input-with-right-btn ${errors.password ? 'error' : ''}`}
                placeholder="••••••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pwd-toggle-btn"
                onClick={() => setShowPwd(!showPwd)}
                aria-label="Toggle password visibility"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16 }} />
                Authenticating...
              </>
            ) : (
              'Sign In to Account'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="auth-footer-text">
          Don't have an account? <Link to="/register">Register student account</Link>
        </p>
      </div>

      <style>{`
        .auth-page-wrapper {
          min-height: calc(100vh - 70px - 120px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1rem;
        }

        .auth-card-container {
          padding: 2.75rem 2.25rem;
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .auth-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .auth-logo-badge {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
          margin-bottom: 1rem;
        }

        .auth-subtitle {
          color: var(--slate-400);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .demo-fill-bar {
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: var(--radius-md);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .demo-fill-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--brand-300);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .demo-chip-group {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .demo-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.25rem 0.65rem;
          background: rgba(15, 23, 42, 0.7);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          color: var(--slate-300);
          font-size: 0.75rem;
          font-weight: 500;
          transition: all var(--duration-fast);
        }

        .demo-chip:hover {
          background: var(--brand-600);
          border-color: var(--brand-500);
          color: #ffffff;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
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

        .input-with-right-btn {
          padding-right: 2.6rem;
        }

        .pwd-toggle-btn {
          position: absolute;
          right: 0.8rem;
          color: var(--slate-400);
          padding: 0.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pwd-toggle-btn:hover { color: var(--text-primary); }

        .auth-footer-text {
          text-align: center;
          font-size: 0.875rem;
          color: var(--slate-400);
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.25rem;
        }

        .auth-footer-text a {
          color: var(--brand-400);
          font-weight: 600;
        }
        .auth-footer-text a:hover {
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
}
