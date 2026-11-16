import { useEffect } from 'react';
import { Outlet, useLocation, ScrollRestoration } from 'react-router-dom';
import Navbar from '../Shared/Components/Navbar';
import Footer from '../Shared/Components/Footer';
import MiniPlayer from '../Features/AudioPaath/Component/MiniPlayer';
import { useAudioPlayer } from '../Features/AudioPaath/hooks/useAudioPlayer';

export const MainLayout = () => {
  const location = useLocation();
  const { currentTrack, isMiniPlayerVisible } = useAudioPlayer();

  // Scroll to top on every fresh section navigation (excluding in-page hash anchors)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  const hasActiveMiniPlayer = Boolean(
    currentTrack && isMiniPlayerVisible && location.pathname !== `/audio/${currentTrack?.slug}`
  );

  return (
    <div className={`app-layout ${hasActiveMiniPlayer ? 'has-active-miniplayer' : ''}`}>
      <ScrollRestoration />
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <MiniPlayer />
    </div>
  );
};

export default MainLayout;
