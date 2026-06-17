import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ZardCardComponent } from '../../../../../shared/components/card/card.component';
import { OverviewDomainPanel } from '../../models/overview.model';

@Component({
  selector: 'mm-overview-domain-panel',
  standalone: true,
  imports: [ZardCardComponent, RouterLink],
  templateUrl: './overview-domain-panel.component.html',
  styleUrl: './overview-domain-panel.component.scss',
})
export class OverviewDomainPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly panel = input.required<OverviewDomainPanel>();
  readonly compact = input(false);

  title(): string {
    const p = this.panel();
    return this.locale.isRtl() ? p.titleAr : p.titleEn;
  }

  description(): string | undefined {
    const p = this.panel();
    return this.locale.isRtl() ? p.descriptionAr : p.descriptionEn;
  }

  metricLabel(metric: OverviewDomainPanel['metrics'][0]): string {
    return this.locale.isRtl() ? metric.labelAr : metric.labelEn;
  }

  footerNote(): string | null {
    const p = this.panel();
    if (this.locale.isRtl()) {
      return p.footerNoteAr ?? null;
    }
    return p.footerNoteEn ?? null;
  }

  barPercent(value: number, max?: number): number {
    if (!max || max <= 0) {
      return 100;
    }
    return Math.min(100, Math.round((value / max) * 100));
  }

  metricValue(metric: OverviewDomainPanel['metrics'][0]): string | number {
    return metric.displayValue ?? metric.value;
  }
}
