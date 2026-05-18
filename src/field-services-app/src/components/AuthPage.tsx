import { FormEvent, useState } from 'react';

import { useAuth } from '@/hooks/AuthContext';

export function AuthPage() {
  const {
    signInWithFabric,
    signInWithPassword,
    signUpWithPassword,
    fabricAuthEnabled,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateAccount, setIsCreateAccount] = useState(false);

  const handleFabricSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await signInWithFabric();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to sign in with Fabric.'
      );
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isCreateAccount) {
        await signUpWithPassword(email.trim(), password);
      } else {
        await signInWithPassword(email.trim(), password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password auth failed.');
      setIsLoading(false);
    }
  };

  const msLogo = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 21 21"
      className="mr-2"
    >
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f8f8]">
      <header className="flex h-14 items-center border-b bg-white px-6">
        <span className="text-sm font-medium text-gray-900">Field Services</span>
      </header>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="mt-2 text-sm text-gray-500">
            Continue to Field Services to manage field work.
          </p>

          {fabricAuthEnabled ? (
            <button
              type="button"
              onClick={handleFabricSignIn}
              disabled={isLoading}
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {msLogo}
              {isLoading ? 'Opening Fabric...' : 'Sign in with Microsoft'}
            </button>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={handlePasswordSubmit}>
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Email
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="you@example.com"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-700">
                Password
                <input
                  required
                  minLength={8}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-3"
                  placeholder="At least 8 characters"
                />
              </label>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading
                  ? 'Working...'
                  : isCreateAccount
                    ? 'Create account'
                    : 'Sign in'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreateAccount((value) => !value)}
                className="text-sm font-medium text-blue-700"
              >
                {isCreateAccount
                  ? 'Already have an account? Sign in'
                  : 'Need an account? Create one'}
              </button>
            </form>
          )}

          {error && (
            <p className="mt-3 text-center text-sm text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
