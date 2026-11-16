import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useReader } from '../../Gurbani/hooks/useReader';
import {
  IconLotus,
  IconBook,
  IconSearch,
  IconBookmark,
  IconArrowRight,
  IconHeadphones,
} from '../../../Shared/Components/Icons';
import '../Styles/home.scss';

export const HomePage = () => {
  const { setPage } = useReader();
  const navigate = useNavigate();
  const [quickAng, setQuickAng] = useState('');

  const handleQuickAngSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(quickAng, 10);
    if (pageNum >= 1 && pageNum <= 1430) {
      setPage(pageNum);
      navigate('/reader');
    }
  };

  const nitnemQuickList = [
    { name: 'ਜਪੁਜੀ ਸਾਹਿਬ', english: 'Japji Sahib', time: 'Amritvela (Dawn)', id: 1 },
    { name: 'ਜਾਪੁ ਸਾਹਿਬ', english: 'Jaap Sahib', time: 'Amritvela (Dawn)', id: 2 },
    { name: 'ਤ੍ਵ ਪ੍ਰਸਾਦਿ ਸਵੱਯੇ', english: 'Tav Prasad Savaiye', time: 'Amritvela (Dawn)', id: 3 },
    { name: 'ਚੌਪਈ ਸਾਹਿਬ', english: 'Chaupai Sahib', time: 'Evening & Night', id: 4 },
    { name: 'ਅਨੰਦੁ ਸਾਹਿਬ', english: 'Anand Sahib', time: 'Devotional Bliss', id: 5 },
    { name: 'ਰਹਰਾਸਿ ਸਾਹਿਬ', english: 'Rehras Sahib', time: 'Sunset (Sodar)', id: 6 },
    { name: 'ਕੀਰਤਨ ਸੋਹਿਲਾ', english: 'Kirtan Sohila', time: 'Night (Retiring)', id: 7 },
  ];

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="home-hero-section">
        <div className="container home-hero-container">
          {/* Spiritual Opening */}
          <div className="badge badge-gold home-opening-badge">
            ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ
          </div>

          <h1 className="editorial-title home-hero-title">
            The Sacred Living Word, <br />
            Preserved for Contemplation.
          </h1>

          <p className="home-hero-desc">
            ShabadSetu is a serene digital sanctuary to read, search, and contemplate Sri Guru Granth Sahib Ji,
            Nitnem, and historical Sikh scriptures with authentic typography and scholarly accuracy.
          </p>

          {/* Quick Actions */}
          <div className="home-actions-row">
            <Link to="/reader" className="btn btn-primary btn-lg">
              <IconBook size={20} /> Open Gurbani Reader
            </Link>
            <Link to="/audio" className="btn btn-secondary btn-lg">
              <IconHeadphones size={20} /> Audio Paath
            </Link>
            <Link to="/search" className="btn btn-outline btn-lg">
              <IconSearch size={20} /> Search Engine
            </Link>
          </div>

          {/* Quick Ang Jump Input */}
          <form onSubmit={handleQuickAngSubmit} className="panel home-ang-form">
            <span className="home-ang-label">Jump to Ang:</span>
            <input
              type="number"
              min="1"
              max="1430"
              placeholder="1 - 1430"
              value={quickAng}
              onChange={(e) => setQuickAng(e.target.value)}
              className="input-field home-ang-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Go
            </button>
          </form>
        </div>
      </section>

      {/* 2. Sacred Opening Mool Mantar Contemplation */}
      <section className="home-manglacharan-section">
        <div className="reader-container home-manglacharan-container">
          <span className="home-manglacharan-tag">
            Manglacharan • The Divine Invocation
          </span>
          <p className="gurbani-verse home-manglacharan-verse">
            ੴ ਸਤਿ ਨਾਮੁ ਕਰਤਾ ਪੁਰਖੁ ਨਿਰਭਉ ਨਿਰਵੈਰੁ ਅਕਾਲ ਮੂਰਤਿ ਅਜੂਨੀ ਸੈਭੰ ਗੁਰ ਪ੍ਰਸਾਦਿ ॥
          </p>
          <p className="gurbani-translation home-manglacharan-trans">
            One Universal Creator God. The Name Is Truth. Creative Being Personified. No Fear. No Hatred. Image Of The Undying, Beyond Birth, Self-Existent. By Guru's Grace.
          </p>
          <div className="home-manglacharan-link-box">
            <Link to="/reader" onClick={() => setPage(1)} className="btn btn-outline btn-sm">
              Read Japji Sahib on Ang 1 <IconArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Nitnem Banis Quick Grid */}
      <section className="home-nitnem-section">
        <div className="container">
          <div className="home-nitnem-header">
            <h2 className="home-nitnem-title">
              Daily Nitnem Prayers
            </h2>
            <p className="home-nitnem-desc">
              The daily spiritual discipline prescribed by the Gurus for remembrance, peace of mind, and divine connection.
            </p>
          </div>

          <div className="home-nitnem-grid">
            {nitnemQuickList.map((bani) => (
              <Link
                key={bani.english}
                to={`/nitnem/bani/${bani.id}`}
                className="panel home-nitnem-card"
              >
                <div>
                  <div className="home-nitnem-top">
                    <span className="badge badge-sage home-nitnem-badge">
                      {bani.time}
                    </span>
                    <span className="home-nitnem-icon">
                      <IconLotus size={16} />
                    </span>
                  </div>
                  <h3 className="gurbani-text home-nitnem-name">
                    {bani.name}
                  </h3>
                  <p className="home-nitnem-eng">
                    {bani.english}
                  </p>
                </div>
                <div className="home-nitnem-bottom">
                  Begin Paath <IconArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>

          <div className="home-nitnem-actions">
            <Link to="/nitnem" className="btn btn-secondary">
              View All Nitnem Banis <IconArrowRight size={16} />
            </Link>
            <Link to="/sundargutka" className="btn btn-outline">
              Open Sundar Gutka <IconArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Scripture & Tools Pillars */}
      <section className="home-pillars-section">
        <div className="container">
          <div className="home-pillars-grid">
            {/* Pillar 1: Advanced Search */}
            <div className="panel home-pillar-card">
              <div>
                <div className="home-pillar-icon">
                  <IconSearch size={28} />
                </div>
                <h3 className="home-pillar-title">
                  Intelligent Gurbani Search
                </h3>
                <p className="home-pillar-desc">
                  Find verses instantly using First-Letter indexing (Gurmukhi or Romanized), exact word matches, or English translation keywords. Filter by Writer, Raag, and Granth.
                </p>
              </div>
              <Link to="/search" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                Open Search Engine <IconArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 2: Sundar Gutka */}
            <div className="panel home-pillar-card">
              <div>
                <div className="home-pillar-icon">
                  <IconBook size={28} />
                </div>
                <h3 className="home-pillar-title">
                  Sundar Gutka Collection
                </h3>
                <p className="home-pillar-desc">
                  Complete recitation of traditional prayers including Sukhmani Sahib, Asa Ki Vaar, Shabad Hazare, Salok Mahalla 9, Dukh Bhanjani Sahib, Ardaas, and Sidh Gosht.
                </p>
              </div>
              <Link to="/sundargutka" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                Explore Sundar Gutka <IconArrowRight size={14} />
              </Link>
            </div>

            {/* Pillar 3: Personal Library */}
            <div className="panel home-pillar-card">
              <div>
                <div className="home-pillar-icon">
                  <IconBookmark size={28} />
                </div>
                <h3 className="home-pillar-title">
                  Personal Library & Sehaj Paath
                </h3>
                <p className="home-pillar-desc">
                  Bookmark shabads, save personal reflection notes, organize Shabads into thematic collections, and track your ongoing Sehaj Paath progress across all devices.
                </p>
              </div>
              <Link to="/library" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                Go to My Library <IconArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Spiritual Reverence Banner */}
      <section className="home-reverence-section">
        <div className="container home-reverence-container">
          <p className="gurbani-text home-reverence-verse">
            ਸਭ ਤੇ ਊਤਮ ਹਰਿ ਕੀ ਕਥਾ ॥ ਨਾਮੁ ਸੁਨਤ ਦਰਦ ਦੁਖ ਲਥਾ ॥
          </p>
          <p className="gurbani-translation home-reverence-trans">
            "Sublime above all is the Discourse of the Lord. Hearing the Naam, pain and sorrow depart." — Guru Arjan Dev Ji (Ang 265)
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
