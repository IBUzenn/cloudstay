import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Hash, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api';
import Logo from '../../components/common/Logo';
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
    if (!form.name.trim())        errs.name            = 'Full name is required.';
    if (!form.email.trim())       errs.email           = 'Email address is required.';
    if (!form.studentId.trim())   errs.studentId       = 'Student ID is required.';
    if (!form.password)           errs.password        = 'Password is required.';
    else if (form.password.length < 6) errs.password   = 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword)
                                  errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authApi.register({
        name:      form.name,
        email:     form.email,
        studentId: form.studentId,
        password:  form.password,
      });
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your inputs.';
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
          <h2 className="auth-title">Create Student Account</h2>
          <p className="subtext">Register your student details to browse and book hostel rooms</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="field-wrap">
              <User size={16} className="field-icon" />
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input has-icon${errors.name ? ' error' : ''}`}
                placeholder="e.g. Abena Mensah"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="reg-grid">
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
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="studentId">Student ID</label>
              <div className="field-wrap">
                <Hash size={16} className="field-icon" />
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  className={`form-input has-icon${errors.studentId ? ' error' : ''}`}
                  placeholder="STU-2026-001"
                  value={form.studentId}
                  onChange={handleChange}
                />
              </div>
              {errors.studentId && <p className="form-error">{errors.studentId}</p>}
            </div>
          </div>

          <div className="reg-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="field-wrap">
                <Lock size={16} className="field-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  className={`form-input has-icon has-right-btn${errors.password ? ' error' : ''}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-pwd-btn"
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
              <div className="field-wrap">
                <Lock size={16} className="field-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPwd ? 'text' : 'password'}
                  className={`form-input has-icon${errors.confirmPassword ? ' error' : ''}`}
                  placeholder="Repeat password"
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
            style={{ marginTop: '0.25rem' }}
          >
            {loading ? 'Creating Account…' : 'Complete Student Registration'}
          </button>
        </form>

        <p className="auth-footer-note">
          Already registered? <Link to="/login">Sign in to your account</Link>
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
          max-width: 500px;
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
          gap: 0.45rem;
        }

        .auth-title {
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--navy-primary);
          margin-top: 0.2rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reg-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
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

        @media (max-width: 520px) {
          .reg-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
