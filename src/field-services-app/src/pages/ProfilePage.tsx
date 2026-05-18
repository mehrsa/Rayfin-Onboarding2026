import { Link } from 'react-router-dom';
import {
  BriefcaseBusinessIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  UserCircleIcon,
} from 'lucide-react';

import { ProfileForm } from '@/components/ProfileForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/AuthContext';
import { useFieldService } from '@/hooks/useFieldService';

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const { profile, loading, error, createProfile, updateProfile } = useFieldService(
    'servicePro',
    user
  );

  const handleSubmit = async (name: string, skills: string) => {
    if (profile) {
      await updateProfile(name, skills);
      return;
    }
    await createProfile(name, skills);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex min-h-20 flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
              <BriefcaseBusinessIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Field Services
              </p>
              <h1 className="text-2xl font-bold text-slate-950">Profile</h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex rounded-2xl bg-slate-100 p-1">
              <Link
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
                to="/"
              >
                <LayoutDashboardIcon className="h-4 w-4" />
                Jobs
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-950 shadow-sm"
                to="/profile"
              >
                <UserCircleIcon className="h-4 w-4" />
                Profile
              </Link>
            </nav>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-2 shadow-sm">
              <div className="hidden min-w-0 px-2 sm:block">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Signed in
                </p>
                <p className="max-w-48 truncate text-sm font-medium text-slate-700">
                  {user?.email}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => void signOut()}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
            Loading profile...
          </div>
        ) : (
          <ProfileForm
            profile={profile}
            defaultName={user?.name ?? ''}
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  );
}
