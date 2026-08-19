import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, Eye, EyeOff } from 'lucide-react';
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
      const msg = err.response?.data?.message || 'Login failed.';
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-logo">
          <Building2 size={32} />
          <h1>Cloud<span className="text-gradient">Stay</span></h1>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your student account</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <div className="input-icon-wrapper">
              <Mail size={16} className="input-icon" />
              <input id="email" name="email" type="email" className={`form-input input-with-icon ${errors.email ? 'error' : ''}`}
                placeholder="you@student.edu" value={form.email} onChange={handleChange} autoComplete="email" />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={16} className="input-icon" />
              <input id="password" name="password" type={showPwd ? 'text' : 'password'}
                className={`form-input input-with-icon input-with-icon-right ${errors.password ? 'error' : ''}`}
                placeholder="Your password" value={form.password} onChange={handleChange} autoComplete="current-password" />
              <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in…</> : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>

        <div className="demo-creds">
          <p className="demo-label">Demo credentials</p>
          <div className="demo-grid">
            <span>Student:</span><code>abena.mensah@student.edu / Student@1234</code>
            <span>Admin:</span><code>admin@cloudstay.edu / Admin@1234</code>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .auth-card { padding: 2.5rem; width: 100%; max-width: 420px; }
        .auth-logo { display: flex; align-items: center; gap: 0.625rem; font-size: 1.5rem; font-weight: 800; margin-bottom: 1.5rem; }
        .auth-title { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.25rem; }
        .auth-subtitle { color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 2rem; }
        .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.875rem; color: var(--text-secondary); }
        .auth-footer a { color: var(--brand-400); font-weight: 500; }
        .auth-footer a:hover { text-decoration: underline; }
        .input-icon-wrapper { position: relative; }
        .input-icon { position: absolute; left: 0.875rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .input-with-icon { padding-left: 2.5rem; }
        .input-icon-right { position: absolute; right: 0.875rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); padding: 0; }
        .input-icon-right:hover { color: var(--text-primary); }
        .input-with-icon-right { padding-right: 2.5rem; }
        .demo-creds { margin-top: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: var(--radius-md); }
        .demo-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.5rem; }
        .demo-grid { display: grid; grid-template-columns: auto 1fr; gap: 0.25rem 0.75rem; font-size: 0.75rem; }
        .demo-grid span { color: var(--text-secondary); }
        .demo-grid code { color: var(--brand-400); font-family: monospace; }
      `}</style>
    </main>
  );
}
