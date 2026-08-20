import React from 'react';

export default function Spinner({ fullScreen, label = 'Loading...' }) {
  const spinnerElement = (
    <div className="spinner-container">
      <div className="spinner-ring">
        <div />
        <div />
      </div>
      {label && <span className="spinner-label">{label}</span>}
      <style>{`
        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.875rem;
          padding: 3rem 1.5rem;
        }
        .spinner-ring {
          display: inline-block;
          position: relative;
          width: 40px;
          height: 40px;
        }
        .spinner-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 40px;
          height: 40px;
          border: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1.1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-top-color: var(--blue-600);
        }
        .spinner-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }
        .spinner-ring div:nth-child(2) {
          border-top-color: var(--blue-300, #93c5fd);
          animation-delay: -0.15s;
          width: 28px;
          height: 28px;
          top: 6px;
          left: 6px;
        }
        @keyframes spin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner-label {
          font-size: 0.825rem;
          font-weight: 500;
          color: var(--text-muted);
          letter-spacing: 0.01em;
        }
        .spinner-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(248, 250, 252, 0.85);
          backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );

  if (fullScreen) {
    return <div className="spinner-fullscreen">{spinnerElement}</div>;
  }

  return spinnerElement;
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '5px', flexShrink: 0 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton" style={{ width: '55%', height: 16 }} />
          <div className="skeleton" style={{ width: '35%', height: 12 }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: '100%', height: 56 }} />
      <div className="skeleton" style={{ width: '28%', height: 20 }} />
    </div>
  );
}
