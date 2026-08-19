import { Link } from 'react-router-dom';
import { Building2, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Building2 size={18} />
          <span>Cloud<strong>Stay</strong></span>
          <p>Student Hostel Booking System</p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <Link to="/hostels">Browse Hostels</Link>
            <Link to="/register">Create Account</Link>
            <Link to="/login">Login</Link>
          </div>
          <div>
            <h4>Support</h4>
            <a href="mailto:admin@cloudstay.edu">admin@cloudstay.edu</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} CloudStay. University Capstone Project.</span>
        <span style={{ color: 'var(--text-muted)' }}>Built with React + Node.js + AWS</span>
      </div>

      <style>{`
        .footer { border-top: 1px solid var(--glass-border); background: var(--surface-1); padding: 3rem 0 0; margin-top: auto; }
        .footer-inner { display: flex; justify-content: space-between; align-items: flex-start; gap: 2rem; flex-wrap: wrap; padding-bottom: 2rem; }
        .footer-brand { display: flex; flex-direction: column; gap: 0.5rem; }
        .footer-brand > div:first-child { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; font-weight: 700; }
        .footer-brand p { font-size: 0.8rem; color: var(--text-muted); }
        .footer-links { display: flex; gap: 3rem; }
        .footer-links h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); margin-bottom: 0.75rem; }
        .footer-links a { display: block; font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem; transition: color var(--duration-fast); }
        .footer-links a:hover { color: var(--brand-400); }
        .footer-bottom { border-top: 1px solid var(--glass-border); padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-secondary); flex-wrap: wrap; gap: 0.5rem; }
        @media (max-width: 640px) { .footer-links { flex-direction: column; gap: 1.5rem; } .footer-bottom { flex-direction: column; text-align: center; } }
      `}</style>
    </footer>
  );
}
