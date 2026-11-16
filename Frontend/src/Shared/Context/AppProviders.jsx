import { UserPreferencesProvider } from '../../Features/Settings/context/UserPreferencesContext';
import { ReaderProvider } from '../../Features/Gurbani/context/ReaderContext';
import { AudioPlayerProvider } from '../../Features/AudioPaath/context/AudioPlayerContext';

export const AppProviders = ({ children }) => {
  return (
    <UserPreferencesProvider>
      <ReaderProvider>
        <AudioPlayerProvider>{children}</AudioPlayerProvider>
      </ReaderProvider>
    </UserPreferencesProvider>
  );
};

export default AppProviders;
