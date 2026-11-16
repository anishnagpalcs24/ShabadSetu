import { Link } from 'react-router-dom';
import useNitnem from '../hooks/useNitnem';
import LoadingState from '../../../Shared/Components/LoadingState';
import ErrorState from '../../../Shared/Components/ErrorState';
import { IconLotus, IconBook, IconArrowRight } from '../../../Shared/Components/Icons';

export const NitnemPage = () => {
  const { sunderGutkas, banis, loading, error } = useNitnem();

  // Known Nitnem Banis with order and timing
  const coreNitnem = [
    { id: 1, name: 'ਜਪੁਜੀ ਸਾਹਿਬ', english: 'Japji Sahib', time: 'Morning (Amritvela)' },
    { id: 2, name: 'ਜਾਪੁ ਸਾਹਿਬ', english: 'Jaap Sahib', time: 'Morning (Amritvela)' },
    { id: 3, name: 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ (ਸ੍ਰਾਵਗ ਸੁਧ)', english: 'Tav Prasad Savaiye', time: 'Morning (Amritvela)' },
    { id: 4, name: 'ਚੌਪਈ ਸਾਹਿਬ', english: 'Chaupai Sahib (Benti)', time: 'Morning / Evening' },
    { id: 5, name: 'ਅਨੰਦੁ ਸਾਹਿਬ', english: 'Anand Sahib (40 Pauris)', time: 'Morning / Completion' },
    { id: 6, name: 'ਰਹਰਾਸਿ ਸਾਹਿਬ', english: 'Rehras Sahib', time: 'Evening (Sunset)' },
    { id: 7, name: 'ਕੀਰਤਨ ਸੋਹਿਲਾ', english: 'Kirtan Sohila', time: 'Bedtime (Night)' },
  ];

  return (
    <div style={{ padding: 'var(--space-10) 0' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <div className="badge badge-gold" style={{ marginBottom: 'var(--space-2)' }}>
            ਨਿਤਨੇਮ
          </div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-2)' }}>
            Daily Nitnem Prayers
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto' }}>
            Daily devotional prayers recited by Sikhs at designated times throughout the day for mindfulness and devotion.
          </p>
        </div>

        {loading ? (
          <LoadingState message="Loading Nitnem Banis..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <div>
            {/* Core Nitnem Section */}
            <section style={{ marginBottom: 'var(--space-10)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-4)' }}>
                <IconLotus size={20} style={{ color: 'var(--color-accent)' }} />
                <h2 style={{ fontSize: '1.4rem' }}>Essential Daily Nitnem</h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 'var(--space-4)',
                }}
              >
                {coreNitnem.map((bani) => (
                  <Link
                    key={bani.id}
                    to={`/nitnem/bani/${bani.id}`}
                    className="panel"
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'border-color var(--transition-fast)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <span className="badge badge-sage" style={{ marginBottom: '0.75rem', fontSize: '0.72rem' }}>
                        {bani.time}
                      </span>
                      <h3
                        className="gurbani-text"
                        style={{ fontSize: '1.45rem', marginBottom: '0.25rem', color: 'var(--color-primary)' }}
                      >
                        {bani.name}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                        {bani.english}
                      </p>
                    </div>

                    <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-accent)', fontSize: '0.825rem', fontWeight: 600 }}>
                      Read Bani <IconArrowRight size={14} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Banner linking to Sundar Gutka */}
            <section
              className="panel"
              style={{
                backgroundColor: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                padding: 'var(--space-6)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div className="badge badge-gold" style={{ marginBottom: '0.4rem', fontSize: '0.75rem' }}>
                  ਸੁੰਦਰ ਗੁਟਕਾ ਸਾਹਿਬ
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--color-primary)' }}>
                  Looking for more Banis?
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '580px' }}>
                  Explore our complete Sundar Gutka containing all 17 traditional compositions including Sukhmani Sahib, Asa Ki Vaar, Shabad Hazare, Salok Mahalla 9, Dukh Bhanjani Sahib, Ardaas, and more.
                </p>
              </div>
              <Link to="/sundargutka" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconBook size={16} /> Open Sundar Gutka
              </Link>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default NitnemPage;
