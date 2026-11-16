import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUserPreferences } from '../../Features/Settings/hooks/useUserPreferences';
import {
  IconLotus,
  IconSun,
  IconMoon,
  IconMenu,
  IconClose,
} from './Icons';

export const Navbar = () => {
  const { theme, toggleTheme } = useUserPreferences();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/reader', label: 'Gurbani ▾' },
    { to: '/search', label: 'Search' },
    { to: '/nitnem', label: 'Nitnem' },
    { to: '/sundargutka', label: 'Sundar Gutka' },
    { to: '/audio', label: 'Audio Paath' },
    { to: '/library', label: 'My Library' },
  ];

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo-badge">
              <IconLotus size={22} />
            </div>
            <div>
              <span className="navbar-brand-title">ShabadSetu</span>
              <span className="navbar-brand-subtitle">ਸ਼ਬਦ ਸੇਤੁ</span>
            </div>
          </Link>
          <span className="navbar-tagline-divider" aria-hidden="true">|</span>
          <span className="navbar-tagline">Digital Gurbani Library</span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="navbar-desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn btn-icon btn-ghost"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to daylight reading' : 'Switch to dark sanctuary theme'}
            aria-label="Toggle reading theme"
          >
            {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="btn btn-icon btn-ghost navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          <nav className="navbar-mobile-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `navbar-mobile-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
