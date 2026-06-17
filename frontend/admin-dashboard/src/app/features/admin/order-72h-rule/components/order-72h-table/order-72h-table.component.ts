import { Component, Input } from '@angular/core';
import { OrderStatusBadgeComponent } from '../../../../../shared/components/order-status-badge/order-status-badge.component';
import { AdminOrder72hRow } from '../../models';

@Component({
  selector: 'mm-order-72h-table',
  standalone: true,
  imports: [OrderStatusBadgeComponent],
  templateUrl: './order-72h-table.component.html',
  styleUrl: './order-72h-table.component.scss',
})
export class Order72hTableComponent {
  @Input({ required: true }) rows: AdminOrder72hRow[] = [];
  @Input() mode: 'monitor' | 'overdue' = 'monitor';
}
