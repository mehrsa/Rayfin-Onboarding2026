import type { ServicePro } from '../../../rayfin/data/ServicePro';
import type { WorkOrder, WorkOrderStatus } from '../../../rayfin/data/WorkOrder';
import type { WorkOrderComment } from '../../../rayfin/data/WorkOrderComment';

export interface FieldServiceSeedProfile {
  seedId: string;
  name: string;
  skills: string[];
  userId: string;
}

export interface FieldServiceSeedWorkOrder {
  id: string;
  customer: string;
  address: string;
  task: string;
  scheduledAt: string;
  status: WorkOrderStatus;
  serviceProSeedId: string | null;
  note: string;
}

export interface FieldServiceSeedDataset {
  generatedAt: string;
  startDate: string;
  endDate: string;
  servicePros: FieldServiceSeedProfile[];
  workOrders: FieldServiceSeedWorkOrder[];
}

export interface AdminDataSummary {
  servicePros: number;
  workOrders: number;
}

export interface NewWorkOrderInput {
  customer: string;
  address: string;
  task: string;
  scheduledAt: Date;
  servicePro_id?: string | null;
  note?: string;
}

export interface NewWorkOrderCommentInput {
  workOrderId: string;
  userId: string;
  content: string;
}

export interface IFieldService {
  bootstrapDemoData(): Promise<void>;
  getDataSummary(): Promise<AdminDataSummary>;
  replaceWithSeedData(seedData: FieldServiceSeedDataset): Promise<AdminDataSummary>;
  resetDemoData(): Promise<AdminDataSummary>;
  getServicePros(): Promise<ServicePro[]>;
  getMyProfile(userId: string): Promise<ServicePro | null>;
  createProfile(userId: string, name: string, skills: string): Promise<ServicePro>;
  updateProfile(id: string, name: string, skills: string): Promise<ServicePro>;
  getWorkOrders(): Promise<WorkOrder[]>;
  getWorkOrdersForServicePro(serviceProId: string): Promise<WorkOrder[]>;
  getCommentsForWorkOrders(workOrderIds: string[]): Promise<WorkOrderComment[]>;
  createWorkOrder(input: NewWorkOrderInput): Promise<WorkOrder>;
  createWorkOrderComment(
    input: NewWorkOrderCommentInput
  ): Promise<WorkOrderComment>;
  assignWorkOrder(id: string, serviceProId: string | null): Promise<WorkOrder>;
  acceptWorkOrder(id: string, serviceProId: string): Promise<WorkOrder>;
  updateWorkOrderStatus(id: string, status: WorkOrderStatus): Promise<WorkOrder>;
}
