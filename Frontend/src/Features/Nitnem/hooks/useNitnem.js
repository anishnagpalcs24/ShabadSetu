import { useState, useEffect } from 'react';
import nitnemApi from '../services/nitnem.api';

export const useNitnem = () => {
  const [sunderGutkas, setSunderGutkas] = useState([]);
  const [banis, setBanis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNitnemData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sgRes, baniRes] = await Promise.allSettled([
          nitnemApi.getSunderGutka(),
          nitnemApi.getBaniList(),
        ]);

        if (sgRes.status === 'fulfilled') {
          const data = sgRes.value?.data || sgRes.value;
          setSunderGutkas(data?.sundergutkas || data || []);
        }

        if (baniRes.status === 'fulfilled') {
          const data = baniRes.value?.data || baniRes.value;
          setBanis(data?.banis || data || []);
        }
      } catch (err) {
        setError(err.message || 'Failed to load Nitnem categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchNitnemData();
  }, []);

  return {
    sunderGutkas,
    banis,
    loading,
    error,
  };
};

export default useNitnem;
