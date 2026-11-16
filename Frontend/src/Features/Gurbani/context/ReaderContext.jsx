import { createContext, useContext, useState, useCallback } from 'react';
import { GRANTH_SOURCES } from '../../../Shared/Utils/sources';

const ReaderContext = createContext(null);

export const ReaderProvider = ({ children }) => {
  const [source, setSourceState] = useState('G');
  const [page, setPageState] = useState(1);

  const currentSourceInfo = GRANTH_SOURCES.find((s) => s.code === source) || GRANTH_SOURCES[0];
  const maxPage = currentSourceInfo.totalPages || 1430;

  const setSource = useCallback((newSource) => {
    setSourceState(newSource);
    setPageState(1);
  }, []);

  const setPage = useCallback((newPage) => {
    const valid = Math.max(1, Math.min(parseInt(newPage, 10) || 1, maxPage));
    setPageState(valid);
  }, [maxPage]);

  const nextPage = useCallback(() => {
    setPageState((prev) => Math.min(prev + 1, maxPage));
  }, [maxPage]);

  const prevPage = useCallback(() => {
    setPageState((prev) => Math.max(prev - 1, 1));
  }, []);

  const value = {
    source,
    sourceInfo: currentSourceInfo,
    page,
    maxPage,
    setSource,
    setPage,
    nextPage,
    prevPage,
  };

  return <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>;
};

export const useReader = () => {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within ReaderProvider');
  }
  return context;
};

export default ReaderContext;
