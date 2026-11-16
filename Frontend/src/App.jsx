import { RouterProvider } from 'react-router-dom';
import AppProviders from './Shared/Context/AppProviders';
import router from './app.routes.jsx';

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

export default App;
