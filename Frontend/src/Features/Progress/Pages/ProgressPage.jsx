import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProgress from '../hooks/useProgress';
import { useReader } from '../../Gurbani/hooks/useReader';
import LoadingState from '../../../Shared/Components/LoadingState';
import ErrorState from '../../../Shared/Components/ErrorState';
import { IconBook, IconLotus, IconArrowRight, IconCheck } from '../../../Shared/Components/Icons';

export const ProgressPage = () => {
  const { progress, loading, error, updateProgress } = useProgress('G');
  const { setPage, setSource } = useReader();
  const navigate = useNavigate();

  const [inputAng, setInputAng] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  const currentPage = progress.current_page || 1;
  const totalPages = progress.total_pages || 1430;
  const completedCycles = progress.completed_cycles || 0;
  const percentage = ((currentPage / totalPages) * 100).toFixed(1);

  const handleContinueReading = () => {
    setSource('G');
    setPage(currentPage);
    navigate('/reader');
  };

  const handleManualUpdate = async (e) => {
    e.preventDefault();
    const p = parseInt(inputAng, 10);
    if (p >= 1 && p <= totalPages) {
      await updateProgress(p);
      setInputAng('');
      setUpdateMsg(`Updated progress to Ang ${p}`);
      setTimeout(() => setUpdateMsg(''), 2500);
    }
  };

  return (
    <div style={{ padding: 'var(--space-10) 0' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div className="badge badge-gold" style={{ marginBottom: 'var(--space-2)' }}>
            ਸਹਿਜ ਪਾਠ ਟ੍ਰੈਕਰ
          </div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>
            Sehaj Paath Progress
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Track your continuous devotional reading of Sri Guru Granth Sahib Ji at your own natural pace.
          </p>
        </div>

        {loading ? (
          <LoadingState message="Fetching your reading progress..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Main Progress Display Card */}
            <div className="panel" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                }}
              >
                <IconLotus size={32} />
              </div>

              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
                Ang {currentPage} <span style={{ fontSize: '1.25rem', color: 'var(--color-muted)', fontWeight: 400 }}>of {totalPages}</span>
              </h2>

              <p style={{ fontSize: '1.1rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '1.5rem' }}>
                {percentage}% Completed
              </p>

              {/* Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: 'var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  marginBottom: '1.5rem',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '1rem',
                  backgroundColor: 'var(--color-surface-hover)',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '1.5rem',
                  fontSize: '0.9rem',
                }}
              >
                <div>
                  <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '0.78rem' }}>Remaining</span>
                  <strong>{totalPages - currentPage} Angs</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '0.78rem' }}>Cycles Completed</span>
                  <strong>{completedCycles} Full Paaths</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)', display: 'block', fontSize: '0.78rem' }}>Last Recorded</span>
                  <strong>
                    {progress.last_read_at ? new Date(progress.last_read_at).toLocaleDateString() : 'Today'}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinueReading}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', maxWidth: '340px' }}
              >
                <IconBook size={18} /> Continue Reading Ang {currentPage} <IconArrowRight size={16} />
              </button>
            </div>

            {/* Manual Update Ang Card */}
            <div className="panel" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>
                Update Current Reading Ang
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                Reading a physical Saroop or reading elsewhere? Update your digital bookmark here:
              </p>

              <form onSubmit={handleManualUpdate} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  placeholder={`e.g. ${currentPage}`}
                  value={inputAng}
                  onChange={(e) => setInputAng(e.target.value)}
                  className="input-field"
                  style={{ width: '130px' }}
                  required
                />
                <button type="submit" className="btn btn-secondary">
                  Update Progress
                </button>
                {updateMsg && (
                  <span style={{ fontSize: '0.825rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <IconCheck size={14} /> {updateMsg}
                  </span>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
