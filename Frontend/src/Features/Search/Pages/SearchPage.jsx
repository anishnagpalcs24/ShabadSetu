import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSearch from '../hooks/useSearch';
import { useReader } from '../../Gurbani/hooks/useReader';
import { SEARCH_TYPES, GRANTH_SOURCES } from '../../../Shared/Utils/sources';
import { normalizeVerse } from '../../../Shared/Utils/gurbani';
import LoadingState from '../../../Shared/Components/LoadingState';
import EmptyState from '../../../Shared/Components/EmptyState';
import ErrorState from '../../../Shared/Components/ErrorState';
import PunjabiKeyboard from '../Component/PunjabiKeyboard';
import '../Styles/search.scss';
import {
  IconSearch,
  IconBook,
  IconArrowRight,
  IconClose,
  IconKeyboard,
} from '../../../Shared/Components/Icons';

export const SearchPage = () => {
  const {
    query,
    setQuery,
    searchType,
    setSearchType,
    source,
    setSource,
    ang,
    setAng,
    resultsLimit,
    setResultsLimit,
    skip,
    setSkip,
    results,
    totalCount,
    loading,
    error,
    clearFilters,
  } = useSearch();

  const { setPage, setSource: setReaderSource } = useReader();
  const navigate = useNavigate();

  const [showKeyboard, setShowKeyboard] = useState(false);

  const activeTypeInfo = SEARCH_TYPES.find((t) => t.id === searchType) || SEARCH_TYPES[0];

  const handleNavigateToAng = (pageNumber, sourceCode, lineId, lineNo) => {
    if (sourceCode) setReaderSource(sourceCode);
    if (pageNumber) setPage(parseInt(pageNumber, 10));
    const searchParams = new URLSearchParams();
    if (pageNumber) searchParams.set('ang', pageNumber);
    if (sourceCode) searchParams.set('source', sourceCode);
    if (lineId) searchParams.set('highlight', lineId);
    if (lineNo) searchParams.set('lineno', lineNo);
    navigate(`/reader?${searchParams.toString()}`);
  };

  const handleKeyboardPress = (char) => {
    setQuery((prev) => (prev ? prev + char : char));
    setSkip(0);
  };

  const handleKeyboardBackspace = () => {
    setQuery((prev) => (prev ? prev.slice(0, -1) : ''));
    setSkip(0);
  };

  const handleKeyboardClear = () => {
    setQuery('');
    setSkip(0);
  };

  return (
    <div className="search-page-wrapper">
      <div className="container search-container">
        {/* Page Header */}
        <div className="search-header">
          <h1 className="search-title">
            Gurbani Search Engine
          </h1>
          <p className="search-subtitle">
            Explore the vast wisdom of Gurbani with first-letter indexing, exact Gurmukhi words, English keywords, and scripture filters.
          </p>
        </div>

        {/* Search Box Panel */}
        <div className="panel search-box-panel">
          {/* Main Search Input */}
          <div className={`search-input-wrapper ${showKeyboard ? 'keyboard-open' : ''}`}>
            <span className="search-icon-adornment">
              <IconSearch size={22} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSkip(0);
              }}
              onFocus={() => {
                // If on mobile or touch, can open keyboard smoothly
                if (!showKeyboard && (searchType === 0 || searchType === 1 || searchType === 2 || searchType === 3)) {
                  setShowKeyboard(true);
                }
              }}
              placeholder={activeTypeInfo.placeholder}
              className={`input-field search-main-input ${query ? 'has-query' : ''}`}
              autoFocus
            />

            {/* Gurmukhi Keyboard Toggle Button */}
            <button
              type="button"
              onClick={() => setShowKeyboard((prev) => !prev)}
              className={`btn btn-icon ${showKeyboard ? 'btn-primary' : 'btn-ghost'} search-keyboard-toggle-btn ${query ? 'has-query' : ''}`}
              title={showKeyboard ? 'ਕੀਬੋਰਡ ਬੰਦ ਕਰੋ (Close Punjabi Keyboard)' : 'ਪੰਜਾਬੀ ਕੀਬੋਰਡ (Open Gurmukhi Keyboard)'}
              aria-label="Toggle Gurmukhi Keyboard"
            >
              <IconKeyboard size={20} />
            </button>

            {/* Clear Query Button */}
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="btn btn-icon btn-ghost search-clear-btn"
                aria-label="Clear search"
              >
                <IconClose size={18} />
              </button>
            )}
          </div>

          {/* On-Screen Punjabi Virtual Keyboard */}
          {showKeyboard && (
            <PunjabiKeyboard
              onKeyPress={handleKeyboardPress}
              onBackspace={handleKeyboardBackspace}
              onClear={handleKeyboardClear}
              onClose={() => setShowKeyboard(false)}
            />
          )}

          {/* Search Type Tabs */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Search Type Mode:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {SEARCH_TYPES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSearchType(t.id);
                    setSkip(0);
                  }}
                  className={`btn btn-sm ${searchType === t.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Scripture Filters */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              alignItems: 'center',
              paddingTop: 'var(--space-3)',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            {/* Granth Source Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                Scripture:
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="select-field"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
              >
                {GRANTH_SOURCES.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ang Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                Filter Ang:
              </label>
              <input
                type="number"
                placeholder="Any"
                value={ang}
                onChange={(e) => setAng(e.target.value)}
                className="input-field"
                style={{ width: '80px', padding: '0.25rem 0.4rem', fontSize: '0.8rem' }}
              />
            </div>

            {/* Results Limit */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                Results limit:
              </label>
              <select
                value={resultsLimit}
                onChange={(e) => setResultsLimit(parseInt(e.target.value, 10))}
                className="select-field"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
              >
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 (Max)</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(source !== 'G' || ang || searchType !== 0) && (
              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.78rem', marginLeft: 'auto' }}
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div>
          {loading ? (
            <LoadingState message="Searching the sacred scripture..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : !query.trim() ? (
            <div className="panel" style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-4)' }}>
              <div style={{ color: 'var(--color-accent)', marginBottom: '1rem' }}>
                <IconSearch size={36} />
              </div>
              <h3 className="state-title">Ready to Search Gurbani</h3>
              <p className="state-message" style={{ margin: '0 auto' }}>
                Type First Letters of any shabad line (e.g. <code>ਸ ਗ</code> or <code>s g</code>), full Gurmukhi words, or English translation keywords above.
              </p>
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              title={`No verses found for "${query}"`}
              message="Try switching to 'First Letter (Anywhere)', verifying spelling, or broadening your search terms."
              actionLabel="Try First-Letter Anywhere"
              onAction={() => setSearchType(1)}
            />
          ) : (
            <div>
              {/* Results Count Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-4)',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                }}
              >
                <span>Found {typeof totalCount === 'number' ? totalCount : results.length} matching verses</span>
                <span>Mode: {activeTypeInfo?.label || 'First Letter'}</span>
              </div>

              {/* Verse Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {results.map((rawItem, idx) => {
                  const verse = normalizeVerse(rawItem);
                  const verseText = verse.verse;
                  const englishText = verse.translation;
                  const pageNumber = verse.pageNumber;
                  const itemSource = verse.source || source;

                  return (
                    <div
                      key={verse.id || idx}
                      className="panel"
                      style={{
                        padding: 'var(--space-5)',
                        transition: 'border-color var(--transition-fast)',
                      }}
                    >
                      {/* Gurmukhi Line */}
                      <p
                        className="gurbani-verse"
                        style={{
                          fontSize: '1.35rem',
                          lineHeight: 1.8,
                          marginBottom: '0.4rem',
                        }}
                      >
                        {verseText}
                      </p>

                      {/* English Translation */}
                      {englishText && (
                        <p
                          className="gurbani-translation"
                          style={{ fontSize: '0.925rem', marginBottom: '0.75rem' }}
                        >
                          {englishText}
                        </p>
                      )}

                      {/* Punjabi Teeka if present */}
                      {verse.teeka && (
                        <p
                          className="gurbani-teeka"
                          style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}
                        >
                          {verse.teeka}
                        </p>
                      )}

                      {/* Citation & Navigation Link */}
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '0.5rem',
                          borderTop: '1px dashed var(--color-border-subtle)',
                          paddingTop: '0.6rem',
                          marginTop: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span className="badge badge-primary">
                            Ang {pageNumber || '—'}
                          </span>
                          <span className="badge badge-sage">
                            {itemSource === 'G' ? 'Guru Granth Sahib Ji' : itemSource}
                          </span>
                          {verse.writer && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                              Writer: {verse.writer}
                            </span>
                          )}
                          {verse.raag && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)' }}>
                              Raag: {verse.raag}
                            </span>
                          )}
                        </div>

                        {pageNumber && (
                          <button
                            type="button"
                            onClick={() =>
                              handleNavigateToAng(
                                pageNumber,
                                itemSource,
                                verse.id,
                                verse.raw?.lineno || verse.raw?.orderid
                              )
                            }
                            className="btn btn-outline btn-sm"
                            style={{ fontSize: '0.78rem' }}
                            title={`Read this shabad line on Ang ${pageNumber}`}
                          >
                            <IconBook size={14} /> Read on Ang {pageNumber} <IconArrowRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalCount > resultsLimit && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'var(--space-8)',
                  }}
                >
                  <button
                    type="button"
                    disabled={skip <= 0}
                    onClick={() => setSkip((prev) => Math.max(prev - resultsLimit, 0))}
                    className="btn btn-secondary btn-sm"
                  >
                    Previous Page
                  </button>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>
                    Showing {skip + 1} - {Math.min(skip + resultsLimit, totalCount)} of {totalCount}
                  </span>
                  <button
                    type="button"
                    disabled={skip + resultsLimit >= totalCount}
                    onClick={() => setSkip((prev) => prev + resultsLimit)}
                    className="btn btn-secondary btn-sm"
                  >
                    Next Page
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
