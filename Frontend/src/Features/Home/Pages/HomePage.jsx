import { Link } from 'react-router-dom';
import goldenTempleImg from '../../../Assets/golden-temple.jpg';
import {
  IconBook,
  IconSearch,
  IconBookmark,
  IconArrowRight,
  IconHeadphones,
  IconLayers,
  IconPrayingHands,
} from '../../../Shared/Components/Icons';
import '../Styles/home.scss';

export const HomePage = () => {
  const featureCards = [
    {
      id: 'gurbani',
      title: 'Gurbani',
      desc: 'Read Sri Guru Granth Sahib Ji',
      icon: IconBook,
      to: '/reader',
    },
    {
      id: 'nitnem',
      title: 'Nitnem',
      desc: 'Daily prayers for a disciplined life',
      icon: IconPrayingHands,
      to: '/nitnem',
    },
    {
      id: 'sundargutka',
      title: 'Sundar Gutka',
      desc: 'Essential bani collection in one place',
      icon: IconLayers,
      to: '/sundargutka',
    },
    {
      id: 'audio',
      title: 'Audio Paath',
      desc: 'Listen to selected banis with focus',
      icon: IconHeadphones,
      to: '/audio',
    },
    {
      id: 'search',
      title: 'Search',
      desc: 'Find any bani, Ang or keyword',
      icon: IconSearch,
      to: '/search',
    },
    {
      id: 'library',
      title: 'My Library',
      desc: 'Save, organize and continue later',
      icon: IconBookmark,
      to: '/library',
    },
  ];

  return (
    <div className="home-page-root">
      <div className="container home-main-container">
        {/* ==========================================================
            HERO SECTION: TWO-COLUMN DESKTOP / STACKED MOBILE
            ========================================================== */}
        <section className="home-hero-grid">
          {/* Left Column: Typography & CTAs */}
          <div className="home-hero-content">
            {/* Eyebrow Label with Gold Rule */}
            <div className="home-hero-eyebrow">
              <span className="home-hero-eyebrow-text">A DIGITAL SANCTUARY OF GURBANI</span>
              <span className="home-hero-eyebrow-line" aria-hidden="true" />
            </div>

            {/* Editorial Headline */}
            <h1 className="home-hero-headline">
              <span className="home-hero-headline-primary">The Sacred Living Word,</span>
              <span className="home-hero-headline-accent">Preserved for Contemplation.</span>
            </h1>

            {/* Subtitle */}
            <p className="home-hero-description">
              Read, search, and contemplate Sri Guru Granth Sahib Ji, Nitnem, and historical Sikh scriptures with authentic typography and scholarly accuracy.
            </p>

            {/* CTA Buttons Row */}
            <div className="home-hero-cta-group">
              <Link to="/reader" className="btn-hero-primary">
                <IconBook size={19} />
                <span>Open Gurbani Reader</span>
                <IconArrowRight size={16} />
              </Link>

              <div className="home-hero-cta-subgroup">
                <Link to="/audio" className="btn-hero-outline">
                  <IconHeadphones size={18} />
                  <span>Audio Paath</span>
                </Link>

                <Link to="/search" className="btn-hero-outline">
                  <IconSearch size={18} />
                  <span>Search Bani</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column / Mobile Center: Golden Temple Image */}
          <div className="home-hero-visual">
            <div className="home-hero-image-wrapper">
              <img
                src={goldenTempleImg}
                alt="Sri Harmandir Sahib - Golden Temple Amritsar"
                className="home-hero-image"
                loading="eager"
              />
            </div>
          </div>
        </section>

        {/* ==========================================================
            FEATURE CARDS GRID (6 Cards: 1 Row Desktop / 2-Col Mobile)
            ========================================================== */}
        <section className="home-features-section" aria-label="Explore Core Features">
          <div className="home-features-grid">
            {featureCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.id}
                  to={card.to}
                  className="home-feature-card"
                >
                  <div className="home-feature-card-icon">
                    <Icon size={24} />
                  </div>
                  <h3 className="home-feature-card-title">
                    {card.title}
                  </h3>
                  <p className="home-feature-card-desc">
                    {card.desc}
                  </p>
                  <div className="home-feature-card-arrow">
                    <IconArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ==========================================================
            BOTTOM SACRED EMBLEM (Golden Khanda Divider)
            ========================================================== */}
        <div className="home-bottom-emblem-divider">
          <span className="home-emblem-line" />
          <span className="home-emblem-khanda">☬</span>
          <span className="home-emblem-line" />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
