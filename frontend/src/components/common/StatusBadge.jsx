import { capitalize, getStatusBadgeClass } from '../../utils/helpers';
import { Clock, CheckCircle2, XCircle, Ban } from 'lucide-react';

const ICONS = {
  pending:  <Clock size={11} />,
  approved: <CheckCircle2 size={11} />,
  rejected: <XCircle size={11} />,
  cancelled:<Ban size={11} />,
  available: <CheckCircle2 size={11} />,
  booked:    <XCircle size={11} />,
  maintenance: <Clock size={11} />,
};

export default function StatusBadge({ status }) {
  return (
    <span className={`badge ${getStatusBadgeClass(status)}`}>
      {ICONS[status]}
      {capitalize(status)}
    </span>
  );
}
