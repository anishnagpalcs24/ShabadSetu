import { useState, useEffect } from 'react';

const PROGRESS_STORAGE_KEY = 'shabadsetu_guest_progress';

export const useProgress = (source = 'G') => {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || 'null');
      if (saved) return saved;
    } catch {
      // fallback
    }
    return {
      source,
      current_page: 1,
      total_pages: 1430,
      completed_cycles: 0,
      last_read_at: null,
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || 'null');
      if (saved) setProgress(saved);
    } catch {
      // Fallback
    }
  }, [source]);

  const updateProgress = async (currentPage, completedCycles = progress.completed_cycles) => {
    const updated = {
      source,
      current_page: currentPage,
      total_pages: 1430,
      completed_cycles: completedCycles,
      last_read_at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
      setProgress(updated);
    } catch {
      // fallback
    }
  };

  return {
    progress,
    loading,
    error,
    updateProgress,
  };
};

export default useProgress;
