import { date, entity, role, text, uuid } from '@microsoft/rayfin-core';

@entity()
@role('authenticated', '*')
export class ServicePro {
  @uuid() id!: string;
  @text({ min: 1, max: 100 }) name!: string;
  @text({ min: 1, max: 300 }) skills!: string;
  @text() user_id!: string;
  @date() createdAt!: Date;
  @date() updatedAt!: Date;
}
