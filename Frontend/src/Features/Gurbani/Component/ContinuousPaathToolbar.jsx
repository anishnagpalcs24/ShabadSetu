import React from 'react';
import {
  IconPlay,
  IconPause,
  IconClose,
  IconArrowLeft,
  IconArrowRight,
  IconVolume,
} from '../../../Shared/Components/Icons';

export const ContinuousPaathToolbar = ({
  isPlaying,
  isPaused,
  activeLineIndex,
  totalLines,
  onStart,
  onPause,
  onResume,
  onStop,
  onNext,
  onPrev,
}) => {
  const currentIndex = activeLineIndex !== null ? activeLineIndex + 1 : 0;
  const progressPercent = totalLines > 0 ? Math.min(Math.round((currentIndex / totalLines) * 100), 100) : 0;

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '2px solid var(--color-accent)',
        boxShadow: 'var(--shadow-md)',
        padding: '0.65rem var(--space-4)',
        position: 'sticky',
        top: 'calc(var(--navbar-height) + 54px)',
        zIndex: 85,
        transition: 'all var(--transition-fast)',
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
        {/* Status & Progress Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: isPlaying && !isPaused ? 'var(--color-accent-soft)' : 'transparent',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconVolume size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-text)' }}>
              ਅਖੰਡ ਪਾਠ ਆਡੀਓ • Continuous Paath
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
              {isPlaying
                ? `Reciting line ${currentIndex} of ${totalLines} (${progressPercent}%)`
                : `Ready to recite • ${totalLines} sacred verses`}
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Previous Line */}
          {isPlaying && (
            <button
              type="button"
              onClick={onPrev}
              disabled={activeLineIndex <= 0}
              className="btn btn-secondary btn-icon btn-sm"
              title="Previous Line"
              aria-label="Previous Line"
            >
              <IconArrowLeft size={14} />
            </button>
          )}

          {/* Main Action Button */}
          {!isPlaying ? (
            <button
              type="button"
              onClick={() => onStart(0)}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 600 }}
            >
              <IconPlay size={15} /> Start Reading
            </button>
          ) : isPaused ? (
            <button
              type="button"
              onClick={onResume}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: 600 }}
            >
              <IconPlay size={15} /> Resume Paath
            </button>
          ) : (
            <button
              type="button"
              onClick={onPause}
              className="btn btn-secondary btn-sm"
              style={{ fontWeight: 600 }}
            >
              <IconPause size={15} /> Pause
            </button>
          )}

          {/* Next Line */}
          {isPlaying && (
            <button
              type="button"
              onClick={onNext}
              disabled={activeLineIndex >= totalLines - 1}
              className="btn btn-secondary btn-icon btn-sm"
              title="Next Line"
              aria-label="Next Line"
            >
              <IconArrowRight size={14} />
            </button>
          )}

          {/* Stop Button */}
          {isPlaying && (
            <button
              type="button"
              onClick={onStop}
              className="btn btn-ghost btn-sm"
              style={{ color: 'var(--color-error)' }}
              title="Stop Recitation"
            >
              <IconClose size={15} /> Stop
            </button>
          )}
        </div>
      </div>

      {/* Thin Progress Line Indicator */}
      {isPlaying && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: `${progressPercent}%`,
            height: '3px',
            backgroundColor: 'var(--color-accent)',
            transition: 'width 250ms ease',
          }}
        />
      )}
    </div>
  );
};

export default ContinuousPaathToolbar;
