import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideActivity,
  lucideChevronLeft,
  lucideClock,
  lucideMessageSquare,
  lucideStore,
  lucideTags,
  lucideWallet,
} from '@ng-icons/lucide';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { ZardCardComponent } from '../../../../../shared/components/card/card.component';
import {
  OverviewActivityItem,
  OverviewAlertItem,
} from '../../models/overview.model';
import {
  overviewActivityChevronVariants,
  overviewActivityIconVariants,
  overviewActivityLinkVariants,
  overviewActivityListVariants,
  overviewActivityRailVariants,
  overviewActivityTextVariants,
  overviewActivityTimeVariants,
  type OverviewActivityTone,
} from './overview-alerts-panel.variants';

const ACTIVITY_ICONS = {
  lucideActivity,
  lucideChevronLeft,
  lucideClock,
  lucideMessageSquare,
  lucideStore,
  lucideTags,
  lucideWallet,
};

@Component({
  selector: 'mm-overview-alerts-panel',
  standalone: true,
  imports: [ZardCardComponent, RouterLink, NgIcon],
  providers: [provideIcons(ACTIVITY_ICONS)],
  templateUrl: './overview-alerts-panel.component.html',
})
export class OverviewAlertsPanelComponent {
  readonly locale = inject(AppLocaleService);
  readonly alerts = input.required<OverviewAlertItem[]>();
  readonly activities = input.required<OverviewActivityItem[]>();
  readonly showAlerts = input(true);
  readonly showActivities = input(true);
  readonly alertLimit = input<number | null>(null);
  readonly activityLimit = input<number | null>(null);
  readonly compact = input(false);

  readonly visibleAlerts = computed(() => {
    const limit = this.alertLimit();
    const list = this.alerts();
    return limit ? list.slice(0, limit) : list;
  });

  readonly visibleActivities = computed(() => {
    const limit = this.activityLimit();
    const list = this.activities();
    return limit ? list.slice(0, limit) : list;
  });

  activityListClass(): string {
    return overviewActivityListVariants({ compact: this.compact() });
  }

  activityLinkClass(): string {
    return overviewActivityLinkVariants({ compact: this.compact() });
  }

  activityIconClass(tone: OverviewActivityTone): string {
    return overviewActivityIconVariants({ compact: this.compact(), tone });
  }

  activityRailClass(): string {
    return overviewActivityRailVariants({ compact: this.compact() });
  }

  activityTextClass(): string {
    return overviewActivityTextVariants({ compact: this.compact() });
  }

  activityTimeClass(): string {
    return overviewActivityTimeVariants({ compact: this.compact() });
  }

  activityChevronClass(): string {
    return overviewActivityChevronVariants({ compact: this.compact() });
  }

  activityTone(item: OverviewActivityItem): OverviewActivityTone {
    if (item.route.includes('/accounts')) {
      return 'accounts';
    }
    if (item.route.includes('/operations')) {
      return 'operations';
    }
    if (item.route.includes('/finance')) {
      return 'finance';
    }
    if (item.route.includes('/support')) {
      return 'support';
    }
    if (item.route.includes('/subscriptions')) {
      return 'subscriptions';
    }
    return 'default';
  }

  activityIcon(item: OverviewActivityItem): string {
    switch (this.activityTone(item)) {
      case 'accounts':
        return 'lucideStore';
      case 'operations':
        return 'lucideClock';
      case 'finance':
        return 'lucideWallet';
      case 'support':
        return 'lucideMessageSquare';
      case 'subscriptions':
        return 'lucideTags';
      default:
        return 'lucideActivity';
    }
  }

  alertTitle(alert: OverviewAlertItem): string {
    return this.locale.isRtl() ? alert.titleAr : alert.titleEn;
  }

  alertDescription(alert: OverviewAlertItem): string {
    return this.locale.isRtl() ? alert.descriptionAr : alert.descriptionEn;
  }

  alertTime(alert: OverviewAlertItem): string {
    return this.locale.isRtl() ? alert.timeAgoAr : alert.timeAgoEn;
  }

  activityText(item: OverviewActivityItem): string {
    return this.locale.isRtl() ? item.textAr : item.textEn;
  }

  activityTime(item: OverviewActivityItem): string {
    return this.locale.isRtl() ? item.timeAgoAr : item.timeAgoEn;
  }
}
