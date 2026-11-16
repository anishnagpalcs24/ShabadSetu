import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEYS = {
  BOOKMARKS: 'shabadsetu_guest_bookmarks',
  COLLECTIONS: 'shabadsetu_guest_collections',
  NOTES: 'shabadsetu_guest_notes',
  HISTORY: 'shabadsetu_guest_history',
};

const getLocalItem = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setLocalItem = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
};

export const useLibrary = () => {
  const [activeTab, setActiveTab] = useState('bookmarks'); // 'bookmarks' | 'collections' | 'notes' | 'history'
  const [bookmarks, setBookmarks] = useState(() => getLocalItem(STORAGE_KEYS.BOOKMARKS));
  const [collections, setCollections] = useState(() => getLocalItem(STORAGE_KEYS.COLLECTIONS));
  const [notes, setNotes] = useState(() => getLocalItem(STORAGE_KEYS.NOTES));
  const [history, setHistory] = useState(() => getLocalItem(STORAGE_KEYS.HISTORY));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookmarks = useCallback(() => {
    setBookmarks(getLocalItem(STORAGE_KEYS.BOOKMARKS));
  }, []);

  const fetchCollections = useCallback(() => {
    setCollections(getLocalItem(STORAGE_KEYS.COLLECTIONS));
  }, []);

  const fetchNotes = useCallback(() => {
    setNotes(getLocalItem(STORAGE_KEYS.NOTES));
  }, []);

  const fetchHistory = useCallback(() => {
    setHistory(getLocalItem(STORAGE_KEYS.HISTORY));
  }, []);

  useEffect(() => {
    if (activeTab === 'bookmarks') fetchBookmarks();
    if (activeTab === 'collections') fetchCollections();
    if (activeTab === 'notes') fetchNotes();
    if (activeTab === 'history') fetchHistory();
  }, [activeTab, fetchBookmarks, fetchCollections, fetchNotes, fetchHistory]);

  const deleteBookmark = async (id, lineId = null) => {
    const target = lineId || id;
    const updated = bookmarks.filter((b) => (b.lineId || b.id) !== target);
    setLocalItem(STORAGE_KEYS.BOOKMARKS, updated);
    setBookmarks(updated);
  };

  const createCollection = async (title, description = '') => {
    const newCol = {
      id: 'col_' + Date.now(),
      title,
      description,
      itemCount: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newCol, ...collections];
    setLocalItem(STORAGE_KEYS.COLLECTIONS, updated);
    setCollections(updated);
  };

  const deleteCollection = async (id) => {
    const updated = collections.filter((c) => c.id !== id);
    setLocalItem(STORAGE_KEYS.COLLECTIONS, updated);
    setCollections(updated);
  };

  const deleteNote = async (id) => {
    const updated = notes.filter((n) => n.id !== id);
    setLocalItem(STORAGE_KEYS.NOTES, updated);
    setNotes(updated);
  };

  const clearHistory = async () => {
    setLocalItem(STORAGE_KEYS.HISTORY, []);
    setHistory([]);
  };

  return {
    activeTab,
    setActiveTab,
    bookmarks,
    collections,
    notes,
    history,
    loading,
    error,
    deleteBookmark,
    createCollection,
    deleteCollection,
    deleteNote,
    clearHistory,
    refetch: () => {
      if (activeTab === 'bookmarks') fetchBookmarks();
      if (activeTab === 'collections') fetchCollections();
      if (activeTab === 'notes') fetchNotes();
      if (activeTab === 'history') fetchHistory();
    },
  };
};

export default useLibrary;
