import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="manager-header fade-in">
          <div className="manager-badge">
            <ShieldCheck size={14} /> Hostel Management Console
          </div>
          <h1>Manager Dashboard</h1>
          <p className="subtext">
            Review student allocation requests and verify submitted payment receipts for your hostel
          </p>
        </div>

        <div className="card manager-portal-card fade-in">
          <div className="card-top-icon">
            <Building2 size={32} />
          </div>

          <div className="portal-text-box">
            <h2>Hostel Allocations & Booking Approvals</h2>
            <p>
              As a hostel manager, you have access to review student applications, verify proof of bank transfers, and update booking status.
            </p>
          </div>

          <div className="portal-features">
            <div className="feature-item">
              <CheckCircle2 size={16} color="var(--accent-400)" />
              <span>Review pending room allocations</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={16} color="var(--accent-400)" />
              <span>Inspect uploaded payment receipts</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={16} color="var(--accent-400)" />
              <span>Approve or reject booking applications</span>
            </div>
          </div>

          <div className="cta-divider" />

          <div className="portal-actions">
            <Link to="/admin/bookings" className="btn btn-primary btn-lg">
              <BookOpen size={18} /> Manage Hostel Bookings <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .manager-header {
          margin-bottom: 2rem;
        }

        .manager-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.7rem;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.28);
          border-radius: var(--radius-full);
          color: var(--brand-300);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .subtext {
          color: var(--slate-400);
          font-size: 0.9rem;
        }

        .manager-portal-card {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .card-top-icon {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, var(--brand-500), var(--brand-700));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 0 24px rgba(99, 102, 241, 0.35);
        }

        .portal-text-box h2 {
          font-size: 1.35rem;
          margin-bottom: 0.35rem;
        }

        .portal-text-box p {
          color: var(--slate-300);
          font-size: 0.925rem;
          line-height: 1.6;
        }

        .portal-features {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: rgba(15, 23, 42, 0.5);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.875rem;
          color: var(--slate-200);
        }

        .cta-divider {
          height: 1px;
          background: var(--border-subtle);
        }

        .portal-actions {
          display: flex;
        }
      `}</style>
    </div>
  );
}
