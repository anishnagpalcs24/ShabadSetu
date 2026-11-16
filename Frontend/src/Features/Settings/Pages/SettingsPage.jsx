import { useUserPreferences } from '../hooks/useUserPreferences';
import { IconSun, IconMoon } from '../../../Shared/Components/Icons';

export const SettingsPage = () => {
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
    spanishTranslation,
    setSpanishTranslation,
    punjlish,
    setPunjlish,
    tapToRead,
    setTapToRead,
    continuousPaath,
    setContinuousPaath,
  } = useUserPreferences();

  return (
    <div style={{ padding: 'var(--space-10) 0' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div className="badge badge-gold" style={{ marginBottom: 'var(--space-2)' }}>
            ਸੈਟਿੰਗਾਂ
          </div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>
            Settings & Reader Preferences
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Customize your visual reading experience, translations, audio recitation, and script styles. All settings are saved automatically on your device.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Reader Display Appearance */}
          <div className="panel">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Appearance & Theme</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div>
                <strong>Reading Theme</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Daylight Warm Ivory or Nighttime Sanctuary mode
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-secondary btn-sm"
              >
                {theme === 'dark' ? <><IconSun size={15} /> Switch to Daylight</> : <><IconMoon size={15} /> Switch to Night</>}
              </button>
            </div>

            {/* Font Size */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-subtle)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <strong>Gurbani Font Size</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  Scale the Gurmukhi script for comfortable reading distance
                </p>
              </div>
              <div style={{ display: 'inline-flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
                {[
                  { id: 'small', label: 'Small' },
                  { id: 'medium', label: 'Default' },
                  { id: 'large', label: 'Large' },
                  { id: 'xlarge', label: 'Extra Large' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setFontSize(sz.id)}
                    style={{
                      backgroundColor: fontSize === sz.id ? 'var(--color-primary)' : 'var(--color-surface)',
                      color: fontSize === sz.id ? '#fff' : 'var(--color-text)',
                      border: 'none',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: fontSize === sz.id ? 700 : 500,
                      cursor: 'pointer',
                    }}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Typography Preview */}
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block', marginBottom: '0.5rem' }}>
                Live Typography Preview
              </span>
              <p className={`gurbani-verse ${larivaar ? 'gurbani-larivaar' : ''}`}>
                {larivaar ? 'ੴਸਤਿਨਾਮੁਕਰਤਾਪੁਰਖੁਨਿਰਭਉਨਿਰਵੈਰੁ' : 'ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ'}
              </p>
            </div>
          </div>

          {/* Scripture & Translation Options */}
          <div className="panel">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Scripture & Translations</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '0.25rem' }}
                  checked={larivaar}
                  onChange={(e) => setLarivaar(e.target.checked)}
                />
                <div>
                  <strong>Larivaar Mode (ਲੜੀਵਾਰ ਸਰੂਪ)</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Continuous unbroken Gurmukhi script as originally written in historical saroops.
                  </p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '0.25rem' }}
                  checked={englishTranslation}
                  onChange={(e) => setEnglishTranslation(e.target.checked)}
                />
                <div>
                  <strong>English Translations (Sant Singh Khalsa)</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Show English translations underneath each Gurmukhi verse line.
                  </p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '0.25rem' }}
                  checked={punjabiTeeka}
                  onChange={(e) => setPunjabiTeeka(e.target.checked)}
                />
                <div>
                  <strong>Punjabi Teeka (Professor Sahib Singh)</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Show classical Punjabi Gurmat grammar teeka and word-by-word meanings.
                  </p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '0.25rem' }}
                  checked={punjlish}
                  onChange={(e) => setPunjlish(e.target.checked)}
                />
                <div>
                  <strong>Punjlish (English Transliteration)</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Show Romanized phonetics alongside Gurmukhi verses for pronunciation guidance.
                  </p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '0.25rem' }}
                  checked={tapToRead}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    setTapToRead(nextVal);
                    if (nextVal) setContinuousPaath(false);
                  }}
                />
                <div>
                  <strong>Audio Mode 1: Tap-to-Read (ਇਕ-ਇਕ ਤੁਕ ਪਾਠ)</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    When enabled, tapping any Gurbani line highlights it and reads that line aloud.
                  </p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '0.25rem' }}
                  checked={continuousPaath}
                  onChange={(e) => {
                    const nextVal = e.target.checked;
                    setContinuousPaath(nextVal);
                    if (nextVal) setTapToRead(false);
                  }}
                />
                <div>
                  <strong>Audio Mode 2: Continuous Paath (ਅਖੰਡ ਪਾਠ ਆਡੀਓ)</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Sequentially recites the entire scripture line-by-line with auto-highlighting and scrolling.
                  </p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  style={{ marginTop: '0.25rem' }}
                  checked={spanishTranslation}
                  onChange={(e) => setSpanishTranslation(e.target.checked)}
                />
                <div>
                  <strong>Spanish Translation</strong>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    Display Spanish translation where available in the iGranth corpus.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
