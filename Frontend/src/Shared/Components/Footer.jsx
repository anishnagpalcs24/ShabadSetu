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
            <p className="footer-desc">
              A digital sanctuary for reading, searching, and meditating upon the sacred words of Gurbani with clarity, tranquility, and devotion.
            </p>
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
                  Sehaj Paath Tracker
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

          {/* Heritage Dedication */}
          <div>
            <h4 className="footer-section-title">Heritage & Reverence</h4>
            <p className="footer-quote">
              "ਬਾਣੀ ਗੁਰੂ ਗੁਰੂ ਹੈ ਬਾਣੀ ਵਿਚਿ ਬਾਣੀ ਅੰਮ੍ਰਿਤੁ ਸਾਰੇ ॥"
            </p>
            <p className="footer-quote-trans">
              The Word is the Guru, and the Guru is the Word; within the Word are all the Nectars of Immortality.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© {CURRENT_YEAR} ShabadSetu. Dedicated to the worldwide Sangat for seva and contemplation.</p>
          <p className="footer-badges-row">
            <span>Powered by iGranth API</span>
            <span>•</span>
            <span>Unicode Verified</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
