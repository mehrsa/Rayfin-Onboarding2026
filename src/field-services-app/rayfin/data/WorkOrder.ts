import {
  date,
  entity,
  one,
  role,
  set,
  text,
  uuid,
} from '@microsoft/rayfin-core';

import { ServicePro } from './ServicePro.js';

export type WorkOrderStatus =
  | 'pending'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'needs_followup'
  | 'cancelled';

@entity()
@role('authenticated', '*')
export class WorkOrder {
  @uuid() id!: string;
  @text({ min: 1, max: 120 }) customer!: string;
  @text({ min: 1, max: 240 }) address!: string;
  @text({ min: 1, max: 240 }) task!: string;
  @date() scheduledAt!: Date;
  @set('pending', 'assigned', 'in_progress', 'completed', 'needs_followup', 'cancelled')
  status!: WorkOrderStatus;
  @uuid({ optional: true }) servicePro_id?: string;
  @one(() => ServicePro, { optional: true }) servicePro?: ServicePro;
  @text({ optional: true, max: 500 }) note?: string;
  @date() createdAt!: Date;
  @date() updatedAt!: Date;
}
