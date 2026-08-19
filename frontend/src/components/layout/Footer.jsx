import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link to="/" className="brand-link">
            <Building2 size={20} className="brand-icon" />
            <span className="brand-title">
              Cloud<span className="text-gradient">Stay</span>
            </span>
          </Link>
          <p className="footer-desc">
            Verified university hostel booking system. Effortless room allocation and instant payment verification for students and university managers.
          </p>
          <div className="security-badge">
            <ShieldCheck size={16} /> 256-bit Encrypted AWS Cloud Infrastructure
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/hostels">Browse Hostels</Link></li>
              <li><Link to="/login">Student Portal</Link></li>
              <li><Link to="/register">Create Account</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support & Info</h4>
            <ul>
              <li><a href="#faq" onClick={(e) => e.preventDefault()}>Student FAQs</a></li>
              <li><a href="#rules" onClick={(e) => e.preventDefault()}>Hostel Regulations</a></li>
              <li><a href="#help" onClick={(e) => e.preventDefault()}>Help Desk</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} CloudStay Hostel System. All rights reserved.</p>
          <p className="footer-tech">
            Built with React 18, Vite & AWS Cloud Architecture
          </p>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--surface-1);
          border-top: 1px solid var(--border-subtle);
          padding-top: 3.5rem;
          margin-top: auto;
        }

        .footer-inner {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 3rem;
          padding-bottom: 3rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 440px;
        }

        .brand-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 800;
        }

        .brand-icon {
          color: var(--brand-400);
        }

        .footer-desc {
          color: var(--slate-400);
          font-size: 0.875rem;
          line-height: 1.6;
        }

        .security-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.85rem;
          background: rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(16, 185, 129, 0.2);
          border-radius: var(--radius-full);
          color: var(--accent-400);
          font-size: 0.775rem;
          font-weight: 500;
          width: fit-content;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .footer-col h4 {
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .footer-col ul {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .footer-col a {
          color: var(--slate-400);
          font-size: 0.875rem;
          transition: color var(--duration-fast);
        }

        .footer-col a:hover {
          color: var(--brand-300);
        }

        .footer-bottom {
          border-top: 1px solid var(--border-subtle);
          padding: 1.25rem 0;
          background: var(--bg-main);
          font-size: 0.8rem;
          color: var(--slate-500);
        }

        .footer-bottom-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .footer-tech {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        @media (max-width: 768px) {
          .footer-inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .footer-links-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </footer>
  );
}
