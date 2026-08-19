/** Loading spinner with optional full-screen overlay */
export default function Spinner({ fullScreen = false, size = 40, label = 'Loading…' }) {
  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
        background: 'var(--surface-0)', zIndex: 9999,
      }}>
        <div style={{ width: size, height: size }} className="spinner" />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</span>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
      <div style={{ width: size, height: size }} className="spinner" />
    </div>
  );
}
