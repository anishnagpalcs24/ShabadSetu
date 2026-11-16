import { Link } from 'react-router-dom';
import { IconLotus } from './Icons';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <div className="footer-logo-box">
                <IconLotus size={18} />
              </div>
              <div>
                <span className="footer-brand-title">ShabadSetu</span>
                <span className="footer-brand-subtitle">ਸ਼ਬਦ ਸੇਤੁ</span>
              </div>
            </div>
            <div className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
              ੴ ਸਤਿਗੁਰ ਪ੍ਰਸਾਦਿ ॥
            </div>
          </div>

          {/* Quick Explore */}
          <div>
            <h4 className="footer-section-title">Scriptures & Reader</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/reader" className="footer-nav-link">
                  Sri Guru Granth Sahib Ji
                </Link>
              </li>
              <li>
                <Link to="/search" className="footer-nav-link">
                  Gurbani Search Engine
                </Link>
              </li>
              <li>
                <Link to="/nitnem" className="footer-nav-link">
                  Daily Nitnem Prayers
                </Link>
              </li>
              <li>
                <Link to="/sundargutka" className="footer-nav-link">
                  Sundar Gutka Collection
                </Link>
              </li>
              <li>
                <Link to="/audio" className="footer-nav-link">
                  Audio Paath (Listen Gurbani)
                </Link>
              </li>
              <li>
                <Link to="/progress" className="footer-nav-link">
                  Sehaj Paath Tracker <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem', borderRadius: '4px', backgroundColor: 'rgba(212, 175, 55, 0.18)', color: 'var(--color-accent)', marginLeft: '0.35rem', fontWeight: 600 }}>Soon</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Tools */}
          <div>
            <h4 className="footer-section-title">Study & Personalization</h4>
            <ul className="footer-nav-list">
              <li>
                <Link to="/library" className="footer-nav-link">
                  Personal Verses & Bookmarks
                </Link>
              </li>
              <li>
                <Link to="/settings" className="footer-nav-link">
                  Reader & Typography Settings
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© {CURRENT_YEAR} ShabadSetu. Dedicated to the worldwide Sangat for seva and contemplation.</p>
          <p className="footer-badges-row">
            <span>Powered by ShabadSetu</span>
            <span>•</span>
            <span>Unicode Verified</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
