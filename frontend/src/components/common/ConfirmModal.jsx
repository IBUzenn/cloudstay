import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={() => !loading && onCancel()}>
      <div className="modal-container card fade-in" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="modal-body">
          <div className={`modal-icon-wrapper modal-icon-${variant}`}>
            <AlertTriangle size={24} />
          </div>

          <div className="modal-text">
            <h3 className="modal-title">{title}</h3>
            {message && <p className="modal-message">{message}</p>}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'} btn-sm`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : confirmText}
          </button>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(2, 6, 23, 0.8);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-container {
          width: 100%;
          max-width: 440px;
          padding: 1.75rem;
          position: relative;
          background: var(--surface-1);
          border: 1px solid var(--border-medium);
          box-shadow: var(--shadow-lg), var(--shadow-glow);
        }

        .modal-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          color: var(--slate-400);
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          transition: color var(--duration-fast);
        }
        .modal-close-btn:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .modal-body {
          display: flex;
          gap: 1.25rem;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .modal-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .modal-icon-danger {
          background: var(--error-bg);
          color: var(--error-400);
          border: 1px solid var(--error-border);
        }

        .modal-icon-warning {
          background: var(--warn-bg);
          color: var(--warn-400);
          border: 1px solid var(--warn-border);
        }

        .modal-text {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .modal-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .modal-message {
          font-size: 0.875rem;
          color: var(--slate-400);
          line-height: 1.5;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          border-top: 1px solid var(--border-subtle);
          padding-top: 1.25rem;
        }
      `}</style>
    </div>
  );
}
