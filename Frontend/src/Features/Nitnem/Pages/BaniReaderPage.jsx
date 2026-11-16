import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useLocation, useSearchParams, Link } from 'react-router-dom';
import nitnemApi from '../services/nitnem.api';
import { useUserPreferences } from '../../Settings/hooks/useUserPreferences';
import { useGurbaniSpeech } from '../../Gurbani/hooks/useGurbaniSpeech';
import ReaderSettingsDrawer from '../../Gurbani/Component/ReaderSettingsDrawer';
import ContinuousPaathToolbar from '../../Gurbani/Component/ContinuousPaathToolbar';
import { normalizeVerse } from '../../../Shared/Utils/gurbani';
import LoadingState from '../../../Shared/Components/LoadingState';
import ErrorState from '../../../Shared/Components/ErrorState';
import {
  IconArrowLeft,
  IconArrowRight,
  IconCopy,
  IconCheck,
  IconSettings,
  IconHeadphones,
} from '../../../Shared/Components/Icons';

/**
 * Accurately detects and segments Banis structured into Ashtpadis (e.g. Sukhmani Sahib)
 * Each Ashtpadi begins with its Salok followed by Ashtpadi Pauris.
 */
export const detectAshtpadis = (verses) => {
  if (!verses || verses.length === 0) return null;

  const isSukhmani = verses.some((v) => {
    const text = v.verse || v.gurmukhi || '';
    return text.includes('ਸੁਖਮਨੀ') || text.includes('ਅਸਟਪਦੀ');
  });

  if (!isSukhmani) return null;

  const sections = [];
  let current = null;

  verses.forEach((v, index) => {
    const text = v.verse || '';
    // A new Ashtpadi begins with a Salok (ਸਲੋਕੁ ॥) preceding the Ashtpadi
    if (index === 0 || (text.startsWith('ਸਲੋਕੁ ॥') && index > 15)) {
      if (current) {
        current.endIndex = index - 1;
        current.verses = verses.slice(current.startIndex, index);
        sections.push(current);
      }
      const num = sections.length + 1;
      current = {
        number: num,
        title: `ਅਸਟਪਦੀ ${num}`,
        englishTitle: `Ashtpadi ${num}`,
        startIndex: index,
      };
    }
  });

  if (current) {
    current.endIndex = verses.length - 1;
    current.verses = verses.slice(current.startIndex);
    sections.push(current);
  }

  return sections.length > 1 ? sections : null;
};

export const BaniReaderPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    fontSize,
    setFontSize,
    larivaar,
    setLarivaar,
    englishTranslation,
    punjabiTeeka,
    punjlish,
    tapToRead,
    continuousPaath,
  } = useUserPreferences();

  const [baniData, setBaniData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const topAnchorRef = useRef(null);

  const isFromSundarGutka = location.pathname.includes('/sundargutka') || searchParams.get('from') === 'sundargutka';

  const fetchBani = async (baniId) => {
    setLoading(true);
    setError(null);
    setBaniData(null); // Clear stale previous Bani data immediately
    try {
      const response = await nitnemApi.getBaniById(baniId);
      const data = response?.data || response;
      setBaniData(data);
    } catch (err) {
      setError(err.message || 'Unable to retrieve Bani verses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBani(id);
  }, [id]);

  const rawVerses = useMemo(() => {
    if (!baniData) return [];
    return Array.isArray(baniData.bani)
      ? baniData.bani
      : Array.isArray(baniData.verses)
      ? baniData.verses
      : Array.isArray(baniData.lines)
      ? baniData.lines
      : Array.isArray(baniData.page)
      ? baniData.page
      : Array.isArray(baniData)
      ? baniData
      : [];
  }, [baniData]);

  const allVerses = useMemo(() => {
    return rawVerses.map(normalizeVerse);
  }, [rawVerses]);

  // Section / Ashtpadi segmentation
  const sections = useMemo(() => {
    return detectAshtpadis(allVerses);
  }, [allVerses]);

  // Read current Ashtpadi from URL query param
  const ashtpadiParam = parseInt(searchParams.get('ashtpadi'), 10);
  const activeAshtpadiNum = useMemo(() => {
    if (!sections || sections.length === 0) return 1;
    if (!isNaN(ashtpadiParam) && ashtpadiParam >= 1 && ashtpadiParam <= sections.length) {
      return ashtpadiParam;
    }
    return 1;
  }, [sections, ashtpadiParam]);

  // The verses to render on screen (either current Ashtpadi or entire Bani)
  const displayVerses = useMemo(() => {
    if (sections && sections.length > 0) {
      const currentSection = sections[activeAshtpadiNum - 1];
      return currentSection ? currentSection.verses : allVerses;
    }
    return allVerses;
  }, [sections, activeAshtpadiNum, allVerses]);

  const handleAshtpadiChange = (newNum) => {
    if (!sections || newNum < 1 || newNum > sections.length) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('ashtpadi', newNum.toString());
      return next;
    });

    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Audio speech hook for both Tap-to-Read and Continuous Paath
  const {
    activeLineIndex,
    isPlaying,
    isPaused,
    handleLineTap,
    startContinuous,
    pauseContinuous,
    resumeContinuous,
    stop,
    nextLine,
    prevLine,
  } = useGurbaniSpeech({
    tapToReadEnabled: tapToRead,
    continuousEnabled: continuousPaath,
    verses: displayVerses,
  });

  const handleCopy = (verse, idx) => {
    const text = `${verse.verse || ''}\n${verse.translation || ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(verse.id || idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const baniTitle =
    baniData?.baniinfo?.gurmukhiUni ||
    baniData?.baniinfo?.unicode ||
    baniData?.baniinfo?.name ||
    baniData?.name ||
    `Bani #${id}`;
  const baniEnglish =
    baniData?.baniinfo?.english ||
    baniData?.baniinfo?.name ||
    baniData?.english ||
    '';

  const isAnandSahib = Number(id) === 5 || baniEnglish.toLowerCase().includes('anand sahib');

  return (
    <div style={{ paddingBottom: '6rem' }} ref={topAnchorRef}>
      {/* Top Floating Control Toolbar */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 90,
          boxShadow: 'var(--shadow-sm)',
          padding: '0.65rem 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to={isFromSundarGutka ? '/sundargutka' : '/nitnem'}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <IconArrowLeft size={16} /> {isFromSundarGutka ? 'Sundar Gutka' : 'All Banis'}
            </Link>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }} className="gurbani-text">
              {baniTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Ashtpadi Dropdown Selector (Active for Ashtpadi-structured Banis e.g. Sukhmani Sahib) */}
            {sections && sections.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <label
                  htmlFor="ashtpadi-select-dropdown"
                  style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}
                >
                  Ashtpadi:
                </label>
                <select
                  id="ashtpadi-select-dropdown"
                  value={activeAshtpadiNum}
                  onChange={(e) => handleAshtpadiChange(Number(e.target.value))}
                  style={{
                    padding: '0.28rem 0.65rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {sections.map((sec) => (
                    <option key={sec.number} value={sec.number}>
                      {sec.englishTitle} • {sec.title} ({sec.verses.length} verses)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Listen Audio Paath pill (Active when audio is available, e.g. Anand Sahib) */}
            {isAnandSahib && (
              <Link
                to="/audio/anand-sahib"
                className="btn btn-sm btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.78rem',
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                }}
              >
                <IconHeadphones size={14} /> Listen Audio
              </Link>
            )}

            {/* Font size toggles */}
            <div style={{ display: 'inline-flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
              {['small', 'medium', 'large', 'xlarge'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  style={{
                    backgroundColor: fontSize === sz ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: fontSize === sz ? '#fff' : 'var(--color-text)',
                    border: 'none',
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {sz === 'small' ? 'A-' : sz === 'medium' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>

            {/* Larivaar toggle */}
            <button
              type="button"
              onClick={() => setLarivaar(!larivaar)}
              className={`btn btn-sm ${larivaar ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.55rem' }}
            >
              ਲੜੀਵਾਰ {larivaar ? 'On' : 'Off'}
            </button>

            {/* Reader Settings Drawer Button */}
            <button
              type="button"
              className="btn btn-secondary btn-icon btn-sm"
              onClick={() => setShowSettingsDrawer(true)}
              title="Reader Settings"
              aria-label="Reader Settings"
            >
              <IconSettings size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Continuous Paath Audio Control Bar (Sticky when mode is enabled) */}
      {continuousPaath && (
        <ContinuousPaathToolbar
          isPlaying={isPlaying}
          isPaused={isPaused}
          activeLineIndex={activeLineIndex}
          totalLines={displayVerses.length}
          onStart={(idx) => startContinuous(idx)}
          onPause={pauseContinuous}
          onResume={resumeContinuous}
          onStop={stop}
          onNext={nextLine}
          onPrev={prevLine}
        />
      )}

      {/* Main Scripture Container */}
      <main className="reader-container" style={{ paddingTop: 'var(--space-8)' }}>
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div className="badge badge-gold" style={{ marginBottom: 'var(--space-2)' }}>
            {isFromSundarGutka ? 'ਸੁੰਦਰ ਗੁਟਕਾ ਬਾਣੀ' : 'ਨਿਤਨੇਮ ਬਾਣੀ'}
          </div>
          <h1 className="gurbani-text" style={{ fontSize: '2.1rem', color: 'var(--color-primary)' }}>
            {baniTitle}
          </h1>
          {baniEnglish && (
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              {baniEnglish}
            </p>
          )}

          {/* Ashtpadi Subheading Banner if segmented */}
          {sections && sections.length > 0 && (
            <div style={{ marginTop: '0.75rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--color-surface-hover)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  padding: '0.3rem 1rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                ਅਸਟਪਦੀ {activeAshtpadiNum} (Ashtpadi {activeAshtpadiNum} of {sections.length})
              </span>
            </div>
          )}

          {tapToRead && (
            <div
              style={{
                marginTop: 'var(--space-3)',
                display: 'inline-block',
                fontSize: '0.78rem',
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-soft)',
                padding: '0.2rem 0.75rem',
                borderRadius: 'var(--radius-full)',
              }}
            >
              ✨ Tap-to-Read enabled: Click or tap any verse line to listen
            </div>
          )}
        </header>

        {loading ? (
          <LoadingState message={`Preparing sacred verses of ${baniTitle}...`} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchBani(id)} />
        ) : displayVerses.length === 0 ? (
          <div className="panel" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <p>No verses currently loaded for this Bani.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '780px', margin: '0 auto' }}>
            {displayVerses.map((verse, idx) => {
              const text = verse.verse || '';
              const en = verse.translation || null;
              const formattedText = larivaar ? text.replace(/\s+/g, '') : text;
              const verseId = verse.id || idx;
              const isSpeaking = activeLineIndex === idx;

              return (
                <div
                  key={verseId}
                  id={`verse-row-${idx}`}
                  onClick={() => handleLineTap(idx)}
                  className={`${isSpeaking ? 'is-speaking' : ''} ${tapToRead ? 'tap-mode-active' : ''}`}
                  style={{ textAlign: 'center', padding: '0.25rem 0' }}
                >
                  {/* Gurmukhi Line */}
                  <div
                    className={`gurbani-verse ${larivaar ? 'gurbani-larivaar' : ''}`}
                    style={{
                      textAlign: 'center',
                      fontSize: 'var(--gurbani-current-size, 1.85rem)',
                      color: 'var(--color-primary, #1e3a30)',
                      lineHeight: 1.85,
                      fontWeight: 500,
                    }}
                  >
                    {formattedText}
                  </div>

                  {/* Punjlish (English Transliteration) - ONLY rendered when toggled ON */}
                  {Boolean(punjlish) && verse.transliteration && (
                    <div
                      className="gurbani-transliteration"
                      style={{
                        textAlign: 'center',
                        fontSize: '0.98rem',
                        color: 'var(--color-text-secondary)',
                        fontStyle: 'italic',
                        marginTop: '0.3rem',
                        lineHeight: 1.45,
                      }}
                    >
                      {verse.transliteration}
                    </div>
                  )}

                  {/* English Translation - ONLY rendered when toggled ON */}
                  {Boolean(englishTranslation) && en && (
                    <div
                      className="gurbani-translation"
                      style={{
                        textAlign: 'center',
                        fontSize: '0.95rem',
                        color: 'var(--color-text)',
                        marginTop: '0.35rem',
                        lineHeight: 1.5,
                      }}
                    >
                      {en}
                    </div>
                  )}

                  {/* Punjabi Teeka if available - ONLY rendered when toggled ON */}
                  {Boolean(punjabiTeeka) && verse.teeka && (
                    <div
                      className="gurbani-punjabi-teeka gurbani-text"
                      style={{
                        textAlign: 'center',
                        fontSize: '0.92rem',
                        color: '#4B6350',
                        marginTop: '0.35rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {verse.teeka}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Ashtpadi Navigation Controls (e.g. Sukhmani Sahib) */}
            {sections && sections.length > 0 && (
              <div
                style={{
                  marginTop: 'var(--space-10)',
                  paddingTop: 'var(--space-6)',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <button
                  type="button"
                  disabled={activeAshtpadiNum <= 1}
                  onClick={() => handleAshtpadiChange(activeAshtpadiNum - 1)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    opacity: activeAshtpadiNum <= 1 ? 0.35 : 1,
                    pointerEvents: activeAshtpadiNum <= 1 ? 'none' : 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <IconArrowLeft size={16} /> Previous Ashtpadi ({activeAshtpadiNum - 1})
                </button>

                <div style={{ textAlign: 'center' }}>
                  <span className="badge badge-gold" style={{ fontSize: '0.82rem' }}>
                    ਅਸਟਪਦੀ {activeAshtpadiNum} of {sections.length}
                  </span>
                </div>

                {activeAshtpadiNum < sections.length ? (
                  <button
                    type="button"
                    onClick={() => handleAshtpadiChange(activeAshtpadiNum + 1)}
                    className="btn btn-primary btn-sm"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  > 
                    Next Ashtpadi ({activeAshtpadiNum + 1}) <IconArrowRight size={16} />
                  </button>
                ) : (
                  <div className="badge badge-sage" style={{ fontSize: '0.82rem' }}>
                    ਸੰਪੂਰਨ ਸਮਾਪਤ (Bani Complete)
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reader Settings Drawer Sidebar */}
      <ReaderSettingsDrawer
        isOpen={showSettingsDrawer}
        onClose={() => setShowSettingsDrawer(false)}
      />
    </div>
  );
};

export default BaniReaderPage;
