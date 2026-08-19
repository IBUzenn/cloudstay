/** Format a date string to readable form. e.g. "Sep 1, 2024" */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

/** Format currency. e.g. "GHS 850.00" */
export function formatCurrency(amount, currency = 'GHS') {
  return `${currency} ${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;
}

/** Capitalise first letter */
export function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

/** Truncate long text with ellipsis */
export function truncate(str, max = 80) {
  return str && str.length > max ? str.slice(0, max) + '…' : str;
}

/** Get initials from a name — e.g. "Abena Mensah" → "AM" */
export function getInitials(name = '') {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

/** Map room type to display label */
export const ROOM_TYPE_LABELS = {
  single: 'Single Room',
  double: 'Double Room',
  triple: 'Triple Room',
  suite:  'Suite',
};

/** Map booking status to badge class */
export function getStatusBadgeClass(status) {
  const map = {
    pending:   'badge-pending',
    approved:  'badge-approved',
    rejected:  'badge-rejected',
    cancelled: 'badge-cancelled',
    available: 'badge-available',
    booked:    'badge-booked',
    maintenance:'badge-maintenance',
  };
  return map[status] || 'badge-pending';
}
