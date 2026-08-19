import React from 'react';

const STATUS_CONFIG = {
  // Booking statuses
  pending:    { label: 'Pending Review', class: 'badge-pending' },
  approved:   { label: 'Approved',       class: 'badge-approved' },
  rejected:   { label: 'Rejected',       class: 'badge-rejected' },
  cancelled:  { label: 'Cancelled',      class: 'badge-cancelled' },

  // Room statuses
  available:  { label: 'Available',      class: 'badge-available' },
  booked:     { label: 'Booked',         class: 'badge-booked' },
  maintenance:{ label: 'Maintenance',    class: 'badge-maintenance' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status?.toLowerCase()] || {
    label: status || 'Unknown',
    class: 'badge-cancelled',
  };

  return (
    <span className={`badge ${config.class}`}>
      <span className="status-dot" />
      {config.label}
    </span>
  );
}
