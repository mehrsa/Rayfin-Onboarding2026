import { bridgeFabricCallback } from '@microsoft/rayfin-auth-provider-fabric';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'sonner';

import App from './App.tsx';
import { ErrorFallback } from './ErrorFallback.tsx';
import { AuthProvider } from './hooks/AuthContext.tsx';
import { ServiceContainer } from './services/ServiceContainer';

import './main.css';
import './styles/theme.css';
import './index.css';

// Backward compat: old Fabric Portal may redirect the popup to the bare origin
// with handoff params in the URL hash. Bridge the code to the opener and close.
if (bridgeFabricCallback()) {
  // Popup is closing — skip the rest of the bootstrap.
} else {
  // Initialize the service container (creates RayfinClient and services).
  ServiceContainer.create();

  createRoot(document.getElementById('root')!).render(
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <App />
        <Toaster position="top-right" />
      </AuthProvider>
    </ErrorBoundary>
  );
}
