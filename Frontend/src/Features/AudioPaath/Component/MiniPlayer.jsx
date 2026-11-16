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
  const progressPercent = activeDuration > 0 ? Math.min(100, Math.max(0, (currentTime / activeDuration) * 100)) : 0;

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
    <aside className="mini-player-root" aria-label="Audio Paath Player">
      {/* Mobile Top Scrub / Progress Line */}
      <div
        className="mini-player-mobile-progress"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, clickX / rect.width));
          seek(ratio * activeDuration);
        }}
      >
        <div
          className="mini-player-mobile-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mini-player-container">
        {/* Left Section: Headphone Badge & Titles */}
        <div className="mini-player-left">
          {/* Caret to expand to full player */}
          <button
            type="button"
            onClick={handleOpenFullPlayer}
            className="mini-player-expand-btn"
            title="Expand player"
            aria-label="Expand player"
          >
            <IconChevronUp size={20} />
          </button>

          {/* Golden Circled Headphone Badge */}
          <div
            onClick={handleOpenFullPlayer}
            className="mini-player-badge"
            title="Open Audio Paath"
          >
            <IconHeadphones size={18} />
          </div>

          {/* Bani Titles */}
          <div
            onClick={handleOpenFullPlayer}
            className="mini-player-titles"
          >
            <span className="mini-player-title-punjabi gurbani-text">
              {currentTrack.punjabi_name || currentTrack.gurmukhi_title}
            </span>
            <span className="mini-player-title-english">
              {currentTrack.english_name || currentTrack.title}
            </span>
          </div>

          {/* Heart Favorite Toggle */}
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`mini-player-fav-btn ${isFavorite ? 'is-fav' : ''}`}
            title={isFavorite ? 'Saved to favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <IconHeart size={18} filled={isFavorite} />
          </button>
        </div>

        {/* Center Section: Playback Buttons & Seek Progress Bar */}
        <div className="mini-player-center">
          {/* Controls Row */}
          <div className="mini-player-controls-row">
            <button
              type="button"
              className="mini-player-ctrl-btn desktop-only"
              title="Shuffle"
              aria-label="Shuffle"
            >
              <IconShuffle size={16} />
            </button>

            <button
              type="button"
              onClick={playPrevious}
              className="mini-player-ctrl-btn"
              title="Previous Bani"
              aria-label="Previous track"
            >
              <IconSkipBack size={18} />
            </button>

            {/* Circular Gold Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlayPause}
              className="mini-player-play-btn"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <IconPause size={18} /> : <IconPlay size={18} style={{ marginLeft: '2px' }} />}
            </button>

            <button
              type="button"
              onClick={playNext}
              className="mini-player-ctrl-btn"
              title="Next Bani"
              aria-label="Next track"
            >
              <IconSkipForward size={18} />
            </button>

            <button
              type="button"
              onClick={toggleRepeat}
              className={`mini-player-ctrl-btn desktop-only ${isRepeating ? 'is-active' : ''}`}
              title={isRepeating ? 'Repeat on' : 'Repeat off'}
              aria-label="Repeat track"
            >
              <IconRepeat size={16} />
            </button>
          </div>

          {/* Desktop Seek Progress Bar with Time Display */}
          <div className="mini-player-seek-row desktop-only">
            <span className="mini-player-time">
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
              className="mini-player-slider"
              style={{
                background: `linear-gradient(to right, #d4a359 0%, #d4a359 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />

            <span className="mini-player-time right">
              {formatAudioTime(activeDuration)}
            </span>
          </div>
        </div>

        {/* Right Section: Volume Slider, Speed Pill, List, and Close Control */}
        <div className="mini-player-right">
          {/* Volume Control */}
          <div className="mini-player-volume desktop-only">
            <button
              type="button"
              onClick={toggleMute}
              className="mini-player-ctrl-btn"
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
              className="mini-player-vol-slider"
              style={{
                background: `linear-gradient(to right, #d4a359 0%, #d4a359 ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />
          </div>

          {/* Speed Pill Indicator */}
          <button
            type="button"
            onClick={handleCycleSpeed}
            className="mini-player-speed-btn desktop-only"
            title="Change playback speed"
            aria-label="Playback speed"
          >
            {playbackRate}×
          </button>

          {/* Playlist / Queue Button */}
          <button
            type="button"
            onClick={() => navigate('/audio')}
            className="mini-player-ctrl-btn desktop-only"
            title="Browse all Banis"
            aria-label="Browse audio catalogue"
          >
            <IconList size={19} />
          </button>

          {/* Dismiss / Close Mini Player */}
          <button
            type="button"
            onClick={closeMiniPlayer}
            className="mini-player-close-btn"
            title="Dismiss player"
            aria-label="Dismiss mini player"
          >
            <IconClose size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MiniPlayer;
