import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useAudioCatalog from '../hooks/useAudioCatalog';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { formatAudioTime } from '../utils/audioFormatters';
import ArchMedallion from '../Component/ArchMedallion';
import LoadingState from '../../../Shared/Components/LoadingState';
import ErrorState from '../../../Shared/Components/ErrorState';
import {
  IconSearch,
  IconPlay,
  IconPause,
  IconLock,
  IconHeadphones,
} from '../../../Shared/Components/Icons';
import '../Styles/audio-paath.scss';

export const AudioLibraryPage = () => {
  const { banis, loading, error } = useAudioCatalog();
  const { currentTrack, isPlaying, duration, playTrack, togglePlayPause } = useAudioPlayer();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Banis'); // 'All Banis' | 'Nitnem' | 'Bani' | 'Other'

  const categories = ['All Banis', 'Nitnem', 'Bani', 'Other'];

  // Categorize Banis matching user categories
  const categorizedBanis = useMemo(() => {
    return banis.map((b) => {
      let cat = 'Bani';
      if (
        ['japji-sahib', 'jaap-sahib', 'tav-prasad-savaiye', 'chaupai-sahib', 'anand-sahib', 'rehras-sahib', 'kirtan-sohila'].includes(b.slug)
      ) {
        cat = 'Nitnem';
      } else if (['sukhmani-sahib', 'mool-mantar', 'asa-ki-vaar'].includes(b.slug)) {
        cat = 'Bani';
      } else {
        cat = 'Other';
      }
      return { ...b, categoryType: cat };
    });
  }, [banis]);

  const filteredBanis = useMemo(() => {
    let result = categorizedBanis;

    if (selectedCategory !== 'All Banis') {
      result = result.filter((b) => b.categoryType === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.english_name?.toLowerCase().includes(q) ||
          b.punjabi_name?.toLowerCase().includes(q) ||
          b.title?.toLowerCase().includes(q) ||
          b.gurmukhi_title?.toLowerCase().includes(q) ||
          b.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [categorizedBanis, selectedCategory, searchQuery]);

  const handlePlayCard = (e, bani) => {
    e.stopPropagation();
    if (!bani.is_available) return;

    if (currentTrack?.slug === bani.slug) {
      togglePlayPause();
    } else {
      playTrack(bani);
    }
  };

  const handleCardClick = (bani) => {
    if (bani.is_available) {
      navigate(`/audio/${bani.slug}`);
    }
  };

  return (
    <div style={{ padding: 'var(--space-8) 0 var(--space-16) 0' }}>
      <div className="container" style={{ maxWidth: '1120px' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--color-surface-hover, #FAF8F2)',
              color: 'var(--color-primary, #24483D)',
              padding: '0.3rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              border: '1px solid var(--color-border, #E7E0D2)',
              marginBottom: '0.65rem',
            }}
          >
            <IconHeadphones size={14} style={{ color: 'var(--color-accent, #C49A55)' }} />
            ਆਡੀਓ ਪਾਠ • Audio Paath
          </div>
          <h1
            style={{
              fontFamily: "var(--font-editorial, 'Lora', Georgia, serif)",
              fontSize: '2.4rem',
              fontWeight: 700,
              color: 'var(--color-primary, #24483D)',
              margin: '0 0 0.4rem 0',
              letterSpacing: '-0.01em',
            }}
          >
            Audio Paath
          </h1>
          <p
            style={{
              fontSize: '1rem',
              color: 'var(--color-text-secondary, #586358)',
              margin: 0,
              maxWidth: '560px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.5,
            }}
          >
            Listen to Gurbani with peace and focus.
          </p>
        </div>

        {/* Top Control Bar: Search Input on Left, Category Filter Pills on Right */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: 'var(--space-8)',
          }}
        >
          {/* Rounded Pill Search Input */}
          <div style={{ position: 'relative', flex: '1 1 340px', maxWidth: '520px' }}>
            <div
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-muted)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <IconSearch size={18} />
            </div>
            <input
              type="search"
              placeholder="Search Bani (e.g. Anand Sahib, Japji Sahib, ਮੂਲ ਮੰਤਰ...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 42px',
                borderRadius: '9999px',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                fontSize: '0.92rem',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)',
              }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '0.55rem 1.35rem',
                    borderRadius: '9999px',
                    fontSize: '0.88rem',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all var(--transition-fast)',
                    backgroundColor: isActive ? 'var(--color-primary, #24483D)' : 'var(--color-surface-hover)',
                    color: isActive ? '#ffffff' : 'var(--color-text)',
                    boxShadow: isActive ? '0 2px 8px rgba(36, 72, 61, 0.25)' : 'none',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading and Error States */}
        {loading ? (
          <LoadingState message="Loading Audio Paath catalogue..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          /* Cards Grid: Fully responsive 100% on mobile, 2 cols on desktop */
          <div className="audio-library-grid">
            {filteredBanis.map((bani) => {
              const isCurrentPlaying = currentTrack?.slug === bani.slug && isPlaying;
              const isCurrentSelected = currentTrack?.slug === bani.slug;

              return (
                <div
                  key={bani.id}
                  onClick={() => handleCardClick(bani)}
                  className={`audio-card ${bani.is_available ? 'is-available' : ''} ${isCurrentSelected ? 'is-selected' : ''}`}
                >
                  {/* Top Status & Selection Badge */}
                  <div className="audio-card-badge-row">
                    <div>
                      {bani.is_available ? (
                        <span className="audio-badge-available">
                          ✔ Available to Listen
                        </span>
                      ) : (
                        <span className="audio-badge-upcoming">
                          ○ Recording Coming Soon
                        </span>
                      )}
                    </div>

                    {isCurrentSelected && (
                      <span className="audio-badge-playing">
                        {isPlaying ? '▶ Currently Playing' : '❚❚ Paused'}
                      </span>
                    )}
                  </div>

                  {/* Split Content: Left Information & Right Decorative Medallion / Controls */}
                  <div className="audio-card-body">
                    {/* Left Column: Titles & Description */}
                    <div className="audio-card-info">
                      <h3 className="gurbani-text audio-card-title-punjabi">
                        {bani.punjabi_name || bani.gurmukhi_title}
                      </h3>

                      <h4 className="audio-card-title-english">
                        {bani.english_name || bani.title}
                      </h4>

                      <p className="audio-card-description">
                        {bani.description}
                      </p>

                      {bani.is_available && (
                        <div className="audio-card-duration">
                          <IconHeadphones size={15} />
                          <span>
                            {currentTrack?.slug === bani.slug && duration > 0
                              ? formatAudioTime(duration)
                              : bani.duration_seconds > 0
                              ? formatAudioTime(bani.duration_seconds)
                              : 'Ready'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Divider Line */}
                    <div className="audio-card-divider" />

                    {/* Right Column: Ornate Medallion & Action Trigger */}
                    <div className="audio-card-actions">
                      {bani.is_available ? (
                        <>
                          {/* Medallion with Headphone */}
                          <ArchMedallion isAvailable={true} size={50}>
                            <IconHeadphones size={20} />
                          </ArchMedallion>

                          {/* Circular Deep Green / Gold Play Button */}
                          <button
                            type="button"
                            onClick={(e) => handlePlayCard(e, bani)}
                            title={isCurrentPlaying ? 'Pause' : 'Play Now'}
                            aria-label={isCurrentPlaying ? 'Pause' : 'Play Now'}
                            className="audio-card-play-btn"
                          >
                            {isCurrentPlaying ? (
                              <IconPause size={16} />
                            ) : (
                              <IconPlay size={16} style={{ marginLeft: '2px' }} />
                            )}
                          </button>
                        </>
                      ) : (
                        /* Medallion with Padlock Icon */
                        <ArchMedallion isAvailable={false} size={50}>
                          <IconLock size={20} style={{ color: 'var(--color-muted)' }} />
                        </ArchMedallion>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredBanis.length === 0 && !loading && (
          <div
            style={{
              textAlign: 'center',
              padding: 'var(--space-12) var(--space-4)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              marginTop: 'var(--space-6)',
            }}
          >
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>
              No Banis found matching "{searchQuery}" in category "{selectedCategory}".
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Banis');
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioLibraryPage;
