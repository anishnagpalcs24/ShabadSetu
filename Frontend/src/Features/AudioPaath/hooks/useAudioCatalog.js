import { useState, useEffect, useMemo } from 'react';
import audioApi from '../services/audio.api';
import AUDIO_CATALOG_FALLBACK from '../config/audioCatalogFallback';

export const useAudioCatalog = () => {
  const [banis, setBanis] = useState(AUDIO_CATALOG_FALLBACK);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all' | 'available'

  const fetchCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await audioApi.getCatalog();
      const list = res?.data?.banis || res?.banis || [];
      if (Array.isArray(list) && list.length > 0) {
        setBanis(list);
      } else {
        setBanis(AUDIO_CATALOG_FALLBACK);
      }
    } catch (err) {
      // Use verified local catalogue fallback
      setBanis(AUDIO_CATALOG_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const filteredBanis = useMemo(() => {
    let result = banis;

    if (filterAvailability === 'available') {
      result = result.filter((b) => b.is_available);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.english_name?.toLowerCase().includes(q) ||
          b.punjabi_name?.toLowerCase().includes(q) ||
          b.title?.toLowerCase().includes(q) ||
          b.gurmukhi_title?.toLowerCase().includes(q) ||
          b.category?.toLowerCase().includes(q) ||
          b.author?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [banis, filterAvailability, searchQuery]);

  const availableCount = useMemo(() => {
    return banis.filter((b) => b.is_available).length;
  }, [banis]);

  return {
    banis,
    filteredBanis,
    availableCount,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filterAvailability,
    setFilterAvailability,
    refetch: fetchCatalog,
  };
};

export default useAudioCatalog;
