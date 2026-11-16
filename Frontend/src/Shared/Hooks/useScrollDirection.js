import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect scroll direction for secondary sticky reader toolbars.
 * - Hides when the user scrolls down to maximize vertical reading space.
 * - Shows immediately when the user scrolls up, even slightly.
 * - When scrolling stops, preserves the last scroll direction state (hidden or visible).
 * - Always remains visible when near the top of the page.
 */
export const useScrollDirection = ({
  threshold = 50,
  upSensitivity = 4,
  downSensitivity = 6,
} = {}) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    // Sync initial scroll position
    if (typeof window !== 'undefined') {
      lastScrollY.current = Math.max(0, window.scrollY || window.pageYOffset || 0);
    }

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
          const diff = currentScrollY - lastScrollY.current;

          // Always visible when within the top threshold
          if (currentScrollY <= threshold) {
            setIsVisible(true);
          } else if (diff > downSensitivity) {
            // User scrolled down -> hide toolbar to maximize scripture reading space
            setIsVisible(false);
          } else if (diff < -upSensitivity) {
            // User scrolled up even slightly -> reveal toolbar smoothly
            setIsVisible(true);
          }
          // When scrolling stops, diff is 0, so isVisible stays unchanged

          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold, upSensitivity, downSensitivity]);

  return isVisible;
};

export default useScrollDirection;
