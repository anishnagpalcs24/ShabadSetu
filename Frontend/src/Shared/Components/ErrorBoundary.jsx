import React from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { IconBook } from './Icons';

/**
 * RouteError Component for React Router errorElement
 */
export const RouteError = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Route error caught:', error);

  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-6)',
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <div
        className="panel"
        style={{
          maxWidth: '560px',
          width: '100%',
          textAlign: 'center',
          padding: 'var(--space-8) var(--space-6)',
          borderTop: '4px solid var(--color-accent)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: 'rgba(196, 154, 85, 0.15)',
            color: 'var(--color-accent)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-4)',
          }}
        >
          <IconBook size={28} />
        </div>

        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          Peaceful Pause
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
          An unexpected occurrence took place while displaying this section of the sanctuary.
          {error?.statusText || error?.message ? ` (${error.statusText || error.message})` : ''}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-secondary"
          >
            Reload Page
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Return to Sanctuary Home
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Standard React Class Error Boundary for component-level protection
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="panel"
          style={{
            margin: 'var(--space-6) auto',
            maxWidth: '600px',
            textAlign: 'center',
            padding: 'var(--space-6)',
            borderLeft: '4px solid var(--color-accent)',
          }}
        >
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            Unable to display this scripture view
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {this.state.error?.message || 'An error occurred while rendering the data.'}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="btn btn-secondary btn-sm"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
