import { Component, computed, inject, input } from '@angular/core';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import {
  OVERVIEW_TABS,
  OverviewTabId,
} from '../../config/overview-tabs.config';

@Component({
  selector: 'mm-overview-section-intro',
  standalone: true,
  templateUrl: './overview-section-intro.component.html',
  styleUrl: './overview-section-intro.component.scss',
})
export class OverviewSectionIntroComponent {
  readonly locale = inject(AppLocaleService);
  readonly tabId = input.required<OverviewTabId>();

  private readonly tab = computed(() =>
    OVERVIEW_TABS.find((t) => t.id === this.tabId()) ?? OVERVIEW_TABS[0],
  );

  readonly title = computed(() =>
    this.locale.isRtl() ? this.tab().labelAr : this.tab().labelEn,
  );

  readonly description = computed(() =>
    this.locale.isRtl() ? this.tab().introAr : this.tab().introEn,
  );

  readonly highlights = computed(() =>
    this.locale.isRtl() ? this.tab().highlightsAr : this.tab().highlightsEn,
  );
}
