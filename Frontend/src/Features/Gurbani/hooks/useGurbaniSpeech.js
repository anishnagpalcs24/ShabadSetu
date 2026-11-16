import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Cleans Punjlish (Romanized transliteration) text for clear, natural browser TTS speech synthesis.
 * Strips pipes (|), semicolons, tildes (~), danda (॥, ।), brackets, and extra punctuation
 * so the speech synthesizer doesn't pronounce punctuation symbol names.
 */
export const cleanPunjlishForSpeech = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[;\|~॥।\(\)\[\]\{\}\<\>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Fallback cleaner for Gurmukhi script text if transliteration is absent.
 */
export const cleanGurmukhiForSpeech = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[॥।;,\.\-\[\]\{\}\(\)<>]/g, ' ')
    .replace(/[0-9੦-੯]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const useGurbaniSpeech = ({
  tapToReadEnabled = false,
  continuousEnabled = false,
  verses = [],
} = {}) => {
  const [activeLineIndex, setActiveLineIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const currentIndexRef = useRef(null);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const versesRef = useRef(verses);

  versesRef.current = verses;
  currentIndexRef.current = activeLineIndex;
  isPlayingRef.current = isPlaying;
  isPausedRef.current = isPaused;

  // Detect and select best voice for pronouncing Romanized Punjlish phonetics
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices() || [];
      setVoices(allVoices);

      // Best voices for Romanized Punjlish recitation:
      // 1. Indian English voice (en-IN) has the exact natural cadence and phonetics for Indian words
      const indianEnglishVoice = allVoices.find((v) => {
        const lang = (v.lang || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        return (
          lang === 'en-in' ||
          lang === 'en_in' ||
          name.includes('india') ||
          name.includes('heera') ||
          name.includes('ravi') ||
          name.includes('veena')
        );
      });

      // 2. Any English voice (e.g. en-US, en-GB, Microsoft / Google English)
      const englishVoice = allVoices.find((v) =>
        (v.lang || '').toLowerCase().startsWith('en')
      );

      // 3. Indic voice (hi-IN)
      const indicVoice = allVoices.find((v) =>
        (v.lang || '').toLowerCase().startsWith('hi')
      );

      // 4. Default system voice
      const defaultVoice = allVoices.find((v) => v.default) || allVoices[0] || null;

      setSelectedVoice(indianEnglishVoice || englishVoice || indicVoice || defaultVoice);
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop playback immediately
  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveLineIndex(null);
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  // Stop if continuous mode is disabled while playing
  useEffect(() => {
    if (!continuousEnabled && isPlayingRef.current) {
      stop();
    }
  }, [continuousEnabled, stop]);

  // Stop if tapToRead is disabled while a line is being spoken
  useEffect(() => {
    if (!tapToReadEnabled && !continuousEnabled && currentIndexRef.current !== null) {
      stop();
    }
  }, [tapToReadEnabled, continuousEnabled, stop]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  /**
   * Speak a specific verse by index.
   * Speaks the Punjlish line (Romanized transliteration) whether the visual
   * Punjlish option is turned ON or OFF by the user, ensuring clear, accurate pronunciation.
   */
  const speakVerse = useCallback(
    (index, onFinishCallback) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

      const currentList = versesRef.current;
      if (!currentList || index < 0 || index >= currentList.length) {
        stop();
        return;
      }

      const verseItem = currentList[index];

      // Always prioritize the Punjlish (Romanized transliteration) line for speech
      const rawPunjlish =
        verseItem.transliteration ||
        verseItem.punjlish ||
        verseItem.raw?.transliteration?.english?.text ||
        '';

      const cleanedPunjlish = cleanPunjlishForSpeech(rawPunjlish);
      const cleanedGurmukhi = cleanGurmukhiForSpeech(verseItem.verse || verseItem.text || '');

      const textToSpeak = cleanedPunjlish || cleanedGurmukhi;

      // Stop any pending speech to prevent overlap
      window.speechSynthesis.cancel();

      if (!textToSpeak) {
        if (onFinishCallback) onFinishCallback();
        return;
      }

      setActiveLineIndex(index);

      // Auto scroll line into view during playback
      try {
        const lineElement = document.getElementById(`verse-row-${index}`);
        if (lineElement) {
          lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } catch {
        // Safe fallback if element is not in DOM
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang || 'en-IN';
      } else {
        utterance.lang = 'en-IN';
      }

      // Calm, clear, measured spiritual pace for Romanized recitation
      utterance.rate = 0.86;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (onFinishCallback) {
          onFinishCallback();
        } else {
          // If standalone Tap-to-Read, remove highlight once spoken
          setActiveLineIndex(null);
        }
      };

      utterance.onerror = (e) => {
        // If cancelled by another speech event, do not trigger error
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        if (onFinishCallback) {
          onFinishCallback();
        } else {
          setActiveLineIndex(null);
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [selectedVoice, stop]
  );

  /**
   * Tap-To-Read Handler for a clicked line
   */
  const handleLineTap = useCallback(
    (index) => {
      if (!tapToReadEnabled) return;
      // If clicking currently playing line in tap mode, stop it
      if (activeLineIndex === index && !isPlaying) {
        stop();
        return;
      }
      setIsPlaying(false);
      setIsPaused(false);
      speakVerse(index);
    },
    [tapToReadEnabled, activeLineIndex, isPlaying, speakVerse, stop]
  );

  /**
   * Continuous Paath: Play sequential line
   */
  const playSequentialLine = useCallback(
    (index) => {
      const currentList = versesRef.current;
      if (!currentList || index >= currentList.length) {
        // Reached end of Bani
        stop();
        return;
      }

      speakVerse(index, () => {
        // Check if continuous mode is still running
        if (isPlayingRef.current && !isPausedRef.current) {
          // Pause slightly between lines for devotional recitation
          setTimeout(() => {
            if (isPlayingRef.current && !isPausedRef.current) {
              playSequentialLine(index + 1);
            }
          }, 450);
        }
      });
    },
    [speakVerse, stop]
  );

  /**
   * Start Continuous Paath
   */
  const startContinuous = useCallback(
    (startIndex = 0) => {
      if (!versesRef.current || versesRef.current.length === 0) return;
      setIsPlaying(true);
      setIsPaused(false);
      const startIdx = typeof startIndex === 'number' ? startIndex : 0;
      playSequentialLine(startIdx);
    },
    [playSequentialLine]
  );

  /**
   * Pause Continuous Paath
   */
  const pauseContinuous = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setIsPaused(true);
  }, []);

  /**
   * Resume Continuous Paath
   */
  const resumeContinuous = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        // Fallback resume
        const resumeIdx = currentIndexRef.current !== null ? currentIndexRef.current : 0;
        setIsPaused(false);
        setIsPlaying(true);
        playSequentialLine(resumeIdx);
      }
    }
  }, [playSequentialLine]);

  /**
   * Next line in Continuous Paath
   */
  const nextLine = useCallback(() => {
    const currentList = versesRef.current;
    const nextIdx = (currentIndexRef.current || 0) + 1;
    if (nextIdx < currentList.length) {
      playSequentialLine(nextIdx);
    } else {
      stop();
    }
  }, [playSequentialLine, stop]);

  /**
   * Previous line in Continuous Paath
   */
  const prevLine = useCallback(() => {
    const prevIdx = Math.max((currentIndexRef.current || 0) - 1, 0);
    playSequentialLine(prevIdx);
  }, [playSequentialLine]);

  return {
    isSupported,
    activeLineIndex,
    isPlaying,
    isPaused,
    voices,
    selectedVoice,
    setSelectedVoice,
    handleLineTap,
    startContinuous,
    pauseContinuous,
    resumeContinuous,
    stop,
    nextLine,
    prevLine,
  };
};

export default useGurbaniSpeech;
