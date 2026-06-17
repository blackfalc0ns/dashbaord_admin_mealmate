import { Component, inject, OnInit } from '@angular/core';
import { PageStateComponent } from '../../../../../shared/components/page-state/page-state.component';
import { OpenReplacementDialogComponent } from '../../components/open-replacement-dialog/open-replacement-dialog.component';
import { Order72hFacade } from '../../state/order-72h.facade';

@Component({
  selector: 'mm-replacement-window-page',
  standalone: true,
  imports: [PageStateComponent, OpenReplacementDialogComponent],
  templateUrl: './replacement-window-page.component.html',
  styleUrl: './replacement-window-page.component.scss',
})
export class ReplacementWindowPageComponent implements OnInit {
  readonly facade = inject(Order72hFacade);

  ngOnInit(): void {
    this.facade.loadReplacementWindows();
  }

  onRetry(): void {
    this.facade.retry();
  }
}
