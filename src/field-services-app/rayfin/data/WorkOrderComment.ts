import { date, entity, role, text, uuid } from '@microsoft/rayfin-core';

@entity()
@role('authenticated', ['create', 'read'])
export class WorkOrderComment {
  @uuid() id!: string;
  @text({ min: 1, max: 200 }) userId!: string;
  @date() createdAt!: Date;
  @uuid() workOrderId!: string;
  @text({ min: 1, max: 2000 }) content!: string;
}

