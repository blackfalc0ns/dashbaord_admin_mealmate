import { Component, inject, OnInit } from '@angular/core';
import { PageStateComponent } from '../../../../../shared/components/page-state/page-state.component';
import { Order72hTableComponent } from '../../components/order-72h-table/order-72h-table.component';
import { Order72hFacade } from '../../state/order-72h.facade';

@Component({
  selector: 'mm-order-72h-monitor-page',
  standalone: true,
  imports: [PageStateComponent, Order72hTableComponent],
  templateUrl: './order-72h-monitor-page.component.html',
  styleUrl: './order-72h-monitor-page.component.scss',
})
export class Order72hMonitorPageComponent implements OnInit {
  readonly facade = inject(Order72hFacade);

  ngOnInit(): void {
    this.facade.loadMonitor();
  }

  onRetry(): void {
    this.facade.retry();
  }
}
