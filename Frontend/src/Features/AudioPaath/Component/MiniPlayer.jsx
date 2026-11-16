import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { formatAudioTime } from '../utils/audioFormatters';
import {
  IconPlay,
  IconPause,
  IconRepeat,
  IconShuffle,
  IconSkipBack,
  IconSkipForward,
  IconVolume,
  IconVolumeMute,
  IconHeadphones,
  IconHeart,
  IconList,
  IconChevronUp,
  IconClose,
} from '../../../Shared/Components/Icons';
import '../Styles/audio-paath.scss';

export const MiniPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isRepeating,
    togglePlayPause,
    closeMiniPlayer,
    isMiniPlayerVisible,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleRepeat,
    playNext,
    playPrevious,
  } = useAudioPlayer();

  const [isFavorite, setIsFavorite] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If no track is loaded, or user closed the player, do not render
  if (!currentTrack || !isMiniPlayerVisible) {
    return null;
  }

  // Hide the mini-player when already on that track's full audio page
  if (location.pathname === `/audio/${currentTrack.slug}`) {
    return null;
  }

  const activeDuration = duration > 0 ? duration : currentTrack.duration_seconds || 0;
  const progressPercent = activeDuration > 0 ? (currentTime / activeDuration) * 100 : 0;

  const handleOpenFullPlayer = () => {
    navigate(`/audio/${currentTrack.slug}`);
  };

  const speedCycle = [0.75, 1, 1.25, 1.5, 2];
  const handleCycleSpeed = () => {
    const curIdx = speedCycle.indexOf(playbackRate);
    const nextIdx = (curIdx + 1) % speedCycle.length;
    setPlaybackRate(speedCycle[nextIdx]);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 300,
        backgroundColor: '#132c23', // Deep forest green matching Screenshot 2
        color: '#ffffff',
        borderTop: '1px solid rgba(212, 163, 89, 0.3)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.35)',
        padding: '0.65rem 1.25rem',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.25rem',
        }}
      >
        {/* Left Section: Caret, Headphone Circle, Titles & Favorite Heart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            minWidth: '220px',
            flex: '1 1 240px',
          }}
        >
          {/* Caret to expand to full player */}
          <button
            type="button"
            onClick={handleOpenFullPlayer}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem',
            }}
            title="Expand player"
            aria-label="Expand player"
          >
            <IconChevronUp size={20} />
          </button>

          {/* Golden Circled Headphone Badge */}
          <div
            onClick={handleOpenFullPlayer}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1.5px solid #d4a359',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <IconHeadphones size={20} />
          </div>

          {/* Bani Titles */}
          <div
            onClick={handleOpenFullPlayer}
            style={{ cursor: 'pointer', minWidth: 0, overflow: 'hidden' }}
          >
            <div
              className="gurbani-text"
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1.15,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentTrack.punjabi_name || currentTrack.gurmukhi_title}
            </div>
            <div
              style={{
                fontSize: '0.82rem',
                color: '#d4a359',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 500,
              }}
            >
              {currentTrack.english_name || currentTrack.title}
            </div>
          </div>

          {/* Heart Favorite Toggle */}
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            style={{
              background: 'none',
              border: 'none',
              color: isFavorite ? '#d4a359' : '#a8b5ac',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.25rem',
              marginLeft: '0.25rem',
            }}
            title={isFavorite ? 'Saved to favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <IconHeart size={18} filled={isFavorite} />
          </button>
        </div>

        {/* Center Section: Playback Buttons & Seek Progress Bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: '2 1 480px',
            maxWidth: '560px',
          }}
        >
          {/* Controls Row: Shuffle, Prev, Play/Pause (Gold circle), Next, Repeat */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.15rem',
              marginBottom: '0.35rem',
            }}
          >
            {/* Shuffle */}
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                color: '#a8b5ac',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Shuffle"
              aria-label="Shuffle"
            >
              <IconShuffle size={17} />
            </button>

            {/* Previous Track */}
            <button
              type="button"
              onClick={playPrevious}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Previous"
              aria-label="Previous track"
            >
              <IconSkipBack size={19} />
            </button>

            {/* Golden Circle Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlayPause}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#d4a359',
                color: '#132c23',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                padding: 0,
              }}
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <IconPause size={18} /> : <IconPlay size={18} style={{ marginLeft: '2px' }} />}
            </button>

            {/* Next Track */}
            <button
              type="button"
              onClick={playNext}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Next"
              aria-label="Next track"
            >
              <IconSkipForward size={19} />
            </button>

            {/* Repeat */}
            <button
              type="button"
              onClick={toggleRepeat}
              style={{
                background: 'none',
                border: 'none',
                color: isRepeating ? '#d4a359' : '#a8b5ac',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
              title={isRepeating ? 'Repeat on' : 'Repeat off'}
              aria-label="Repeat track"
            >
              <IconRepeat size={17} />
            </button>
          </div>

          {/* Seek Progress Bar with Time Display (Matching Screenshot 2) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              gap: '0.65rem',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#a8b5ac', fontFamily: 'monospace', minWidth: '32px' }}>
              {formatAudioTime(currentTime)}
            </span>

            <input
              type="range"
              min="0"
              max={activeDuration || 100}
              step="1"
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Seek track"
              style={{
                width: '100%',
                height: '4px',
                borderRadius: '9999px',
                background: `linear-gradient(to right, #d4a359 0%, #d4a359 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
              }}
            />

            <span style={{ fontSize: '0.78rem', color: '#a8b5ac', fontFamily: 'monospace', minWidth: '32px', textAlign: 'right' }}>
              {formatAudioTime(activeDuration)}
            </span>
          </div>
        </div>

        {/* Right Section: Volume Slider, Speed Pill, List, and Close Control */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.85rem',
            minWidth: '220px',
            flex: '1 1 240px',
          }}
          className="desktop-only-controls"
        >
          {/* Volume Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={toggleMute}
              style={{
                background: 'none',
                border: 'none',
                color: isMuted ? '#a8b5ac' : '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem',
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label="Toggle mute"
            >
              {isMuted ? <IconVolumeMute size={18} /> : <IconVolume size={18} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume"
              style={{
                width: '75px',
                height: '4px',
                cursor: 'pointer',
                background: `linear-gradient(to right, #d4a359 0%, #d4a359 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`,
                appearance: 'none',
                borderRadius: '9999px',
              }}
            />
          </div>

          {/* Speed Pill Indicator (e.g. 1.0x) */}
          <button
            type="button"
            onClick={handleCycleSpeed}
            style={{
              padding: '0.2rem 0.55rem',
              fontSize: '0.78rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backgroundColor: 'transparent',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)',
            }}
            title="Change playback speed"
            aria-label="Playback speed"
          >
            {playbackRate}×
          </button>

          {/* Playlist / Queue Button */}
          <button
            type="button"
            onClick={() => navigate('/audio')}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem',
            }}
            title="Browse all Banis"
            aria-label="Browse audio catalogue"
          >
            <IconList size={19} />
          </button>

          {/* Dismiss / Close Mini Player */}
          <button
            type="button"
            onClick={closeMiniPlayer}
            style={{
              background: 'none',
              border: 'none',
              color: '#a8b5ac',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.2rem',
            }}
            title="Dismiss mini player"
            aria-label="Dismiss mini player"
          >
            <IconClose size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
