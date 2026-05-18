import { ServicePro } from './ServicePro.js';
import { WorkOrder } from './WorkOrder.js';
import { WorkOrderComment } from './WorkOrderComment.js';

export type FieldServiceSchema = {
  ServicePro: ServicePro;
  WorkOrder: WorkOrder;
  WorkOrderComment: WorkOrderComment;
};

export const schema = [ServicePro, WorkOrder, WorkOrderComment];
