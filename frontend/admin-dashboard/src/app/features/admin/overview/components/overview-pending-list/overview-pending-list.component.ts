import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ZardCardComponent } from '../../../../../shared/components/card/card.component';
import { OverviewPendingItem } from '../../models/overview.model';

@Component({
  selector: 'mm-overview-pending-list',
  standalone: true,
  imports: [ZardCardComponent, RouterLink],
  templateUrl: './overview-pending-list.component.html',
  styleUrl: './overview-pending-list.component.scss',
})
export class OverviewPendingListComponent {
  readonly locale = inject(AppLocaleService);
  readonly items = input.required<OverviewPendingItem[]>();

  name(item: OverviewPendingItem): string {
    return this.locale.isRtl() ? item.nameAr : item.nameEn;
  }

  type(item: OverviewPendingItem): string {
    return this.locale.isRtl() ? item.typeAr : item.typeEn;
  }

  submitted(item: OverviewPendingItem): string {
    return this.locale.isRtl() ? item.submittedAtAr : item.submittedAtEn;
  }

  status(item: OverviewPendingItem): string {
    return this.locale.isRtl() ? item.statusAr : item.statusEn;
  }

  statusTone(item: OverviewPendingItem): string {
    return item.statusTone ?? 'warning';
  }

  isRestaurant(item: OverviewPendingItem): boolean {
    return item.typeEn === 'Restaurant';
  }
}
