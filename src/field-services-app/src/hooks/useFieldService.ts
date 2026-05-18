import { useCallback, useEffect, useState } from 'react';

import type { ServicePro } from '../../rayfin/data/ServicePro';
import type { WorkOrder, WorkOrderStatus } from '../../rayfin/data/WorkOrder';
import type { WorkOrderComment } from '../../rayfin/data/WorkOrderComment';
import { AuthUser } from '../services/interfaces/IAuthService';
import { NewWorkOrderInput } from '../services/interfaces/IFieldService';
import { ServiceContainer } from '../services/ServiceContainer';

type Mode = 'servicePro' | 'manager';

interface UseFieldServiceResult {
  servicePros: ServicePro[];
  profile: ServicePro | null;
  workOrders: WorkOrder[];
  commentsByWorkOrderId: Record<string, WorkOrderComment[]>;
  loading: boolean;
  error: string | null;
  createProfile: (name: string, skills: string) => Promise<void>;
  updateProfile: (name: string, skills: string) => Promise<void>;
  createWorkOrder: (input: NewWorkOrderInput) => Promise<void>;
  addWorkOrderComment: (workOrderId: string, content: string) => Promise<void>;
  assignWorkOrder: (id: string, serviceProId: string | null) => Promise<void>;
  acceptWorkOrder: (id: string) => Promise<void>;
  updateWorkOrderStatus: (id: string, status: WorkOrderStatus) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useFieldService(mode: Mode, user: AuthUser | null): UseFieldServiceResult {
  const [servicePros, setServicePros] = useState<ServicePro[]>([]);
  const [profile, setProfile] = useState<ServicePro | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [commentsByWorkOrderId, setCommentsByWorkOrderId] = useState<
    Record<string, WorkOrderComment[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const service = ServiceContainer.getInstance().fieldService;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await service.bootstrapDemoData();

      if (mode === 'servicePro') {
        const nextProfile = user ? await service.getMyProfile(user.id) : null;
        setProfile(nextProfile);

        if (!nextProfile) {
          setServicePros([]);
          setWorkOrders([]);
          setCommentsByWorkOrderId({});
          return;
        }

        const [nextServicePros, nextWorkOrders] = await Promise.all([
          service.getServicePros(),
          service.getWorkOrdersForServicePro(nextProfile.id),
        ]);
        const assignedOrderIds = nextWorkOrders
          .filter((order) => order.servicePro_id === nextProfile.id)
          .map((order) => order.id);
        const nextComments = await service.getCommentsForWorkOrders(assignedOrderIds);
        setServicePros(nextServicePros);
        setWorkOrders(nextWorkOrders);
        setCommentsByWorkOrderId(groupCommentsByWorkOrderId(nextComments));
        return;
      }

      const [nextServicePros, nextWorkOrders] = await Promise.all([
        service.getServicePros(),
        service.getWorkOrders(),
      ]);
      const nextComments = await service.getCommentsForWorkOrders(
        nextWorkOrders.map((order) => order.id)
      );
      setServicePros(nextServicePros);
      setWorkOrders(nextWorkOrders);
      setCommentsByWorkOrderId(groupCommentsByWorkOrderId(nextComments));
      setProfile(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load work orders.';
      console.error('Failed to load Field Services data:', err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [mode, service, user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createProfile = useCallback(
    async (name: string, skills: string) => {
      if (!user) {
        throw new Error('You must sign in before creating a Service Pro profile.');
      }
      setError(null);
      try {
        await service.createProfile(user.id, name, skills);
        await refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to create profile.';
        console.error('Failed to create Service Pro profile:', err);
        setError(message);
        throw err;
      }
    },
    [refresh, service, user]
  );

  const updateProfile = useCallback(
    async (name: string, skills: string) => {
      if (!profile) {
        throw new Error('Create your Service Pro profile before editing it.');
      }
      setError(null);
      try {
        await service.updateProfile(profile.id, name, skills);
        await refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update profile.';
        console.error('Failed to update Service Pro profile:', err);
        setError(message);
        throw err;
      }
    },
    [profile, refresh, service]
  );

  const createWorkOrder = useCallback(
    async (input: NewWorkOrderInput) => {
      setError(null);
      try {
        await service.createWorkOrder(input);
        await refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to create work order.';
        console.error('Failed to create work order:', err);
        setError(message);
        throw err;
      }
    },
    [refresh, service]
  );

  const addWorkOrderComment = useCallback(
    async (workOrderId: string, content: string) => {
      if (!user) {
        throw new Error('You must sign in before adding comments.');
      }

      const workOrder = workOrders.find((order) => order.id === workOrderId);
      if (!workOrder) {
        throw new Error('Work order not found.');
      }

      if (mode === 'servicePro' && workOrder.servicePro_id !== profile?.id) {
        throw new Error('Only the assigned Service Pro can comment on this work order.');
      }

      setError(null);
      try {
        await service.createWorkOrderComment({
          workOrderId,
          userId: user.id,
          content,
        });
        await refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to add work order comment.';
        console.error('Failed to add work order comment:', err);
        setError(message);
        throw err;
      }
    },
    [mode, profile, refresh, service, user, workOrders]
  );

  const assignWorkOrder = useCallback(
    async (id: string, serviceProId: string | null) => {
      setError(null);
      try {
        await service.assignWorkOrder(id, serviceProId);
        await refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to assign work order.';
        console.error('Failed to assign work order:', err);
        setError(message);
        throw err;
      }
    },
    [refresh, service]
  );

  const acceptWorkOrder = useCallback(
    async (id: string) => {
      if (!profile) {
        throw new Error('Create your Service Pro profile before accepting jobs.');
      }
      setError(null);
      try {
        await service.acceptWorkOrder(id, profile.id);
        await refresh();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to accept work order.';
        console.error('Failed to accept work order:', err);
        setError(message);
        throw err;
      }
    },
    [profile, refresh, service]
  );

  const updateWorkOrderStatus = useCallback(
    async (id: string, status: WorkOrderStatus) => {
      setError(null);
      try {
        await service.updateWorkOrderStatus(id, status);
        await refresh();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to update work order status.';
        console.error('Failed to update work order status:', err);
        setError(message);
        throw err;
      }
    },
    [refresh, service]
  );

  return {
    servicePros,
    profile,
    workOrders,
    commentsByWorkOrderId,
    loading,
    error,
    createProfile,
    updateProfile,
    createWorkOrder,
    addWorkOrderComment,
    assignWorkOrder,
    acceptWorkOrder,
    updateWorkOrderStatus,
    refresh,
  };
}

function groupCommentsByWorkOrderId(
  comments: WorkOrderComment[]
): Record<string, WorkOrderComment[]> {
  return comments.reduce<Record<string, WorkOrderComment[]>>((groups, comment) => {
    groups[comment.workOrderId] ??= [];
    groups[comment.workOrderId].push(comment);
    return groups;
  }, {});
}
