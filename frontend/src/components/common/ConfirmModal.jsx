import { AlertTriangle, X } from 'lucide-react';

/**
 * Confirmation modal for destructive actions.
 * @param {string}   title   - Modal heading
 * @param {string}   message - Body text
 * @param {string}   confirmLabel - Confirm button text
 * @param {string}   confirmClass - btn class for confirm button
 * @param {Function} onConfirm
 * @param {Function} onCancel
 * @param {boolean}  loading
 */
export default function ConfirmModal({ title, message, confirmLabel = 'Confirm', confirmClass = 'btn-danger', onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-icon"><AlertTriangle size={20} /></span>
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel}><X size={18} /></button>
        </div>
        <p className="modal-body">{message}</p>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className={`btn ${confirmClass}`} onClick={onConfirm} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : confirmLabel}
          </button>
        </div>
      </div>
      <style>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; animation: fadeIn 0.2s ease; }
        .modal-box { background: var(--surface-2); border: 1px solid var(--glass-border); border-radius: var(--radius-lg); padding: 1.75rem; max-width: 420px; width: 100%; box-shadow: var(--shadow-lg); }
        .modal-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
        .modal-icon { color: var(--warn-400); flex-shrink: 0; }
        .modal-header h3 { flex: 1; font-size: 1rem; }
        .modal-close { color: var(--text-secondary); padding: 0.25rem; border-radius: var(--radius-sm); transition: color var(--duration-fast); }
        .modal-close:hover { color: var(--text-primary); }
        .modal-body { color: var(--text-secondary); font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.5rem; }
        .modal-footer { display: flex; gap: 0.75rem; justify-content: flex-end; }
      `}</style>
    </div>
  );
}
