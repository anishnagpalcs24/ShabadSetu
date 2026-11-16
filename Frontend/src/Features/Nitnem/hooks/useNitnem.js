import { useState, useEffect } from 'react';
import nitnemApi from '../services/nitnem.api';

let cachedNitnemState = null;

export const useNitnem = () => {
  const [sunderGutkas, setSunderGutkas] = useState(() => cachedNitnemState?.sunderGutkas || []);
  const [banis, setBanis] = useState(() => cachedNitnemState?.banis || []);
  const [loading, setLoading] = useState(() => !cachedNitnemState);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchNitnemData = async () => {
      if (!cachedNitnemState) {
        setLoading(true);
      }
      setError(null);
      try {
        const [sgRes, baniRes] = await Promise.allSettled([
          nitnemApi.getSunderGutka(),
          nitnemApi.getBaniList(),
        ]);

        let sgData = [];
        let bData = [];

        if (sgRes.status === 'fulfilled') {
          const data = sgRes.value?.data || sgRes.value;
          sgData = data?.sundergutkas || data || [];
        }

        if (baniRes.status === 'fulfilled') {
          const data = baniRes.value?.data || baniRes.value;
          bData = data?.banis || data || [];
        }

        if (!isCancelled) {
          cachedNitnemState = { sunderGutkas: sgData, banis: bData };
          setSunderGutkas(sgData);
          setBanis(bData);
        }
      } catch (err) {
        if (!isCancelled && !cachedNitnemState) {
          setError(err.message || 'Failed to load Nitnem categories.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchNitnemData();

    return () => {
      isCancelled = true;
    };
  }, []);

  return {
    sunderGutkas,
    banis,
    loading,
    error,
  };
};

export default useNitnem;
