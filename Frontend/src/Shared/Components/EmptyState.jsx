import { IconBook } from './Icons';

export const EmptyState = ({
  icon: Icon = IconBook,
  title = 'No verses found',
  message = 'There are no records matching your request.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="state-container panel" style={{ background: 'var(--color-surface)', borderStyle: 'dashed' }}>
      <div className="state-icon" style={{ color: 'var(--color-accent)' }}>
        <Icon size={40} />
      </div>
      <h3 className="state-title">{title}</h3>
      <p className="state-message">{message}</p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-secondary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
