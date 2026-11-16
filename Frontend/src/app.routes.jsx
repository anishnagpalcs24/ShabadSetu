import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import LoadingState from './Shared/Components/LoadingState';
import { RouteError } from './Shared/Components/ErrorBoundary';

// Lazy-loaded feature page components for high-performance chunking
const HomePage = lazy(() => import('./Features/Home/Pages/HomePage'));
const ReaderPage = lazy(() => import('./Features/Gurbani/Pages/ReaderPage'));
const SearchPage = lazy(() => import('./Features/Search/Pages/SearchPage'));
const NitnemPage = lazy(() => import('./Features/Nitnem/Pages/NitnemPage'));
const BaniReaderPage = lazy(() => import('./Features/Nitnem/Pages/BaniReaderPage'));
const SundarGutkaPage = lazy(() => import('./Features/SundarGutka/Pages/SundarGutkaPage'));
const AudioLibraryPage = lazy(() => import('./Features/AudioPaath/Pages/AudioLibraryPage'));
const AudioPlayerPage = lazy(() => import('./Features/AudioPaath/Pages/AudioPlayerPage'));
const LibraryPage = lazy(() => import('./Features/Library/Pages/LibraryPage'));
const ProgressPage = lazy(() => import('./Features/Progress/Pages/ProgressPage'));
const SettingsPage = lazy(() => import('./Features/Settings/Pages/SettingsPage'));

// Pre-warm primary chunks during idle browser cycles for instant transitions
if (typeof window !== 'undefined') {
  const prewarm = () => {
    import('./Features/Home/Pages/HomePage');
    import('./Features/Gurbani/Pages/ReaderPage');
    import('./Features/Search/Pages/SearchPage');
    import('./Features/Nitnem/Pages/NitnemPage');
    import('./Features/SundarGutka/Pages/SundarGutkaPage');
    import('./Features/AudioPaath/Pages/AudioLibraryPage');
  };
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prewarm, { timeout: 2000 });
  } else {
    setTimeout(prewarm, 1000);
  }
}

const RouteFallback = () => (
  <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <LoadingState compact={true} message="Opening sanctuary..." />
  </div>
);

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<RouteFallback />}>{children}</Suspense>
);

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'reader',
        element: (
          <SuspenseWrapper>
            <ReaderPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'search',
        element: (
          <SuspenseWrapper>
            <SearchPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'nitnem',
        element: (
          <SuspenseWrapper>
            <NitnemPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'nitnem/bani/:id',
        element: (
          <SuspenseWrapper>
            <BaniReaderPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sundargutka/bani/:id',
        element: (
          <SuspenseWrapper>
            <SundarGutkaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'nitnem/sundergutka/:id',
        element: (
          <SuspenseWrapper>
            <BaniReaderPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sundargutka',
        element: (
          <SuspenseWrapper>
            <SundarGutkaPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'audio',
        element: (
          <SuspenseWrapper>
            <AudioLibraryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'audio/:baniSlug',
        element: (
          <SuspenseWrapper>
            <AudioPlayerPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'library',
        element: (
          <SuspenseWrapper>
            <LibraryPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'progress',
        element: (
          <SuspenseWrapper>
            <ProgressPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);

export default router;
