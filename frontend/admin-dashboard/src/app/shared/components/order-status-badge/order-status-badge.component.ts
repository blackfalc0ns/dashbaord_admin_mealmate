import { Component, Input } from '@angular/core';
import { Order72hPhase } from '../../../features/admin/order-72h-rule/models';

@Component({
  selector: 'mm-order-status-badge',
  standalone: true,
  templateUrl: './order-status-badge.component.html',
  styleUrl: './order-status-badge.component.scss',
})
export class OrderStatusBadgeComponent {
  @Input({ required: true }) phase!: Order72hPhase;
}
