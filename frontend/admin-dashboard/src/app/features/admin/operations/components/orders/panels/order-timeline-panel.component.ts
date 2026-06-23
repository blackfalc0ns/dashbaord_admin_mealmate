import { Component, Input, inject } from '@angular/core';
import { AdminOrderDetail, OrderTimelineEvent } from '../../../models';
import { MmAuditTimelineComponent } from '@/shared/components/operations';

@Component({
  selector: 'mm-order-timeline-panel',
  standalone: true,
  imports: [MmAuditTimelineComponent],
  template: `<mm-audit-timeline [events]="events" />`,
})
export class OrderTimelinePanelComponent {
  @Input({ required: true }) order!: AdminOrderDetail;
  @Input({ required: true }) events: OrderTimelineEvent[] = [];
}
