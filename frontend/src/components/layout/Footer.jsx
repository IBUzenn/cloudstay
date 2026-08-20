import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-body">
        <div className="footer-brand">
          <Link to="/" className="footer-logo-wrap">
            <Logo size={30} variant="light" showText={true} subtitle={true} />
          </Link>
          <p className="footer-desc">
            University hostel booking and accommodation management platform. Streamlining room reservations, receipt verification, and administrative approvals.
          </p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4>Accommodation</h4>
            <ul>
              <li><Link to="/hostels">Hostels Directory</Link></li>
              <li><Link to="/login">Student Sign In</Link></li>
              <li><Link to="/register">Student Registration</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>System & Rules</h4>
            <ul>
              <li><a href="#regulations" onClick={(e) => e.preventDefault()}>Hostel Regulations</a></li>
              <li><a href="#support" onClick={(e) => e.preventDefault()}>Help & Assistance</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} CloudStay Hostel Management System. All rights reserved.</p>
          <p className="footer-tech-tag">AWS Cloud Deployed</p>
        </div>
      </div>

      <style>{`
        .footer {
          background: #0B1F33;
          border-top: 1px solid #1E3A5F;
          padding-top: 2.75rem;
          margin-top: auto;
        }

        .footer-body {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 3rem;
          padding-bottom: 2.5rem;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          max-width: 420px;
        }

        .footer-logo-wrap {
          display: inline-block;
          text-decoration: none;
        }

        .footer-desc {
          font-size: 0.85rem;
          color: #829AB1;
          line-height: 1.65;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .footer-col h4 {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #38BDF8;
          margin-bottom: 0.85rem;
        }

        .footer-col ul {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-col a {
          font-size: 0.85rem;
          color: #9FB3C8;
          transition: color 140ms ease-in-out;
        }

        .footer-col a:hover { color: #F8FAFC; }

        .footer-bottom {
          border-top: 1px solid #1E3A5F;
          padding: 1rem 0;
          background: #071524;
        }

        .footer-bottom-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          font-size: 0.775rem;
          color: #627D98;
        }

        .footer-tech-tag { color: #627D98; font-weight: 500; }

        @media (max-width: 768px) {
          .footer-body { grid-template-columns: 1fr; gap: 2rem; }
          .footer-brand { max-width: 100%; }
        }
      `}</style>
    </footer>
  );
}
