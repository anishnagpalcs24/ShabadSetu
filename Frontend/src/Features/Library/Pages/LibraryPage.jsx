import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLibrary from '../hooks/useLibrary';
import { useReader } from '../../Gurbani/hooks/useReader';
import LoadingState from '../../../Shared/Components/LoadingState';
import EmptyState from '../../../Shared/Components/EmptyState';
import ErrorState from '../../../Shared/Components/ErrorState';
import {
  IconBookmark,
  IconBook,
  IconNote,
  IconTrash,
  IconPlus,
  IconArrowRight,
} from '../../../Shared/Components/Icons';

export const LibraryPage = () => {
  const {
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
  } = useLibrary();

  const { setPage, setSource } = useReader();
  const navigate = useNavigate();

  const [showCreateColModal, setShowCreateColModal] = useState(false);
  const [colTitle, setColTitle] = useState('');
  const [colDesc, setColDesc] = useState('');

  const handleNavigateToAng = (pageNumber, sourceCode = 'G') => {
    if (sourceCode) setSource(sourceCode);
    if (pageNumber) setPage(parseInt(pageNumber, 10));
    navigate('/reader');
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!colTitle.trim()) return;
    await createCollection(colTitle.trim(), colDesc.trim());
    setColTitle('');
    setColDesc('');
    setShowCreateColModal(false);
  };

  return (
    <div style={{ padding: 'var(--space-10) 0' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Header */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <div className="badge badge-gold" style={{ marginBottom: 'var(--space-2)' }}>
            ਮੇਰੀ ਲਾਇਬ੍ਰੇਰੀ
          </div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>
            Personal Gurbani Library
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Your sacred space for saved verses, study collections, personal reflection notes, and reading progress. Stored securely on your device.
          </p>
        </div>

        {/* Library Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.5rem',
            marginBottom: 'var(--space-6)',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`btn btn-sm ${activeTab === 'bookmarks' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <IconBookmark size={15} /> Saved Bookmarks ({bookmarks.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('collections')}
            className={`btn btn-sm ${activeTab === 'collections' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <IconBook size={15} /> Collections ({collections.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`btn btn-sm ${activeTab === 'notes' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <IconNote size={15} /> Reflection Notes ({notes.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`btn btn-sm ${activeTab === 'history' ? 'btn-primary' : 'btn-ghost'}`}
          >
            Reading History ({history.length})
          </button>
        </div>

        {/* Tab 1: Saved Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div>
            {loading ? (
              <LoadingState message="Loading your bookmarks..." />
            ) : error ? (
              <ErrorState message={error} />
            ) : bookmarks.length === 0 ? (
              <EmptyState
                icon={IconBookmark}
                title="No bookmarks saved yet"
                message="Click the bookmark icon on any verse or Ang in the reader to save verses here for contemplation."
                actionLabel="Open Gurbani Reader"
                onAction={() => navigate('/reader')}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {bookmarks.map((b) => (
                  <div
                    key={b.id || b.lineId}
                    className="panel"
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: 'var(--space-4)',
                    }}
                  >
                    <div style={{ maxWidth: '75%' }}>
                      <span className="badge badge-primary" style={{ marginBottom: '0.25rem' }}>
                        Ang {b.page_number || b.pageNumber || '—'}
                      </span>
                      <p className="gurbani-text" style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                        {b.title || b.verse || 'Sacred Verse'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleNavigateToAng(b.page_number || b.pageNumber, b.source)}
                        className="btn btn-secondary btn-sm"
                      >
                        Read <IconArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBookmark(b.id, b.lineId)}
                        className="btn btn-ghost btn-icon btn-sm"
                        style={{ color: 'var(--color-error)' }}
                        title="Remove bookmark"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Collections */}
        {activeTab === 'collections' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Group favorite shabads into thematic playlists or study sets.
              </span>
              <button
                type="button"
                onClick={() => setShowCreateColModal(true)}
                className="btn btn-primary btn-sm"
              >
                <IconPlus size={15} /> New Collection
              </button>
            </div>

            {loading ? (
              <LoadingState message="Loading your collections..." />
            ) : error ? (
              <ErrorState message={error} />
            ) : collections.length === 0 ? (
              <EmptyState
                icon={IconBook}
                title="No collections created yet"
                message="Organize shabads for Anand Karaj, Funeral prayers, Amritvela simran, or specific spiritual themes."
                actionLabel="Create First Collection"
                onAction={() => setShowCreateColModal(true)}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                {collections.map((c) => (
                  <div key={c.id} className="panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem' }}>{c.title}</h3>
                        <button
                          type="button"
                          onClick={() => deleteCollection(c.id)}
                          className="btn btn-ghost btn-icon btn-sm"
                          style={{ color: 'var(--color-error)' }}
                          title="Delete collection"
                        >
                          <IconTrash size={15} />
                        </button>
                      </div>
                      {c.description && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{c.description}</p>
                      )}
                    </div>
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-muted)' }}>
                      {c.items_count || 0} Shabads saved
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Notes */}
        {activeTab === 'notes' && (
          <div>
            {loading ? (
              <LoadingState message="Loading your reflection notes..." />
            ) : error ? (
              <ErrorState message={error} />
            ) : notes.length === 0 ? (
              <EmptyState
                icon={IconNote}
                title="No notes written yet"
                message="Add personal contemplations to verses while reading in Gurbani Reader."
                actionLabel="Explore Reader"
                onAction={() => navigate('/reader')}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {notes.map((n) => (
                  <div key={n.id} className="panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span className="badge badge-gold">
                        Shabad #{n.shabad_id || 'Verse Note'}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteNote(n.id)}
                        className="btn btn-ghost btn-icon btn-sm"
                        style={{ color: 'var(--color-error)' }}
                        title="Delete note"
                      >
                        <IconTrash size={15} />
                      </button>
                    </div>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {n.content}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', display: 'block', marginTop: '0.5rem' }}>
                      Saved on {new Date(n.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Reading History */}
        {activeTab === 'history' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Automatically logged reading history.
              </span>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={clearHistory}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-error)' }}
                >
                  Clear History
                </button>
              )}
            </div>

            {loading ? (
              <LoadingState message="Loading reading logs..." />
            ) : history.length === 0 ? (
              <EmptyState
                title="No reading history yet"
                message="As you read Angs in Gurbani reader, your history will be recorded here."
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {history.map((h, idx) => (
                  <div
                    key={h.id || idx}
                    className="panel"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.65rem 1rem',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600 }}>Ang {h.page_number}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginLeft: '0.75rem' }}>
                        {new Date(h.read_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNavigateToAng(h.page_number, h.source)}
                      className="btn btn-secondary btn-sm"
                    >
                      Resume <IconArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Collection Modal */}
        {showCreateColModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem',
            }}
          >
            <div className="panel" style={{ width: '100%', maxWidth: '480px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Create New Collection</h3>
              <form onSubmit={handleCreateCollection}>
                <div className="form-group">
                  <label className="form-label">Collection Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amritvela Simran, Anand Karaj Shabads"
                    value={colTitle}
                    onChange={(e) => setColTitle(e.target.value)}
                    className="input-field"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <textarea
                    rows="3"
                    placeholder="Brief description of this collection..."
                    value={colDesc}
                    onChange={(e) => setColDesc(e.target.value)}
                    className="textarea-field"
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowCreateColModal(false)}
                    className="btn btn-secondary btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
