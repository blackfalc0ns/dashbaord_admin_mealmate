import { Component, inject, OnInit } from '@angular/core';
import { PageStateComponent } from '../../../../../shared/components/page-state/page-state.component';
import { Order72hTableComponent } from '../../components/order-72h-table/order-72h-table.component';
import { Order72hFacade } from '../../state/order-72h.facade';

@Component({
  selector: 'mm-confirmation-overdue-page',
  standalone: true,
  imports: [PageStateComponent, Order72hTableComponent],
  templateUrl: './confirmation-overdue-page.component.html',
  styleUrl: './confirmation-overdue-page.component.scss',
})
export class ConfirmationOverduePageComponent implements OnInit {
  readonly facade = inject(Order72hFacade);

  ngOnInit(): void {
    this.facade.loadOverdue();
  }

  onRetry(): void {
    this.facade.retry();
  }
}
