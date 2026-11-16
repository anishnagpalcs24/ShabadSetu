import { Outlet } from 'react-router-dom';
import Navbar from '../Shared/Components/Navbar';
import Footer from '../Shared/Components/Footer';
import MiniPlayer from '../Features/AudioPaath/Component/MiniPlayer';

export const MainLayout = () => {
  return (
    <div className="app-layout">
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
