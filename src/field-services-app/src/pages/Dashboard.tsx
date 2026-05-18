import { FormEvent, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseBusinessIcon,
  ChevronDownIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MessageSquareIcon,
  RefreshCwIcon,
  SendIcon,
  UserCircleIcon,
  XIcon,
} from 'lucide-react';

import type { ServicePro } from '../../rayfin/data/ServicePro';
import type { WorkOrder, WorkOrderStatus } from '../../rayfin/data/WorkOrder';
import type { WorkOrderComment } from '../../rayfin/data/WorkOrderComment';
import { ProfileForm } from '@/components/ProfileForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useAuth } from '@/hooks/AuthContext';
import { useFieldService } from '@/hooks/useFieldService';

type DashboardMode = 'servicePro' | 'manager';
type WorkOrderFilter = 'open' | 'unassigned' | 'completed';

interface DashboardProps {
  mode: DashboardMode;
}

const STATUS_LABELS: Record<WorkOrderStatus, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In progress',
  completed: 'Completed',
  needs_followup: 'Needs follow-up',
  cancelled: 'Cancelled',
};

const STATUS_STYLES: Record<WorkOrderStatus, string> = {
  pending: 'bg-slate-100 text-slate-700',
  assigned: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  needs_followup: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

const DEFAULT_FILTERS: WorkOrderFilter[] = ['open', 'unassigned'];
const OPEN_STATUSES: WorkOrderStatus[] = [
  'pending',
  'assigned',
  'in_progress',
  'needs_followup',
];

const FILTER_LABELS: Record<WorkOrderFilter, string> = {
  open: 'Open orders',
  unassigned: 'Unassigned',
  completed: 'Completed',
};

const SKILL_HINTS: Record<string, string[]> = {
  hanging: ['hang', 'mount', 'gallery', 'frame', 'painting', 'canvas'],
  drilling: ['anchor', 'drill', 'wall', 'mount'],
  framing: ['frame', 'gallery'],
  painting: ['painting', 'canvas'],
  plumbing: ['pipe', 'sink', 'tap', 'leak'],
};

function parseSkills(skills: string): string[] {
  return skills
    .split(',')
    .map((skill) => skill.trim().toLowerCase())
    .filter(Boolean);
}

function formatDate(value: Date | string): string {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function datetimeLocalValue(): string {
  const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
  nextDay.setMinutes(0, 0, 0);
  return nextDay.toISOString().slice(0, 16);
}

function getSkillMatches(order: WorkOrder, servicePro: ServicePro): string[] {
  const task = order.task.toLowerCase();
  return parseSkills(servicePro.skills).filter((skill) => {
    const hints = SKILL_HINTS[skill] ?? [skill];
    return hints.some((hint) => task.includes(hint));
  });
}

function getServicePro(order: WorkOrder, servicePros: ServicePro[]): ServicePro | null {
  return servicePros.find((servicePro) => servicePro.id === order.servicePro_id) ?? null;
}

function getCommentAuthor(
  comment: WorkOrderComment,
  servicePros: ServicePro[],
  currentUserId?: string
): string {
  if (comment.userId === currentUserId) {
    return 'You';
  }

  return (
    servicePros.find((servicePro) => servicePro.user_id === comment.userId)?.name ??
    'Manager'
  );
}

function WorkOrderComments({
  comments,
  currentUserId,
  servicePros,
  onAddComment,
}: {
  comments: WorkOrderComment[];
  currentUserId?: string;
  servicePros: ServicePro[];
  onAddComment: (content: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onAddComment(content);
      setContent('');
      setOpen(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-5">
      <CollapsibleTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="gap-2">
          <MessageSquareIcon className="h-4 w-4" />
          Comments ({comments.length})
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <div className="grid gap-3">
            {comments.length === 0 ? (
              <p className="text-sm text-slate-500">
                No comments yet. Start the intervention history here.
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-slate-200"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-slate-900">
                      {getCommentAuthor(comment, servicePros, currentUserId)}
                    </p>
                    <time className="text-xs text-slate-500">
                      {formatDate(comment.createdAt)}
                    </time>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-slate-700">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
          <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
            <textarea
              required
              value={content}
              maxLength={2000}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-24 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
              placeholder="Add an intervention note or question"
            />
            <Button type="submit" disabled={saving || !content.trim()}>
              <SendIcon className="mr-2 h-4 w-4" />
              {saving ? 'Adding...' : 'Add comment'}
            </Button>
          </form>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ManagerCreateOrderForm({
  servicePros,
  onCreate,
}: {
  servicePros: ServicePro[];
  onCreate: (input: {
    customer: string;
    address: string;
    task: string;
    scheduledAt: Date;
    servicePro_id?: string | null;
    note?: string;
  }) => Promise<void>;
}) {
  const [customer, setCustomer] = useState('');
  const [address, setAddress] = useState('');
  const [task, setTask] = useState('');
  const [scheduledAt, setScheduledAt] = useState(datetimeLocalValue());
  const [serviceProId, setServiceProId] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onCreate({
        customer: customer.trim(),
        address: address.trim(),
        task: task.trim(),
        scheduledAt: new Date(scheduledAt),
        servicePro_id: serviceProId || null,
        note: note.trim(),
      });
      setCustomer('');
      setAddress('');
      setTask('');
      setServiceProId('');
      setNote('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-xl font-bold text-slate-950">Create work order</h2>
      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            value={customer}
            onChange={(event) => setCustomer(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Customer"
          />
          <input
            required
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
            placeholder="Address"
          />
        </div>
        <input
          required
          value={task}
          onChange={(event) => setTask(event.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Task, e.g. Hang large painting in living room"
        />
        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => setScheduledAt(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <select
            value={serviceProId}
            onChange={(event) => setServiceProId(event.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Unassigned</option>
            {servicePros.map((servicePro) => (
              <option key={servicePro.id} value={servicePro.id}>
                {servicePro.name} - {servicePro.skills}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-24 rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Notes or follow-up details"
        />
        <Button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create order'}
        </Button>
      </form>
    </section>
  );
}

function OrderCard({
  mode,
  order,
  servicePros,
  profile,
  comments,
  currentUserId,
  onAssign,
  onAccept,
  onStatus,
  onAddComment,
}: {
  mode: DashboardMode;
  order: WorkOrder;
  servicePros: ServicePro[];
  profile: ServicePro | null;
  comments: WorkOrderComment[];
  currentUserId?: string;
  onAssign: (id: string, serviceProId: string | null) => Promise<void>;
  onAccept: (id: string) => Promise<void>;
  onStatus: (id: string, status: WorkOrderStatus) => Promise<void>;
  onAddComment: (id: string, content: string) => Promise<void>;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const servicePro = getServicePro(order, servicePros);
  const ownOrder = !!profile && order.servicePro_id === profile.id;
  const canUseComments = mode === 'manager' || ownOrder;
  const canAccept =
    mode === 'servicePro' &&
    !!profile &&
    (order.status === 'pending' ||
      (order.status === 'assigned' && !order.servicePro_id));
  const canUpdateOwnStatus =
    mode === 'servicePro' &&
    ownOrder &&
    !['completed', 'cancelled'].includes(order.status);

  const sortedServicePros = useMemo(() => {
    return [...servicePros].sort((left, right) => {
      return getSkillMatches(order, right).length - getSkillMatches(order, left).length;
    });
  }, [servicePros, order]);

  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
            >
              {STATUS_LABELS[order.status]}
            </span>
            <span className="text-sm text-slate-500">
              {formatDate(order.scheduledAt)}
            </span>
          </div>
          <h3 className="mt-3 text-xl font-bold text-slate-950">{order.task}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {order.customer} - {order.address}
          </p>
        </div>
        <div className="min-w-52 rounded-2xl bg-slate-50 p-4 text-sm">
          <p className="font-semibold text-slate-900">
            {servicePro ? servicePro.name : 'Unassigned'}
          </p>
          <p className="mt-1 text-slate-500">
            {servicePro ? servicePro.skills : 'Pick best skill match'}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails((value) => !value)}
        >
          {showDetails ? 'Hide details' : 'View details'}
        </Button>
      </div>

      {showDetails && (
        <dl className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm md:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-900">Customer</dt>
            <dd className="text-slate-600">{order.customer}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Address</dt>
            <dd className="text-slate-600">{order.address}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Scheduled</dt>
            <dd className="text-slate-600">{formatDate(order.scheduledAt)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Assigned Service Pro</dt>
            <dd className="text-slate-600">
              {servicePro ? `${servicePro.name} - ${servicePro.skills}` : 'None'}
            </dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold text-slate-900">Task</dt>
            <dd className="text-slate-600">{order.task}</dd>
          </div>
          <div className="md:col-span-2">
            <dt className="font-semibold text-slate-900">Note</dt>
            <dd className="text-slate-600">{order.note || 'No note.'}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Created</dt>
            <dd className="text-slate-600">{formatDate(order.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Updated</dt>
            <dd className="text-slate-600">{formatDate(order.updatedAt)}</dd>
          </div>
        </dl>
      )}

      {mode === 'manager' && (
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <select
            value={order.servicePro_id ?? ''}
            onChange={(event) => {
              void onAssign(order.id, event.target.value || null);
            }}
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            <option value="">Unassigned</option>
            {sortedServicePros.map((servicePro) => {
              const matches = getSkillMatches(order, servicePro);
              const suffix =
                matches.length > 0 ? ` | match: ${matches.join(', ')}` : '';
              return (
                <option key={servicePro.id} value={servicePro.id}>
                  {servicePro.name} - {servicePro.skills}
                  {suffix}
                </option>
              );
            })}
          </select>
          <select
            value={order.status}
            onChange={(event) =>
              void onStatus(order.id, event.target.value as WorkOrderStatus)
            }
            className="rounded-xl border border-slate-300 px-4 py-3"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      )}

      {canUseComments && (
        <WorkOrderComments
          comments={comments}
          currentUserId={currentUserId}
          servicePros={servicePros}
          onAddComment={(content) => onAddComment(order.id, content)}
        />
      )}

      {mode === 'servicePro' && (
        <div className="mt-5 flex flex-wrap gap-3">
          {canAccept && (
            <Button type="button" onClick={() => void onAccept(order.id)}>
              Accept job
            </Button>
          )}
          {canUpdateOwnStatus && (
            <>
              {order.status !== 'in_progress' && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void onStatus(order.id, 'in_progress')}
                >
                  Start work
                </Button>
              )}
              {order.status !== 'needs_followup' && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => void onStatus(order.id, 'needs_followup')}
                >
                  Needs follow-up
                </Button>
              )}
              <Button
                type="button"
                variant="secondary"
                onClick={() => void onStatus(order.id, 'completed')}
              >
                Mark done
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => void onStatus(order.id, 'cancelled')}
              >
                Cancel job
              </Button>
            </>
          )}
          {!canAccept && !canUpdateOwnStatus && (
            <span className="text-sm text-slate-500">
              {ownOrder
                ? 'No action needed now.'
                : 'Assigned to another Service Pro or waiting for manager.'}
            </span>
          )}
        </div>
      )}
    </article>
  );
}

export function Dashboard({ mode }: DashboardProps) {
  const { user, signOut } = useAuth();
  const {
    servicePros,
    profile,
    workOrders,
    commentsByWorkOrderId,
    loading,
    error,
    createProfile,
    createWorkOrder,
    addWorkOrderComment,
    assignWorkOrder,
    acceptWorkOrder,
    updateWorkOrderStatus,
    refresh,
  } = useFieldService(mode, user);
  const [activeFilters, setActiveFilters] =
    useState<WorkOrderFilter[]>(DEFAULT_FILTERS);

  const switchFilter = (filter: WorkOrderFilter) => {
    setActiveFilters([filter]);
  };

  const removeFilter = (filter: WorkOrderFilter) => {
    setActiveFilters((current) => current.filter((item) => item !== filter));
  };

  const matchesFilter = (order: WorkOrder, filter: WorkOrderFilter) => {
    if (filter === 'open') {
      return OPEN_STATUSES.includes(order.status);
    }
    if (filter === 'unassigned') {
      return !order.servicePro_id;
    }
    return order.status === 'completed';
  };

  const baseOrders =
    mode === 'manager'
      ? workOrders
      : !profile
        ? []
        : workOrders.filter(
            (order) => !order.servicePro_id || order.servicePro_id === profile.id
          );

  const stats = {
    open: baseOrders.filter((order) => matchesFilter(order, 'open')).length,
    completed: baseOrders.filter((order) => matchesFilter(order, 'completed'))
      .length,
    unassigned: baseOrders.filter((order) => matchesFilter(order, 'unassigned'))
      .length,
  };

  const visibleOrders =
    activeFilters.length === 0
      ? baseOrders
      : baseOrders.filter((order) =>
          activeFilters.some((filter) => matchesFilter(order, filter))
        );

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
              <h1 className="text-2xl font-bold text-slate-950">
                {mode === 'manager' ? 'Manager dispatch' : 'Service Pro jobs'}
              </h1>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-950"
              onClick={() => void refresh()}
            >
              <RefreshCwIcon className="mr-2 h-4 w-4" />
              Refresh
            </Button>

            <nav className="flex rounded-2xl bg-slate-100 p-1">
              <Link
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  mode === 'servicePro'
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
                to="/"
              >
                <LayoutDashboardIcon className="h-4 w-4" />
                Jobs
              </Link>
              {mode === 'servicePro' ? (
                <Link
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
                  to="/profile"
                >
                  <UserCircleIcon className="h-4 w-4" />
                  Profile
                </Link>
              ) : (
                <Link
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-950 shadow-sm"
                  to="/manager/"
                >
                  <BriefcaseBusinessIcon className="h-4 w-4" />
                  Manager
                </Link>
              )}
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

      <main className="container mx-auto grid gap-6 px-4 py-8">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {mode === 'servicePro' && !loading && !profile && (
          <ProfileForm
            defaultName={user?.name ?? ''}
            onSubmit={createProfile}
          />
        )}

        {(mode === 'manager' || profile) && (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <button
                type="button"
                onClick={() => switchFilter('open')}
                className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300"
              >
                <p className="text-sm text-slate-500">Open orders</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {stats.open}
                </p>
              </button>
              <button
                type="button"
                onClick={() => switchFilter('unassigned')}
                className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300"
              >
                <p className="text-sm text-slate-500">Unassigned</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {stats.unassigned}
                </p>
              </button>
              <button
                type="button"
                onClick={() => switchFilter('completed')}
                className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-slate-300"
              >
                <p className="text-sm text-slate-500">Completed</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {stats.completed}
                </p>
              </button>
            </section>

            {mode === 'manager' && (
              <ManagerCreateOrderForm
                servicePros={servicePros}
                onCreate={createWorkOrder}
              />
            )}

            <section className="grid gap-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-950">
                    Work orders
                  </h2>
                  {activeFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => removeFilter(filter)}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
                    >
                      {FILTER_LABELS[filter]}
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  ))}
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveFilters(DEFAULT_FILTERS)}
                      className="text-sm font-medium text-slate-500 hover:text-slate-950"
                    >
                      Reset
                    </button>
                  )}
                </div>
                {loading && (
                  <span className="text-sm text-slate-500">Loading...</span>
                )}
              </div>
              {!loading && visibleOrders.length === 0 && (
                <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
                  No work orders yet.
                </div>
              )}
              {visibleOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  mode={mode}
                  order={order}
                  servicePros={servicePros}
                  profile={profile}
                  comments={commentsByWorkOrderId[order.id] ?? []}
                  currentUserId={user?.id}
                  onAssign={assignWorkOrder}
                  onAccept={acceptWorkOrder}
                  onStatus={updateWorkOrderStatus}
                  onAddComment={addWorkOrderComment}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
