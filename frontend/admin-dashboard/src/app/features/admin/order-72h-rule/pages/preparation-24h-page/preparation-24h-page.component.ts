import { Component, inject, OnInit } from '@angular/core';
import { PageStateComponent } from '../../../../../shared/components/page-state/page-state.component';
import { Order72hFacade } from '../../state/order-72h.facade';

@Component({
  selector: 'mm-preparation-24h-page',
  standalone: true,
  imports: [PageStateComponent],
  templateUrl: './preparation-24h-page.component.html',
  styleUrl: './preparation-24h-page.component.scss',
})
export class Preparation24hPageComponent implements OnInit {
  readonly facade = inject(Order72hFacade);

  ngOnInit(): void {
    this.facade.loadPreparation24h();
  }

  onRetry(): void {
    this.facade.retry();
  }
}
