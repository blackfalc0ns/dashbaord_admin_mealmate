import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AppLocaleService } from '../../../../../core/i18n/app-locale.service';
import { AdminPageContextService } from '../../../../../core/navigation/admin-page-context.service';
import { AdminNavItem } from '../../../../../core/navigation/admin-nav.model';
import {
  MmBreadcrumbComponent,
  MmPageHeadingComponent,
  MmShellCardComponent,
} from '../../../../../shared/components/layout';
import { BreadcrumbItem } from '../../../../../shared/models/breadcrumb-item.model';
import { OverviewPeriod } from '../../models/overview.model';
import { OverviewPeriodFilterComponent } from '../overview-period-filter/overview-period-filter.component';
import {
  OverviewSectionNavComponent,
  OverviewTabBadge,
} from '../overview-section-nav/overview-section-nav.component';
import { OverviewTabId } from '../../config/overview-tabs.config';

@Component({
  selector: 'mm-overview-page-header',
  standalone: true,
  imports: [
    RouterLink,
    MmShellCardComponent,
    MmBreadcrumbComponent,
    MmPageHeadingComponent,
    OverviewPeriodFilterComponent,
    OverviewSectionNavComponent,
  ],
  templateUrl: './overview-page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block shrink-0 mm-overview-page-header',
  },
})
export class OverviewPageHeaderComponent {
  private readonly router = inject(Router);
  readonly locale = inject(AppLocaleService);
  readonly pageContext = inject(AdminPageContextService);

  readonly selected = input.required<OverviewPeriod>();
  readonly countryLabel = input('');
  readonly updatedAt = input('');
  readonly activeTab = input.required<OverviewTabId>();
  readonly tabBadges = input<OverviewTabBadge[]>([]);

  readonly periodChange = output<OverviewPeriod>();
  readonly tabChange = output<OverviewTabId>();

  readonly panelLabel = computed(() =>
    this.locale.isRtl() ? 'لوحة المسؤول' : 'Admin Panel',
  );

  readonly quickActionLabel = computed(() =>
    this.locale.isRtl() ? 'استثناء طارئ' : 'Quick exception',
  );

  readonly pageTitle = computed(() => {
    const page = this.pageContext.context().page;
    return page ? this.label(page) : this.panelLabel();
  });

  readonly pageDescription = computed(() => {
    const page = this.pageContext.context().page;
    if (!page) {
      return '';
    }
    return this.locale.isRtl()
      ? (page.descriptionAr ?? '')
      : (page.descriptionEn ?? '');
  });

  readonly breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const page = this.pageContext.context().page;
    if (!page) {
      return [];
    }
    return [{ label: this.pageTitle(), active: true }];
  });

  label(item: AdminNavItem): string {
    return this.locale.isRtl() ? item.labelAr : item.labelEn;
  }

  goHome(): void {
    void this.router.navigate(['/admin/overview']);
  }
}
