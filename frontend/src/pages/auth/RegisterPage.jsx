import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, User, Mail, Lock, CreditCard, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api';
import toast from 'react-hot-toast';

const RULES = {
  name:      (v) => !v.trim() ? 'Name is required.' : v.length < 2 ? 'Name must be at least 2 characters.' : '',
  email:     (v) => !v ? 'Email is required.' : !/^\S+@\S+\.\S+$/.test(v) ? 'Invalid email address.' : '',
  studentId: (v) => !v.trim() ? 'Student ID is required.' : !/^[A-Za-z0-9\-]+$/.test(v) ? 'Only letters, numbers, and hyphens.' : '',
  password:  (v) => !v ? 'Password is required.' : v.length < 8 ? 'At least 8 characters.' :
                    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(v) ? 'Must include uppercase, lowercase, and a number.' : '',
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', studentId: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: RULES[name](value) }));
  };

  const validate = () => {
    const errs = {};
    Object.entries(RULES).forEach(([k, fn]) => { const msg = fn(form[k]); if (msg) errs[k] = msg; });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await authApi.register(form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      if (err.response?.data?.errors) {
        const apiErrs = {};
        err.response.data.errors.forEach((e) => { apiErrs[e.field] = e.message; });
        setErrors(apiErrs);
      }
      toast.error(msg);
    } finally { setLoading(false); }
  };

  const Field = ({ name, label, type = 'text', icon: Icon, placeholder }) => (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>{label}</label>
      <div className="input-icon-wrapper">
        <Icon size={16} className="input-icon" />
        {name === 'password' ? (
          <>
            <input id={name} name={name} type={showPwd ? 'text' : 'password'}
              className={`form-input input-with-icon input-with-icon-right ${errors[name] ? 'error' : ''}`}
              placeholder={placeholder} value={form[name]} onChange={handleChange} />
            <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </>
        ) : (
          <input id={name} name={name} type={type}
            className={`form-input input-with-icon ${errors[name] ? 'error' : ''}`}
            placeholder={placeholder} value={form[name]} onChange={handleChange} autoComplete={type === 'email' ? 'email' : 'off'} />
        )}
      </div>
      {errors[name] && <p className="form-error">{errors[name]}</p>}
    </div>
  );

  return (
    <main className="auth-page">
      <div className="auth-card card fade-in">
        <div className="auth-logo">
          <Building2 size={28} />
          <h1>Cloud<span className="text-gradient">Stay</span></h1>
        </div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join thousands of students booking hostel rooms</p>

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Field name="name"      label="Full Name"   icon={User}   placeholder="Abena Mensah" />
          <Field name="email"     label="Email"       type="email" icon={Mail} placeholder="you@student.edu" />
          <Field name="studentId" label="Student ID"  icon={CreditCard} placeholder="STU-2024-001" />
          <Field name="password"  label="Password"    icon={Lock}   placeholder="Min 8 chars, upper, lower, number" />

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.5rem' }} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <style>{`
        .auth-page { min-height: calc(100vh - 64px); display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
        .auth-card { padding: 2.5rem; width: 100%; max-width: 440px; }
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
        .input-with-icon-right { padding-right: 2.5rem; }
      `}</style>
    </main>
  );
}
