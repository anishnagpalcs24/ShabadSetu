import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useReader } from '../hooks/useReader';
import { useUserPreferences } from '../../Settings/hooks/useUserPreferences';
import ReaderSettingsDrawer from '../Component/ReaderSettingsDrawer';
import BaniAudioOption from '../../AudioPaath/Component/BaniAudioOption';
import gurbaniApi from '../services/gurbani.api';
import { GRANTH_SOURCES } from '../../../Shared/Utils/sources';
import { normalizeVerse } from '../../../Shared/Utils/gurbani';
import LoadingState from '../../../Shared/Components/LoadingState';
import ErrorState from '../../../Shared/Components/ErrorState';
import { useScrollDirection } from '../../../Shared/Hooks/useScrollDirection';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBookmark,
  IconCopy,
  IconCheck,
  IconNote,
  IconSettings,
  IconSun,
  IconMoon,
} from '../../../Shared/Components/Icons';

export const ReaderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlAng = searchParams.get('ang');
  const urlSource = searchParams.get('source');
  const highlightId = searchParams.get('highlight');
  const highlightLineNo = searchParams.get('lineno');

  const { source, sourceInfo, page, maxPage, setSource, setPage, nextPage, prevPage } = useReader();
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
  } = useUserPreferences();
  const [angData, setAngData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('shabadsetu_guest_bookmarks') || '[]');
      return new Set(saved.map((b) => b.lineId || b.id));
    } catch {
      return new Set();
    }
  });
  const [pageInput, setPageInput] = useState(page);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [noteModalVerse, setNoteModalVerse] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [noteStatus, setNoteStatus] = useState('');
  const [activeHighlight, setActiveHighlight] = useState(highlightId || highlightLineNo || null);
  const isToolbarVisible = useScrollDirection();

  const topRef = useRef(null);

  // Sync URL params (ang, source, highlight) with reader state
  useEffect(() => {
    if (urlAng) {
      const parsedAng = parseInt(urlAng, 10);
      if (!isNaN(parsedAng) && parsedAng !== page) {
        setPage(parsedAng);
      }
    }
    if (urlSource && urlSource !== source) {
      setSource(urlSource);
    }
    if (highlightId || highlightLineNo) {
      setActiveHighlight(highlightId || highlightLineNo);
    }
  }, [urlAng, urlSource, highlightId, highlightLineNo]);

  // Sync page input with page change
  useEffect(() => {
    setPageInput(page);
  }, [page]);

  // Fetch Ang content from backend
  const fetchAng = async (p, s) => {
    setLoading(true);
    setError(null);
    try {
      const response = await gurbaniApi.getAng(p, s);
      const data = response?.data || response;
      setAngData(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve Ang verses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAng(page, source);
    // Scroll to top on normal Ang change (unless jumping to a highlighted verse)
    if (!highlightId && !highlightLineNo && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page, source]);

  // Automatically scroll smooth to the highlighted verse when verses finish loading
  useEffect(() => {
    if (!loading && angData && (highlightId || highlightLineNo)) {
      const scrollTimer = setTimeout(() => {
        let targetEl = null;
        if (highlightId) {
          targetEl = document.getElementById(`verse-${highlightId}`);
        }
        if (!targetEl) {
          targetEl = document.querySelector('.search-matched-verse');
        }
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);

      return () => clearTimeout(scrollTimer);
    }
  }, [loading, angData, highlightId, highlightLineNo]);

  const handlePageSubmit = (e) => {
    e.preventDefault();
    const p = parseInt(pageInput, 10);
    if (p >= 1 && p <= maxPage) {
      setPage(p);
    } else {
      setPageInput(page);
    }
  };

  const handleCopyVerse = (verse) => {
    const textToCopy = `${verse.verse}\n${verse.translation?.en || ''}\n— Ang ${page}, ${sourceInfo.name}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(verse.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBookmarkVerse = (verse) => {
    try {
      const guestBookmarks = JSON.parse(localStorage.getItem('shabadsetu_guest_bookmarks') || '[]');
      const exists = guestBookmarks.some((b) => (b.lineId || b.id) === verse.id);
      if (exists) {
        const filtered = guestBookmarks.filter((b) => (b.lineId || b.id) !== verse.id);
        localStorage.setItem('shabadsetu_guest_bookmarks', JSON.stringify(filtered));
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          next.delete(verse.id);
          return next;
        });
      } else {
        guestBookmarks.push({
          type: 'line',
          source,
          pageNumber: page,
          lineId: verse.id,
          shabadId: verse.shabad_id,
          title: verse.verse,
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem('shabadsetu_guest_bookmarks', JSON.stringify(guestBookmarks));
        setBookmarkedIds((prev) => new Set([...prev, verse.id]));
      }
    } catch {
      // Storage fallback
    }
  };

  const handleSaveNote = () => {
    if (!noteContent.trim() || !noteModalVerse) return;
    setNoteStatus('Saving note...');
    try {
      const guestNotes = JSON.parse(localStorage.getItem('shabadsetu_guest_notes') || '[]');
      guestNotes.unshift({
        id: 'note_' + Date.now(),
        content: noteContent.trim(),
        source,
        pageNumber: page,
        shabadId: noteModalVerse.shabad_id,
        lineId: noteModalVerse.id,
        verseText: noteModalVerse.verse,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('shabadsetu_guest_notes', JSON.stringify(guestNotes));
      setNoteStatus('Note saved successfully!');
      setTimeout(() => {
        setNoteModalVerse(null);
        setNoteContent('');
        setNoteStatus('');
      }, 1000);
    } catch {
      setNoteStatus('Failed to save note. Please try again.');
    }
  };

  // Extract verse list safely from backend envelope and normalize
  const rawVerses = Array.isArray(angData?.page)
    ? angData.page
    : Array.isArray(angData?.shabad)
    ? angData.shabad
    : Array.isArray(angData?.verses)
    ? angData.verses
    : Array.isArray(angData?.lines)
    ? angData.lines
    : Array.isArray(angData?.bani)
    ? angData.bani
    : Array.isArray(angData)
    ? angData
    : [];
  const verses = rawVerses.map(normalizeVerse);

  // Compute detected Bani for current Ang if it has an Audio recording in our library
  const currentAngAudioBani = useMemo(() => {
    if (source !== 'G') return null;
    const p = Number(page);
    if (p >= 1 && p <= 8) {
      return { id: 1, slug: 'japji-sahib', name: 'ਜਪੁਜੀ ਸਾਹਿਬ', english: 'Japji Sahib' };
    }
    if (p >= 8 && p <= 12) {
      return { id: 6, slug: 'rehras-sahib', name: 'ਰਹਰਾਸਿ ਸਾਹਿਬ', english: 'Rehras Sahib' };
    }
    if (p >= 12 && p <= 13) {
      return { id: 7, slug: 'kirtan-sohila', name: 'ਕੀਰਤਨ ਸੋਹਿਲਾ', english: 'Kirtan Sohila' };
    }
    if (p >= 262 && p <= 296) {
      return { id: 8, slug: 'sukhmani-sahib', name: 'ਸੁਖਮਨੀ ਸਾਹਿਬ', english: 'Sukhmani Sahib' };
    }
    return null;
  }, [source, page]);

  // Strictly compute the single matching verse ID for search highlight (never highlight 2 lines)
  const matchedVerseId = useMemo(() => {
    if (!activeHighlight && !highlightLineNo) return null;
    if (activeHighlight) {
      const matchById = verses.find(
        (v) => (v.id && String(v.id) === String(activeHighlight)) ||
               (v.raw?.id && String(v.raw?.id) === String(activeHighlight))
      );
      if (matchById) return matchById.id || matchById.raw?.id;
    }
    if (highlightLineNo) {
      const matchByLine = verses.find(
        (v) => v.raw?.lineno && String(v.raw?.lineno) === String(highlightLineNo)
      );
      if (matchByLine) return matchByLine.id || matchByLine.raw?.id;
    }
    return null;
  }, [verses, activeHighlight, highlightLineNo]);

  // Smoothly scroll the selected verse into center view
  useEffect(() => {
    if (matchedVerseId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`verse-${matchedVerseId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [matchedVerseId]);

  // Helper to remove spaces for Larivaar mode
  const formatGurmukhi = (text) => {
    if (!text) return '';
    if (larivaar) {
      return text.replace(/\s+/g, '');
    }
    return text;
  };

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <div ref={topRef} />

      {/* Reader Control Header Bar */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 90,
          boxShadow: isToolbarVisible ? 'var(--shadow-sm)' : 'none',
          padding: '0.65rem 0',
          transform: isToolbarVisible ? 'translateY(0)' : 'translateY(-100%)',
          opacity: isToolbarVisible ? 1 : 0,
          pointerEvents: isToolbarVisible ? 'auto' : 'none',
          transition: 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease, box-shadow 0.22s ease',
          willChange: 'transform, opacity',
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
          {/* Source Selection & Ang Navigator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="select-field"
              style={{ padding: '0.35rem 0.65rem', fontSize: '0.85rem', width: 'auto', fontWeight: 600 }}
              aria-label="Select Granth Source"
            >
              {GRANTH_SOURCES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Ang Flip Form */}
            <form onSubmit={handlePageSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={prevPage}
                disabled={page <= 1}
                className="btn btn-secondary btn-icon btn-sm"
                title="Previous Ang"
                aria-label="Previous Ang"
              >
                <IconArrowLeft size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-muted)' }}>Ang</span>
                <input
                  type="number"
                  min="1"
                  max={maxPage}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={handlePageSubmit}
                  className="input-field"
                  style={{
                    width: '64px',
                    textAlign: 'center',
                    padding: '0.25rem 0.35rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                  aria-label="Current Ang Number"
                />
                <span style={{ color: 'var(--color-muted)' }}>of {maxPage}</span>
              </div>

              <button
                type="button"
                onClick={nextPage}
                disabled={page >= maxPage}
                className="btn btn-secondary btn-icon btn-sm"
                title="Next Ang"
                aria-label="Next Ang"
              >
                <IconArrowRight size={16} />
              </button>
            </form>
          </div>

          {/* Reader Preferences Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Quick Font Size Toggle */}
            <div
              style={{
                display: 'inline-flex',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
              }}
            >
              {['small', 'medium', 'large', 'xlarge'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFontSize(sz)}
                  style={{
                    backgroundColor: fontSize === sz ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: fontSize === sz ? '#fff' : 'var(--color-text)',
                    border: 'none',
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.72rem',
                    fontWeight: fontSize === sz ? 700 : 500,
                    cursor: 'pointer',
                  }}
                  title={`Font size ${sz}`}
                >
                  {sz === 'small' ? 'A-' : sz === 'medium' ? 'A' : sz === 'large' ? 'A+' : 'A++'}
                </button>
              ))}
            </div>

            {/* Larivaar Quick Toggle */}
            <button
              type="button"
              onClick={() => setLarivaar(!larivaar)}
              className={`btn btn-sm ${larivaar ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              title="Toggle Larivaar continuous script mode"
            >
              ਲੜੀਵਾਰ {larivaar ? 'On' : 'Off'}
            </button>

            {/* Audio Paath Option (Strictly rendered ONLY if audio is available in our library) */}
            {currentAngAudioBani && (
              <BaniAudioOption bani={currentAngAudioBani} />
            )}

            {/* Settings Drawer Button */}
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
      </section>

      {/* Main Scripture Text Body */}
      <main className="reader-container" style={{ paddingTop: 'var(--space-10)' }}>
        {/* Ang Title Header */}
        <header style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div className="badge badge-gold" style={{ marginBottom: 'var(--space-2)' }}>
            {sourceInfo.name}
          </div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>
            ਅੰਗ {page} • Ang {page}
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontStyle: 'italic', marginTop: '0.25rem' }}>
            ਪੰਨਾ {page} / {maxPage}
          </p>
        </header>

        {/* Verses Content View */}
        {loading ? (
          <LoadingState message={`Opening Ang ${page}...`} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => fetchAng(page, source)} />
        ) : verses.length === 0 ? (
          <div className="state-container panel">
            <h3 className="state-title">No verses found on Ang {page}</h3>
            <p className="state-message">Please check the Ang number or choose another page.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {verses.map((verse, index) => {
              const verseText = verse.verse;
              const englishText = verse.translation;
              const transliterationText = verse.transliteration;
              const teekaText = verse.teeka;
              const isBookmarked = bookmarkedIds.has(verse.id);

              const isSearchMatch = Boolean(
                matchedVerseId &&
                ((verse.id && String(verse.id) === String(matchedVerseId)) ||
                 (verse.raw?.id && String(verse.raw?.id) === String(matchedVerseId)))
              );

              return (
                <article
                  key={verse.id || index}
                  id={`verse-${verse.id || verse.raw?.id || index}`}
                  className={`verse-row ${isSearchMatch ? 'search-matched-verse' : ''}`}
                  style={{
                    position: 'relative',
                    transition: 'border-color 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease',
                    ...(isSearchMatch
                      ? {
                          borderLeft: '4px solid var(--color-accent, #D4AF37)',
                          backgroundColor: 'rgba(212, 175, 55, 0.08)',
                          borderRadius: '12px',
                          padding: '1.25rem 1.5rem',
                          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.12)',
                        }
                      : {}),
                  }}
                >
                  {/* Subtle, professional selected line pill */}
                  {isSearchMatch && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '0.65rem',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          backgroundColor: 'var(--color-surface, #FFFFFF)',
                          border: '1px solid rgba(212, 175, 55, 0.5)',
                          color: 'var(--color-accent, #D4AF37)',
                          padding: '0.2rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                        }}
                      >
                        <span>✦ ਖੋਜਿਆ ਤੁਕ • Selected Verse</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHighlight(null);
                            const nextParams = new URLSearchParams(searchParams);
                            nextParams.delete('highlight');
                            nextParams.delete('lineno');
                            setSearchParams(nextParams, { replace: true });
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-muted)',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            padding: '0 2px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                          title="Dismiss highlight"
                          aria-label="Dismiss search highlight"
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                  )}
                  {/* Gurmukhi Line */}
                  <div
                    className={`gurbani-verse ${larivaar ? 'gurbani-larivaar' : ''}`}
                    style={{ textAlign: 'center' }}
                  >
                    {formatGurmukhi(verseText)}
                  </div>

                  {/* Punjlish (English Transliteration) - ONLY rendered if user enables it in Settings */}
                  {punjlish && transliterationText && (
                    <div className="gurbani-transliteration" style={{ textAlign: 'center' }}>
                      {transliterationText}
                    </div>
                  )}

                  {/* English Translation */}
                  {englishTranslation && englishText && (
                    <div className="gurbani-translation" style={{ textAlign: 'center' }}>
                      {englishText}
                    </div>
                  )}

                  {/* Punjabi Teeka */}
                  {punjabiTeeka && teekaText && (
                    <div className="gurbani-punjabi-teeka" style={{ textAlign: 'center' }}>
                      {teekaText}
                    </div>
                  )}

                  {/* Verse Hover Actions */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginTop: 'var(--space-3)',
                      paddingTop: 'var(--space-2)',
                      borderTop: '1px dashed var(--color-border-subtle)',
                      opacity: 0.85,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleCopyVerse(verse)}
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Copy verse and citation"
                      aria-label="Copy verse"
                    >
                      {copiedId === verse.id ? (
                        <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem' }}>
                          <IconCheck size={14} /> Copied
                        </span>
                      ) : (
                        <IconCopy size={15} />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleBookmarkVerse(verse)}
                      className="btn btn-ghost btn-icon btn-sm"
                      style={{ color: isBookmarked ? 'var(--color-accent)' : 'inherit' }}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark this verse'}
                      aria-label="Bookmark verse"
                    >
                      <IconBookmark size={15} filled={isBookmarked} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNoteModalVerse(verse);
                        setNoteContent('');
                      }}
                      className="btn btn-ghost btn-icon btn-sm"
                      title="Add reflection note"
                      aria-label="Add reflection note"
                    >
                      <IconNote size={15} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom Ang Navigation Pagination */}
        <div
          style={{
            marginTop: 'var(--space-12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'var(--space-4) 0',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <button
            type="button"
            onClick={prevPage}
            disabled={page <= 1}
            className="btn btn-secondary"
          >
            <IconArrowLeft size={16} /> Previous Ang ({page > 1 ? page - 1 : 1})
          </button>

          <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>
            Ang {page} of {maxPage}
          </span>

          <button
            type="button"
            onClick={nextPage}
            disabled={page >= maxPage}
            className="btn btn-secondary"
          >
            Next Ang ({page < maxPage ? page + 1 : maxPage}) <IconArrowRight size={16} />
          </button>
        </div>
      </main>

      {/* Note Reflection Modal */}
      {noteModalVerse && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="panel" style={{ width: '100%', maxWidth: '520px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              Add Personal Reflection Note
            </h3>
            <p
              className="gurbani-text"
              style={{
                fontSize: '1.1rem',
                backgroundColor: 'var(--color-surface-hover)',
                padding: '0.65rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
              }}
            >
              {noteModalVerse.verse}
            </p>

            <div className="form-group">
              <label className="form-label">Your Note / Contemplation</label>
              <textarea
                rows="4"
                className="textarea-field"
                placeholder="Write your spiritual reflections, meanings, or personal contemplation..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
              />
            </div>

            {noteStatus && (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>
                {noteStatus}
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setNoteModalVerse(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveNote}
                disabled={!noteContent.trim()}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reader Settings Drawer Sidebar */}
      <ReaderSettingsDrawer
        isOpen={showSettingsDrawer}
        onClose={() => setShowSettingsDrawer(false)}
      />
    </div>
  );
};

export default ReaderPage;
