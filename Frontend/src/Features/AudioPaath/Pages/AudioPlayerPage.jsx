import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import audioApi from '../services/audio.api';
import AUDIO_CATALOG_FALLBACK from '../config/audioCatalogFallback';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { formatAudioTime } from '../utils/audioFormatters';
import LoadingState from '../../../Shared/Components/LoadingState';
import ErrorState from '../../../Shared/Components/ErrorState';
import {
  IconArrowLeft,
  IconPlay,
  IconPause,
  IconRepeat,
  IconSkipBack,
  IconSkipForward,
  IconVolume,
  IconVolumeMute,
  IconLotus,
  IconHeadphones,
  IconAlertCircle,
} from '../../../Shared/Components/Icons';
import '../Styles/audio-paath.scss';

export const AudioPlayerPage = () => {
  const { baniSlug } = useParams();
  const navigate = useNavigate();

  const [baniData, setBaniData] = useState(() =>
    AUDIO_CATALOG_FALLBACK.find((b) => b.slug === baniSlug) || null
  );
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isRepeating,
    isLoading,
    error: playbackError,
    playTrack,
    pause,
    resume,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleRepeat,
    playNext,
    playPrevious,
  } = useAudioPlayer();

  // Fetch track metadata for this slug
  useEffect(() => {
    let isMounted = true;
    setFetching(true);
    setFetchError(null);

    audioApi
      .getBySlug(baniSlug)
      .then((data) => {
        if (!isMounted) return;
        const bani = data?.data?.bani || data?.bani;
        if (bani) {
          setBaniData(bani);
        } else {
          const fallback = AUDIO_CATALOG_FALLBACK.find((b) => b.slug === baniSlug);
          if (fallback) setBaniData(fallback);
          else setFetchError('Bani audio recording not found.');
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const fallback = AUDIO_CATALOG_FALLBACK.find((b) => b.slug === baniSlug);
        if (fallback) {
          setBaniData(fallback);
        } else {
          setFetchError('Unable to retrieve Bani recording information.');
        }
      })
      .finally(() => {
        if (isMounted) setFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [baniSlug]);

  // Keep URL in sync when track changes via Previous / Next
  useEffect(() => {
    if (currentTrack?.slug && currentTrack.slug !== baniSlug) {
      navigate(`/audio/${currentTrack.slug}`, { replace: true });
    }
  }, [currentTrack, baniSlug, navigate]);

  const isCurrentTrackLoaded = currentTrack?.slug === baniSlug;
  const isCurrentTrackPlaying = isCurrentTrackLoaded && isPlaying;

  const handleMainPlayToggle = () => {
    if (!baniData || !baniData.is_available) return;

    if (isCurrentTrackLoaded) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
    } else {
      // User explicitly initiated playback - no autoplay prior to this
      playTrack(baniData);
    }
  };

  const activeDuration = isCurrentTrackLoaded && duration > 0 ? duration : baniData?.duration_seconds || 0;
  const activeTime = isCurrentTrackLoaded ? currentTime : 0;
  const progressPercent = activeDuration > 0 ? (activeTime / activeDuration) * 100 : 0;

  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  if (fetching && !baniData) {
    return (
      <div style={{ padding: 'var(--space-12) 0' }}>
        <LoadingState message="Preparing sanctuary audio player..." />
      </div>
    );
  }

  if (fetchError && !baniData) {
    return (
      <div style={{ padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ maxWidth: '680px' }}>
          <ErrorState message={fetchError || 'Bani audio recording not found.'} />
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link to="/audio" className="btn btn-secondary">
              <IconArrowLeft size={16} /> Return to Audio Library
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-8) 0 var(--space-14) 0' }}>
      <div className="container" style={{ maxWidth: '780px' }}>
        {/* Navigation Bar */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link
            to="/audio"
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-secondary)' }}
          >
            <IconArrowLeft size={16} /> Audio Paath Library
          </Link>
        </div>

        {/* Player Sanctuary Card */}
        <div
          className="panel"
          style={{
            padding: 'var(--space-8) var(--space-6)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            textAlign: 'center',
          }}
        >
          {/* Spiritual Emblem & Artwork Header */}
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-hover)',
              border: '2px solid var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
              color: 'var(--color-accent)',
              boxShadow: '0 4px 16px rgba(196, 154, 85, 0.15)',
            }}
          >
            <IconLotus size={48} />
          </div>

          {/* Badge */}
          <div className="badge badge-gold" style={{ marginBottom: '0.75rem', fontSize: '0.78rem' }}>
            {baniData?.category || 'ਗੁਰਬਾਣੀ ਆਡੀਓ ਪਾਠ'}
          </div>

          {/* Gurmukhi Title */}
          <h1
            className="gurbani-text"
            style={{
              fontSize: '2.4rem',
              color: 'var(--color-primary)',
              marginBottom: '0.35rem',
              lineHeight: 1.2,
            }}
          >
            {baniData?.punjabi_name || baniData?.gurmukhi_title}
          </h1>

          {/* English Title */}
          <h2
            style={{
              fontSize: '1.45rem',
              fontWeight: 600,
              color: 'var(--color-text)',
              marginBottom: '0.4rem',
            }}
          >
            {baniData?.english_name || baniData?.title}
          </h2>

          {/* Author */}
          {baniData?.author && (
            <p
              style={{
                fontSize: '0.92rem',
                color: 'var(--color-accent)',
                fontWeight: 500,
                marginBottom: '1rem',
              }}
            >
              {baniData.author}
            </p>
          )}

          {/* Description */}
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              maxWidth: '560px',
              margin: '0 auto 2rem auto',
              lineHeight: 1.6,
            }}
          >
            {baniData?.description}
          </p>

          {/* Unavailable state warning */}
          {!baniData?.is_available ? (
            <div
              style={{
                padding: 'var(--space-6)',
                backgroundColor: 'var(--color-surface-hover)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--color-border)',
                margin: '1.5rem 0',
              }}
            >
              <IconHeadphones size={24} style={{ color: 'var(--color-muted)', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Recording Coming Soon</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', maxWidth: '420px', margin: '0 auto 1rem auto' }}>
                The audio recording for {baniData?.english_name} will be uploaded soon.
              </p>
              <Link to="/audio/anand-sahib" className="btn btn-primary btn-sm">
                Listen to Anand Sahib Instead
              </Link>
            </div>
          ) : (
            <>
              {/* Playback Error Message */}
              {playbackError && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid var(--color-error)',
                    color: 'var(--color-error)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <IconAlertCircle size={16} />
                  <span>{playbackError}</span>
                </div>
              )}

              {/* Seekable Progress Bar */}
              <div style={{ margin: '0 auto 1.5rem auto', maxWidth: '580px' }}>
                <input
                  type="range"
                  min="0"
                  max={activeDuration || 100}
                  step="1"
                  value={activeTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  aria-label="Seek track position"
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${progressPercent}%, var(--color-border) ${progressPercent}%, var(--color-border) 100%)`,
                    cursor: 'pointer',
                    outline: 'none',
                    appearance: 'none',
                  }}
                />

                {/* Time Display */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.82rem',
                    color: 'var(--color-text-secondary)',
                    marginTop: '0.4rem',
                    fontFamily: 'monospace',
                  }}
                >
                  <span>{formatAudioTime(activeTime)}</span>
                  <span>{isLoading ? 'Buffering...' : formatAudioTime(activeDuration)}</span>
                </div>
              </div>

              {/* Main Playback Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                {/* Repeat Toggle with Tooltip / State */}
                <button
                  type="button"
                  onClick={toggleRepeat}
                  className="btn btn-icon btn-ghost"
                  title={isRepeating ? 'Repeat current recording (On)' : 'Repeat off'}
                  aria-label="Toggle repeat"
                  style={{
                    color: isRepeating ? 'var(--color-accent)' : 'var(--color-muted)',
                    transition: 'color var(--transition-fast)',
                    position: 'relative',
                  }}
                >
                  <IconRepeat size={20} />
                  {isRepeating && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '2px',
                        fontSize: '9px',
                        fontWeight: 800,
                        color: 'var(--color-accent)',
                      }}
                    >
                      1
                    </span>
                  )}
                </button>

                {/* Previous Track */}
                <button
                  type="button"
                  onClick={playPrevious}
                  className="btn btn-icon btn-ghost"
                  title="Previous recording"
                  aria-label="Previous recording"
                >
                  <IconSkipBack size={22} />
                </button>

                {/* Primary Play / Pause Button */}
                <button
                  type="button"
                  onClick={handleMainPlayToggle}
                  className="btn btn-primary"
                  title={isCurrentTrackPlaying ? 'Pause Paath' : 'Play Paath'}
                  aria-label={isCurrentTrackPlaying ? 'Pause Paath' : 'Play Paath'}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(36, 72, 61, 0.35)',
                    padding: 0,
                  }}
                >
                  {isLoading ? (
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        border: '3px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        display: 'inline-block',
                      }}
                    />
                  ) : isCurrentTrackPlaying ? (
                    <IconPause size={24} />
                  ) : (
                    <IconPlay size={24} style={{ marginLeft: '3px' }} />
                  )}
                </button>

                {/* Next Track */}
                <button
                  type="button"
                  onClick={playNext}
                  className="btn btn-icon btn-ghost"
                  title="Next recording"
                  aria-label="Next recording"
                >
                  <IconSkipForward size={22} />
                </button>

                {/* Volume / Mute Toggle */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="btn btn-icon btn-ghost"
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  style={{ color: isMuted ? 'var(--color-muted)' : 'inherit' }}
                >
                  {isMuted ? <IconVolumeMute size={20} /> : <IconVolume size={20} />}
                </button>
              </div>

              {/* Secondary Controls Bar: Volume Slider & Speed Controls */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--color-border)',
                  gap: '1rem',
                  maxWidth: '580px',
                  margin: '0 auto',
                }}
              >
                {/* Volume Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', fontWeight: 500 }}>
                    Volume
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    aria-label="Audio volume"
                    style={{
                      width: '90px',
                      height: '4px',
                      cursor: 'pointer',
                    }}
                  />
                </div>

                {/* Playback Speed Selector: 0.75x, 1x, 1.25x, 1.5x, 2x */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginRight: '0.2rem' }}>
                    Speed:
                  </span>
                  {speedOptions.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPlaybackRate(rate)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        fontSize: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                        backgroundColor: playbackRate === rate ? 'var(--color-primary)' : 'transparent',
                        color: playbackRate === rate ? '#fff' : 'var(--color-text)',
                        fontWeight: playbackRate === rate ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayerPage;
