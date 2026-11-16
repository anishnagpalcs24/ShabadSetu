import { useState, useEffect, useCallback, useRef } from 'react';
import searchApi from '../services/search.api';
import useDebounce from '../../../Shared/Hooks/useDebounce';

export const useSearch = (initialQuery = '', initialType = 0) => {
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [source, setSource] = useState('G');
  const [ang, setAng] = useState('');
  const [resultsLimit, setResultsLimit] = useState(50);
  const [skip, setSkip] = useState(0);

  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debouncedQuery = useDebounce(query, 400);
  const abortControllerRef = useRef(null);

  const executeSearch = useCallback(async () => {
    const trimmed = debouncedQuery ? debouncedQuery.trim() : '';

    if (!trimmed) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      setResults([]);
      setTotalCount(0);
      setLoading(false);
      setError(null);
      return;
    }

    // Cancel any previous in-flight search request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const params = {
      type: searchType,
      results: resultsLimit,
      skip,
    };
    if (source) params.source = source;
    if (ang) params.ang = ang;

    try {
      const response = await searchApi.search(trimmed, params, {
        signal: controller.signal,
      });

      const data = response?.data || response;

      const items = Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data?.verses)
        ? data.verses
        : Array.isArray(data)
        ? data
        : [];

      setResults(items);
      setTotalCount(data?.total || data?.count || items.length);
    } catch (err) {
      // Do not treat aborted requests as errors
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED' || err.name === 'AbortError') {
        return;
      }
      setError(err.response?.data?.message || err.message || 'Error occurred while searching Gurbani.');
      setResults([]);
      setTotalCount(0);
    } finally {
      // Only set loading to false if this was the latest request
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [debouncedQuery, searchType, source, ang, resultsLimit, skip]);

  useEffect(() => {
    executeSearch();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [executeSearch]);

  const clearFilters = () => {
    setSearchType(0);
    setSource('G');
    setAng('');
    setSkip(0);
  };

  return {
    query,
    setQuery,
    searchType,
    setSearchType,
    source,
    setSource,
    ang,
    setAng,
    resultsLimit,
    setResultsLimit,
    skip,
    setSkip,
    results,
    totalCount,
    loading,
    error,
    clearFilters,
    executeSearch,
  };
};

export default useSearch;
