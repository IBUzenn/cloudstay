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
          gap: 1rem;
          padding: 2.5rem;
        }
        .spinner-ring {
          display: inline-block;
          position: relative;
          width: 44px;
          height: 44px;
        }
        .spinner-ring div {
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 44px;
          height: 44px;
          border: 3px solid transparent;
          border-radius: 50%;
          animation: spin 1.1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-top-color: var(--brand-400);
        }
        .spinner-ring div:nth-child(1) {
          animation-delay: -0.45s;
        }
        .spinner-ring div:nth-child(2) {
          border-top-color: var(--accent-400);
          animation-delay: -0.15s;
          width: 32px;
          height: 32px;
          top: 6px;
          left: 6px;
        }
        .spinner-label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--slate-400);
          letter-spacing: 0.02em;
        }
        .spinner-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(11, 15, 23, 0.85);
          backdrop-filter: blur(12px);
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
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="skeleton" style={{ width: '60%', height: 18 }} />
          <div className="skeleton" style={{ width: '40%', height: 14 }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: '100%', height: 60 }} />
      <div className="skeleton" style={{ width: '30%', height: 24 }} />
    </div>
  );
}
