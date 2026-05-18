import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Auth callback page.
 * With the postMessage-based Fabric auth flow, there is no redirect callback.
 * This page is a no-op that redirects to home.
 */
export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-muted-foreground">Redirecting...</div>
    </div>
  );
}
