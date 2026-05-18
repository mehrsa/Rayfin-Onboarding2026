import { FormEvent, useEffect, useState } from 'react';

import type { ServicePro } from '../../rayfin/data/ServicePro';
import { Button } from '@/components/ui/button';

interface ProfileFormProps {
  profile?: ServicePro | null;
  defaultName: string;
  onSubmit: (name: string, skills: string) => Promise<void>;
}

export function ProfileForm({
  profile,
  defaultName,
  onSubmit,
}: ProfileFormProps) {
  const [name, setName] = useState(profile?.name ?? defaultName);
  const [skills, setSkills] = useState(profile?.skills ?? 'painting, hanging');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile?.name ?? defaultName);
    setSkills(profile?.skills ?? 'painting, hanging');
  }, [defaultName, profile]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit(name.trim(), skills.trim());
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
        {profile ? 'Profile' : 'First access'}
      </p>
      <h2 className="mt-2 text-3xl font-bold text-slate-950">
        {profile ? 'Edit your Service Pro profile' : 'Create your Service Pro profile'}
      </h2>
      <p className="mt-2 text-slate-600">
        Add name and skills so Field Services can match you with right jobs.
      </p>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Name
          <input
            required
            minLength={1}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Alex Martin"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          Skills
          <input
            required
            minLength={1}
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="painting, plumbing, hanging"
          />
        </label>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : profile ? 'Save profile' : 'Create profile'}
        </Button>
      </form>
    </section>
  );
}
