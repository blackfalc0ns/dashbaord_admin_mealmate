import { Component, inject, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';

import { AppLocaleService } from '@/core/i18n/app-locale.service';
import { OPERATIONS_I18N } from '@/core/i18n/translations/operations.i18n';
import { TrackingPanelComponent } from '../../components/delivery/tracking-panel/tracking-panel.component';
import { HoldPanelComponent } from '../../components/delivery/hold-panel/hold-panel.component';
import { OperationsStore } from '../../data/operations-store';

@Component({
  selector: 'mm-delivery-workspace-page',
  standalone: true,
  imports: [NgClass, TrackingPanelComponent, HoldPanelComponent],
  templateUrl: './delivery-workspace-page.component.html',
  host: { class: 'block' },
})
export class DeliveryWorkspacePageComponent {
  readonly locale = inject(AppLocaleService);
  readonly state = inject(OperationsStore);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly copy = computed(() => OPERATIONS_I18N[this.locale.locale()]);
  readonly activeTab = signal<'tracking' | 'hold'>('tracking');

  readonly holdCount = computed(() => this.state.activeHoldCount());

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const tab = params.get('tab');
      if (tab === 'hold' || tab === 'tracking') {
        this.activeTab.set(tab);
      }
    });
  }

  setTab(tab: 'tracking' | 'hold'): void {
    this.activeTab.set(tab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge',
    });
  }
}
