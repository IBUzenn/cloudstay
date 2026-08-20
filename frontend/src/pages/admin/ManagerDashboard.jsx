import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export default function ManagerDashboard() {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 760 }}>
        <div className="manager-header">
          <div className="manager-badge">
            <ShieldCheck size={13} /> Hostel Management Console
          </div>
          <h1>Manager Dashboard</h1>
          <p className="subtext">
            Review student allocation requests and verify submitted payment receipts for your hostel
          </p>
        </div>

        <div className="card manager-portal-card">
          <div className="card-top-icon">
            <Building2 size={26} />
          </div>

          <div className="portal-text-box">
            <h2>Hostel Allocations & Booking Approvals</h2>
            <p>
              As a hostel manager, you have access to review student applications, verify proof of bank transfers, and update booking status.
            </p>
          </div>

          <div className="portal-features">
            <div className="feature-item">
              <CheckCircle2 size={15} color="var(--emerald-600)" />
              <span>Review pending room allocations</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={15} color="var(--emerald-600)" />
              <span>Inspect uploaded payment receipts</span>
            </div>
            <div className="feature-item">
              <CheckCircle2 size={15} color="var(--emerald-600)" />
              <span>Approve or reject booking applications</span>
            </div>
          </div>

          <div className="cta-divider" />

          <div className="portal-actions">
            <Link to="/admin/bookings" className="btn btn-primary btn-lg">
              <BookOpen size={16} /> Manage Hostel Bookings <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .manager-header {
          margin-bottom: 1.5rem;
        }

        .manager-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.2rem 0.6rem;
          background: var(--blue-50);
          border: 1px solid var(--blue-200);
          border-radius: 999px;
          color: var(--blue-700);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }

        .manager-portal-card {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .card-top-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-md);
          background: var(--blue-600);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .portal-text-box h2 {
          font-size: 1.25rem;
          margin-bottom: 0.3rem;
        }

        .portal-text-box p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.55;
        }

        .portal-features {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background: var(--surface-subtle);
          padding: 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-primary);
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
