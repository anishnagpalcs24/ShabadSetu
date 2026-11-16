import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import nitnemApi from '../../Nitnem/services/nitnem.api';
import { useUserPreferences } from '../../Settings/hooks/useUserPreferences';
import ReaderSettingsDrawer from '../../Gurbani/Component/ReaderSettingsDrawer';
import { normalizeVerse } from '../../../Shared/Utils/gurbani';
import LoadingState from '../../../Shared/Components/LoadingState';
import ErrorState from '../../../Shared/Components/ErrorState';
import {
  IconSearch,
  IconBook,
  IconNote,
  IconSettings,
  IconChevronRight,
  IconChevronLeft,
  IconLayers,
  IconMenu,
  IconClose,
} from '../../../Shared/Components/Icons';
import '../Styles/sundargutka.scss';

export const SUNDAR_GUTKA_BANIS = [
  {
    id: 1,
    name: 'ਜਪੁਜੀ ਸਾਹਿਬ',
    english: 'Japji Sahib',
    author: 'Guru Nanak Dev Ji',
    categories: ['Nitnem'],
    description: 'The foundational composition of Sikh faith, revealing the nature of the Divine and truthful living.',
  },
  {
    id: 2,
    name: 'ਜਾਪੁ ਸਾਹਿਬ',
    english: 'Jaap Sahib',
    author: 'Guru Gobind Singh Ji',
    categories: ['Nitnem', 'Stotras'],
    description: '199 sacred verses glorifying the infinite, formless, attribute-less, and sovereign nature of the Almighty.',
  },
  {
    id: 3,
    name: 'ਤਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ',
    english: 'Tav-Prasad Savaiye',
    author: 'Guru Gobind Singh Ji',
    categories: ['Nitnem', 'Savaiye'],
    description: 'Ten divine stanzas emphasizing that genuine devotion and love for God surpass all outward rituals.',
  },
  {
    id: 4,
    name: 'ਚੌਪਈ ਸਾਹਿਬ',
    english: 'Chaupai Sahib',
    author: 'Guru Gobind Singh Ji',
    categories: ['Nitnem', 'Stotras'],
    description: 'A prayer of protection and surrender invoking God’s divine shield from obstacles and sorrow.',
  },
  {
    id: 5,
    name: 'ਅਨੰਦੁ ਸਾਹਿਬ',
    english: 'Anand Sahib',
    author: 'Guru Amar Das Ji',
    categories: ['Nitnem'],
    description: 'The hymn of celestial bliss, inner union, and divine tranquility composed in Raag Ramkali.',
  },
  {
    id: 6,
    name: 'ਰਹਰਾਸਿ ਸਾਹਿਬ',
    english: 'Rehras Sahib',
    author: 'Multiple Gurus',
    categories: ['Nitnem'],
    description: 'The twilight prayer expressing gratitude at the end of the working day, recounting divine majesty.',
  },
  {
    id: 7,
    name: 'ਕੀਰਤਨ ਸੋਹਿਲਾ',
    english: 'Kirtan Sohila',
    author: 'Guru Nanak, Guru Ram Das, Guru Arjan',
    categories: ['Nitnem'],
    description: 'The serene night prayer sung before sleep, contemplating mortal journey and peaceful rest.',
  },
  {
    id: 8,
    name: 'ਸੁਖਮਨੀ ਸਾਹਿਬ',
    english: 'Sukhmani Sahib',
    author: 'Guru Arjan Dev Ji',
    categories: ['Other'],
    description: 'The Jewel of Peace comprising 24 Ashtpadis; brings inner tranquility and soothes troubled minds.',
  },
  {
    id: 9,
    name: 'ਆਸਾ ਕੀ ਵਾਰ',
    english: 'Asa Ki Vaar',
    author: 'Guru Nanak Dev Ji',
    categories: ['Other'],
    description: 'A heroic spiritual ballad sung in morning assemblies to destroy spiritual ego and illusion.',
  },
  {
    id: 10,
    name: 'ਸ਼ਬਦ ਹਜ਼ਾਰੇ',
    english: 'Shabad Hazare',
    author: 'Guru Ram Das & Guru Arjan Dev Ji',
    categories: ['Other'],
    description: 'Soulful hymns expressing heartfelt longing, separation, and the ecstasy of meeting the Guru.',
  },
  {
    id: 11,
    name: 'ਬਸੰਤ ਕੀ ਵਾਰ',
    english: 'Basant Ki Vaar',
    author: 'Guru Arjan Dev Ji',
    categories: ['Other'],
    description: 'The shortest Vaar in Guru Granth Sahib Ji celebrating spiritual blossoming and inner spring.',
  },
  {
    id: 12,
    name: 'ਸਲੋਕ ਮਹਲਾ ੯',
    english: 'Salok Mahalla 9',
    author: 'Guru Tegh Bahadur Ji',
    categories: ['Other'],
    description: '57 philosophical couplets on impermanence, spiritual courage, and supreme detachment.',
  },
  {
    id: 13,
    name: 'ਦੁਖ ਭੰਜਨੀ ਸਾਹਿਬ',
    english: 'Dukh Bhanjani Sahib',
    author: 'Guru Arjan Dev Ji',
    categories: ['Stotras'],
    description: 'A soothing compilation of sacred Shabads recited to dispel afflictions and sorrows.',
  },
  {
    id: 14,
    name: 'ਆਰਤੀ',
    english: 'Aarti',
    author: 'Guru Nanak Dev Ji & Bhagats',
    categories: ['Stotras'],
    description: 'The universal hymn revealing the whole cosmos engaged in cosmic worship of the Creator.',
  },
  {
    id: 15,
    name: 'ਅਰਦਾਸਿ',
    english: 'Ardaas',
    author: 'Sikh Panth Tradition',
    categories: ['Stotras'],
    description: 'The solemn petition invoking the Gurus and divine blessings for sarbat da bhalla.',
  },
  {
    id: 16,
    name: 'ਬਾਰਹ ਮਾਹਾ',
    english: 'Barah Maha',
    author: 'Guru Nanak / Guru Arjan Dev Ji',
    categories: ['Other'],
    description: 'Poetic reflections through the twelve months illustrating the soul’s journey to God.',
  },
  {
    id: 17,
    name: 'ਸਿਧ ਗੋਸਟਿ',
    english: 'Sidh Gosht',
    author: 'Guru Nanak Dev Ji',
    categories: ['Other'],
    description: 'The profound dialogue with Yogis discussing truth, meditation, and householder spirituality.',
  },
];

const CATEGORIES = ['All', 'Nitnem', 'Stotras', 'Savaiye', 'Other'];

/**
 * Detects and groups Ashtpadis for Banis like Sukhmani Sahib.
 * Detects Salok preceding Ashtpadi stanzas.
 */
export const detectAshtpadis = (verses) => {
  if (!verses || verses.length === 0) return null;

  const isSukhmani = verses.some((v) => {
    const text = v.verse || v.gurmukhi || '';
    return text.includes('ਸੁਖਮਨੀ') || text.includes('ਅਸਟਪਦੀ');
  });

  if (!isSukhmani) return null;

  const sections = [];
  let current = null;

  verses.forEach((v, index) => {
    const text = v.verse || '';
    // A new Ashtpadi begins with a Salok (ਸਲੋਕੁ ॥)
    if (index === 0 || (text.startsWith('ਸਲੋਕੁ ॥') && index > 15)) {
      if (current) {
        current.endIndex = index - 1;
        current.verses = verses.slice(current.startIndex, index);
        sections.push(current);
      }
      const num = sections.length + 1;
      current = {
        number: num,
        title: `ਅਸਟਪਦੀ ${num}`,
        englishTitle: `Ashtpadi ${num}`,
        startIndex: index,
      };
    }
  });

  if (current) {
    current.endIndex = verses.length - 1;
    current.verses = verses.slice(current.startIndex);
    sections.push(current);
  }

  return sections.length > 1 ? sections : null;
};

// Clean, precise Toggle Switch matching reference design
const ToggleSwitch = ({ checked, onChange, id, ariaLabel }) => (
  <button
    id={id}
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    onClick={onChange}
    style={{
      width: '42px',
      height: '24px',
      borderRadius: '9999px',
      backgroundColor: checked ? 'var(--color-primary, #24483D)' : '#B0AAA0',
      border: 'none',
      position: 'relative',
      cursor: 'pointer',
      padding: '2px',
      transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
      outline: 'none',
    }}
  >
    <span
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 3px rgba(0,0,0,0.28)',
        transform: checked ? 'translateX(18px)' : 'translateX(0)',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'block',
      }}
    />
  </button>
);

export const SundarGutkaPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // If no ID in route, default to 8 (Sukhmani Sahib)
  const activeBaniId = id ? parseInt(id, 10) : 8;

  const {
    fontSize,
    setFontSize,
    larivaar,
    setLarivaar,
    englishTranslation,
    setEnglishTranslation,
    punjabiTeeka,
    setPunjabiTeeka,
    punjlish,
    setPunjlish,
  } = useUserPreferences();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [baniData, setBaniData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [displayOptionsOpen, setDisplayOptionsOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const topScrollRef = useRef(null);

  // Fetch Bani verses whenever activeBaniId changes
  useEffect(() => {
    let isCancelled = false;
    const fetchBaniData = async () => {
      setLoading(true);
      setError(null);
      setBaniData(null); // Clear previous content to avoid stale display

      try {
        const response = await nitnemApi.getBaniById(activeBaniId);
        if (!isCancelled) {
          const data = response?.data || response;
          setBaniData(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Unable to retrieve Bani verses.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchBaniData();

    return () => {
      isCancelled = true;
    };
  }, [activeBaniId]);

  // Current Bani Info
  const currentBaniMeta = useMemo(() => {
    return (
      SUNDAR_GUTKA_BANIS.find((b) => b.id === activeBaniId) || {
        id: activeBaniId,
        name: baniData?.baniinfo?.gurmukhiUni || `ਬਾਣੀ #${activeBaniId}`,
        english: baniData?.baniinfo?.english || baniData?.baniinfo?.name || `Bani #${activeBaniId}`,
      }
    );
  }, [activeBaniId, baniData]);

  // Filter Banis in left sidebar
  const filteredBanis = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SUNDAR_GUTKA_BANIS.filter((bani) => {
      const matchesCategory =
        activeCategory === 'All' ||
        (bani.categories && (
          bani.categories.includes(activeCategory) ||
          (activeCategory === 'Savaiye' && bani.categories.includes('Sawaiye')) ||
          (activeCategory === 'Sawaiye' && bani.categories.includes('Savaiye'))
        ));
      if (!matchesCategory) return false;

      if (!q) return true;
      return (
        bani.english.toLowerCase().includes(q) ||
        bani.name.toLowerCase().includes(q) ||
        (bani.author && bani.author.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  // Normalize verses
  const rawVerses = useMemo(() => {
    if (!baniData) return [];
    return Array.isArray(baniData.bani)
      ? baniData.bani
      : Array.isArray(baniData.verses)
      ? baniData.verses
      : Array.isArray(baniData.lines)
      ? baniData.lines
      : Array.isArray(baniData.page)
      ? baniData.page
      : Array.isArray(baniData)
      ? baniData
      : [];
  }, [baniData]);

  const allVerses = useMemo(() => {
    return rawVerses.map(normalizeVerse);
  }, [rawVerses]);

  // Ashtpadi segmentation
  const sections = useMemo(() => {
    return detectAshtpadis(allVerses);
  }, [allVerses]);

  const ashtpadiParam = parseInt(searchParams.get('ashtpadi'), 10);
  const activeAshtpadiNum = useMemo(() => {
    if (!sections || sections.length === 0) return 1;
    if (!isNaN(ashtpadiParam) && ashtpadiParam >= 1 && ashtpadiParam <= sections.length) {
      return ashtpadiParam;
    }
    return 1;
  }, [sections, ashtpadiParam]);

  const displayVerses = useMemo(() => {
    if (sections && sections.length > 0) {
      const currentSection = sections[activeAshtpadiNum - 1];
      return currentSection ? currentSection.verses : allVerses;
    }
    return allVerses;
  }, [sections, activeAshtpadiNum, allVerses]);

  const handleAshtpadiChange = (newNum) => {
    if (!sections || newNum < 1 || newNum > sections.length) return;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('ashtpadi', newNum.toString());
      return next;
    });

    if (topScrollRef.current) {
      topScrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectBani = (baniId) => {
    setMobileSidebarOpen(false);
    navigate(`/sundargutka/bani/${baniId}`);
  };

  return (
    <div className="sundar-gutka-page-root">
      <div
        ref={topScrollRef}
        className="sundar-gutka-layout-container"
      >
        {/* ========================================================
            LEFT SIDEBAR: SUNDAR GUTKA COLLECTION
            ======================================================== */}
        <aside
          className={`sundar-gutka-sidebar ${mobileSidebarOpen ? 'is-open' : ''}`}
        >
          {/* Mobile Sidebar Close Button */}
          {mobileSidebarOpen && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(false)}
                className="btn btn-ghost btn-icon btn-sm"
                aria-label="Close Sidebar"
              >
                <IconClose size={18} />
              </button>
            </div>
          )}

          {/* Header - Horizontal clean layout with Deep Forest Green title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <div style={{ color: 'var(--color-accent, #C49A55)', marginTop: '2px', flexShrink: 0 }}>
              <IconLayers size={26} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontFamily: "var(--font-editorial, 'Lora', Georgia, serif)",
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: 0,
                  color: 'var(--color-primary, #24483D)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}
              >
                Sundar Gutka
              </h2>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--color-text-secondary, #586358)',
                  margin: '0.2rem 0 0 0',
                  lineHeight: 1.35,
                }}
              >
                A complete collection of sacred Banis for daily Paath.
              </p>
            </div>
          </div>

          {/* Search Input - Fully visible, pill-shaped with clean padding and icon */}
          <div style={{ position: 'relative', margin: '0.9rem 0 0.85rem 0', width: '100%' }}>
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-muted, #829486)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
              }}
            >
              <IconSearch size={16} />
            </div>
            <input
              type="text"
              placeholder="Search Bani..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: '38px',
                padding: '0 0.75rem 0 36px',
                fontSize: '0.85rem',
                borderRadius: '9999px',
                border: '1px solid #DED7C8',
                backgroundColor: 'var(--color-surface, #FFFFFF)',
                color: 'var(--color-text, #343A32)',
                outline: 'none',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary, #24483D)';
                e.target.style.boxShadow = '0 0 0 2px rgba(36, 72, 61, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#DED7C8';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Category Tabs - All 5 tabs fully visible, compact pill design */}
          <div
            className="sundar-gutka-category-tabs"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.3rem',
              marginBottom: '0.85rem',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    border: isActive ? 'none' : '1px solid #E7E0D2',
                    borderRadius: '9999px',
                    padding: '0.32rem 0.55rem',
                    fontSize: '0.74rem',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    backgroundColor: isActive ? 'var(--color-primary, #24483D)' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : 'var(--color-text, #343A32)',
                    transition: 'all 0.15s ease',
                    flex: '1 1 auto',
                    textAlign: 'center',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Scrollable Bani List - Clean bordered items matching reference image */}
          <div
            className="sundar-gutka-bani-list"
            style={{
              overflowY: 'auto',
              flex: 1,
              minHeight: 0,
              paddingRight: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {filteredBanis.map((bani) => {
              const isSelected = bani.id === activeBaniId;
              return (
                <button
                  key={bani.id}
                  type="button"
                  onClick={() => handleSelectBani(bani.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#EEF5F1' : '#FFFFFF',
                    border: isSelected
                      ? '1.5px solid var(--color-primary, #24483D)'
                      : '1px solid #ECE6D9',
                    transition: 'all 0.15s ease',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    <div
                      style={{
                        color: 'var(--color-accent, #C49A55)',
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconBook size={20} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 600,
                          color: isSelected ? 'var(--color-primary, #24483D)' : 'var(--color-text, #2D3748)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {bani.english}
                      </div>
                      <div
                        className="gurbani-text"
                        style={{
                          fontSize: '0.82rem',
                          color: isSelected ? 'var(--color-primary, #24483D)' : 'var(--color-text-secondary, #586358)',
                          marginTop: '1px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {bani.name}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      color: isSelected ? 'var(--color-primary, #24483D)' : '#829486',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      marginLeft: '0.5rem',
                    }}
                  >
                    <IconChevronRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ========================================================
            RIGHT AREA: MAIN READER WORKSPACE
            ======================================================== */}
        <div className="sundar-gutka-reader-workspace">
          {/* Top Reader Toolbar */}
          <div className="sundar-gutka-top-toolbar">
            {/* Breadcrumb Left */}
            <div className="sundar-gutka-breadcrumb-left">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="sundar-gutka-mobile-menu-btn"
              >
                <IconMenu size={16} /> All Banis
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.92rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>← Sundar Gutka</span>
                <span style={{ color: 'var(--color-muted)' }}>&gt;</span>
                <span
                  className="gurbani-text"
                  style={{ fontWeight: 700, color: 'var(--color-primary, #24483D)' }}
                >
                  {currentBaniMeta.name}
                </span>
              </div>
            </div>

            {/* Controls Right */}
            <div className="sundar-gutka-controls-right">
              {/* Re-open Display Options Button if panel was closed */}
              {!displayOptionsOpen && (
                <button
                  type="button"
                  onClick={() => setDisplayOptionsOpen(true)}
                  className="sundar-gutka-display-btn"
                >
                  <IconSettings size={15} /> Display Options
                </button>
              )}

              {/* Font Size Pill Group */}
              <div className="sundar-gutka-fontsize-pill">
                {[
                  { id: 'small', label: 'A-' },
                  { id: 'medium', label: 'A' },
                  { id: 'large', label: 'A+' },
                  { id: 'xlarge', label: 'A++' },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setFontSize(sz.id)}
                    style={{
                      border: 'none',
                      backgroundColor: fontSize === sz.id ? 'var(--color-primary, #24483D)' : 'transparent',
                      color: fontSize === sz.id ? '#FFFFFF' : 'var(--color-text)',
                      padding: '0.32rem 0.6rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>

              {/* Larivaar Switch Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span
                  className="gurbani-text"
                  style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text)' }}
                >
                  ਲੜੀਵਾਰ
                </span>
                <ToggleSwitch
                  id="larivaar-toggle"
                  checked={larivaar}
                  onChange={() => setLarivaar(!larivaar)}
                  ariaLabel="Toggle Larivaar Script"
                />
              </div>

              {/* Settings Drawer Button */}
              <button
                type="button"
                onClick={() => setShowSettingsDrawer(true)}
                title="Full Reader Settings"
                aria-label="Open Reader Settings"
                className="sundar-gutka-settings-btn"
              >
                <IconSettings size={16} />
              </button>
            </div>
          </div>

          {/* Bani Header Card (Dark Forest Green) */}
          <div className="sundar-gutka-header-card">
            {/* Left section: Icon + Bani Titles */}
            <div className="sundar-gutka-header-title-box">
              <div style={{ color: '#C49A55', display: 'flex', alignItems: 'center' }}>
                <IconBook size={34} />
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <h1
                  className="gurbani-text sundar-gutka-header-title"
                >
                  {currentBaniMeta.name}
                </h1>
                <div style={{ fontSize: '0.95rem', color: '#E2D5BA', marginTop: '0.2rem' }}>
                  {currentBaniMeta.english}
                </div>
              </div>
            </div>

            {/* Right section: Ashtpadi Selector & Arrows */}
            {sections && sections.length > 0 && (
              <div className="sundar-gutka-ashtpadi-controls">
                <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', height: '36px', marginRight: '0.25rem' }} />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: 'rgba(255,255,255,0.7)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '0.2rem',
                    }}
                  >
                    Ashtpadi
                  </span>
                  <select
                    id="ashtpadi-dropdown"
                    value={activeAshtpadiNum}
                    onChange={(e) => handleAshtpadiChange(Number(e.target.value))}
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: '#1B3B32',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      padding: '0.38rem 0.85rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    {sections.map((sec) => (
                      <option key={sec.number} value={sec.number}>
                        {sec.number}. {sec.title} ({sec.verses.length} verses)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    disabled={activeAshtpadiNum <= 1}
                    onClick={() => handleAshtpadiChange(activeAshtpadiNum - 1)}
                    title="Previous Ashtpadi"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'transparent',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: activeAshtpadiNum <= 1 ? 'not-allowed' : 'pointer',
                      opacity: activeAshtpadiNum <= 1 ? 0.4 : 1,
                    }}
                  >
                    <IconChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={activeAshtpadiNum >= sections.length}
                    onClick={() => handleAshtpadiChange(activeAshtpadiNum + 1)}
                    title="Next Ashtpadi"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      backgroundColor: 'transparent',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: activeAshtpadiNum >= sections.length ? 'not-allowed' : 'pointer',
                      opacity: activeAshtpadiNum >= sections.length ? 0.4 : 1,
                    }}
                  >
                    <IconChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================
              SCRIPTURE READING AREA WITH REDESIGNED DISPLAY OPTIONS
              ======================================================== */}
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'flex-start',
              position: 'relative',
              marginTop: '0.5rem',
            }}
          >
            {/* Center Continuous Scripture Stream */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                maxWidth: '780px',
                margin: '0 auto',
                padding: '1.5rem 1rem',
              }}
            >
              {loading ? (
                <LoadingState message={`Preparing sacred verses of ${currentBaniMeta.english}...`} />
              ) : error ? (
                <ErrorState message={error} onRetry={() => handleSelectBani(activeBaniId)} />
              ) : displayVerses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-secondary)' }}>
                  No verses currently loaded for this composition.
                </div>
              ) : (
                <div>
                  {/* Decorative Lotus / Khanda Divider between Header and Verses */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '1rem',
                      margin: '1rem 0 2rem 0',
                    }}
                  >
                    <div style={{ height: '1px', flex: 1, maxWidth: '140px', backgroundColor: '#E0D8C8' }} />
                    <span style={{ color: '#C49A55', fontSize: '1.35rem' }}>☬</span>
                    <div style={{ height: '1px', flex: 1, maxWidth: '140px', backgroundColor: '#E0D8C8' }} />
                  </div>

                  {/* Clean Continuous Verse Stream - NO Cards, NO Borders, NO Copy Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                    {displayVerses.map((verse, idx) => {
                      const gurmukhi = verse.verse || '';
                      const formattedGurmukhi = larivaar ? gurmukhi.replace(/\s+/g, '') : gurmukhi;

                      return (
                        <div
                          key={verse.id || idx}
                          id={`verse-${idx}`}
                          style={{
                            textAlign: 'center',
                            padding: '0.2rem 0',
                            transition: 'color 0.2s ease',
                          }}
                        >
                          {/* 1. Gurmukhi Line (Always rendered with pure sacred styling) */}
                          <div
                            className="gurbani-verse"
                            style={{
                              fontSize: 'var(--gurbani-current-size, 1.85rem)',
                              color: 'var(--color-primary, #1e3a30)',
                              lineHeight: 1.85,
                              fontWeight: 500,
                              letterSpacing: '0.01em',
                            }}
                          >
                            {formattedGurmukhi}
                          </div>

                          {/* 2. Roman Transliteration - ONLY rendered when user toggles ON */}
                          {Boolean(punjlish) && verse.transliteration && (
                            <div
                              className="gurbani-transliteration"
                              style={{
                                fontSize: '0.98rem',
                                color: 'var(--color-text-secondary, #586358)',
                                fontStyle: 'italic',
                                marginTop: '0.3rem',
                                lineHeight: 1.45,
                              }}
                            >
                              {verse.transliteration}
                            </div>
                          )}

                          {/* 3. English Translation (Meaning) - ONLY rendered when user toggles ON */}
                          {Boolean(englishTranslation) && verse.translation && (
                            <div
                              className="gurbani-translation"
                              style={{
                                fontSize: '0.95rem',
                                color: 'var(--color-text, #343A32)',
                                marginTop: '0.35rem',
                                lineHeight: 1.5,
                              }}
                            >
                              {verse.translation}
                            </div>
                          )}

                          {/* 4. Punjabi Teeka (Exposition) - ONLY rendered when user toggles ON */}
                          {Boolean(punjabiTeeka) && verse.teeka && (
                            <div
                              className="gurbani-punjabi-teeka gurbani-text"
                              style={{
                                fontSize: '0.92rem',
                                color: '#4B6350',
                                marginTop: '0.35rem',
                                lineHeight: 1.6,
                              }}
                            >
                              {verse.teeka}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Ashtpadi Navigation (For Sukhmani Sahib / Ashtpadi Banis) */}
                  {sections && sections.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '3.5rem',
                        paddingTop: '1.75rem',
                        borderTop: '1px solid var(--color-border, #E7E0D2)',
                        gap: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <button
                        type="button"
                        disabled={activeAshtpadiNum <= 1}
                        onClick={() => handleAshtpadiChange(activeAshtpadiNum - 1)}
                        style={{
                          backgroundColor: '#F4F0E6',
                          border: '1px solid #DFD8C8',
                          color: '#24483D',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          padding: '0.55rem 1.25rem',
                          borderRadius: '25px',
                          cursor: activeAshtpadiNum <= 1 ? 'not-allowed' : 'pointer',
                          opacity: activeAshtpadiNum <= 1 ? 0.45 : 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        ‹ Previous 
                      </button>

                      <div
                        style={{
                          fontSize: '0.92rem',
                          fontWeight: 600,
                          color: 'var(--color-text-secondary, #586358)',
                        }}
                      >
                        Ashtpadi {activeAshtpadiNum} of {sections.length}
                      </div>

                      <button
                        type="button"
                        disabled={activeAshtpadiNum >= sections.length}
                        onClick={() => handleAshtpadiChange(activeAshtpadiNum + 1)}
                        style={{
                          backgroundColor: '#24483D',
                          border: 'none',
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          padding: '0.55rem 1.35rem',
                          borderRadius: '25px',
                          cursor: activeAshtpadiNum >= sections.length ? 'not-allowed' : 'pointer',
                          opacity: activeAshtpadiNum >= sections.length ? 0.45 : 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        Next  ›
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ========================================================
                RIGHT STICKY DISPLAY OPTIONS PANEL
                Redesigned strictly according to target visual reference
                ======================================================== */}
            {displayOptionsOpen && (
              <aside
                className="sundar-gutka-display-options"
                style={{
                  width: '320px',
                  flexShrink: 0,
                  backgroundColor: 'var(--color-surface, #FFFFFF)',
                  borderRadius: '14px',
                  border: '1px solid #E2DBCF',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  position: 'sticky',
                  top: 'calc(var(--navbar-height, 68px) + 1.25rem)',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                {/* Header Bar in Deep Forest Green (#24483D) */}
                <div
                  style={{
                    backgroundColor: 'var(--color-primary, #24483D)',
                    padding: '0.75rem 1.15rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                    <div style={{ color: '#FFFFFF', display: 'flex', alignItems: 'center' }}>
                      <IconSettings size={18} />
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-editorial, 'Lora', Georgia, serif)",
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        color: '#FFFFFF',
                        margin: 0,
                        letterSpacing: '0.01em',
                      }}
                    >
                      Display Options
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDisplayOptionsOpen(false)}
                    title="Close Display Options"
                    aria-label="Close Display Options"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255, 255, 255, 0.85)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '2px',
                      borderRadius: '4px',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)')}
                  >
                    <IconClose size={18} />
                  </button>
                </div>

                {/* Settings Rows Container */}
                <div style={{ padding: '0.2rem 0' }}>
                  {/* Row 1: Transliteration (Roman) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.15rem',
                      borderBottom: '1px solid #F0EBE0',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-editorial, 'Lora', Georgia, serif)",
                          fontStyle: 'italic',
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          color: 'var(--color-primary, #24483D)',
                          width: '22px',
                          textAlign: 'center',
                          display: 'inline-block',
                          flexShrink: 0,
                        }}
                      >
                        A
                      </span>
                      <span
                        style={{
                          width: '1px',
                          height: '18px',
                          backgroundColor: '#E2DBCF',
                          margin: '0 0.1rem',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 500,
                          color: 'var(--color-text, #343A32)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        Transliteration (Roman)
                      </span>
                    </div>

                    <ToggleSwitch
                      id="toggle-transliteration"
                      checked={punjlish}
                      onChange={() => setPunjlish(!punjlish)}
                      ariaLabel="Toggle Roman Transliteration"
                    />
                  </div>

                  {/* Row 2: English Translation (Meaning) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.15rem',
                      borderBottom: '1px solid #F0EBE0',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <div
                        style={{
                          color: 'var(--color-primary, #24483D)',
                          width: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconBook size={19} />
                      </div>
                      <span
                        style={{
                          width: '1px',
                          height: '18px',
                          backgroundColor: '#E2DBCF',
                          margin: '0 0.1rem',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 500,
                          color: 'var(--color-text, #343A32)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        English Translation (Meaning)
                      </span>
                    </div>

                    <ToggleSwitch
                      id="toggle-translation"
                      checked={englishTranslation}
                      onChange={() => setEnglishTranslation(!englishTranslation)}
                      ariaLabel="Toggle English Translation"
                    />
                  </div>

                  {/* Row 3: Tika / Explanation */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.15rem',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
                      <div
                        style={{
                          color: 'var(--color-primary, #24483D)',
                          width: '22px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconNote size={19} />
                      </div>
                      <span
                        style={{
                          width: '1px',
                          height: '18px',
                          backgroundColor: '#E2DBCF',
                          margin: '0 0.1rem',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 500,
                          color: 'var(--color-text, #343A32)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        Tika / Explanation
                      </span>
                    </div>

                    <ToggleSwitch
                      id="toggle-teeka"
                      checked={punjabiTeeka}
                      onChange={() => setPunjabiTeeka(!punjabiTeeka)}
                      ariaLabel="Toggle Punjabi Teeka"
                    />
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>

      {/* Reader Settings Drawer (Accessible via Gear icon) */}
      <ReaderSettingsDrawer
        isOpen={showSettingsDrawer}
        onClose={() => setShowSettingsDrawer(false)}
      />
    </div>
  );
};

export default SundarGutkaPage;
