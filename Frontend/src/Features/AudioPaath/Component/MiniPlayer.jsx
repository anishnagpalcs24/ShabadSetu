import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { formatAudioTime } from '../utils/audioFormatters';
import {
  IconPlay,
  IconPause,
  IconSkipBack,
  IconSkipForward,
  IconRepeat,
  IconShuffle,
  IconVolume,
  IconVolumeMute,
  IconChevronUp,
  IconList,
  IconClose,
  IconHeadphones,
  IconHeart,
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
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleRepeat,
    playNext,
    playPrevious,
    closeMiniPlayer,
  } = useAudioPlayer();

  const [isFavorite, setIsFavorite] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If no track is actively playing or selected, do not render
  if (!currentTrack) {
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
    <aside className="shabadsetu-mini-player" aria-label="Audio Paath Player">
      <div className="mini-player-inner-wrapper">
        {/* Left Section: Caret, Headphone Badge, Titles & Heart */}
        <div className="mini-player-left-col">
          {/* Caret to expand */}
          <button
            type="button"
            onClick={handleOpenFullPlayer}
            className="mini-player-icon-btn"
            title="Open Full Screen Player"
            aria-label="Expand player"
          >
            <IconChevronUp size={20} />
          </button>

          {/* Golden Circled Headphone Badge */}
          <div
            onClick={handleOpenFullPlayer}
            className="mini-player-headphone-badge"
            title="Open Audio Paath"
          >
            <IconHeadphones size={17} />
          </div>

          {/* Titles */}
          <div
            onClick={handleOpenFullPlayer}
            className="mini-player-titles-group"
          >
            <div className="mini-player-title-gurmukhi gurbani-text">
              {currentTrack.punjabi_name || currentTrack.gurmukhi_title}
            </div>
            <div className="mini-player-title-sub">
              {currentTrack.english_name || currentTrack.title}
            </div>
          </div>

          {/* Favorite Heart */}
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`mini-player-icon-btn mini-player-heart-btn ${isFavorite ? 'is-fav' : ''}`}
            title={isFavorite ? 'Saved to favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <IconHeart size={18} filled={isFavorite} />
          </button>
        </div>

        {/* Center Section: Controls & Time Scrub Bar */}
        <div className="mini-player-center-col">
          {/* Control Buttons */}
          <div className="mini-player-buttons-row">
            <button
              type="button"
              className="mini-player-icon-btn desktop-only"
              title="Shuffle"
              aria-label="Shuffle"
            >
              <IconShuffle size={16} />
            </button>

            <button
              type="button"
              onClick={playPrevious}
              className="mini-player-icon-btn"
              title="Previous Bani"
              aria-label="Previous track"
            >
              <IconSkipBack size={18} />
            </button>

            {/* Circular Play / Pause Button */}
            <button
              type="button"
              onClick={togglePlayPause}
              className="mini-player-main-play-btn"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <IconPause size={18} /> : <IconPlay size={18} style={{ marginLeft: '2px' }} />}
            </button>

            <button
              type="button"
              onClick={playNext}
              className="mini-player-icon-btn"
              title="Next Bani"
              aria-label="Next track"
            >
              <IconSkipForward size={18} />
            </button>

            <button
              type="button"
              onClick={toggleRepeat}
              className={`mini-player-icon-btn desktop-only ${isRepeating ? 'is-active' : ''}`}
              title={isRepeating ? 'Repeat on' : 'Repeat off'}
              aria-label="Repeat track"
            >
              <IconRepeat size={16} />
            </button>
          </div>

          {/* Seek Bar with Time Display */}
          <div className="mini-player-scrub-row">
            <span className="mini-player-time-num">
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
              className="mini-player-range-input"
              style={{
                background: `linear-gradient(to right, #d4a359 0%, #d4a359 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />

            <span className="mini-player-time-num end">
              {formatAudioTime(activeDuration)}
            </span>
          </div>
        </div>

        {/* Right Section: Volume Slider, Speed Pill, List & CLOSE CROSS BUTTON */}
        <div className="mini-player-right-col">
          {/* Volume Control */}
          <div className="mini-player-vol-group desktop-only">
            <button
              type="button"
              onClick={toggleMute}
              className="mini-player-icon-btn"
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
            className="mini-player-speed-pill desktop-only"
            title="Change playback speed"
            aria-label="Playback speed"
          >
            {playbackRate}×
          </button>

          {/* Playlist / Queue Button */}
          <button
            type="button"
            onClick={() => navigate('/audio')}
            className="mini-player-icon-btn desktop-only"
            title="Browse all Banis"
            aria-label="Browse audio catalogue"
          >
            <IconList size={19} />
          </button>

          {/* ALWAYS VISIBLE CROSS CLOSE BUTTON (Desktop & Mobile) */}
          <button
            type="button"
            onClick={closeMiniPlayer}
            className="mini-player-dismiss-cross-btn"
            title="Close / Dismiss player"
            aria-label="Dismiss audio player"
          >
            <IconClose size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MiniPlayer;
