import { IconLotus } from './Icons';

export const LoadingState = ({ message = 'Loading sacred verses...', compact = false }) => {
  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0', justifyContent: 'center' }}>
        <div className="spinner spinner-sm" />
        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{message}</span>
      </div>
    );
  }

  return (
    <div className="state-container" role="status" aria-live="polite">
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
        <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '3px' }} />
        <div style={{ position: 'absolute', color: 'var(--color-accent)' }}>
          <IconLotus size={20} />
        </div>
      </div>
      <h3 className="state-title" style={{ fontSize: '1.15rem' }}>{message}</h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
        Waheguru — Meditating on the Divine Word
      </p>
    </div>
  );
};

export default LoadingState;
