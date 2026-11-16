import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { findBaniAudio } from '../utils/findBaniAudio';
import { IconHeadphones, IconPlay, IconPause } from '../../../Shared/Components/Icons';
import '../Styles/audio-paath.scss';

/**
 * Small "Listen while reading" option for reader header toolbars.
 * Strictly renders NOTHING if no audio recording is available in our library.
 */
export const BaniAudioOption = ({ bani, compact = false, className = '' }) => {
  const { currentTrack, isPlaying, playTrack, togglePlayPause, playlist } = useAudioPlayer();

  const track = findBaniAudio(bani, playlist);

  // If this Bani does NOT have audio available in our library, do not show anything
  if (!track) {
    return null;
  }

  const isCurrentTrack = currentTrack?.slug === track.slug;
  const isThisPlaying = isCurrentTrack && isPlaying;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`bani-audio-listen-btn ${isThisPlaying ? 'is-playing' : ''} ${className}`}
      title={
        isThisPlaying
          ? 'Pause Audio Paath'
          : `Listen to ${track.english_name || 'Bani'} Audio Paath while reading`
      }
      aria-label={isThisPlaying ? 'Pause Audio Paath' : 'Listen to Audio Paath'}
    >
      <span className="bani-audio-icon-wrap" aria-hidden="true">
        <IconHeadphones size={15} />
      </span>
      <span className="bani-audio-play-indicator" aria-hidden="true">
        {isThisPlaying ? (
          <IconPause size={12} />
        ) : (
          <IconPlay size={12} style={{ marginLeft: '1px' }} />
        )}
      </span>
      <span className="bani-audio-btn-label">
        {isThisPlaying ? 'Pause Audio' : (compact ? 'Listen' : 'Listen Paath')}
      </span>
    </button>
  );
};

export default BaniAudioOption;
