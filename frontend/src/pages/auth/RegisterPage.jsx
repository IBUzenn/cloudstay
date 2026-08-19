import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Hash, Building2, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required.';
    if (!form.email.trim()) errs.email = 'Email address is required.';
    if (!form.studentId.trim()) errs.studentId = 'Student ID is required.';
    if (!form.password) errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authApi.register({
        name: form.name,
        email: form.email,
        studentId: form.studentId,
        password: form.password,
      });
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check inputs.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page-wrapper">
      <div className="auth-card-container card fade-in" style={{ maxWidth: 480 }}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Building2 size={26} />
          </div>
          <h2>Create Student Account</h2>
          <p className="auth-subtitle">Register to reserve your hostel room for the semester</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="input-icon-wrapper">
              <User size={16} className="input-icon" />
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input input-with-icon ${errors.name ? 'error' : ''}`}
                placeholder="e.g. Abena Mensah"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="input-icon-wrapper">
                <Mail size={16} className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
                  placeholder="student@edu"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="studentId">Student ID</label>
              <div className="input-icon-wrapper">
                <Hash size={16} className="input-icon" />
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  className={`form-input input-with-icon ${errors.studentId ? 'error' : ''}`}
                  placeholder="STU-2026-001"
                  value={form.studentId}
                  onChange={handleChange}
                />
              </div>
              {errors.studentId && <p className="form-error">{errors.studentId}</p>}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  className={`form-input input-with-icon input-with-right-btn ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="pwd-toggle-btn"
                  onClick={() => setShowPwd(!showPwd)}
                  aria-label="Toggle password"
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-icon-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPwd ? 'text' : 'password'}
                  className={`form-input input-with-icon ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>
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
                Creating Account...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          Already registered? <Link to="/login">Sign in to your account</Link>
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
          padding: 2.5rem 2rem;
          width: 100%;
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
