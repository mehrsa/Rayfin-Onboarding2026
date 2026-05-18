import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DatabaseIcon,
  RefreshCwIcon,
  RotateCcwIcon,
  SproutIcon,
} from 'lucide-react';

import seedData from '@/data/field-service-seed.json';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type {
  AdminDataSummary,
  FieldServiceSeedDataset,
} from '@/services/interfaces/IFieldService';
import { ServiceContainer } from '@/services/ServiceContainer';

type AdminAction = 'seed' | 'reset' | null;

const fieldServiceSeed = seedData as FieldServiceSeedDataset;

export function AdminPage() {
  const fieldService = ServiceContainer.getInstance().fieldService;
  const [summary, setSummary] = useState<AdminDataSummary | null>(null);
  const [activeAction, setActiveAction] = useState<AdminAction>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const seedStats = useMemo(
    () => ({
      servicePros: fieldServiceSeed.servicePros.length,
      workOrders: fieldServiceSeed.workOrders.length,
      dateRange: `${fieldServiceSeed.startDate} to ${fieldServiceSeed.endDate}`,
    }),
    []
  );

  const loadSummary = useCallback(async () => {
    setError(null);
    try {
      setSummary(await fieldService.getDataSummary());
    } catch (err) {
      console.error('Failed to load admin data summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load DB summary.');
    }
  }, [fieldService]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  const runAdminAction = async (action: Exclude<AdminAction, null>) => {
    setActiveAction(action);
    setError(null);
    setMessage(null);

    try {
      const nextSummary =
        action === 'seed'
          ? await fieldService.replaceWithSeedData(fieldServiceSeed)
          : await fieldService.resetDemoData();

      setSummary(nextSummary);
      setMessage(
        action === 'seed'
          ? `Seeded ${nextSummary.servicePros} Service Pros and ${nextSummary.workOrders} work orders.`
          : 'Reset DB to one unassigned example work order.'
      );
    } catch (err) {
      console.error(`Failed to ${action} admin data:`, err);
      setError(
        err instanceof Error ? err.message : `Failed to ${action} admin data.`
      );
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex min-h-20 flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <DatabaseIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Field Services
              </p>
              <h1 className="text-2xl font-bold text-slate-950">Admin data tools</h1>
            </div>
          </div>

          <Button variant="ghost" asChild>
            <Link to="/manager/">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to manager
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto grid gap-6 px-4 py-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Current Service Pros</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {summary?.servicePros ?? '...'}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Current work orders</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {summary?.workOrders ?? '...'}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Seed range</p>
            <p className="mt-2 text-lg font-bold text-slate-950">
              {seedStats.dateRange}
            </p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <SproutIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">Seed DB</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Replace current data with {seedStats.servicePros} Service Pro
                  profiles and {seedStats.workOrders} historical work orders.
                </p>
              </div>
            </div>
            <Button
              className="mt-6"
              disabled={activeAction !== null}
              onClick={() => void runAdminAction('seed')}
            >
              {activeAction === 'seed' ? (
                <>
                  <RefreshCwIcon className="h-4 w-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <SproutIcon className="h-4 w-4" />
                  Seed data
                </>
              )}
            </Button>
          </article>

          <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                <RotateCcwIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950">Reset DB</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Clear all Service Pros and work orders, then recreate one
                  unassigned example job.
                </p>
              </div>
            </div>
            <Button
              className="mt-6"
              disabled={activeAction !== null}
              variant="outline"
              onClick={() => void runAdminAction('reset')}
            >
              {activeAction === 'reset' ? (
                <>
                  <RefreshCwIcon className="h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <RotateCcwIcon className="h-4 w-4" />
                  Reset data
                </>
              )}
            </Button>
          </article>
        </section>

      </main>
    </div>
  );
}
