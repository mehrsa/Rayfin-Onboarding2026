import type { ServicePro } from '../../../rayfin/data/ServicePro';
import type { WorkOrder, WorkOrderStatus } from '../../../rayfin/data/WorkOrder';
import type { WorkOrderComment } from '../../../rayfin/data/WorkOrderComment';
import {
  AdminDataSummary,
  FieldServiceSeedDataset,
  IFieldService,
  NewWorkOrderCommentInput,
  NewWorkOrderInput,
} from '../interfaces/IFieldService';

import { getRayfinClient } from './RayfinClientService';

const SERVICE_PRO_FIELDS = [
  'id',
  'name',
  'skills',
  'user_id',
  'createdAt',
  'updatedAt',
] as const;

const WORK_ORDER_FIELDS = [
  'id',
  'customer',
  'address',
  'task',
  'scheduledAt',
  'status',
  'servicePro_id',
  'servicePro.name',
  'servicePro.skills',
  'note',
  'createdAt',
  'updatedAt',
] as const;

const WORK_ORDER_COMMENT_FIELDS = [
  'id',
  'userId',
  'createdAt',
  'workOrderId',
  'content',
] as const;

type WorkOrderQueryFilter = {
  servicePro_id?: {
    eq?: string;
    isNull?: boolean;
  };
  or?: WorkOrderQueryFilter[];
};

type WorkOrderCommentQueryFilter = {
  workOrderId?: {
    eq?: string;
  };
};

const INITIAL_DEMO_ORDER = {
  customer: 'Jane Doe',
  address: '12 Rue de Rivoli, Paris',
  task: 'Hang large painting in living room',
  scheduledAt: new Date('2026-05-03T10:00:00Z'),
  note: 'Initial example work order. Leave unassigned so any Service Pro can accept it.',
};

const WRITE_BATCH_SIZE = 20;
const READ_PAGE_SIZE = 100;

async function runInBatches<T>(
  items: T[],
  operation: (item: T) => Promise<unknown>
): Promise<void> {
  for (let index = 0; index < items.length; index += WRITE_BATCH_SIZE) {
    const batch = items.slice(index, index + WRITE_BATCH_SIZE);
    await Promise.all(batch.map((item) => operation(item)));
  }
}

export class RayfinFieldService implements IFieldService {
  private demoDataChecked = false;

  async bootstrapDemoData(): Promise<void> {
    if (this.demoDataChecked) {
      return;
    }

    const hasWorkOrders = await this.hasWorkOrders();
    if (hasWorkOrders) {
      this.demoDataChecked = true;
      return;
    }

    await this.createWorkOrder(INITIAL_DEMO_ORDER);
    this.demoDataChecked = true;
  }

  async getDataSummary(): Promise<AdminDataSummary> {
    const [servicePros, workOrders] = await Promise.all([
      this.getServicePros(),
      this.getWorkOrders(),
    ]);
    return {
      servicePros: servicePros.length,
      workOrders: workOrders.length,
    };
  }

  async replaceWithSeedData(
    seedData: FieldServiceSeedDataset
  ): Promise<AdminDataSummary> {
    this.validateSeedData(seedData);
    await this.clearAllData();

    const serviceProIdsBySeedId = new Map<string, string>();
    for (const seedProfile of seedData.servicePros) {
      const profile = await this.createProfile(
        seedProfile.userId,
        seedProfile.name,
        seedProfile.skills.join(', ')
      );
      serviceProIdsBySeedId.set(seedProfile.seedId, profile.id);
    }

    await runInBatches(seedData.workOrders, async (seedOrder) => {
      const serviceProId = seedOrder.serviceProSeedId
        ? serviceProIdsBySeedId.get(seedOrder.serviceProSeedId)
        : null;

      if (seedOrder.serviceProSeedId && !serviceProId) {
        throw new Error(
          `Seed work order ${seedOrder.id} references unknown Service Pro ${seedOrder.serviceProSeedId}.`
        );
      }

      const created = await this.createWorkOrder({
        customer: seedOrder.customer,
        address: seedOrder.address,
        task: seedOrder.task,
        scheduledAt: new Date(seedOrder.scheduledAt),
        servicePro_id: serviceProId,
        note: seedOrder.note,
      });

      if (created.status !== seedOrder.status) {
        await this.updateWorkOrderStatus(created.id, seedOrder.status);
      }
    });

    const summary = await this.getDataSummary();
    if (
      summary.servicePros !== seedData.servicePros.length ||
      summary.workOrders !== seedData.workOrders.length
    ) {
      throw new Error(
        `Seed finished with ${summary.servicePros} Service Pros and ${summary.workOrders} work orders; expected ${seedData.servicePros.length} Service Pros and ${seedData.workOrders.length} work orders.`
      );
    }

    this.demoDataChecked = true;
    return summary;
  }

  async resetDemoData(): Promise<AdminDataSummary> {
    await this.clearAllData();
    await this.createWorkOrder(INITIAL_DEMO_ORDER);
    this.demoDataChecked = true;
    return this.getDataSummary();
  }

  async getServicePros(): Promise<ServicePro[]> {
    const client = getRayfinClient();
    const servicePros: ServicePro[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      let query = client.data.ServicePro.select(SERVICE_PRO_FIELDS)
        .orderBy({ name: 'asc' })
        .first(READ_PAGE_SIZE);

      if (cursor) {
        query = query.after(cursor);
      }

      const page = await query.executePaginated();
      servicePros.push(...page.items);
      cursor = page.endCursor ?? null;
      hasNextPage = page.hasNextPage;
    }

    return servicePros;
  }

  async getMyProfile(userId: string): Promise<ServicePro | null> {
    const client = getRayfinClient();
    const [profile] = await client.data.ServicePro.select([
      'id',
      'name',
      'skills',
      'user_id',
      'createdAt',
      'updatedAt',
    ])
      .where({ user_id: { eq: userId } })
      .first(1)
      .execute();
    return profile ?? null;
  }

  async createProfile(
    userId: string,
    name: string,
    skills: string
  ): Promise<ServicePro> {
    const client = getRayfinClient();
    const now = new Date();
    return client.data.ServicePro.create({
      name,
      skills,
      user_id: userId,
      createdAt: now,
      updatedAt: now,
    });
  }

  async updateProfile(
    id: string,
    name: string,
    skills: string
  ): Promise<ServicePro> {
    const client = getRayfinClient();
    return client.data.ServicePro.update(
      { id },
      {
        name,
        skills,
        updatedAt: new Date(),
      }
    );
  }

  async getWorkOrders(): Promise<WorkOrder[]> {
    return this.getWorkOrdersByFilter();
  }

  async getWorkOrdersForServicePro(serviceProId: string): Promise<WorkOrder[]> {
    return this.getWorkOrdersByFilter({
      or: [
        { servicePro_id: { isNull: true } },
        { servicePro_id: { eq: serviceProId } },
      ],
    });
  }

  async getCommentsForWorkOrders(
    workOrderIds: string[]
  ): Promise<WorkOrderComment[]> {
    const uniqueWorkOrderIds = [...new Set(workOrderIds)];
    const commentGroups = await Promise.all(
      uniqueWorkOrderIds.map((workOrderId) =>
        this.getCommentsByFilter({ workOrderId: { eq: workOrderId } })
      )
    );

    return commentGroups
      .flat()
      .sort(
        (left, right) =>
          new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
      );
  }

  private async getWorkOrdersByFilter(
    filter?: WorkOrderQueryFilter
  ): Promise<WorkOrder[]> {
    const client = getRayfinClient();
    const workOrders: WorkOrder[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      let query = client.data.WorkOrder.select(WORK_ORDER_FIELDS)
        .orderBy({ scheduledAt: 'asc' })
        .first(READ_PAGE_SIZE);

      if (filter) {
        query = query.where(filter);
      }

      if (cursor) {
        query = query.after(cursor);
      }

      const page = await query.executePaginated();
      workOrders.push(...page.items);
      cursor = page.endCursor ?? null;
      hasNextPage = page.hasNextPage;
    }

    return workOrders;
  }

  private async getCommentsByFilter(
    filter?: WorkOrderCommentQueryFilter
  ): Promise<WorkOrderComment[]> {
    const client = getRayfinClient();
    const comments: WorkOrderComment[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;

    while (hasNextPage) {
      let query = client.data.WorkOrderComment.select(WORK_ORDER_COMMENT_FIELDS)
        .orderBy({ createdAt: 'asc' })
        .first(READ_PAGE_SIZE);

      if (filter) {
        query = query.where(filter);
      }

      if (cursor) {
        query = query.after(cursor);
      }

      const page = await query.executePaginated();
      comments.push(...page.items);
      cursor = page.endCursor ?? null;
      hasNextPage = page.hasNextPage;
    }

    return comments;
  }

  async createWorkOrder(input: NewWorkOrderInput): Promise<WorkOrder> {
    const client = getRayfinClient();
    const now = new Date();
    return client.data.WorkOrder.create({
      customer: input.customer,
      address: input.address,
      task: input.task,
      scheduledAt: input.scheduledAt,
      status: input.servicePro_id ? 'assigned' : 'pending',
      ...(input.servicePro_id ? { servicePro_id: input.servicePro_id } : {}),
      note: input.note ?? '',
      createdAt: now,
      updatedAt: now,
    });
  }

  async createWorkOrderComment(
    input: NewWorkOrderCommentInput
  ): Promise<WorkOrderComment> {
    const content = input.content.trim();
    if (!content) {
      throw new Error('Comment content is required.');
    }

    const client = getRayfinClient();
    return client.data.WorkOrderComment.create({
      userId: input.userId,
      createdAt: new Date(),
      workOrderId: input.workOrderId,
      content,
    });
  }

  async assignWorkOrder(
    id: string,
    serviceProId: string | null
  ): Promise<WorkOrder> {
    const client = getRayfinClient();
    if (serviceProId) {
      return client.data.WorkOrder.update(
        { id },
        {
          servicePro_id: serviceProId,
          status: 'assigned',
          updatedAt: new Date(),
        }
      );
    }

    const updates = {
      servicePro_id: null,
      status: 'pending',
      updatedAt: new Date(),
    } as unknown as Parameters<typeof client.data.WorkOrder.update>[1];

    return client.data.WorkOrder.update({ id }, updates);
  }

  async acceptWorkOrder(
    id: string,
    serviceProId: string
  ): Promise<WorkOrder> {
    const client = getRayfinClient();
    return client.data.WorkOrder.update(
      { id },
      {
        servicePro_id: serviceProId,
        status: 'assigned',
        updatedAt: new Date(),
      }
    );
  }

  async updateWorkOrderStatus(
    id: string,
    status: WorkOrderStatus
  ): Promise<WorkOrder> {
    const client = getRayfinClient();
    return client.data.WorkOrder.update(
      { id },
      {
        status,
        updatedAt: new Date(),
      }
    );
  }

  private async clearAllData(): Promise<void> {
    const client = getRayfinClient();
    const [workOrders, servicePros] = await Promise.all([
      this.getWorkOrders(),
      this.getServicePros(),
    ]);

    await runInBatches(workOrders, (workOrder) =>
      client.data.WorkOrder.delete({ id: workOrder.id })
    );
    await runInBatches(servicePros, (servicePro) =>
      client.data.ServicePro.delete({ id: servicePro.id })
    );
    this.demoDataChecked = false;
  }

  private async hasWorkOrders(): Promise<boolean> {
    const client = getRayfinClient();
    const orders = await client.data.WorkOrder.select(['id'])
      .first(1)
      .execute();
    return orders.length > 0;
  }

  private validateSeedData(seedData: FieldServiceSeedDataset): void {
    const serviceProIds = new Set<string>();

    if (seedData.servicePros.length < 12) {
      throw new Error('Seed data must include at least 12 Service Pro profiles.');
    }

    for (const profile of seedData.servicePros) {
      if (!profile.seedId || !profile.name || !profile.userId) {
        throw new Error('Seed Service Pro profiles must include seedId, name, and userId.');
      }
      if (!Array.isArray(profile.skills) || profile.skills.length === 0) {
        throw new Error(`Seed Service Pro ${profile.seedId} must include skills.`);
      }
      serviceProIds.add(profile.seedId);
    }

    for (const order of seedData.workOrders) {
      if (!order.customer || !order.address || !order.task || !order.scheduledAt) {
        throw new Error(`Seed work order ${order.id} is missing required data.`);
      }
      if (order.serviceProSeedId && !serviceProIds.has(order.serviceProSeedId)) {
        throw new Error(
          `Seed work order ${order.id} references unknown Service Pro ${order.serviceProSeedId}.`
        );
      }
    }
  }
}
