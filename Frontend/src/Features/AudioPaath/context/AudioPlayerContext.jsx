import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import audioApi from '../services/audio.api';
import AUDIO_CATALOG_FALLBACK from '../config/audioCatalogFallback';

const AudioPlayerContext = createContext(null);

export const AudioPlayerProvider = ({ children }) => {
  // Global persistent HTMLAudioElement
  const audioRef = useRef(null);

  const [playlist, setPlaylist] = useState(() =>
    AUDIO_CATALOG_FALLBACK.filter((b) => b.is_available)
  );
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);

  // Initialize Audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onDurationChange = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };

    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setIsMiniPlayerVisible(true);
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      const err = audio.error;
      let msg = 'Unable to stream Gurbani audio. Please check your internet connection.';
      if (err?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
        msg = 'The audio format or recording URL is currently unavailable.';
      } else if (err?.code === MediaError.MEDIA_ERR_NETWORK) {
        msg = 'Network connection lost while streaming audio.';
      }
      setError(msg);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    // Initial playlist load
    audioApi
      .getCatalog({ available: true })
      .then((data) => {
        const availableBanis = data?.data?.banis || data?.banis || [];
        if (Array.isArray(availableBanis) && availableBanis.length > 0) {
          setPlaylist(availableBanis);
        } else {
          setPlaylist(AUDIO_CATALOG_FALLBACK.filter((b) => b.is_available));
        }
      })
      .catch(() => {
        setPlaylist(AUDIO_CATALOG_FALLBACK.filter((b) => b.is_available));
      });

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Handle track repetition
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoop = () => {
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    };

    audio.addEventListener('ended', handleLoop);
    return () => audio.removeEventListener('ended', handleLoop);
  }, [isRepeating]);

  /**
   * Play a specific Bani track
   * Does NOT reload or restart if same track is already playing
   */
  const playTrack = useCallback(
    async (track) => {
      if (!track || !track.audio_url) {
        setError('This Bani recording has not been uploaded yet.');
        return;
      }

      const audio = audioRef.current;
      if (!audio) return;

      setError(null);

      // If already playing this track, simply resume
      if (currentTrack?.slug === track.slug) {
        if (audio.paused) {
          try {
            await audio.play();
          } catch (err) {
            setError('Playback interrupted. Tap play to resume.');
          }
        }
        setIsMiniPlayerVisible(true);
        return;
      }

      // Switching to a new track
      try {
        setIsLoading(true);
        setCurrentTrack(track);
        setIsMiniPlayerVisible(true);
        setCurrentTime(0);
        setDuration(track.duration_seconds || 0);

        audio.src = track.audio_url;
        audio.playbackRate = playbackRate;
        audio.volume = isMuted ? 0 : volume;
        audio.load();

        await audio.play();
      } catch (err) {
        setIsLoading(false);
        if (err.name !== 'AbortError') {
          setError('Playback was prevented by browser autoplay policy. Please press play.');
        }
      }
    },
    [currentTrack, playbackRate, isMuted, volume]
  );

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(async () => {
    if (!audioRef.current) return;
    try {
      setError(null);
      await audioRef.current.play();
    } catch {
      setError('Tap play to start audio playback.');
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (!currentTrack) return;
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  }, [currentTrack, isPlaying, pause, resume]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setIsMiniPlayerVisible(false);
  }, []);

  const closeMiniPlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setIsMiniPlayerVisible(false);
  }, []);

  const seek = useCallback((timeInSeconds) => {
    const audio = audioRef.current;
    if (audio && !isNaN(timeInSeconds)) {
      const clamped = Math.max(0, Math.min(timeInSeconds, audio.duration || 99999));
      audio.currentTime = clamped;
      setCurrentTime(clamped);
    }
  }, []);

  const setVolume = useCallback((val) => {
    const audio = audioRef.current;
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audio) {
      audio.volume = clamped;
      if (clamped === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume > 0 ? volume : 1;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const setPlaybackRate = useCallback((rate) => {
    const audio = audioRef.current;
    setPlaybackRateState(rate);
    if (audio) {
      audio.playbackRate = rate;
    }
  }, []);

  const toggleRepeat = useCallback(() => {
    setIsRepeating((prev) => !prev);
  }, []);

  const playNext = useCallback(() => {
    if (!playlist || playlist.length <= 1 || !currentTrack) return;
    const currentIndex = playlist.findIndex((t) => t.slug === currentTrack.slug);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  }, [playlist, currentTrack, playTrack]);

  const playPrevious = useCallback(() => {
    if (!playlist || playlist.length <= 1 || !currentTrack) return;
    const currentIndex = playlist.findIndex((t) => t.slug === currentTrack.slug);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  }, [playlist, currentTrack, playTrack]);

  const value = {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isRepeating,
    isLoading,
    error,
    isMiniPlayerVisible,
    playlist,
    playTrack,
    pause,
    resume,
    togglePlayPause,
    stop,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleRepeat,
    playNext,
    playPrevious,
    closeMiniPlayer,
    setIsMiniPlayerVisible,
  };

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>;
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

export default AudioPlayerContext;
