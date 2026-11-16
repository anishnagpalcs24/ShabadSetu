import { useNavigate } from 'react-router-dom';
import { IconLotus, IconBook, IconCheck } from '../../../Shared/Components/Icons';
import '../Styles/progress.scss';

export const ProgressPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 'var(--space-12) 0 var(--space-16) 0' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        {/* Main Coming Soon Panel */}
        <div
          className="panel"
          style={{
            padding: 'var(--space-12) var(--space-6)',
            textAlign: 'center',
            borderRadius: '20px',
            border: '1.5px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Spiritual Lotus Icon */}
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: 'rgba(212, 175, 55, 0.12)',
              color: 'var(--color-accent, #D4AF37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4) auto',
              border: '1.5px solid rgba(212, 175, 55, 0.35)',
            }}
          >
            <IconLotus size={38} />
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(46, 125, 74, 0.12)',
              color: 'var(--color-primary, #24483D)',
              padding: '0.3rem 0.95rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: 'var(--space-3)',
              border: '1px solid rgba(46, 125, 74, 0.25)',
            }}
          >
            <span>ਜਲਦ ਆ ਰਿਹਾ ਹੈ • Coming Soon</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--font-editorial, 'Lora', Georgia, serif)",
              fontSize: 'clamp(1.9rem, 4vw, 2.6rem)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              margin: '0 0 var(--space-2) 0',
              lineHeight: 1.25,
            }}
          >
            Sehaj Paath Tracker
          </h1>

          <div
            className="gurbani-text"
            style={{
              fontSize: '1.4rem',
              color: 'var(--color-accent)',
              marginBottom: 'var(--space-4)',
              fontWeight: 600,
            }}
          >
            ਸਹਿਜ ਪਾਠ ਟ੍ਰੈਕਰ
          </div>

          <p
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '1.02rem',
              lineHeight: 1.65,
              maxWidth: '560px',
              margin: '0 auto var(--space-8) auto',
            }}
          >
            We are creating an authentic, tranquil Sehaj Paath companion with intuitive Ang milestone bookmarks, daily paath pace reminders, and reflection journaling to support your sacred contemplation of Sri Guru Granth Sahib Ji.
          </p>

          {/* Highlights List */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.75rem',
              maxWidth: '520px',
              margin: '0 auto var(--space-8) auto',
              textAlign: 'left',
            }}
          >
            {[
              'Natural reading pace goals',
              'Automatic Ang bookmarking',
              'Personal contemplation notes',
              'Offline sync & local privacy',
            ].map((feature) => (
              <div
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.88rem',
                  color: 'var(--color-text)',
                  backgroundColor: 'var(--color-surface-hover)',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ color: 'var(--color-accent)' }}>
                  <IconCheck size={16} />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.85rem',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/reader')}
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <IconBook size={18} /> Open Gurbani Reader
            </button>
            <button
              type="button"
              onClick={() => navigate('/nitnem')}
              className="btn btn-secondary"
            >
              Daily Nitnem Prayers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
