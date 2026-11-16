import { useEffect } from 'react';
import { useUserPreferences } from '../../Settings/hooks/useUserPreferences';
import {
  IconClose,
  IconSun,
  IconMoon,
  IconSettings,
  IconVolume,
} from '../../../Shared/Components/Icons';

export const ReaderSettingsDrawer = ({ isOpen, onClose }) => {
  const {
    theme,
    toggleTheme,
    fontSize,
    setFontSize,
    larivaar,
    setLarivaar,
    englishTranslation,
    setEnglishTranslation,
    punjabiTeeka,
    setPunjabiTeeka,
    punjlish,
    setPunjlish,
    tapToRead,
    setTapToRead,
    continuousPaath,
    setContinuousPaath,
  } = useUserPreferences();

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className="settings-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <aside
        className="settings-drawer-panel"
        role="dialog"
        aria-label="Reader Settings"
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: 'var(--space-5) var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            backgroundColor: 'inherit',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent-soft)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconSettings size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', color: 'var(--color-text)', margin: 0 }}>
                ਸੈਟਿੰਗਜ਼ • Settings
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                Reader Display & Audio
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-icon btn-sm"
            aria-label="Close Settings Drawer"
          >
            <IconClose size={20} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Section: Typography & Theme */}
          <div>
            <h3
              style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-muted)',
                marginBottom: 'var(--space-3)',
                fontWeight: 700,
              }}
            >
              Typography & Appearance
            </h3>

            {/* Font Size Selector */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-text)', display: 'block', marginBottom: '0.4rem', fontWeight: 500 }}>
                Gurmukhi Font Size
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                }}
              >
                {[
                  { id: 'small', label: 'Small' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'large', label: 'Large' },
                  { id: 'xlarge', label: 'Extra' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setFontSize(sz.id)}
                    style={{
                      backgroundColor: fontSize === sz.id ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: fontSize === sz.id ? '#FFFFFF' : 'var(--color-text)',
                      border: 'none',
                      padding: '0.45rem 0',
                      fontSize: '0.78rem',
                      fontWeight: fontSize === sz.id ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'background-color var(--transition-fast)',
                    }}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>
            </div>

          {/* Section: Scripture Options */}
          <div>
            <h3
              style={{
                fontSize: '0.78rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-muted)',
                marginBottom: 'var(--space-3)',
                fontWeight: 700,
              }}
            >
              Scripture Display Options
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Punjlish (English Transliteration) */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: punjlish ? 'var(--color-accent-soft)' : 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                <input
                  type="checkbox"
                  checked={punjlish}
                  onChange={(e) => setPunjlish(e.target.checked)}
                  style={{ marginTop: '0.2rem', accentColor: 'var(--color-accent)' }}
                />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    Punjlish (English Transliteration)
                  </div>
                  
                </div>
              </label>

              {/* English Translation */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: englishTranslation ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={englishTranslation}
                  onChange={(e) => setEnglishTranslation(e.target.checked)}
                  style={{ marginTop: '0.2rem', accentColor: 'var(--color-primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
                    English Translation
                  </div>
                </div>
              </label>

              

              {/* Larivaar Continuous Script */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: larivaar ? 'var(--color-surface-hover)' : 'var(--color-surface)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={larivaar}
                  onChange={(e) => setLarivaar(e.target.checked)}
                  style={{ marginTop: '0.2rem', accentColor: 'var(--color-primary)' }}
                />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)' }}>
                    ਲੜੀਵਾਰ ਸਰੂਪ (Larivaar Script)
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Section: Audio Recitation Modes */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: 'var(--space-3)' }}>
              <IconVolume size={16} style={{ color: 'var(--color-accent)' }} />
              <h3
                style={{
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-muted)',
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                Gurbani Audio Reading (TTS)
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* 1. Tap-to-Read Mode Toggle */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: tapToRead ? 'var(--color-accent-soft)' : 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                <input
                  type="checkbox"
                  checked={tapToRead}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    setTapToRead(nextVal);
                    if (nextVal) {
                      setContinuousPaath(false); // Independent modes
                    }
                  }}
                  style={{ marginTop: '0.2rem', accentColor: 'var(--color-accent)' }}
                />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    1. Tap-to-Read Mode 
                  </div>
                </div>
              </label>

              {/* 2. Continuous Paath Mode Toggle */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: continuousPaath ? 'var(--color-accent-soft)' : 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'background-color var(--transition-fast)',
                }}
              >
                <input
                  type="checkbox"
                  checked={continuousPaath}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    setContinuousPaath(nextVal);
                    if (nextVal) {
                      setTapToRead(false); // Independent modes
                    }
                  }}
                  style={{ marginTop: '0.2rem', accentColor: 'var(--color-accent)' }}
                />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                    2. Continuous Paath Mode 
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div
          style={{
            marginTop: 'auto',
            padding: 'var(--space-4) var(--space-6)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: 'inherit',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', fontWeight: 600 }}
          >
            Apply & Close
          </button>
        </div>
      </aside>
    </>
  );
};

export default ReaderSettingsDrawer;
